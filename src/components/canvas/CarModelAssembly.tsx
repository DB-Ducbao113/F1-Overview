import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { ANATOMY_PARTS } from '../../data/parts';
import { createCarbonFiberTexture, createTyreTexture } from './materials';
import { Hotspots } from './Hotspots';

export const CarModelAssembly: React.FC<{ carIdOverride?: CarId }> = ({ carIdOverride }) => {
  const {
    selectedCarId: storeCarId,
    explodedProgress,
    selectedPartId,
    selectPart,
    drsActive,
    wireframe,
  } = useCarStore();

  const selectedCarId = carIdOverride || storeCarId;
  const car = CARS_DATA[selectedCarId] || CARS_DATA.rb20;
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Procedural PBR textures
  const carbonTexture = useMemo(() => createCarbonFiberTexture(), []);
  const tyreTexture = useMemo(() => createTyreTexture(car.accentColor), [car.accentColor]);

  // Group refs for exploded disassembly animation
  const frontWingRef = useRef<THREE.Group>(null);
  const rearWingRef = useRef<THREE.Group>(null);
  const floorRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const wheelFlRef = useRef<THREE.Group>(null);
  const wheelFrRef = useRef<THREE.Group>(null);
  const wheelRlRef = useRef<THREE.Group>(null);
  const wheelRrRef = useRef<THREE.Group>(null);
  const drsFlapRef = useRef<THREE.Group>(null);

  // Smooth lerp frame updates for disassembly & DRS flap
  useFrame((_, delta) => {
    const p = explodedProgress;

    const lerpGroup = (ref: React.RefObject<THREE.Group>, offset: [number, number, number]) => {
      if (!ref.current) return;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, offset[0] * p, delta * 8);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, offset[1] * p, delta * 8);
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, offset[2] * p, delta * 8);
    };

    const getOffset = (id: string): [number, number, number] => {
      const part = ANATOMY_PARTS.find((pt) => pt.id === id);
      return part ? part.explodedOffset : [0, 0, 0];
    };

    lerpGroup(frontWingRef, getOffset('front-wing'));
    lerpGroup(rearWingRef, getOffset('rear-wing'));
    lerpGroup(floorRef, getOffset('venturi-floor'));
    lerpGroup(haloRef, getOffset('halo'));
    lerpGroup(engineRef, getOffset('power-unit'));
    lerpGroup(chassisRef, getOffset('chassis'));
    lerpGroup(wheelFlRef, getOffset('wheels-front-left'));
    lerpGroup(wheelFrRef, getOffset('wheels-front-right'));
    lerpGroup(wheelRlRef, getOffset('wheels-rear-left'));
    lerpGroup(wheelRrRef, getOffset('wheels-rear-right'));

    // Animate DRS flap opening (rotates up ~18 degrees)
    if (drsFlapRef.current) {
      const targetRotation = drsActive ? -0.34 : 0;
      drsFlapRef.current.rotation.x = THREE.MathUtils.lerp(
        drsFlapRef.current.rotation.x,
        targetRotation,
        delta * 12
      );
    }
  });

  const getPartColor = (partId: string, defaultColor: string) => {
    if (selectedPartId === partId) return '#e10600'; // Racing Red highlight
    if (hoveredPart === partId) return '#ffffff';
    return defaultColor;
  };

  const getEmissive = (partId: string) => {
    if (selectedPartId === partId) return new THREE.Color('#e10600');
    if (hoveredPart === partId) return new THREE.Color('#3f3f46');
    return new THREE.Color('#000000');
  };

  const handlePointerOver = (e: any, partId: string) => {
    e.stopPropagation();
    setHoveredPart(partId);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHoveredPart(null);
  };

  const handleClick = (e: any, partId: string) => {
    e.stopPropagation();
    selectPart(selectedPartId === partId ? null : partId);
  };

  return (
    <group position={[0, 0.4, 0]}>
      {/* 3D Hotspot beacons */}
      <Hotspots />

      {/* ══════════════════════════════════════════════════════
          1. CHASSIS / MONOCOQUE & COCKPIT
          ══════════════════════════════════════════════════════ */}
      <group
        ref={chassisRef}
        onPointerOver={(e) => handlePointerOver(e, 'chassis')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'chassis')}
      >
        {/* Main Nose & Cockpit sculpted monocoque */}
        <mesh position={[0, 0.35, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.36, 2.7]} />
          <meshPhysicalMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.2}
            metalness={0.7}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            wireframe={wireframe}
            emissive={getEmissive('chassis')}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Tapered nosecone sloping down to front wing */}
        <mesh position={[0, 0.23, 2.15]} rotation={[-0.14, 0, 0]} castShadow>
          <coneGeometry args={[0.28, 0.95, 6]} />
          <meshPhysicalMaterial
            color={car.accentColor}
            roughness={0.25}
            metalness={0.65}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            wireframe={wireframe}
          />
        </mesh>

        {/* Engine Airbox intake scoop above driver helmet */}
        <mesh position={[0, 0.72, -0.2]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.22, 0.65, 16]} />
          <meshPhysicalMaterial
            color={car.highlightColor}
            roughness={0.3}
            metalness={0.5}
            clearcoat={0.9}
            wireframe={wireframe}
          />
        </mesh>

        {/* Dorsal Shark Fin extending to rear wing */}
        <mesh position={[0, 0.75, -1.1]} castShadow>
          <boxGeometry args={[0.02, 0.42, 1.4]} />
          <meshStandardMaterial
            color={getPartColor('chassis', car.primaryColor)}
            map={carbonTexture}
            roughness={0.4}
            metalness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Cockpit rim & aperture */}
        <mesh position={[0, 0.46, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.28, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>

        {/* F1 Digital Steering Wheel inside cockpit */}
        <mesh position={[0, 0.42, 0.25]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.03]} />
          <meshStandardMaterial color="#09090b" roughness={0.5} />
        </mesh>
        {/* Steering wheel screen */}
        <mesh position={[0, 0.43, 0.26]} rotation={[0.4, 0, 0]}>
          <planeGeometry args={[0.08, 0.04]} />
          <meshBasicMaterial color="#00ff66" />
        </mesh>

        {/* Sidepod left — aerodynamic undercut & radiator inlet */}
        <mesh position={[-0.6, 0.24, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.34, 1.7]} />
          <meshPhysicalMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.2}
            metalness={0.7}
            clearcoat={1.0}
            wireframe={wireframe}
          />
        </mesh>
        {/* Left radiator intake duct */}
        <mesh position={[-0.6, 0.28, 0.66]}>
          <planeGeometry args={[0.42, 0.24]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Sidepod right — aerodynamic undercut & radiator inlet */}
        <mesh position={[0.6, 0.24, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.34, 1.7]} />
          <meshPhysicalMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.2}
            metalness={0.7}
            clearcoat={1.0}
            wireframe={wireframe}
          />
        </mesh>
        {/* Right radiator intake duct */}
        <mesh position={[0.6, 0.28, 0.66]}>
          <planeGeometry args={[0.42, 0.24]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* ══════════════════════════════════════════════════════
            TEAM-SPECIFIC BESPOKE 2024 AERODYNAMIC PACKAGES
            ══════════════════════════════════════════════════════ */}

        {/* 1. Red Bull RB20: Overbite Intake & Twin Bazooka Cooling Cannons */}
        {selectedCarId === 'rb20' && (
          <group>
            {/* Overbite upper lip left */}
            <mesh position={[-0.6, 0.43, 0.72]} castShadow>
              <boxGeometry args={[0.46, 0.04, 0.28]} />
              <meshPhysicalMaterial color={car.accentColor} roughness={0.2} metalness={0.7} />
            </mesh>
            {/* Overbite upper lip right */}
            <mesh position={[0.6, 0.43, 0.72]} castShadow>
              <boxGeometry args={[0.46, 0.04, 0.28]} />
              <meshPhysicalMaterial color={car.accentColor} roughness={0.2} metalness={0.7} />
            </mesh>
            {/* Twin Bazooka cooling cannons along engine cover */}
            <mesh position={[-0.24, 0.62, -0.75]} rotation={[-0.08, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.09, 1.4, 16]} />
              <meshPhysicalMaterial color={car.primaryColor} roughness={0.25} metalness={0.6} />
            </mesh>
            <mesh position={[0.24, 0.62, -0.75]} rotation={[-0.08, 0, 0]} castShadow>
              <cylinderGeometry args={[0.07, 0.09, 1.4, 16]} />
              <meshPhysicalMaterial color={car.primaryColor} roughness={0.25} metalness={0.6} />
            </mesh>
            {/* Yellow nose tip ring */}
            <mesh position={[0, 0.17, 2.62]}>
              <ringGeometry args={[0.08, 0.13, 16]} />
              <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}

        {/* 2. Ferrari SF-24: Iconic Scalloped Bathtub Sidepod Troughs */}
        {selectedCarId === 'sf24' && (
          <group>
            {/* Left bathtub concave channel */}
            <mesh position={[-0.58, 0.38, -0.2]} castShadow>
              <boxGeometry args={[0.34, 0.06, 1.2]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.5} map={carbonTexture} />
            </mesh>
            {/* Right bathtub concave channel */}
            <mesh position={[0.58, 0.38, -0.2]} castShadow>
              <boxGeometry args={[0.34, 0.06, 1.2]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.5} map={carbonTexture} />
            </mesh>
            {/* White Halo fairing */}
            <mesh position={[0, 0.82, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.275, 0.015, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Italian tricolor nose stripe */}
            <mesh position={[0, 0.28, 1.8]} rotation={[-0.14, 0, 0]}>
              <planeGeometry args={[0.04, 0.6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* 3. McLaren MCL38: Aggressive Coke-bottle Carbon Undercut */}
        {selectedCarId === 'mcl38' && (
          <group>
            {/* Exposed raw carbon sidepod flanks */}
            <mesh position={[-0.64, 0.18, -0.3]} castShadow>
              <boxGeometry args={[0.03, 0.26, 1.5]} />
              <meshStandardMaterial color="#141416" map={carbonTexture} roughness={0.4} />
            </mesh>
            <mesh position={[0.64, 0.18, -0.3]} castShadow>
              <boxGeometry args={[0.03, 0.26, 1.5]} />
              <meshStandardMaterial color="#141416" map={carbonTexture} roughness={0.4} />
            </mesh>
            {/* Neon Cyan aero vane stripes */}
            <mesh position={[-0.62, 0.35, 0.5]}>
              <boxGeometry args={[0.02, 0.02, 0.4]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <mesh position={[0.62, 0.35, 0.5]}>
              <boxGeometry args={[0.02, 0.02, 0.4]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
          </group>
        )}

        {/* 4. Mercedes-AMG W15: Arrow-Slim Nose & Petronas Aero Rails */}
        {selectedCarId === 'w15' && (
          <group>
            {/* Silver arrow nose upper cowl */}
            <mesh position={[0, 0.26, 2.1]} rotation={[-0.14, 0, 0]} castShadow>
              <boxGeometry args={[0.22, 0.04, 0.9]} />
              <meshPhysicalMaterial color="#e4e4e7" roughness={0.15} metalness={0.9} clearcoat={1.0} />
            </mesh>
            {/* Left Petronas cyan aerodynamic rail */}
            <mesh position={[-0.62, 0.12, -0.1]}>
              <boxGeometry args={[0.04, 0.03, 1.8]} />
              <meshBasicMaterial color="#00a19c" />
            </mesh>
            {/* Right Petronas cyan aerodynamic rail */}
            <mesh position={[0.62, 0.12, -0.1]}>
              <boxGeometry args={[0.04, 0.03, 1.8]} />
              <meshBasicMaterial color="#00a19c" />
            </mesh>
          </group>
        )}
      </group>

      {/* ══════════════════════════════════════════════════════
          2. 3-TIER CURVED FRONT WING & ENDPLATES
          ══════════════════════════════════════════════════════ */}
      <group
        ref={frontWingRef}
        onPointerOver={(e) => handlePointerOver(e, 'front-wing')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'front-wing')}
      >
        {/* Main curved lower plane */}
        <mesh position={[0, 0.08, 2.38]} castShadow receiveShadow>
          <boxGeometry args={[1.92, 0.025, 0.44]} />
          <meshStandardMaterial
            color={getPartColor('front-wing', car.accentColor)}
            map={carbonTexture}
            roughness={0.3}
            metalness={0.4}
            wireframe={wireframe}
            emissive={getEmissive('front-wing')}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* 2nd tier flap */}
        <mesh position={[0, 0.12, 2.32]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.86, 0.02, 0.24]} />
          <meshStandardMaterial
            color={car.primaryColor}
            map={carbonTexture}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* 3rd tier top gurney flap */}
        <mesh position={[0, 0.16, 2.24]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[1.78, 0.015, 0.18]} />
          <meshStandardMaterial
            color={car.highlightColor}
            roughness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Left endplate & diveplane */}
        <mesh position={[-0.96, 0.16, 2.36]} castShadow>
          <boxGeometry args={[0.025, 0.24, 0.52]} />
          <meshStandardMaterial color={car.accentColor} map={carbonTexture} roughness={0.3} />
        </mesh>
        <mesh position={[-0.99, 0.14, 2.34]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.08, 0.015, 0.22]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>

        {/* Right endplate & diveplane */}
        <mesh position={[0.96, 0.16, 2.36]} castShadow>
          <boxGeometry args={[0.025, 0.24, 0.52]} />
          <meshStandardMaterial color={car.accentColor} map={carbonTexture} roughness={0.3} />
        </mesh>
        <mesh position={[0.99, 0.14, 2.34]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.08, 0.015, 0.22]} />
          <meshStandardMaterial color="#09090b" roughness={0.4} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          3. REAR WING ASSEMBLY & MOTORIZED DRS FLAP
          ══════════════════════════════════════════════════════ */}
      <group
        ref={rearWingRef}
        onPointerOver={(e) => handlePointerOver(e, 'rear-wing')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rear-wing')}
      >
        {/* Main lower swept wing element */}
        <mesh position={[0, 0.88, -2.18]} castShadow receiveShadow>
          <boxGeometry args={[1.38, 0.035, 0.34]} />
          <meshPhysicalMaterial
            color={getPartColor('rear-wing', car.primaryColor)}
            map={carbonTexture}
            roughness={0.25}
            metalness={0.4}
            clearcoat={1.0}
            wireframe={wireframe}
            emissive={getEmissive('rear-wing')}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Dual center support swan-neck pylons */}
        <mesh position={[-0.08, 0.68, -2.08]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.46, 0.05]} />
          <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.68, -2.08]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.46, 0.05]} />
          <meshStandardMaterial color="#27272a" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Motorized DRS Upper Flap (hinged group) */}
        <group ref={drsFlapRef} position={[0, 0.96, -2.2]}>
          <mesh position={[0, 0.03, -0.04]} castShadow>
            <boxGeometry args={[1.34, 0.025, 0.22]} />
            <meshPhysicalMaterial
              color={drsActive ? '#22c55e' : car.accentColor}
              map={carbonTexture}
              roughness={0.2}
              metalness={0.5}
              clearcoat={1.0}
              wireframe={wireframe}
            />
          </mesh>
          {/* DRS actuator pod */}
          <mesh position={[0, 0.05, -0.06]}>
            <boxGeometry args={[0.06, 0.05, 0.09]} />
            <meshStandardMaterial color="#18181b" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>

        {/* Left rear endplate with 2022 curved tips */}
        <mesh position={[-0.7, 0.86, -2.18]} castShadow>
          <boxGeometry args={[0.025, 0.48, 0.46]} />
          <meshStandardMaterial color={car.primaryColor} map={carbonTexture} roughness={0.3} />
        </mesh>

        {/* Right rear endplate with 2022 curved tips */}
        <mesh position={[0.7, 0.86, -2.18]} castShadow>
          <boxGeometry args={[0.025, 0.48, 0.46]} />
          <meshStandardMaterial color={car.primaryColor} map={carbonTexture} roughness={0.3} />
        </mesh>

        {/* Lower beam wing (generates upwash to diffuse airflow) */}
        <mesh position={[0, 0.42, -2.05]} castShadow>
          <boxGeometry args={[0.92, 0.02, 0.22]} />
          <meshStandardMaterial color="#09090b" map={carbonTexture} roughness={0.4} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          4. VENTURI GROUND EFFECT UNDERFLOOR & DIFFUSER
          ══════════════════════════════════════════════════════ */}
      <group
        ref={floorRef}
        onPointerOver={(e) => handlePointerOver(e, 'venturi-floor')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'venturi-floor')}
      >
        {/* Main stepped floor plank */}
        <mesh position={[0, -0.03, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.03, 3.2]} />
          <meshStandardMaterial
            color={getPartColor('venturi-floor', '#141416')}
            map={carbonTexture}
            roughness={0.6}
            metalness={0.2}
            wireframe={wireframe}
            emissive={getEmissive('venturi-floor')}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Left Venturi tunnel channel */}
        <mesh position={[-0.52, -0.01, -0.3]} castShadow>
          <boxGeometry args={[0.44, 0.06, 2.2]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.7} map={carbonTexture} />
        </mesh>
        {/* Left floor strakes / vortex fences */}
        <mesh position={[-0.72, 0.06, 0.8]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.7]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} />
        </mesh>
        <mesh position={[-0.58, 0.06, 0.85]} rotation={[0, 0.08, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.7]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} />
        </mesh>

        {/* Right Venturi tunnel channel */}
        <mesh position={[0.52, -0.01, -0.3]} castShadow>
          <boxGeometry args={[0.44, 0.06, 2.2]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.7} map={carbonTexture} />
        </mesh>
        {/* Right floor strakes / vortex fences */}
        <mesh position={[0.72, 0.06, 0.8]} rotation={[0, -0.1, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.7]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} />
        </mesh>
        <mesh position={[0.58, 0.06, 0.85]} rotation={[0, -0.08, 0]}>
          <boxGeometry args={[0.015, 0.14, 0.7]} />
          <meshStandardMaterial color="#09090b" roughness={0.3} />
        </mesh>

        {/* Expanding Rear Diffuser (angled upward at rear) */}
        <mesh position={[0, 0.12, -1.88]} rotation={[-0.26, 0, 0]} castShadow>
          <boxGeometry args={[1.18, 0.025, 0.72]} />
          <meshStandardMaterial
            color={getPartColor('venturi-floor', '#0d0d0f')}
            map={carbonTexture}
            roughness={0.5}
            metalness={0.3}
            wireframe={wireframe}
          />
        </mesh>

        {/* Vertical diffuser dividing vanes */}
        {[-0.45, -0.15, 0.15, 0.45].map((x) => (
          <mesh key={x} position={[x, 0.14, -1.88]} rotation={[-0.26, 0, 0]} castShadow>
            <boxGeometry args={[0.015, 0.16, 0.7]} />
            <meshStandardMaterial color="#09090b" map={carbonTexture} roughness={0.4} />
          </mesh>
        ))}

        {/* FIA Titanium skid blocks under the floor (generates iconic F1 sparks) */}
        <mesh position={[0, -0.05, 0.2]}>
          <boxGeometry args={[0.22, 0.012, 1.2]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          5. TITANIUM HALO COCKPIT SAFETY CAGE
          ══════════════════════════════════════════════════════ */}
      <group
        ref={haloRef}
        onPointerOver={(e) => handlePointerOver(e, 'halo')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'halo')}
      >
        {/* Forward center pillar */}
        <mesh position={[0, 0.62, 0.32]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.038, 0.42, 16]} />
          <meshStandardMaterial
            color={getPartColor('halo', '#27272a')}
            metalness={0.88}
            roughness={0.2}
            wireframe={wireframe}
            emissive={getEmissive('halo')}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Upper curved wishbone ring around cockpit */}
        <mesh position={[0, 0.81, -0.05]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.27, 0.032, 12, 28, Math.PI]} />
          <meshStandardMaterial
            color={getPartColor('halo', '#3f3f46')}
            metalness={0.85}
            roughness={0.25}
            wireframe={wireframe}
          />
        </mesh>

        {/* Rear mounting brackets into chassis */}
        <mesh position={[-0.26, 0.68, -0.18]} rotation={[0.4, 0, -0.2]}>
          <cylinderGeometry args={[0.024, 0.028, 0.32, 12]} />
          <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0.26, 0.68, -0.18]} rotation={[0.4, 0, 0.2]}>
          <cylinderGeometry args={[0.024, 0.028, 0.32, 12]} />
          <meshStandardMaterial color="#27272a" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          6. 1.6L TURBOCHARGED HYBRID V6 POWER UNIT
          ══════════════════════════════════════════════════════ */}
      <group
        ref={engineRef}
        onPointerOver={(e) => handlePointerOver(e, 'power-unit')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'power-unit')}
      >
        {/* V6 Engine Block */}
        <mesh position={[0, 0.28, -0.92]} castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.36, 0.68]} />
          <meshStandardMaterial
            color={getPartColor('power-unit', '#3f3f46')}
            metalness={0.92}
            roughness={0.25}
            wireframe={wireframe}
            emissive={getEmissive('power-unit')}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* MGU-K Electric Motor (copper coil detail) */}
        <mesh position={[0, 0.14, -0.66]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.38, 16]} />
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Turbocharger compressor snail housing */}
        <mesh position={[0, 0.42, -0.74]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.12, 0.045, 12, 20]} />
          <meshStandardMaterial color="#71717a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Exhaust collector tailpipe (with thermal heat glow) */}
        <mesh position={[0, 0.36, -1.98]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.065, 0.62, 16, 1, true]} />
          <meshStandardMaterial
            color="#27272a"
            metalness={0.9}
            roughness={0.3}
            emissive="#e10600"
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════
          7. 18-INCH WHEELS, BRAKES & PIRELLI TYRES
          ══════════════════════════════════════════════════════ */}
      {/* Front Left */}
      <group
        ref={wheelFlRef}
        position={[-0.92, 0.16, 1.48]}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-front-left')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-front-left')}
      >
        <WheelAssembly tyreTexture={tyreTexture} wireframe={wireframe} isLeft />
      </group>

      {/* Front Right */}
      <group
        ref={wheelFrRef}
        position={[0.92, 0.16, 1.48]}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-front-right')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-front-right')}
      >
        <WheelAssembly tyreTexture={tyreTexture} wireframe={wireframe} isLeft={false} />
      </group>

      {/* Rear Left */}
      <group
        ref={wheelRlRef}
        position={[-0.94, 0.17, -1.48]}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-rear-left')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-rear-left')}
      >
        <WheelAssembly tyreTexture={tyreTexture} wireframe={wireframe} isLeft isRear />
      </group>

      {/* Rear Right */}
      <group
        ref={wheelRrRef}
        position={[0.94, 0.17, -1.48]}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-rear-right')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-rear-right')}
      >
        <WheelAssembly tyreTexture={tyreTexture} wireframe={wireframe} isLeft={false} isRear />
      </group>
    </group>
  );
};

// Reusable 18-inch F1 wheel assembly with carbon aero covers & brake ducts
const WheelAssembly: React.FC<{
  tyreTexture: THREE.CanvasTexture;
  wireframe: boolean;
  isLeft: boolean;
  isRear?: boolean;
}> = ({ tyreTexture, wireframe, isLeft, isRear }) => {
  const width = isRear ? 0.42 : 0.36;
  const radius = 0.36;

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Rubber tyre with sidewall texture */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <meshStandardMaterial
          color="#1e1e20"
          map={tyreTexture}
          roughness={0.7}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* 18-inch Rim / Aero Wheel Cover */}
      <mesh position={[0, (width / 2) * (isLeft ? 1.01 : -1.01), 0]}>
        <circleGeometry args={[radius * 0.58, 24]} />
        <meshStandardMaterial
          color="#09090b"
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Center lock wheel nut */}
      <mesh position={[0, (width / 2) * (isLeft ? 1.05 : -1.05), 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.05, 6]} />
        <meshStandardMaterial color={isLeft ? '#e10600' : '#2563eb'} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Carbon fiber brake disc & caliper inside */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.48, radius * 0.48, width * 0.5, 16]} />
        <meshStandardMaterial color="#27272a" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
};
