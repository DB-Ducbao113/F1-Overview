import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { BlurPass } from '@react-three/drei/materials/BlurPass.js';
import { MeshReflectorMaterial as MeshReflectorMaterialImpl } from '@react-three/drei/materials/MeshReflectorMaterial.js';

extend({ StudioMeshReflectorMaterialImpl: MeshReflectorMaterialImpl });

export interface StudioReflectorMaterialProps {
  mixBlur?: number;
  mixStrength?: number;
  resolution?: number;
  blur?: [number, number];
  minDepthThreshold?: number;
  maxDepthThreshold?: number;
  depthScale?: number;
  depthToBlurRatioBias?: number;
  mirror?: number;
  distortion?: number;
  mixContrast?: number;
  distortionMap?: THREE.Texture;
  reflectorOffset?: number;
  color?: string;
  roughness?: number;
  metalness?: number;
}

/**
 * StudioReflectorMaterial — Ownership-safe 3D floor reflection material.
 *
 * Provides identical photorealistic ground reflections to Drei's MeshReflectorMaterial,
 * but adds deterministic lifecycle cleanup for offscreen render targets (fbo1, fbo2,
 * BlurPass targets, and depth textures).
 *
 * Prevents WebGLFramebuffer, WebGLRenderbuffer, and GPU texture leaks across
 * quality mode transitions and route navigation cycles.
 */
export const StudioReflectorMaterial = React.forwardRef<any, StudioReflectorMaterialProps>(
  (
    {
      mixBlur = 0,
      mixStrength = 1,
      resolution = 256,
      blur = [0, 0],
      minDepthThreshold = 0.9,
      maxDepthThreshold = 1,
      depthScale = 0,
      depthToBlurRatioBias = 0.25,
      mirror = 0,
      distortion = 1,
      mixContrast = 1,
      distortionMap,
      reflectorOffset = 0,
      ...props
    },
    ref,
  ) => {
    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera);
    const scene = useThree((state) => state.scene);

    const blurX = Array.isArray(blur) ? blur[0] : blur;
    const blurY = Array.isArray(blur) ? blur[1] : blur;
    const hasBlur = blurX + blurY > 0;
    const materialRef = useRef<any>(null);

    React.useImperativeHandle(ref, () => materialRef.current, []);

    const [reflectorPlane] = useState(() => new THREE.Plane());
    const [normal] = useState(() => new THREE.Vector3());
    const [reflectorWorldPosition] = useState(() => new THREE.Vector3());
    const [cameraWorldPosition] = useState(() => new THREE.Vector3());
    const [rotationMatrix] = useState(() => new THREE.Matrix4());
    const [lookAtPosition] = useState(() => new THREE.Vector3(0, 0, -1));
    const [clipPlane] = useState(() => new THREE.Vector4());
    const [view] = useState(() => new THREE.Vector3());
    const [target] = useState(() => new THREE.Vector3());
    const [q] = useState(() => new THREE.Vector4());
    const [textureMatrix] = useState(() => new THREE.Matrix4());
    const [virtualCamera] = useState(() => new THREE.PerspectiveCamera());

    const beforeRender = useCallback(() => {
      const parent = materialRef.current?.parent || (materialRef.current as any)?.__r3f?.parent;
      if (!parent) return;

      reflectorWorldPosition.setFromMatrixPosition(parent.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
      rotationMatrix.extractRotation(parent.matrixWorld);

      normal.set(0, 0, 1);
      normal.applyMatrix4(rotationMatrix);
      reflectorWorldPosition.addScaledVector(normal, reflectorOffset);
      view.subVectors(reflectorWorldPosition, cameraWorldPosition);

      // Avoid rendering when reflector faces away from camera
      if (view.dot(normal) > 0) return;

      view.reflect(normal).negate();
      view.add(reflectorWorldPosition);
      rotationMatrix.extractRotation(camera.matrixWorld);

      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);

      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(reflectorWorldPosition);

      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0);
      virtualCamera.up.applyMatrix4(rotationMatrix);
      virtualCamera.up.reflect(normal);
      virtualCamera.lookAt(target);
      virtualCamera.far = (camera as THREE.PerspectiveCamera).far;
      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

      // Update texture matrix for planar projection
      textureMatrix.set(
        0.5,
        0.0,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.5,
        0.0,
        0.0,
        0.5,
        0.5,
        0.0,
        0.0,
        0.0,
        1.0,
      );
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);
      textureMatrix.multiply(parent.matrixWorld);

      // Oblique near-plane clipping
      reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
      clipPlane.set(
        reflectorPlane.normal.x,
        reflectorPlane.normal.y,
        reflectorPlane.normal.z,
        reflectorPlane.constant,
      );

      const projectionMatrix = virtualCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
      q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
      q.z = -1.0;
      q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0;
      projectionMatrix.elements[14] = clipPlane.w;
    }, [
      camera,
      clipPlane,
      lookAtPosition,
      normal,
      q,
      reflectorOffset,
      reflectorPlane,
      reflectorWorldPosition,
      cameraWorldPosition,
      rotationMatrix,
      target,
      textureMatrix,
      view,
      virtualCamera,
    ]);

    const [fbo1, fbo2, blurpass, reflectorProps] = useMemo(() => {
      const parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: THREE.HalfFloatType,
      };

      const renderTarget1 = new THREE.WebGLRenderTarget(resolution, resolution, parameters);
      renderTarget1.depthBuffer = true;
      renderTarget1.depthTexture = new THREE.DepthTexture(resolution, resolution);
      renderTarget1.depthTexture.format = THREE.DepthFormat;
      renderTarget1.depthTexture.type = THREE.UnsignedShortType;

      const renderTarget2 = new THREE.WebGLRenderTarget(resolution, resolution, parameters);

      const blurPassInstance = new BlurPass({
        gl,
        resolution,
        width: blurX,
        height: blurY,
        minDepthThreshold,
        maxDepthThreshold,
        depthScale,
        depthToBlurRatioBias,
      });

      const propsObj = {
        mirror,
        textureMatrix,
        mixBlur,
        tDiffuse: renderTarget1.texture,
        tDepth: renderTarget1.depthTexture,
        tDiffuseBlur: renderTarget2.texture,
        hasBlur,
        mixStrength,
        minDepthThreshold,
        maxDepthThreshold,
        depthScale,
        depthToBlurRatioBias,
        distortion,
        distortionMap,
        mixContrast,
        'defines-USE_BLUR': hasBlur ? '' : undefined,
        'defines-USE_DEPTH': depthScale > 0 ? '' : undefined,
        'defines-USE_DISTORTION': distortionMap ? '' : undefined,
      };

      return [renderTarget1, renderTarget2, blurPassInstance, propsObj];
    }, [
      gl,
      blurX,
      blurY,
      textureMatrix,
      resolution,
      mirror,
      hasBlur,
      mixBlur,
      mixStrength,
      minDepthThreshold,
      maxDepthThreshold,
      depthScale,
      depthToBlurRatioBias,
      distortion,
      distortionMap,
      mixContrast,
    ]);

    // Deterministic disposal of WebGL RenderTargets, Framebuffers, and Textures
    useEffect(() => {
      return () => {
        fbo1.dispose();
        fbo2.dispose();
        blurpass.renderTargetA?.dispose?.();
        blurpass.renderTargetB?.dispose?.();
        blurpass.convolutionMaterial?.dispose?.();
        blurpass.screen?.geometry?.dispose?.();
      };
    }, [fbo1, fbo2, blurpass]);

    useFrame(() => {
      const parent = materialRef.current?.parent || (materialRef.current as any)?.__r3f?.parent;
      if (!parent) return;

      parent.visible = false;
      const currentXrEnabled = gl.xr.enabled;
      const currentShadowAutoUpdate = gl.shadowMap.autoUpdate;

      beforeRender();
      gl.xr.enabled = false;
      gl.shadowMap.autoUpdate = false;
      gl.setRenderTarget(fbo1);
      gl.state.buffers.depth.setMask(true);
      if (!gl.autoClear) gl.clear();
      gl.render(scene, virtualCamera);

      if (hasBlur) {
        blurpass.render(gl, fbo1, fbo2);
      }

      gl.xr.enabled = currentXrEnabled;
      gl.shadowMap.autoUpdate = currentShadowAutoUpdate;
      parent.visible = true;
      gl.setRenderTarget(null);
    });

    return (
      // @ts-expect-error Custom R3F component binding
      <studioMeshReflectorMaterialImpl
        attach="material"
        key={
          'key' +
          reflectorProps['defines-USE_BLUR'] +
          reflectorProps['defines-USE_DEPTH'] +
          reflectorProps['defines-USE_DISTORTION']
        }
        ref={materialRef}
        {...reflectorProps}
        {...props}
      />
    );
  },
);

StudioReflectorMaterial.displayName = 'StudioReflectorMaterial';
