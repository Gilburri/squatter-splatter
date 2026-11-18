import type { RefObject } from "react";
import type * as THREE from "three";
import type { FigureLook } from "@/game/figures";

function Hair({ look }: { look: FigureLook }) {
  const color = look.hair;
  if (look.hairStyle === "receding") {
    return (
      <group>
        <mesh position={[-0.105, 0.0, -0.01]} scale={[0.7, 0.85, 0.75]} castShadow>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0.105, 0.0, -0.01]} scale={[0.7, 0.85, 0.75]} castShadow>
          <sphereGeometry args={[0.09, 12, 8]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
        <mesh position={[0, -0.02, -0.11]} scale={[1.05, 0.55, 0.42]} castShadow>
          <sphereGeometry args={[0.11, 12, 8]} />
          <meshStandardMaterial color={color} roughness={0.96} />
        </mesh>
      </group>
    );
  }
  if (look.hairStyle === "curly") {
    const curls: [number, number, number, number][] = [
      [0, 0.13, -0.01, 0.055],
      [-0.07, 0.11, 0.02, 0.05],
      [0.08, 0.11, 0.01, 0.05],
      [-0.04, 0.14, -0.05, 0.046],
      [0.05, 0.135, -0.06, 0.048],
      [0, 0.05, -0.12, 0.06],
      [-0.12, 0.04, -0.02, 0.048],
      [0.12, 0.05, -0.03, 0.05],
      [-0.08, 0.08, -0.08, 0.042],
      [0.09, 0.07, -0.09, 0.044],
    ];
    return (
      <group>
        {curls.map(([x, y, z, r]) => (
          <mesh key={`${x},${y},${z}`} position={[x, y, z]} castShadow>
            <sphereGeometry args={[r, 8, 6]} />
            <meshStandardMaterial color={color} roughness={0.98} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <group>
      <mesh position={[0.015, 0.09, -0.02]} scale={[1.02, 0.46, 0.82]} castShadow>
        <sphereGeometry args={[0.15, 14, 10]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[-0.05, 0.105, 0.03]} scale={[0.55, 0.32, 0.5]} castShadow>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.01, -0.1]} scale={[0.9, 0.62, 0.4]} castShadow>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[-0.12, -0.02, 0.02]} scale={[0.4, 0.85, 0.45]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0.12, -0.02, 0.02]} scale={[0.4, 0.85, 0.45]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
    </group>
  );
}

function Beard({ look }: { look: FigureLook }) {
  const color = look.beard;
  if (look.beardStyle === "patriarch") {
    return (
      <group>
        <mesh position={[0, -0.08, 0.04]} scale={[1.15, 0.8, 0.85]} userData={{ paint: true, gore: "head" }}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
        <mesh position={[0, -0.2, 0.05]} userData={{ paint: true, gore: "head" }}>
          <capsuleGeometry args={[0.07, 0.16, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[-0.06, -0.22, 0.04]} rotation={[0.1, 0, 0.15]} userData={{ paint: true, gore: "head" }}>
          <capsuleGeometry args={[0.045, 0.18, 3, 6]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[0.06, -0.22, 0.04]} rotation={[0.1, 0, -0.15]} userData={{ paint: true, gore: "head" }}>
          <capsuleGeometry args={[0.045, 0.18, 3, 6]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      </group>
    );
  }
  if (look.beardStyle === "bushy") {
    const puffs: [number, number, number, number][] = [
      [0, -0.08, 0.05, 0.07],
      [-0.07, -0.06, 0.04, 0.055],
      [0.07, -0.06, 0.04, 0.055],
      [0, -0.14, 0.05, 0.06],
      [-0.05, -0.13, 0.045, 0.05],
      [0.05, -0.14, 0.04, 0.05],
      [0, -0.2, 0.04, 0.045],
    ];
    return (
      <group>
        {puffs.map(([x, y, z, r]) => (
          <mesh key={`${x},${y}`} position={[x, y, z]} userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[r, 8, 6]} />
            <meshStandardMaterial color={color} roughness={0.97} />
          </mesh>
        ))}
      </group>
    );
  }
  return (
    <group>
      <mesh position={[-0.06, -0.04, 0.05]} scale={[0.7, 0.85, 0.7]} userData={{ paint: true, gore: "head" }}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh position={[0.06, -0.04, 0.05]} scale={[0.7, 0.85, 0.7]} userData={{ paint: true, gore: "head" }}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
      <mesh name="beard" position={[0, -0.08, 0.045]} scale={[1, 0.85, 0.8]} userData={{ paint: true, gore: "head" }}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.94} />
      </mesh>
    </group>
  );
}

function Eye({ x, iris, skin }: { x: number; iris: string; skin: string }) {
  return (
    <group position={[x, 0.02, 0.09]}>
      <mesh position={[0, 0, -0.012]} scale={[1.05, 0.7, 0.35]}>
        <sphereGeometry args={[0.028, 8, 6]} />
        <meshStandardMaterial color="#1a1412" roughness={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.02, 12, 10]} />
        <meshStandardMaterial color="#f4f1ea" roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <sphereGeometry args={[0.01, 10, 8]} />
        <meshStandardMaterial color={iris} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <sphereGeometry args={[0.005, 8, 6]} />
        <meshBasicMaterial color="#100c0a" />
      </mesh>
      <mesh position={[0, 0.012, 0.006]} scale={[1.15, 0.28, 0.55]} userData={{ paint: true, gore: "head" }}>
        <sphereGeometry args={[0.024, 8, 6]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Arm({
  side,
  group,
  skin,
}: {
  side: "L" | "R";
  group: RefObject<THREE.Group | null>;
  skin: string;
}) {
  const sign = side === "L" ? -1 : 1;
  const id = side === "L" ? "armL" : "armR";
  return (
    <group ref={group} position={[sign * 0.32, 0.55, 0]}>
      <mesh name={`sleeve${side}`} position={[0, -0.16, 0]} castShadow userData={{ paint: true, gore: id }}>
        <capsuleGeometry args={[0.075, 0.22, 5, 8]} />
        <meshStandardMaterial color="#2b2723" roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.34, 0]} castShadow userData={{ paint: true, gore: id }}>
        <capsuleGeometry args={[0.062, 0.16, 4, 8]} />
        <meshStandardMaterial color="#322c27" roughness={0.84} />
      </mesh>
      <mesh position={[0, -0.3, 0.02]}>
        <cylinderGeometry args={[0.07, 0.078, 0.04, 8]} />
        <meshStandardMaterial color="#1c1814" roughness={0.7} />
      </mesh>
      <mesh name={`hand${side}`} position={[0, -0.46, 0.02]} userData={{ paint: true, gore: id }}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color={skin} roughness={0.58} />
      </mesh>
      <mesh position={[sign * 0.04, -0.45, 0.04]} rotation={[0.4, 0, sign * 0.6]} userData={{ paint: true, gore: id }}>
        <capsuleGeometry args={[0.014, 0.04, 3, 5]} />
        <meshStandardMaterial color={skin} roughness={0.58} />
      </mesh>
      <mesh position={[0, -0.5, 0.03]} rotation={[0.5, 0, 0]} userData={{ paint: true, gore: id }}>
        <boxGeometry args={[0.05, 0.02, 0.04]} />
        <meshStandardMaterial color={skin} roughness={0.58} />
      </mesh>
      <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.012, 6, 12]} />
        <meshStandardMaterial color="#3e3a36" metalness={0.86} roughness={0.36} />
      </mesh>
      <object3D name={`anchor-${id}`} position={[0, -0.42, 0.02]} />
      <mesh name={`wound-${id}`} userData={{ wound: id }} position={[0, -0.22, 0.08]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color="#7a1418" />
      </mesh>
    </group>
  );
}

function Leg({ side, group }: { side: "L" | "R"; group: RefObject<THREE.Group | null> }) {
  const sign = side === "L" ? -1 : 1;
  const id = side === "L" ? "legL" : "legR";
  return (
    <group ref={group} position={[sign * 0.12, 0.02, 0]}>
      <mesh name={`thigh${side}`} position={[0, -0.26, 0]} castShadow userData={{ paint: true, gore: id }}>
        <capsuleGeometry args={[0.09, 0.28, 4, 8]} />
        <meshStandardMaterial color="#3a342e" roughness={0.86} />
      </mesh>
      <mesh name={`shin${side}`} position={[0, -0.64, 0.02]} castShadow userData={{ paint: true, gore: id }}>
        <capsuleGeometry args={[0.065, 0.22, 4, 8]} />
        <meshStandardMaterial color="#2e2924" roughness={0.88} />
      </mesh>
      <mesh position={[0, -0.86, 0.04]}>
        <boxGeometry args={[0.11, 0.16, 0.24]} />
        <meshStandardMaterial color="#161311" roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.93, 0.1]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#0e0c0a" roughness={0.7} />
      </mesh>
      <object3D name={`anchor-${id}`} position={[0, -0.28, 0.1]} />
      <mesh name={`wound-${id}`} userData={{ wound: id }} position={[0, -0.28, 0.12]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#7a1418" />
      </mesh>
    </group>
  );
}

export function Victim({
  look,
  hips,
  torso,
  head,
  jaw,
  headHat,
  armL,
  armR,
  legL,
  legR,
}: {
  look: FigureLook;
  hips: RefObject<THREE.Group | null>;
  torso: RefObject<THREE.Group | null>;
  head: RefObject<THREE.Group | null>;
  jaw: RefObject<THREE.Group | null>;
  headHat: RefObject<THREE.Group | null>;
  armL: RefObject<THREE.Group | null>;
  armR: RefObject<THREE.Group | null>;
  legL: RefObject<THREE.Group | null>;
  legR: RefObject<THREE.Group | null>;
}) {
  const coat = "#2a2622";
  return (
    <group ref={hips} position={[0, 0.96, 0]}>
      <group ref={torso}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 8]} />
          <meshStandardMaterial color={look.skin} roughness={0.6} />
        </mesh>
        <mesh
          name="coat"
          position={[0, 0.34, 0]}
          scale={[look.bulk, 1, 0.92]}
          castShadow
          userData={{ paint: true, gore: "chest", gore2: "gut" }}
        >
          <capsuleGeometry args={[0.2, 0.28, 6, 10]} />
          <meshStandardMaterial color={coat} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.52, 0]} scale={[look.bulk * 1.15, 0.55, 0.85]} castShadow userData={{ paint: true, gore: "chest" }}>
          <sphereGeometry args={[0.24, 14, 10]} />
          <meshStandardMaterial color={coat} roughness={0.82} />
        </mesh>
        <mesh position={[-0.09, 0.4, 0.14]} rotation={[0.15, 0.35, 0.55]} userData={{ paint: true, gore: "chest" }}>
          <boxGeometry args={[0.1, 0.28, 0.025]} />
          <meshStandardMaterial color="#241f1b" roughness={0.78} />
        </mesh>
        <mesh position={[0.09, 0.4, 0.14]} rotation={[0.15, -0.35, -0.55]} userData={{ paint: true, gore: "chest" }}>
          <boxGeometry args={[0.1, 0.28, 0.025]} />
          <meshStandardMaterial color="#241f1b" roughness={0.78} />
        </mesh>
        <mesh
          name="shirt"
          position={[0, 0.3, 0.14]}
          userData={{ paint: true, gore: "chest", gore2: "gut" }}
        >
          <boxGeometry args={[0.12, 0.28, 0.03]} />
          <meshStandardMaterial color="#e7dfd0" roughness={0.66} />
        </mesh>
        <mesh position={[0, 0.18, 0.15]} userData={{ paint: true, gore: "gut" }}>
          <boxGeometry args={[0.16, 0.16, 0.03]} />
          <meshStandardMaterial color="#3a2420" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.5, 0.12]} scale={[1, look.cravat, 1]}>
          <boxGeometry args={[0.14, 0.1, 0.05]} />
          <meshStandardMaterial color="#f3eee4" roughness={0.62} />
        </mesh>
        <mesh position={[-0.07, 0.44, 0.13]} rotation={[0.2, 0.2, 0.8]} scale={[1, look.cravat, 1]}>
          <boxGeometry args={[0.1, 0.045, 0.02]} />
          <meshStandardMaterial color="#f7f3ea" roughness={0.6} />
        </mesh>
        <mesh position={[0.07, 0.44, 0.13]} rotation={[0.2, -0.2, -0.8]} scale={[1, look.cravat, 1]}>
          <boxGeometry args={[0.1, 0.045, 0.02]} />
          <meshStandardMaterial color="#f7f3ea" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, -0.02]} scale={[look.bulk, 1, 0.9]} userData={{ paint: true, gore: "gut" }}>
          <cylinderGeometry args={[0.2, 0.24, 0.28, 10]} />
          <meshStandardMaterial color={coat} roughness={0.84} />
        </mesh>
        <object3D name="anchor-chest" position={[0, 0.42, 0.2]} />
        <object3D name="anchor-gut" position={[0, 0.16, 0.2]} />
        <mesh name="wound-chest" userData={{ wound: "chest" }} position={[0, 0.4, 0.2]}>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshBasicMaterial color="#7a1418" />
        </mesh>
        <mesh name="wound-gut" userData={{ wound: "gut" }} position={[0, 0.16, 0.18]}>
          <sphereGeometry args={[0.08, 8, 6]} />
          <meshBasicMaterial color="#7a1418" />
        </mesh>

        <group ref={head} position={[0, 0.84, 0.03]}>
          <mesh name="skin" scale={[0.92, 1.05, 0.88]} castShadow userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[0.155, 22, 16]} />
            <meshStandardMaterial color={look.skin} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.055, 0.09]} scale={[1.15, 0.28, 0.45]} userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[0.08, 10, 8]} />
            <meshStandardMaterial color={look.skin} roughness={0.6} />
          </mesh>
          <mesh position={[-0.055, 0.055, 0.1]} rotation={[0, 0, 0.45]}>
            <boxGeometry args={[0.055, 0.016, 0.02]} />
            <meshStandardMaterial color="#2a211c" roughness={0.7} />
          </mesh>
          <mesh position={[0.055, 0.055, 0.1]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.055, 0.016, 0.02]} />
            <meshStandardMaterial color="#2a211c" roughness={0.7} />
          </mesh>
          <Eye x={-0.05} iris={look.iris} skin={look.skin} />
          <Eye x={0.05} iris={look.iris} skin={look.skin} />
          <mesh position={[0, 0.01, 0.12]} rotation={[0.55, 0, 0]} scale={[0.65, look.nose, 1]} userData={{ paint: true, gore: "head" }}>
            <capsuleGeometry args={[0.016, 0.055, 3, 6]} />
            <meshStandardMaterial color={look.skin} roughness={0.52} />
          </mesh>
          <mesh name="nose" position={[0, -0.028, 0.145]} scale={[1, 0.85, look.nose]} userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[0.028, 12, 10]} />
            <meshStandardMaterial color={look.skin} roughness={0.5} />
          </mesh>
          <mesh position={[-0.018, -0.04, 0.15]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshStandardMaterial color="#8a5a52" roughness={0.7} />
          </mesh>
          <mesh position={[0.018, -0.04, 0.15]}>
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshStandardMaterial color="#8a5a52" roughness={0.7} />
          </mesh>
          <mesh position={[-0.145, 0.0, 0]} rotation={[0, 0, 0.4]} scale={[0.45, 0.85, 0.35]} userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={look.skin} roughness={0.6} />
          </mesh>
          <mesh position={[0.145, 0.0, 0]} rotation={[0, 0, -0.4]} scale={[0.45, 0.85, 0.35]} userData={{ paint: true, gore: "head" }}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={look.skin} roughness={0.6} />
          </mesh>
          <mesh position={[-0.05, -0.045, 0.12]} rotation={[0.2, 0.3, 0.4]}>
            <capsuleGeometry args={[0.012, 0.04, 3, 5]} />
            <meshStandardMaterial color={look.beard} roughness={0.9} />
          </mesh>
          <mesh position={[0.05, -0.045, 0.12]} rotation={[0.2, -0.3, -0.4]}>
            <capsuleGeometry args={[0.012, 0.04, 3, 5]} />
            <meshStandardMaterial color={look.beard} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.055, 0.125]}>
            <boxGeometry args={[0.05, 0.012, 0.02]} />
            <meshStandardMaterial color="#8d534c" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.07, 0.11]}>
            <boxGeometry args={[0.045, 0.028, 0.02]} />
            <meshBasicMaterial color="#1a0c0c" />
          </mesh>
          <Hair look={look} />
          <group ref={jaw} position={[0, -0.04, 0.02]}>
            <mesh position={[0, -0.06, 0.03]} scale={[0.82, 0.62, 0.78]} userData={{ paint: true, gore: "head" }}>
              <sphereGeometry args={[0.11, 14, 10]} />
              <meshStandardMaterial color={look.skin} roughness={0.58} />
            </mesh>
            <mesh position={[0, -0.02, 0.1]}>
              <boxGeometry args={[0.05, 0.014, 0.02]} />
              <meshStandardMaterial color="#a8645c" roughness={0.5} />
            </mesh>
            <Beard look={look} />
          </group>
          <group ref={headHat} position={[0, 0.12, -0.01]} rotation={[-0.18, 0, 0.04]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.018, 18]} />
              <meshStandardMaterial color="#241c16" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.105, 0.118, 0.14, 12]} />
              <meshStandardMaterial color="#241c16" roughness={0.8} />
            </mesh>
          </group>
          <object3D name="anchor-head" position={[0, 0.02, 0.1]} />
          <mesh name="wound-head" userData={{ wound: "head" }} position={[0.02, 0.02, 0.12]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshBasicMaterial color="#7a1418" />
          </mesh>
          <mesh position={[0, -0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09, 0.015, 6, 14]} />
            <meshStandardMaterial color="#3e3a36" metalness={0.86} roughness={0.36} />
          </mesh>
          <object3D name="anchor-neck" position={[0, -0.16, -0.02]} />
        </group>

        <Arm side="L" group={armL} skin={look.skin} />
        <Arm side="R" group={armR} skin={look.skin} />
      </group>
      <Leg side="L" group={legL} />
      <Leg side="R" group={legR} />
    </group>
  );
}
