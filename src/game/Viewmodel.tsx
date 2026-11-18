import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { input, motion } from "@/game/input";
import { buildAxe, buildBoomerang, buildSpear } from "@/game/models";
import { useGame } from "@/game/store";

export function Viewmodel() {
  const ref = useRef<THREE.Group>(null);
  const weapon = useGame((s) => s.weapon);
  const { camera } = useThree();
  const boomerang = useMemo(() => buildBoomerang(), []);
  const spear = useMemo(() => buildSpear(), []);
  const axe = useMemo(() => buildAxe(), []);

  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    camera.add(group);
    return () => {
      camera.remove(group);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const dt = Math.min(delta, 0.05);
    if (motion.swing > 0) motion.swing = Math.max(0, motion.swing - dt / 0.28);
    const pull = input.charging ? input.charge : 0;
    const axeOn = weapon === "axe";
    const ropeOn = weapon === "rope";
    const through = motion.swing > 0 ? Math.sin((1 - motion.swing) * Math.PI) : 0;
    if (ropeOn) {
      group.position.set(0.34, -0.42 - pull * 0.16, -0.38);
      group.rotation.set(-0.9 - pull * 0.7, -0.2, 0.4);
    } else if (axeOn) {
      group.position.set(0.2, -0.18 - pull * 0.14, -0.32);
      group.rotation.set(-1.4 + pull * 0.4 + through * 2.15, -0.18, 0.32);
    } else {
      group.position.set(0.46, -0.48 - pull * 0.05, -0.42);
      group.rotation.set(-0.42 + pull * 0.62 - through * 1.15, -0.25, 0.18);
    }
    boomerang.visible = weapon === "boomerang";
    spear.visible = weapon === "spear";
    axe.visible = axeOn;
    const coil = group.getObjectByName("rope-coil");
    if (coil) coil.visible = ropeOn;
  });

  return (
    <group ref={ref} frustumCulled={false}>
      <mesh position={[0.02, -0.02, 0.12]} rotation={[0.55, 0, 0.35]} frustumCulled={false}>
        <capsuleGeometry args={[0.055, 0.32, 4, 8]} />
        <meshStandardMaterial color="#5c3a2c" roughness={0.7} />
      </mesh>
      <mesh position={[0.06, 0.02, 0.02]} rotation={[0.55, 0, 0.35]}>
        <torusGeometry args={[0.064, 0.012, 6, 12]} />
        <meshStandardMaterial color="#c4622d" roughness={0.5} />
      </mesh>
      <mesh position={[0.0, -0.12, 0.22]} rotation={[0.55, 0, 0.35]}>
        <torusGeometry args={[0.06, 0.01, 6, 12]} />
        <meshStandardMaterial color="#c4622d" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, -0.18, -0.08]}>
        <sphereGeometry args={[0.064, 10, 8]} />
        <meshStandardMaterial color="#5c3a2c" roughness={0.68} />
      </mesh>
      <primitive object={boomerang} position={[0.12, -0.16, -0.28]} rotation={[0.2, Math.PI, 0.4]} />
      <primitive object={spear} position={[0.08, -0.14, -0.2]} rotation={[0.15, Math.PI, 0.08]} />
      <primitive object={axe} position={[0.02, -0.08, -0.05]} rotation={[0.15, 0, 0]} />
      <group name="rope-coil" visible={false} position={[0.08, -0.12, -0.16]}>
        <mesh rotation={[0.4, 0.2, 0.6]}>
          <torusGeometry args={[0.09, 0.018, 6, 14]} />
          <meshStandardMaterial color="#6b4630" roughness={0.94} />
        </mesh>
        <mesh rotation={[1.1, 0.4, 0.2]} position={[0.02, -0.03, 0.02]}>
          <torusGeometry args={[0.07, 0.016, 6, 12]} />
          <meshStandardMaterial color="#5a3c28" roughness={0.94} />
        </mesh>
        <mesh rotation={[0.2, 0.8, 1.2]} position={[-0.02, 0.02, -0.02]}>
          <torusGeometry args={[0.055, 0.014, 6, 12]} />
          <meshStandardMaterial color="#7a5340" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
