import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { ANATOMY_PARTS } from '../../data/parts';

export const CarModelAssembly: React.FC = () => {
  const {
    selectedCarId,
    explodedProgress,
    selectedPartId,
    selectPart,
    drsActive,
    wireframe,
  } = useCarStore();

  const car = CARS_DATA[selectedCarId] || CARS_DATA.rb20;
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Group refs for animated displacement
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
  const drsFlapRef = useRef<THREE.Mesh>(null);

  // Smooth frame updates
  useFrame((_, delta) => {
    const p = explodedProgress;

    // Helper to lerp group position towards target vector
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
      const targetRotation = drsActive ? -0.32 : 0;
      drsFlapRef.current.rotation.x = THREE.MathUtils.lerp(
        drsFlapRef.current.rotation.x,
        targetRotation,
        delta * 12
      );
    }
  });

  const getPartColor = (partId: string, defaultColor: string) => {
    if (selectedPartId === partId) return '#00f0ff'; // Cyber cyan highlight
    if (hoveredPart === partId) return '#ffffff';
    return defaultColor;
  };

  const getEmissive = (partId: string) => {
    if (selectedPartId === partId) return new THREE.Color('#00f0ff');
    if (hoveredPart === partId) return new THREE.Color('#334155');
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
      {/* 1. CHASSIS / MONOCOQUE */}
      <group
        ref={chassisRef}
        onPointerOver={(e) => handlePointerOver(e, 'chassis')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'chassis')}
      >
        {/* Main Nose & Cockpit body */}
        <mesh position={[0, 0.35, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.35, 2.8]} />
          <meshStandardMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.25}
            metalness={0.8}
            wireframe={wireframe}
            emissive={getEmissive('chassis')}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Nose cone tapering down to front wing */}
        <mesh position={[0, 0.22, 2.1]} rotation={[-0.15, 0, 0]} castShadow>
          <coneGeometry args={[0.3, 0.9, 4]} />
          <meshStandardMaterial
            color={car.accentColor}
            roughness={0.3}
            metalness={0.7}
            wireframe={wireframe}
          />
        </mesh>

        {/* Engine airbox intake above driver head */}
        <mesh position={[0, 0.72, -0.2]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.22, 0.6, 16]} />
          <meshStandardMaterial
            color={car.highlightColor}
            roughness={0.3}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>

        {/* Sidepods Left & Right with modern aggressive undercut */}
        <mesh position={[-0.6, 0.28, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.32, 1.6]} />
          <meshStandardMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.2}
            metalness={0.85}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.6, 0.28, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 0.32, 1.6]} />
          <meshStandardMaterial
            color={getPartColor('chassis', car.primaryColor)}
            roughness={0.2}
            metalness={0.85}
            wireframe={wireframe}
          />
        </mesh>

        {/* Cockpit opening & Driver Helmet outline */}
        <mesh position={[0, 0.45, 0.15]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* 2. FRONT WING (4-TIER AERO ELEMENT) */}
      <group
        ref={frontWingRef}
        onPointerOver={(e) => handlePointerOver(e, 'front-wing')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'front-wing')}
      >
        {/* Main curved lower plane */}
        <mesh position={[0, 0.08, 2.55]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.04, 0.45]} />
          <meshStandardMaterial
            color={getPartColor('front-wing', '#18181b')}
            roughness={0.15}
            metalness={0.9}
            wireframe={wireframe}
            emissive={getEmissive('front-wing')}
          />
        </mesh>
        {/* Flap Tier 2 */}
        <mesh position={[0, 0.13, 2.45]} rotation={[-0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.85, 0.02, 0.25]} />
          <meshStandardMaterial color={car.accentColor} roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Flap Tier 3 & 4 */}
        <mesh position={[0, 0.17, 2.38]} rotation={[-0.25, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.015, 0.2]} />
          <meshStandardMaterial color="#27272a" roughness={0.2} wireframe={wireframe} />
        </mesh>
        {/* Endplates Left & Right */}
        <mesh position={[-0.95, 0.16, 2.5]} castShadow>
          <boxGeometry args={[0.03, 0.22, 0.55]} />
          <meshStandardMaterial color={car.primaryColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.95, 0.16, 2.5]} castShadow>
          <boxGeometry args={[0.03, 0.22, 0.55]} />
          <meshStandardMaterial color={car.primaryColor} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 3. VENTURI UNDERFLOOR & REAR DIFFUSER */}
      <group
        ref={floorRef}
        onPointerOver={(e) => handlePointerOver(e, 'venturi-floor')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'venturi-floor')}
      >
        {/* Ground Effect Venturi Floor Plane */}
        <mesh position={[0, -0.02, 0.1]} receiveShadow castShadow>
          <boxGeometry args={[1.65, 0.05, 3.2]} />
          <meshStandardMaterial
            color={getPartColor('venturi-floor', '#111113')}
            roughness={0.4}
            metalness={0.8}
            wireframe={wireframe}
            emissive={getEmissive('venturi-floor')}
          />
        </mesh>

        {/* Upward kicking Rear Diffuser tunnels */}
        <mesh position={[0, 0.12, -1.45]} rotation={[-0.35, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.04, 0.65]} />
          <meshStandardMaterial
            color={getPartColor('venturi-floor', '#1f2937')}
            roughness={0.3}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>

        {/* Diffuser vertical aerodynamic strakes */}
        {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0.1, -1.45]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.02, 0.16, 0.55]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
        ))}

        {/* Titanium Skid Block on floor plank */}
        <mesh position={[0, -0.05, 0.2]}>
          <boxGeometry args={[0.25, 0.015, 1.8]} />
          <meshStandardMaterial color="#f59e0b" metalness={1.0} roughness={0.2} />
        </mesh>
      </group>

      {/* 4. HALO PROTECTION SYSTEM */}
      <group
        ref={haloRef}
        onPointerOver={(e) => handlePointerOver(e, 'halo')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'halo')}
      >
        {/* Center Support Pillar */}
        <mesh position={[0, 0.48, 0.52]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 16]} />
          <meshStandardMaterial
            color={getPartColor('halo', '#374151')}
            metalness={0.95}
            roughness={0.2}
            wireframe={wireframe}
            emissive={getEmissive('halo')}
          />
        </mesh>

        {/* Left & Right Curved Arc Bars */}
        <mesh position={[-0.18, 0.6, 0.2]} rotation={[0, 0.4, 0.2]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.5, 16]} />
          <meshStandardMaterial
            color={getPartColor('halo', '#1f2937')}
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
        <mesh position={[0.18, 0.6, 0.2]} rotation={[0, -0.4, -0.2]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.5, 16]} />
          <meshStandardMaterial
            color={getPartColor('halo', '#1f2937')}
            metalness={0.95}
            roughness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* 5. 1.6L V6 TURBO HYBRID POWER UNIT */}
      <group
        ref={engineRef}
        onPointerOver={(e) => handlePointerOver(e, 'power-unit')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'power-unit')}
      >
        {/* Engine V6 Cylinder Block */}
        <mesh position={[0, 0.26, -0.55]} castShadow>
          <boxGeometry args={[0.45, 0.32, 0.65]} />
          <meshStandardMaterial
            color={getPartColor('power-unit', '#4b5563')}
            metalness={0.95}
            roughness={0.25}
            wireframe={wireframe}
            emissive={getEmissive('power-unit')}
          />
        </mesh>

        {/* Turbocharger & MGU-H Assembly */}
        <mesh position={[0, 0.38, -0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.25, 16]} />
          <meshStandardMaterial color="#00f0ff" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* High Voltage ERS Battery Pack / Inverter */}
        <mesh position={[0, 0.12, -0.2]} castShadow>
          <boxGeometry args={[0.38, 0.15, 0.35]} />
          <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Exhaust Tailpipe */}
        <mesh position={[0, 0.34, -1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.45, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* 6. REAR WING & DRS ACTUATOR */}
      <group
        ref={rearWingRef}
        onPointerOver={(e) => handlePointerOver(e, 'rear-wing')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'rear-wing')}
      >
        {/* Main Rear Wing Plane */}
        <mesh position={[0, 0.82, -1.5]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[1.35, 0.03, 0.35]} />
          <meshStandardMaterial
            color={getPartColor('rear-wing', car.primaryColor)}
            roughness={0.2}
            metalness={0.8}
            wireframe={wireframe}
            emissive={getEmissive('rear-wing')}
          />
        </mesh>

        {/* Dynamic DRS Top Flap (Opens when DRS is ON) */}
        <mesh ref={drsFlapRef} position={[0, 0.9, -1.45]} castShadow>
          <boxGeometry args={[1.33, 0.025, 0.2]} />
          <meshStandardMaterial
            color={drsActive ? '#00f0ff' : car.accentColor}
            roughness={0.2}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>

        {/* Rear Wing Endplates */}
        <mesh position={[-0.68, 0.72, -1.45]} castShadow>
          <boxGeometry args={[0.02, 0.45, 0.6]} />
          <meshStandardMaterial color={car.accentColor} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0.68, 0.72, -1.45]} castShadow>
          <boxGeometry args={[0.02, 0.45, 0.6]} />
          <meshStandardMaterial color={car.accentColor} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Lower Beam Wing */}
        <mesh position={[0, 0.48, -1.4]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.9, 0.02, 0.22]} />
          <meshStandardMaterial color="#18181b" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 7. WHEELS & 18-INCH PIRELLI TIRES */}
      {/* Front Left */}
      <WheelAssembly
        refProp={wheelFlRef}
        position={[-0.82, 0.24, 1.45]}
        partId="wheels-front-left"
        isHovered={hoveredPart === 'wheels-front-left'}
        isSelected={selectedPartId === 'wheels-front-left'}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-front-left')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-front-left')}
        wireframe={wireframe}
        isRear={false}
      />

      {/* Front Right */}
      <WheelAssembly
        refProp={wheelFrRef}
        position={[0.82, 0.24, 1.45]}
        partId="wheels-front-right"
        isHovered={hoveredPart === 'wheels-front-right'}
        isSelected={selectedPartId === 'wheels-front-right'}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-front-right')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-front-right')}
        wireframe={wireframe}
        isRear={false}
      />

      {/* Rear Left */}
      <WheelAssembly
        refProp={wheelRlRef}
        position={[-0.84, 0.25, -1.15]}
        partId="wheels-rear-left"
        isHovered={hoveredPart === 'wheels-rear-left'}
        isSelected={selectedPartId === 'wheels-rear-left'}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-rear-left')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-rear-left')}
        wireframe={wireframe}
        isRear={true}
      />

      {/* Rear Right */}
      <WheelAssembly
        refProp={wheelRrRef}
        position={[0.84, 0.25, -1.15]}
        partId="wheels-rear-right"
        isHovered={hoveredPart === 'wheels-rear-right'}
        isSelected={selectedPartId === 'wheels-rear-right'}
        onPointerOver={(e) => handlePointerOver(e, 'wheels-rear-right')}
        onPointerOut={handlePointerOut}
        onClick={(e) => handleClick(e, 'wheels-rear-right')}
        wireframe={wireframe}
        isRear={true}
      />
    </group>
  );
};

// Reusable Wheel Component
interface WheelProps {
  refProp: React.RefObject<THREE.Group>;
  position: [number, number, number];
  partId: string;
  isHovered: boolean;
  isSelected: boolean;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
  onClick: (e: any) => void;
  wireframe: boolean;
  isRear: boolean;
}

const WheelAssembly: React.FC<WheelProps> = ({
  refProp,
  position,
  partId,
  isHovered,
  isSelected,
  onPointerOver,
  onPointerOut,
  onClick,
  wireframe,
  isRear,
}) => {
  const width = isRear ? 0.36 : 0.28;
  const radius = 0.34;

  const tireColor = isSelected ? '#00f0ff' : isHovered ? '#3b82f6' : '#18181b';

  return (
    <group
      ref={refProp}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* 18-inch Pirelli Rubber Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <meshStandardMaterial
          color={tireColor}
          roughness={0.65}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* Red Compound Stripe (Pirelli P Zero Soft) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[radius * 0.78, 0.012, 8, 32]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* BBS Forged Magnesium Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius * 0.65, radius * 0.65, width * 1.02, 16]} />
        <meshStandardMaterial color="#09090b" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Aerodynamic Wheel Deflector Cover (Modern 2022+ Regulation) */}
      {!isRear && (
        <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.42]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.8} />
        </mesh>
      )}
    </group>
  );
};
