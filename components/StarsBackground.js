"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255, 255, 220, 1)");
  gradient.addColorStop(0.25, "rgba(255, 240, 180, 0.8)");
  gradient.addColorStop(0.55, "rgba(200, 180, 255, 0.3)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Stars({ count = 80 }) {
  const meshRef = useRef();
  const dataRef = useRef(null);

  if (!dataRef.current) {
    const positions = [];
    const speeds = [];
    const phases = [];
    const scales = [];

    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
      ]);
      speeds.push(0.5 + Math.random() * 0.8);
      phases.push(Math.random() * Math.PI * 2);
      scales.push(0.08 + Math.random() * 0.3);
    }

    const texture = createStarTexture();
    dataRef.current = { positions, speeds, phases, scales, texture };
  }

  const { positions, speeds, phases, scales, texture } = dataRef.current;

  useFrame((state, delta) => {
    const group = meshRef.current;
    if (!group) return;
    group.children.forEach((mesh, i) => {
      mesh.position.y += speeds[i] * delta * 0.15;
      mesh.material.opacity =
        0.3 + 0.55 * Math.abs(Math.sin(state.clock.elapsedTime * speeds[i] * 0.6 + phases[i]));

      if (mesh.position.y > 8) {
        mesh.position.y = -8;
        mesh.position.x = (Math.random() - 0.5) * 22;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {positions.map((pos, i) => (
        <sprite key={i} position={pos} scale={[scales[i], scales[i], 1]}>
          <spriteMaterial map={texture} transparent opacity={0.7} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

export default function StarsBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #080d1a 0%, #0f1a30 50%, #0a0e20 100%)" }}
    >
      {mounted && (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <Stars />
        </Canvas>
      )}
    </div>
  );
}
