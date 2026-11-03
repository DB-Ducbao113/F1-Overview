import React, { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';

export interface StudioContactShadowsProps {
  opacity?: number;
  width?: number;
  height?: number;
  blur?: number;
  near?: number;
  far?: number;
  smooth?: boolean;
  resolution?: number;
  frames?: number;
  scale?: number | [number, number];
  color?: string;
  depthWrite?: boolean;
  renderOrder?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * StudioContactShadows — Ownership-safe ground contact shadow renderer.
 *
 * Provides identical ground contact shadows to Drei's ContactShadows,
 * but adds deterministic lifecycle disposal for all offscreen render targets,
 * geometries, and shader materials.
 *
 * Prevents WebGLFramebuffer, WebGLRenderbuffer, texture, and geometry leaks
 * across graphics quality transitions and route navigation cycles.
 */
export const StudioContactShadows = forwardRef<THREE.Group, StudioContactShadowsProps>(
  (
    {
      scale = 10,
      frames = Infinity,
      opacity = 1,
      width = 1,
      height = 1,
      blur = 1,
      near = 0,
      far = 10,
      resolution = 512,
      smooth = true,
      color = '#000000',
      depthWrite = false,
      renderOrder,
      ...props
    },
    fref,
  ) => {
    const ref = useRef<THREE.Group>(null);
    const scene = useThree((state) => state.scene);
    const gl = useThree((state) => state.gl);
    const shadowCamera = useRef<THREE.OrthographicCamera>(null);

    const actualWidth = width * (Array.isArray(scale) ? scale[0] : scale || 1);
    const actualHeight = height * (Array.isArray(scale) ? scale[1] : scale || 1);

    const [
      renderTarget,
      planeGeometry,
      depthMaterial,
      blurPlane,
      horizontalBlurMaterial,
      verticalBlurMaterial,
      renderTargetBlur,
    ] = useMemo(() => {
      const rt = new THREE.WebGLRenderTarget(resolution, resolution);
      const rtBlur = new THREE.WebGLRenderTarget(resolution, resolution);
      rtBlur.texture.generateMipmaps = rt.texture.generateMipmaps = false;

      const geom = new THREE.PlaneGeometry(actualWidth, actualHeight).rotateX(Math.PI / 2);
      const mesh = new THREE.Mesh(geom);
      const depthMat = new THREE.MeshDepthMaterial();
      depthMat.depthTest = depthMat.depthWrite = false;
      depthMat.onBeforeCompile = (shader) => {
        shader.uniforms = {
          ...shader.uniforms,
          ucolor: {
            value: new THREE.Color(color),
          },
        };
        shader.fragmentShader = shader.fragmentShader.replace(
          `void main() {`,
          `uniform vec3 ucolor;\nvoid main() {`,
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );',
        );
      };

      const hBlurMat = new THREE.ShaderMaterial(HorizontalBlurShader);
      const vBlurMat = new THREE.ShaderMaterial(VerticalBlurShader);
      vBlurMat.depthTest = hBlurMat.depthTest = false;

      return [rt, geom, depthMat, mesh, hBlurMat, vBlurMat, rtBlur];
    }, [resolution, actualWidth, actualHeight, color]);

    // Deterministic disposal of WebGL RenderTargets, Framebuffers, Textures, and Geometries
    useEffect(() => {
      return () => {
        renderTarget.dispose();
        renderTargetBlur.dispose();
        planeGeometry.dispose();
        depthMaterial.dispose();
        horizontalBlurMaterial.dispose();
        verticalBlurMaterial.dispose();
      };
    }, [
      renderTarget,
      renderTargetBlur,
      planeGeometry,
      depthMaterial,
      horizontalBlurMaterial,
      verticalBlurMaterial,
    ]);

    const blurShadows = (b: number) => {
      blurPlane.visible = true;
      blurPlane.material = horizontalBlurMaterial;
      horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
      horizontalBlurMaterial.uniforms.h.value = (b * 1) / 256;
      gl.setRenderTarget(renderTargetBlur);
      gl.render(blurPlane, shadowCamera.current!);

      blurPlane.material = verticalBlurMaterial;
      verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
      verticalBlurMaterial.uniforms.v.value = (b * 1) / 256;
      gl.setRenderTarget(renderTarget);
      gl.render(blurPlane, shadowCamera.current!);
      blurPlane.visible = false;
    };

    const countRef = useRef(0);

    useFrame(() => {
      if (shadowCamera.current && (frames === Infinity || countRef.current < frames)) {
        countRef.current++;
        const initialBackground = scene.background;
        const initialOverrideMaterial = scene.overrideMaterial;

        if (ref.current) ref.current.visible = false;
        scene.background = null;
        scene.overrideMaterial = depthMaterial;

        gl.setRenderTarget(renderTarget);
        gl.render(scene, shadowCamera.current);

        blurShadows(blur);
        if (smooth) blurShadows(blur * 0.4);

        gl.setRenderTarget(null);
        if (ref.current) ref.current.visible = true;
        scene.overrideMaterial = initialOverrideMaterial;
        scene.background = initialBackground;
      }
    });

    useImperativeHandle(fref, () => ref.current!, []);

    return (
      <group rotation-x={Math.PI / 2} {...props} ref={ref}>
        <mesh
          renderOrder={renderOrder}
          geometry={planeGeometry}
          scale={[1, -1, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            transparent
            map={renderTarget.texture}
            opacity={opacity}
            depthWrite={depthWrite}
          />
        </mesh>
        <orthographicCamera
          ref={shadowCamera}
          args={[-actualWidth / 2, actualWidth / 2, actualHeight / 2, -actualHeight / 2, near, far]}
        />
      </group>
    );
  },
);

StudioContactShadows.displayName = 'StudioContactShadows';
