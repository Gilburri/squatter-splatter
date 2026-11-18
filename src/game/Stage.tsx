import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { unlockAudio } from "@/game/audio";
import { Clearing } from "@/game/Clearing";
import { GRAVITY, boomerangPosition, spearSpeed, throwReach } from "@/game/flight";
import { input, motion, beginHaul, releaseThrow, startCharge } from "@/game/input";
import { useGame } from "@/game/store";
import { Viewmodel } from "@/game/Viewmodel";

const _o = new THREE.Vector3();
const _f = new THREE.Vector3();
const _r = new THREE.Vector3();
const _p = new THREE.Vector3();

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (input.charging) input.charge = Math.min(1, input.charge + dt / 0.62);
    motion.shake = Math.max(0, motion.shake - dt * 1.8);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = reduce ? 0 : motion.shake;
    const want = useGame.getState().weapon === "axe" && useGame.getState().phase === "play" ? useGame.getState().close : 0;
    input.dolly = THREE.MathUtils.damp(input.dolly, want, 4.2, dt);
    const y = THREE.MathUtils.lerp(1.66, 1.7, input.dolly);
    const z = THREE.MathUtils.lerp(7.5, 2.05, input.dolly);
    camera.position.set(Math.sin(s * 48) * 0.05 * s, y + Math.cos(s * 33) * 0.035 * s, z);
    camera.rotation.order = "YXZ";
    camera.rotation.y = input.yaw;
    camera.rotation.x = input.pitch;
    camera.rotation.z = reduce ? 0 : Math.sin(s * 62) * 0.012 * s;
  });
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight color="#9aadc8" groundColor="#2a2218" intensity={0.55} />
      <ambientLight color="#202430" intensity={0.35} />
      <directionalLight
        position={[-7, 11, -5]}
        intensity={2.35}
        color="#e7eeff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={36}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[3.5, 4.5, 8]} intensity={0.55} color="#ffd2b4" />
    </>
  );
}

function AimGuide() {
  const { camera } = useThree();
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    const show = input.charging && useGame.getState().phase === "play" && useGame.getState().weapon !== "axe";
    const weapon = useGame.getState().weapon;
    const power = Math.max(input.charge, 0.45);
    camera.getWorldPosition(_o);
    _f.set(0, 0, -1).applyQuaternion(camera.quaternion);
    _r.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const rf = throwReach(_o, _f);
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = show;
      if (!show) return;
      const t = (index + 1) / refs.current.length;
      if (weapon === "boomerang") boomerangPosition(_o, _f, _r, rf, 0.75, t * 0.92, _p);
      else {
        const speed = spearSpeed(power);
        const time = t * 0.48;
        _p.copy(_o).addScaledVector(_f, 0.45 + speed * time);
        _p.y -= 0.5 * GRAVITY * time * time;
      }
      mesh.position.copy(_p);
    });
  });
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#e6d7c3" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function StageWorld() {
  const round = useGame((s) => s.round);
  return (
    <>
      <color attach="background" args={["#12151c"]} />
      <fog attach="fog" args={["#12151c", 16, 46]} />
      <CameraRig />
      <Lights />
      <Clearing key={round} />
      <Viewmodel />
      <AimGuide />
    </>
  );
}

export default function Stage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; id: number } | null>(null);
  const gore = useGame((s) => s.gore);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-ui]")) return;
      unlockAudio();
      if (event.pointerType === "touch") {
        touch.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        return;
      }
      if (event.button !== 0) return;
      startCharge();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (!touch.current || event.pointerId !== touch.current.id) return;
        const dx = event.clientX - touch.current.x;
        const dy = event.clientY - touch.current.y;
        touch.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        input.yaw = clamp(input.yaw - dx * 0.0048, -0.78, 0.78);
        input.pitch = clamp(input.pitch - dy * 0.0036, -0.5, 0.46);
        return;
      }
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("[data-ui]")) return;
      if (!root.contains(target as Node)) return;
      const rect = root.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      input.yaw = clamp(-nx * 0.62, -0.78, 0.78);
      input.pitch = clamp(0.04 - ny * 0.34, -0.5, 0.46);
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (touch.current?.id === event.pointerId) touch.current = null;
        return;
      }
      if (input.charging) releaseThrow();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "Digit1") useGame.getState().setWeapon("boomerang");
      if (event.code === "Digit2") useGame.getState().setWeapon("spear");
      if (event.code === "Digit3") useGame.getState().setWeapon("axe");
      if (event.code === "Digit4") useGame.getState().setWeapon("rope");
      if (event.code === "KeyW" && useGame.getState().phase === "play") {
        event.preventDefault();
        useGame.getState().setClose(1);
      }
      if (event.code === "KeyS" && useGame.getState().phase === "play") {
        event.preventDefault();
        useGame.getState().setClose(0);
      }
      if (event.code === "KeyR") {
        const phase = useGame.getState().phase;
        if (phase === "play" || phase === "done") useGame.getState().again();
      }
      if (event.code === "Space") {
        event.preventDefault();
        if (useGame.getState().weapon === "rope") beginHaul();
        else startCharge();
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        releaseThrow();
      }
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 touch-none">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ fov: 50, near: 0.08, far: 70, position: [0, 1.66, 7.5] }}
        gl={{ antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.12;
        }}
      >
        <StageWorld />
      </Canvas>
      <div className="vig pointer-events-none absolute inset-0" />
      <div
        className="vig-gore pointer-events-none absolute inset-0"
        style={{ ["--vig" as string]: String(Math.min(0.72, gore * 0.85)) }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2">
        <span className="absolute top-0 -left-4 h-px w-2.5 bg-blood" />
        <span className="absolute top-0 left-1.5 h-px w-2.5 bg-blood" />
        <span className="absolute -top-4 left-0 h-2.5 w-px bg-blood" />
        <span className="absolute top-1.5 left-0 h-2.5 w-px bg-blood" />
      </div>
    </div>
  );
}
