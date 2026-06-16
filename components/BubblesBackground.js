"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createBubbleTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.28, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(160, 210, 255, 0)");
  gradient.addColorStop(0.72, "rgba(160, 210, 255, 0)");
  gradient.addColorStop(0.82, "rgba(190, 225, 255, 0.35)");
  gradient.addColorStop(0.93, "rgba(220, 240, 255, 0.55)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // highlight
  ctx.beginPath();
  ctx.arc(size * 0.38, size * 0.35, size * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Bubbles({ count = 45 }) {
  const meshRef = useRef();
  const dataRef = useRef(null);

  if (!dataRef.current) {
    const positions = [];
    const speeds = [];
    const sways = [];
    const scales = [];

    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14 - 4,
        (Math.random() - 0.5) * 6,
      ]);
      speeds.push(0.18 + Math.random() * 0.38);
      sways.push(Math.random() * Math.PI * 2);
      scales.push(0.35 + Math.random() * 0.9);
    }

    const texture = createBubbleTexture();
    dataRef.current = { positions, speeds, sways, scales, texture };
  }

  const { positions, speeds, sways, scales, texture } = dataRef.current;

  useFrame((state, delta) => {
    const group = meshRef.current;
    if (!group) return;
    group.children.forEach((mesh, i) => {
      mesh.position.y += speeds[i] * delta * 0.5;
      mesh.position.x += Math.sin(state.clock.elapsedTime * 0.3 + sways[i]) * delta * 0.12;

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
          <spriteMaterial map={texture} transparent opacity={0.65} depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

export default function BubblesBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #061520 0%, #0a2235 50%, #071928 100%)" }}
    >
      {mounted && (
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <Bubbles />
        </Canvas>
      )}
    </div>
  );
}
