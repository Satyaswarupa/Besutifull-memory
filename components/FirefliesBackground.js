"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FIREFLY_COLORS = [
  [180, 255, 80],
  [210, 255, 60],
  [150, 255, 120],
  [200, 240, 90],
  [160, 255, 100],
];

function createFireflyTexture(r, g, b) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  gradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, 0.7)`);
  gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.2)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Fireflies({ count = 55 }) {
  const meshRef = useRef();
  const dataRef = useRef(null);

  if (!dataRef.current) {
    const positions = [];
    const freqX = [];
    const freqY = [];
    const phaseX = [];
    const phaseY = [];
    const ampX = [];
    const ampY = [];
    const scales = [];
    const colorIdx = [];

    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      ]);
      freqX.push(0.2 + Math.random() * 0.5);
      freqY.push(0.15 + Math.random() * 0.4);
      phaseX.push(Math.random() * Math.PI * 2);
      phaseY.push(Math.random() * Math.PI * 2);
      ampX.push(0.8 + Math.random() * 1.5);
      ampY.push(0.5 + Math.random() * 1.0);
      scales.push(0.1 + Math.random() * 0.25);
      colorIdx.push(Math.floor(Math.random() * FIREFLY_COLORS.length));
    }

    const textures = FIREFLY_COLORS.map(([r, g, b]) => createFireflyTexture(r, g, b));
    const basePositions = positions.map((p) => [...p]);

    dataRef.current = { basePositions, freqX, freqY, phaseX, phaseY, ampX, ampY, scales, colorIdx, textures };
  }

  const { basePositions, freqX, freqY, phaseX, phaseY, ampX, ampY, scales, colorIdx, textures } =
    dataRef.current;

  useFrame((state) => {
    const group = meshRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.children.forEach((mesh, i) => {
      mesh.position.x = basePositions[i][0] + Math.sin(t * freqX[i] + phaseX[i]) * ampX[i];
      mesh.position.y = basePositions[i][1] + Math.sin(t * freqY[i] + phaseY[i]) * ampY[i];
      mesh.material.opacity = 0.35 + 0.55 * Math.abs(Math.sin(t * 0.8 + phaseX[i]));
    });
  });

  return (
    <group ref={meshRef}>
      {basePositions.map((pos, i) => (
        <sprite key={i} position={pos} scale={[scales[i], scales[i], 1]}>
          <spriteMaterial
            map={textures[colorIdx[i]]}
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

export default function FirefliesBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #060f08 0%, #0d1f0f 50%, #081208 100%)" }}
    >
      {mounted && (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <Fireflies />
        </Canvas>
      )}
    </div>
  );
}
