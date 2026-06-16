"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createHeartTexture(color) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.translate(size / 2, size / 2 + size * 0.12);
  ctx.scale(1.7, 1.7);
  ctx.beginPath();
  const topCurveHeight = size * 0.2;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -size * 0.25, 0, -size * 0.25, topCurveHeight);
  ctx.bezierCurveTo(-size * 0.25, size * 0.32, 0, size * 0.45, 0, size * 0.55);
  ctx.bezierCurveTo(0, size * 0.45, size * 0.25, size * 0.32, size * 0.25, topCurveHeight);
  ctx.bezierCurveTo(size * 0.25, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const COLORS = ["#ff6b9d", "#ff8fab", "#c084fc", "#f472b6", "#fb7185"];

function Hearts({ count = 60 }) {
  const meshRef = useRef();

  const dataRef = useRef(null);
  if (!dataRef.current) {
    const positions = [];
    const speeds = [];
    const sways = [];
    const scales = [];
    const colorIndex = [];

    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14 - 4,
        (Math.random() - 0.5) * 8,
      ]);
      speeds.push(0.25 + Math.random() * 0.5);
      sways.push(Math.random() * Math.PI * 2);
      scales.push(0.25 + Math.random() * 0.55);
      colorIndex.push(Math.floor(Math.random() * COLORS.length));
    }

    const textures = COLORS.map((c) => createHeartTexture(c));

    dataRef.current = { positions, speeds, sways, scales, textures, colorIndex };
  }

  const { positions, speeds, sways, scales, textures, colorIndex } = dataRef.current;

  useFrame((state, delta) => {
    const group = meshRef.current;
    if (!group) return;
    group.children.forEach((mesh, i) => {
      mesh.position.y += speeds[i] * delta * 0.6;
      mesh.position.x += Math.sin(state.clock.elapsedTime * 0.4 + sways[i]) * delta * 0.15;
      mesh.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + sways[i]) * 0.3;

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
          <spriteMaterial
            map={textures[colorIndex[i]]}
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

export default function LoveBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-romance">
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Hearts />
        </Canvas>
      )}
    </div>
  );
}
