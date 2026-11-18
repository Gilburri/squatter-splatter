import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { chainClank, choke, death, setGroan, wet, wood } from "@/game/audio";
import {
  GRAVITY,
  boomerangPosition,
  boomerangTangent,
  gumRadius,
  segmentHitsSphere,
  spearSpeed,
  throwReach,
} from "@/game/flight";
import { input, motion } from "@/game/input";
import { FIGURES } from "@/game/figures";
import { buildFlyer } from "@/game/models";
import { useGame, type Weapon } from "@/game/store";
import { makeBark, makeBlood, makeGround } from "@/game/textures";
import { Victim } from "@/game/Victim";

const BLOOD = new THREE.Color("#6e1216");
const UP = new THREE.Vector3(0, 1, 0);
const DOWN = new THREE.Vector3(0, -1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

const _o = new THREE.Vector3();
const _f = new THREE.Vector3();
const _r = new THREE.Vector3();
const _p = new THREE.Vector3();
const _p2 = new THREE.Vector3();
const _hit = new THREE.Vector3();
const _best = new THREE.Vector3();
const _look = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _local = new THREE.Vector3();
const _aim = new THREE.Vector3();
const _sample = new THREE.Vector3();
const HITCH = new THREE.Vector3(0.85, 4.55, 0.7);

type PartId = "head" | "chest" | "gut" | "armL" | "armR" | "legL" | "legR";

const PART_META: { id: PartId; label: string; radius: number; mult: number }[] = [
  { id: "head", label: "SKULL", radius: 0.2, mult: 1.65 },
  { id: "chest", label: "RIBS", radius: 0.28, mult: 1 },
  { id: "gut", label: "GUT", radius: 0.22, mult: 1.05 },
  { id: "armL", label: "ARM", radius: 0.14, mult: 0.58 },
  { id: "armR", label: "ARM", radius: 0.14, mult: 0.58 },
  { id: "legL", label: "THIGH", radius: 0.16, mult: 0.7 },
  { id: "legR", label: "THIGH", radius: 0.16, mult: 0.7 },
];

type PartRT = {
  id: PartId;
  label: string;
  radius: number;
  mult: number;
  anchor: THREE.Object3D;
  world: THREE.Vector3;
};

type Flyer = {
  group: THREE.Group;
  kind: Weapon;
  alive: boolean;
  stuck: boolean;
  phase: number;
  pos: THREE.Vector3;
  prev: THREE.Vector3;
  vel: THREE.Vector3;
  origin: THREE.Vector3;
  forward: THREE.Vector3;
  right: THREE.Vector3;
  rf: number;
  side: number;
  power: number;
  hits: Set<string>;
  spin: number;
  barked: boolean;
};

type Drop = {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  max: number;
  stained: boolean;
  base: number;
};

function quad(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, t: number, out: THREE.Vector3) {
  const u = 1 - t;
  out.set(0, 0, 0);
  out.addScaledVector(a, u * u);
  out.addScaledVector(b, 2 * u * t);
  out.addScaledVector(c, t * t);
}

function trunkHit(a: THREE.Vector3, b: THREE.Vector3, out: THREE.Vector3) {
  for (let i = 1; i <= 4; i++) {
    out.lerpVectors(a, b, i / 4);
    if (out.y < 0.25 || out.y > 8.5) continue;
    const r = gumRadius(out.y) * 0.96;
    if (out.x * out.x + out.z * out.z < r * r) {
      const radial = Math.hypot(out.x, out.z) || 1;
      out.x = (out.x / radial) * r;
      out.z = (out.z / radial) * r;
      return true;
    }
  }
  return false;
}

export function Clearing() {
  const { camera } = useThree();
  const barkTex = useMemo(() => makeBark(), []);
  const groundTex = useMemo(() => makeGround(), []);
  const bloodTex = useMemo(() => makeBlood(), []);
  const look = useGame((s) => FIGURES[s.figure]?.look ?? FIGURES[0].look);
  const trunkGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 30; i++) pts.push(new THREE.Vector2(gumRadius((i / 30) * 12.8), (i / 30) * 12.8));
    const geo = new THREE.LatheGeometry(pts, 18);
    const pos = geo.attributes.position;
    if (!pos) return geo;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = 1 + Math.sin(y * 2.4 + x) * 0.025 + Math.sin(y * 14.0) * 0.012;
      pos.setXYZ(i, x * n, y, z * n);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  const stars = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(70 * 3);
    for (let i = 0; i < 70; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 22 + Math.random() * 16;
      arr[i * 3] = Math.cos(ang) * rad;
      arr[i * 3 + 1] = 6 + Math.random() * 14;
      arr[i * 3 + 2] = Math.sin(ang) * rad;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return geo;
  }, []);

  const tree = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const hips = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const headHat = useRef<THREE.Group>(null);
  const worldHat = useRef<THREE.Group>(null);
  const holder = useRef<THREE.Group>(null);
  const ground = useRef<THREE.Group>(null);
  const rope = useRef<THREE.Mesh>(null);
  const noose = useRef<THREE.Mesh>(null);

  const parts = useRef<PartRT[]>([]);
  const paintLists = useRef<Partial<Record<PartId, THREE.Mesh[]>>>({});
  const flyers = useRef<Flyer[]>([]);
  const drops = useRef<Drop[]>([]);
  const decals = useRef<THREE.Mesh[]>([]);
  const links = useRef<THREE.Mesh[]>([]);
  const decalCursor = useRef(0);
  const hang = useRef(0);
  const hoist = useRef(0);
  const strungDone = useRef(false);
  const recoil = useRef(0);
  const alive = useRef(true);
  const hatLost = useRef(false);
  const hatVel = useRef(new THREE.Vector3());
  const voice = useRef(false);
  const drip = useRef(0);
  const bleed = useRef<Partial<Record<PartId, number>>>({});

  useLayoutEffect(() => {
    const root = rig.current;
    const bin = holder.current;
    const floor = ground.current;
    const trunk = tree.current;
    if (!root || !bin || !floor || !trunk) return;
    input.haul = false;

    const lists: Partial<Record<PartId, THREE.Mesh[]>> = {};
    const take = (name: string) => root.getObjectByName(name) as THREE.Mesh | undefined;
    const assign = (id: PartId, names: string[]) => {
      lists[id] = names
        .map((name) => take(name))
        .filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
    };
    assign("head", ["skin", "nose", "beard"]);
    assign("chest", ["coat", "shirt"]);
    assign("gut", ["coat", "shirt"]);
    assign("armL", ["sleeveL", "handL"]);
    assign("armR", ["sleeveR", "handR"]);
    assign("legL", ["thighL", "shinL"]);
    assign("legR", ["thighR", "shinR"]);
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const gore = mesh.userData.gore as PartId | undefined;
      const gore2 = mesh.userData.gore2 as PartId | undefined;
      if (gore) (lists[gore] ??= []).push(mesh);
      if (gore2) (lists[gore2] ??= []).push(mesh);
    });
    paintLists.current = lists;

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
      if (mesh.userData.paint && (mat as THREE.MeshStandardMaterial).color) {
        const standard = mat as THREE.MeshStandardMaterial;
        mesh.userData.base = standard.color.clone();
        mesh.userData.rough = standard.roughness;
      }
      if (typeof mesh.userData.wound === "string") {
        mesh.visible = false;
        mesh.userData.n = 0;
      }
    });

    const found: PartRT[] = [];
    for (const meta of PART_META) {
      const anchor = root.getObjectByName(`anchor-${meta.id}`);
      if (!anchor) continue;
      found.push({ ...meta, anchor, world: new THREE.Vector3() });
    }
    parts.current = found;

    const iron = new THREE.MeshStandardMaterial({ color: "#4a453f", metalness: 0.88, roughness: 0.36 });
    const linkGeo = new THREE.TorusGeometry(0.048, 0.014, 6, 8);
    const chain: THREE.Mesh[] = [];
    for (let i = 0; i < 33; i++) {
      const link = new THREE.Mesh(linkGeo, iron);
      link.castShadow = true;
      bin.add(link);
      chain.push(link);
    }
    links.current = chain;

    const made: Flyer[] = [];
    for (let i = 0; i < 6; i++) {
      const group = buildFlyer();
      bin.add(group);
      made.push({
        group,
        kind: "spear",
        alive: false,
        stuck: false,
        phase: 0,
        pos: new THREE.Vector3(),
        prev: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        origin: new THREE.Vector3(),
        forward: new THREE.Vector3(),
        right: new THREE.Vector3(),
        rf: 8,
        side: 0.75,
        power: 0.5,
        hits: new Set(),
        spin: 0,
        barked: false,
      });
    }
    flyers.current = made;

    const bloodGeo = new THREE.SphereGeometry(1, 6, 5);
    const bloodMat = new THREE.MeshStandardMaterial({
      color: "#7c1418",
      roughness: 0.32,
      metalness: 0.06,
      emissive: "#3a0808",
      emissiveIntensity: 0.4,
    });
    const dropList: Drop[] = [];
    for (let i = 0; i < 90; i++) {
      const mesh = new THREE.Mesh(bloodGeo, bloodMat);
      mesh.visible = false;
      mesh.castShadow = false;
      bin.add(mesh);
      dropList.push({
        mesh,
        vel: new THREE.Vector3(),
        life: 0,
        max: 1,
        stained: false,
        base: 0.05,
      });
    }
    drops.current = dropList;

    const decalMat = new THREE.MeshBasicMaterial({
      map: bloodTex,
      color: "#8a1418",
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    const decalGeo = new THREE.PlaneGeometry(1, 1);
    const decalList: THREE.Mesh[] = [];
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(decalGeo, decalMat);
      mesh.visible = false;
      mesh.renderOrder = 2;
      bin.add(mesh);
      decalList.push(mesh);
    }
    decals.current = decalList;

    const branchMat = new THREE.MeshStandardMaterial({ map: barkTex, color: "#cbb892", roughness: 0.94 });
    const branchMeshes: THREE.Mesh[] = [];
    const ends: THREE.Vector3[] = [];
    const specs: [number, number, number, number, number, number, number][] = [
      [0.15, 4.3, 0.1, 2.6, 5.4, 1.4, 0.16],
      [-0.1, 4.8, -0.05, -2.8, 5.7, -0.6, 0.15],
      [0.05, 5.7, -0.1, 1.4, 6.9, -2.4, 0.13],
      [0, 6.5, 0.05, -1.9, 7.7, 1.7, 0.12],
      [0.1, 7.4, 0, 2.3, 8.6, 0.5, 0.1],
      [-0.1, 8.2, 0, -0.7, 9.6, -1.6, 0.09],
    ];
    for (const [x1, y1, z1, x2, y2, z2, radius] of specs) {
      const from = new THREE.Vector3(x1, y1, z1);
      const to = new THREE.Vector3(x2, y2, z2);
      const dir = to.clone().sub(from);
      const len = dir.length();
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius, len, 6), branchMat);
      mesh.position.copy(from).add(to).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
      mesh.castShadow = true;
      trunk.add(mesh);
      branchMeshes.push(mesh);
      ends.push(to);
    }

    const leafGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const leafMat = new THREE.MeshStandardMaterial({ color: "#3e4a32", roughness: 0.92, flatShading: true });
    const leaves = new THREE.InstancedMesh(leafGeo, leafMat, 64);
    const dummy = new THREE.Object3D();
    let n = 0;
    for (const end of ends) {
      for (let k = 0; k < 8 && n < 64; k++) {
        dummy.position.set(
          end.x + (Math.random() - 0.5) * 1.4,
          end.y + (Math.random() - 0.4) * 1.1,
          end.z + (Math.random() - 0.5) * 1.4,
        );
        dummy.rotation.set(Math.random() * 3, Math.random() * 6, Math.random() * 3);
        dummy.scale.setScalar(0.7 + Math.random() * 0.9);
        dummy.updateMatrix();
        leaves.setMatrixAt(n, dummy.matrix);
        n++;
      }
    }
    for (let i = n; i < 64; i++) {
      dummy.position.set(0, -20, 0);
      dummy.scale.setScalar(0.001);
      dummy.updateMatrix();
      leaves.setMatrixAt(i, dummy.matrix);
    }
    leaves.instanceMatrix.needsUpdate = true;
    trunk.add(leaves);

    const grassGeo = new THREE.ConeGeometry(0.08, 1, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: "#243024", roughness: 1 });
    const grass = new THREE.InstancedMesh(grassGeo, grassMat, 160);
    let g = 0;
    for (let i = 0; i < 160; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 2.2 + Math.random() * 13;
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;
      if (x * x + z * z < 2.2) continue;
      dummy.position.set(x, 0.15, z);
      dummy.rotation.set(0, Math.random() * 6, 0);
      dummy.scale.set(0.7 + Math.random(), 0.35 + Math.random() * 0.7, 0.7);
      dummy.updateMatrix();
      grass.setMatrixAt(g, dummy.matrix);
      g++;
    }
    for (let i = g; i < 160; i++) {
      dummy.position.set(0, -5, 0);
      dummy.scale.setScalar(0.001);
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
    }
    grass.instanceMatrix.needsUpdate = true;
    floor.add(grass);

    return () => {
      for (const flyer of made) {
        flyer.group.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) mesh.geometry.dispose();
        });
        bin.remove(flyer.group);
      }
      bloodGeo.dispose();
      bloodMat.dispose();
      decalGeo.dispose();
      decalMat.dispose();
      linkGeo.dispose();
      iron.dispose();
      for (const mesh of branchMeshes) {
        trunk.remove(mesh);
        mesh.geometry.dispose();
      }
      branchMat.dispose();
      trunk.remove(leaves);
      leafGeo.dispose();
      leafMat.dispose();
      floor.remove(grass);
      grassGeo.dispose();
      grassMat.dispose();
      for (const link of chain) bin.remove(link);
      for (const drop of dropList) bin.remove(drop.mesh);
      for (const decal of decalList) bin.remove(decal);
      flyers.current = [];
      drops.current = [];
      decals.current = [];
      links.current = [];
      setGroan(false);
    };
  }, [barkTex, bloodTex]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    let sim = dt;
    if (motion.hitStop > 0) {
      motion.hitStop -= dt;
      sim *= 0.22;
    }
    const t = performance.now() * 0.001;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const idle = reduce ? 0 : 1;
    const strung = useGame.getState().strung;
    const hangTarget = !strung && useGame.getState().vitality <= 0 ? 1 : 0;
    hang.current = THREE.MathUtils.damp(hang.current, hangTarget, hangTarget > 0 ? 2.4 : 1.5, sim);
    recoil.current = Math.max(0, recoil.current - sim * 2.4);
    const rec = recoil.current;
    const h = hang.current;

    if (hips.current) hips.current.position.y = THREE.MathUtils.lerp(0.96, 0.42, h) + Math.sin(t * 1.7) * 0.01 * idle * (1 - h);
    if (torso.current) {
      torso.current.rotation.x = THREE.MathUtils.lerp(0.04, 0.72, h) - rec * 0.28;
      torso.current.rotation.y = Math.sin(t * 0.85) * 0.05 * idle * (1 - h);
    }
    if (head.current) {
      const talk = useGame.getState().shut ? 0.15 : 1;
      head.current.rotation.x = Math.sin(t * 1.4) * 0.05 * idle * talk + h * 0.85 - rec * 0.45;
      head.current.rotation.y = Math.sin(t * 0.65) * 0.16 * idle * (1 - h) * talk;
      head.current.rotation.z = rec * Math.sin(t * 36) * 0.18;
    }
    if (jaw.current) {
      const shut = useGame.getState().shut || h > 0.2;
      jaw.current.rotation.x = shut ? 0 : -(0.06 + Math.sin(t * 6.2) * 0.07) * idle;
    }
    const groaning = useGame.getState().phase === "play" && useGame.getState().vitality > 0 && !useGame.getState().shut;
    if (groaning !== voice.current) {
      voice.current = groaning;
      setGroan(groaning);
    }
    const spreadStruggle = Math.sin(t * 8) * 0.06 * idle * (1 - h);
    const yUp = THREE.MathUtils.lerp(0.12, 0.9, h);
    const zBack = THREE.MathUtils.lerp(-0.95, -0.4, h);
    const xOut = THREE.MathUtils.lerp(0.95, 0.32, h);
    if (armL.current) {
      _dir.set(-xOut, yUp + spreadStruggle, zBack).normalize();
      armL.current.quaternion.setFromUnitVectors(DOWN, _dir);
    }
    if (armR.current) {
      _dir.set(xOut, yUp - spreadStruggle, zBack).normalize();
      armR.current.quaternion.setFromUnitVectors(DOWN, _dir);
    }
    if (legL.current) legL.current.rotation.x = -1.2 * h;
    if (legR.current) legR.current.rotation.x = -1.05 * h;

    if (input.haul && hoist.current < 1) {
      hoist.current = Math.min(1, hoist.current + sim * 0.7);
    }
    const lifted = hoist.current;
    if (rig.current) {
      const shudder = lifted > 0 && lifted < 0.98 ? Math.sin(t * 18) * 0.025 : 0;
      rig.current.position.y = lifted * 2.05 + shudder;
    }
    if (strung) {
      const kick = Math.sin(t * 12) * 0.5 * Math.max(0, 1 - lifted * 1.15);
      if (legL.current) legL.current.rotation.x = -0.35 + kick;
      if (legR.current) legR.current.rotation.x = -0.22 - kick * 0.85;
      if (torso.current) {
        torso.current.rotation.x = 0.06;
        torso.current.rotation.z = 0.14;
      }
      if (head.current) {
        head.current.rotation.x = 0.42;
        head.current.rotation.y = 0.18;
        head.current.rotation.z = 0.48 + Math.sin(t * 8) * 0.06 * (1 - lifted);
      }
      if (armL.current) {
        _dir.set(-0.42, -0.82, 0.12).normalize();
        armL.current.quaternion.setFromUnitVectors(DOWN, _dir);
      }
      if (armR.current) {
        _dir.set(0.38, -0.84, 0.08).normalize();
        armR.current.quaternion.setFromUnitVectors(DOWN, _dir);
      }
    }

    rig.current?.updateWorldMatrix(true, true);
    for (const part of parts.current) part.anchor.getWorldPosition(part.world);

    if (input.chop > 0) {
      const prev = input.chop;
      input.chop = Math.max(0, input.chop - sim / 0.32);
      if (prev > 0.5 && input.chop <= 0.5) axeChop();
    }

    const ring = tree.current?.getObjectByName("anchor-ring");
    const neck = rig.current?.getObjectByName("anchor-neck");
    const wristL = rig.current?.getObjectByName("anchor-armL");
    const wristR = rig.current?.getObjectByName("anchor-armR");
    if (ring && neck && wristL && wristR && links.current.length === 33) {
      ring.getWorldPosition(_o);
      const sag = 0.18 * (1 - h * 0.65) + Math.sin(t * 3) * 0.012 * idle;
      const place = (index: number, target: THREE.Object3D) => {
        target.getWorldPosition(_f);
        _mid.copy(_o).lerp(_f, 0.5);
        _mid.y -= sag;
        for (let i = 0; i < 11; i++) {
          const u = (i + 0.5) / 11;
          quad(_o, _mid, _f, u, _p);
          quad(_o, _mid, _f, Math.min(0.98, u + 0.07), _p2);
          const link = links.current[index + i];
          if (!link) continue;
          link.position.copy(_p);
          _dir.subVectors(_p2, _p);
          if (_dir.lengthSq() > 1e-6) {
            link.quaternion.setFromUnitVectors(Z_AXIS, _dir.normalize());
            if (i % 2 === 1) link.rotateZ(Math.PI / 2);
          }
        }
      };
      place(11, wristL);
      place(22, wristR);
      if (strung) {
        for (let i = 0; i < 11; i++) {
          const link = links.current[i];
          if (link) link.visible = false;
        }
      } else {
        place(0, neck);
        for (let i = 0; i < 11; i++) {
          const link = links.current[i];
          if (link) link.visible = true;
        }
      }
    }

    const showRope = useGame.getState().weapon === "rope" || strung;
    if (rope.current && noose.current) {
      rope.current.visible = showRope;
      noose.current.visible = showRope;
      if (showRope && neck) {
        neck.getWorldPosition(_f);
        _dir.subVectors(HITCH, _f);
        const len = Math.max(0.2, _dir.length());
        rope.current.position.copy(_f).addScaledVector(_dir, 0.5);
        rope.current.quaternion.setFromUnitVectors(UP, _dir.normalize());
        rope.current.scale.set(1, len, 1);
        noose.current.position.copy(_f);
        noose.current.quaternion.setFromUnitVectors(Z_AXIS, _dir);
      }
    }
    if (strung && lifted > 0.08) popHat();
    if (strung && lifted >= 1 && !strungDone.current) {
      strungDone.current = true;
      paintPart("head", 0.9);
      growWound("head");
      useGame.getState().silence();
      useGame.getState().wound(200, "HUNG");
      if (neck) {
        neck.getWorldPosition(_p);
        burst(_p, DOWN, 22, 2.6);
        _dir.set(0.2, -0.2, 0.6);
        burst(_p, _dir, 16, 3);
      }
    }

    if (hatLost.current && worldHat.current) {
      hatVel.current.y -= 9 * sim;
      worldHat.current.position.addScaledVector(hatVel.current, sim);
      worldHat.current.rotation.x += sim * 4;
      worldHat.current.rotation.z += sim * 2.4;
      if (worldHat.current.position.y < 0.12) {
        worldHat.current.position.y = 0.12;
        hatVel.current.y *= -0.28;
        hatVel.current.x *= 0.6;
        hatVel.current.z *= 0.6;
      }
    }

    if (input.queued && holder.current) {
      input.queued = false;
      launch(input.queuedWeapon, input.power);
    }

    for (const flyer of flyers.current) {
      if (!flyer.alive || flyer.stuck) continue;
      if (flyer.kind === "spear") stepSpear(flyer, sim);
      else stepBoom(flyer, sim);
    }

    const still = useGame.getState().vitality > 0;
    if (alive.current && !still) {
      alive.current = false;
      death();
      motion.shake = 1.15;
      const chest = parts.current.find((part) => part.id === "chest");
      if (chest) burst(chest.world, UP, 40, 6);
    }

    if (useGame.getState().gore > 0.18 && hang.current < 0.95) {
      drip.current += sim;
      if (drip.current > 0.14) {
        drip.current = 0;
        const bleeding = parts.current.filter((part) => (bleed.current[part.id] ?? 0) > 0);
        const part = bleeding[Math.floor(Math.random() * bleeding.length)];
        if (part) {
          _dir.set((Math.random() - 0.5) * 0.3, -0.4, 0.4);
          burst(part.world, _dir, 2, 1.2);
        }
      }
    }

    for (const drop of drops.current) {
      if (!drop.mesh.visible) continue;
      drop.life -= sim;
      drop.vel.y -= 12 * sim;
      drop.mesh.position.addScaledVector(drop.vel, sim);
      if (drop.mesh.position.y < 0.03 && ground.current) {
        drop.mesh.position.y = 0.03;
        if (!drop.stained) {
          drop.stained = true;
          putDecal(ground.current, drop.mesh.position, UP, 0.16 + Math.random() * 0.22);
        }
        drop.vel.multiplyScalar(0.2);
      }
      const k = Math.max(0, drop.life / drop.max);
      const s = drop.base * (0.55 + 0.45 * k);
      drop.mesh.scale.set(s * 0.7, s * 0.7, s * 1.7);
      if (drop.vel.lengthSq() > 0.15) {
        _look.copy(drop.mesh.position).add(drop.vel);
        drop.mesh.lookAt(_look);
      }
      if (drop.life <= 0) drop.mesh.visible = false;
    }
  });

  function takeFlyer() {
    const free = flyers.current.find((flyer) => !flyer.alive);
    if (free) return free;
    const stuck = flyers.current.find((flyer) => flyer.stuck);
    if (!stuck || !holder.current) return null;
    holder.current.attach(stuck.group);
    stuck.stuck = false;
    stuck.alive = false;
    return stuck;
  }

  function launch(kind: Weapon, power: number) {
    const flyer = takeFlyer();
    if (!flyer) return;
    camera.getWorldPosition(_o);
    _f.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    _r.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    flyer.kind = kind;
    flyer.alive = true;
    flyer.stuck = false;
    flyer.power = power;
    flyer.phase = 0.05;
    flyer.spin = 0;
    flyer.barked = false;
    flyer.hits.clear();
    flyer.group.visible = true;
    const boom = flyer.group.getObjectByName("boomerang");
    const spear = flyer.group.getObjectByName("spear");
    if (boom) boom.visible = kind === "boomerang";
    if (spear) spear.visible = kind === "spear";
    if (kind === "spear") {
      flyer.vel.copy(_f).multiplyScalar(spearSpeed(power));
      flyer.pos.copy(_o).addScaledVector(_f, 0.7);
      flyer.prev.copy(flyer.pos);
      flyer.group.position.copy(flyer.pos);
      _look.copy(flyer.pos).add(flyer.vel);
      flyer.group.lookAt(_look);
    } else {
      flyer.origin.copy(_o);
      flyer.forward.copy(_f);
      flyer.right.copy(_r);
      flyer.rf = throwReach(_o, _f);
      flyer.side = 0.75;
      boomerangPosition(flyer.origin, flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, flyer.pos);
      flyer.prev.copy(flyer.pos);
      flyer.group.position.copy(flyer.pos);
    }
  }

  function burst(point: THREE.Vector3, dir: THREE.Vector3, count: number, force: number) {
    for (let i = 0; i < count; i++) {
      let drop = drops.current.find((item) => !item.mesh.visible);
      if (!drop) drop = drops.current.reduce((a, b) => (a.life < b.life ? a : b));
      drop.mesh.visible = true;
      drop.mesh.position.copy(point);
      drop.vel.copy(dir);
      if (drop.vel.lengthSq() < 1e-4) drop.vel.copy(UP);
      drop.vel.normalize().multiplyScalar(force * (0.35 + Math.random()));
      drop.vel.x += (Math.random() - 0.5) * force * 1.4;
      drop.vel.y += Math.random() * force * 0.8;
      drop.vel.z += (Math.random() - 0.5) * force * 1.4;
      drop.life = 0.65 + Math.random() * 0.85;
      drop.max = drop.life;
      drop.stained = false;
      drop.base = 0.035 + Math.random() * (force > 3 ? 0.1 : 0.045);
      drop.mesh.scale.setScalar(drop.base);
    }
  }

  function putDecal(parent: THREE.Object3D, worldPoint: THREE.Vector3, normal: THREE.Vector3, size: number) {
    const mesh = decals.current[decalCursor.current % decals.current.length];
    if (!mesh) return;
    decalCursor.current++;
    parent.add(mesh);
    parent.worldToLocal(_local.copy(worldPoint));
    mesh.position.copy(_local);
    mesh.visible = true;
    _aim.copy(worldPoint).add(normal);
    mesh.lookAt(_aim);
    mesh.rotateZ(Math.random() * Math.PI);
    mesh.translateZ(0.02);
    const s = size * (0.75 + Math.random() * 0.7);
    mesh.scale.set(s, s * (0.75 + Math.random() * 0.5), 1);
  }

  function paintPart(id: PartId, amount: number) {
    const list = paintLists.current[id] ?? [];
    const seen = new Set<THREE.Mesh>();
    for (const mesh of list) {
      if (seen.has(mesh)) continue;
      seen.add(mesh);
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const base = mesh.userData.base as THREE.Color | undefined;
      if (!base || !mat.color) continue;
      const next = Math.min(1, ((mesh.userData.blood as number | undefined) ?? 0) + amount);
      mesh.userData.blood = next;
      mat.color.copy(base).lerp(BLOOD, next * 0.9);
      if (typeof mesh.userData.rough === "number") {
        mat.roughness = Math.max(0.25, mesh.userData.rough - next * 0.4);
      }
    }
  }

  function growWound(id: PartId) {
    const mesh = rig.current?.getObjectByName(`wound-${id}`) as THREE.Mesh | undefined;
    if (!mesh) return;
    const next = Math.min(2.5, ((mesh.userData.n as number | undefined) ?? 0) + 0.8);
    mesh.userData.n = next;
    mesh.visible = true;
    mesh.scale.setScalar(Math.max(0.7, next));
    bleed.current[id] = (bleed.current[id] ?? 0) + 1;
  }

  function popHat() {
    if (hatLost.current || !headHat.current || !worldHat.current) return;
    hatLost.current = true;
    headHat.current.getWorldPosition(worldHat.current.position);
    headHat.current.getWorldQuaternion(worldHat.current.quaternion);
    headHat.current.visible = false;
    worldHat.current.visible = true;
    hatVel.current.set((Math.random() - 0.5) * 2.4, 4.4, 1.8);
  }

  function strike(flyer: Flyer, part: PartRT, point: THREE.Vector3) {
    flyer.hits.add(part.id);
    const base = flyer.kind === "spear" ? 33 : 21;
    const dmg = base * (0.72 + flyer.power * 0.6) * part.mult;
    const verb = flyer.kind === "spear" ? "STUCK" : "OPENED";
    const forceDir = flyer.kind === "spear" ? flyer.vel : flyer.forward;
    burst(point, forceDir, flyer.kind === "spear" ? 28 : 40, flyer.kind === "spear" ? 5.5 : 4.2);
    const parent = part.anchor.parent ?? holder.current;
    if (parent) {
      _dir.copy(camera.position).sub(point).normalize();
      putDecal(parent, point, _dir, 0.32 + Math.random() * 0.35);
    }
    if (tree.current) {
      const r = gumRadius(point.y);
      _sample.set(point.x * 0.2, point.y, r * 0.98);
      putDecal(tree.current, _sample, Z_AXIS, 0.45 + Math.random() * 0.55);
    }
    paintPart(part.id, 0.32 + flyer.power * 0.28);
    growWound(part.id);
    if (part.id === "head") popHat();
    motion.shake = Math.min(1.25, motion.shake + 0.72);
    motion.hitStop = 0.05;
    recoil.current = 1;
    wet(dmg);
    chainClank();
    useGame.getState().wound(dmg, `${part.label} · ${verb}`);
    if (flyer.kind === "spear") {
      flyer.stuck = true;
      part.anchor.attach(flyer.group);
    }
  }

  function chopConnect(part: PartRT, point: THREE.Vector3) {
    const power = Math.max(0.45, input.power);
    const headHit = part.id === "head";
    const dmg = 42 * (0.7 + power * 0.55) * part.mult;
    burst(point, _f, headHit ? 48 : 30, 6.4);
    const parent = part.anchor.parent ?? holder.current;
    if (parent) {
      _dir.copy(camera.position).sub(point).normalize();
      putDecal(parent, point, _dir, headHit ? 0.58 : 0.4);
    }
    paintPart(part.id, headHit ? 0.75 : 0.48);
    growWound(part.id);
    if (headHit) popHat();
    motion.shake = Math.min(1.45, motion.shake + 1);
    motion.hitStop = 0.08;
    recoil.current = 1;
    wet(dmg);
    chainClank();
    if (headHit) {
      useGame.getState().silence();
      choke();
    }
    useGame.getState().wound(dmg, headHit ? "SKULL · SHUT" : `${part.label} · CLEFT`);
  }

  function axeChop() {
    if (input.dolly < 0.55) {
      useGame.getState().flash("STEP IN");
      return;
    }
    camera.getWorldPosition(_o);
    _f.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    _p.copy(_o).addScaledVector(_f, 0.25);
    _p2.copy(_o).addScaledVector(_f, 1.2);
    const hit = closestPart(_p, _p2, 0.2);
    if (hit) {
      chopConnect(hit, _best);
      return;
    }
    if (trunkHit(_p, _p2, _sample)) {
      wood();
      useGame.getState().flash("THE GUM");
      return;
    }
    useGame.getState().flash("WIDE");
  }

  function closestPart(a: THREE.Vector3, b: THREE.Vector3, slash: number) {
    let best: PartRT | null = null;
    let bestD = Infinity;
    for (const part of parts.current) {
      if (segmentHitsSphere(a, b, part.world, part.radius + slash, _hit)) {
        const d = _hit.distanceToSquared(part.world);
        if (d < bestD) {
          bestD = d;
          best = part;
          _best.copy(_hit);
        }
      }
    }
    return best;
  }

  function stepSpear(flyer: Flyer, sim: number) {
    flyer.prev.copy(flyer.pos);
    flyer.vel.y -= GRAVITY * sim;
    flyer.pos.addScaledVector(flyer.vel, sim);
    flyer.group.position.copy(flyer.pos);
    if (flyer.vel.lengthSq() > 0.01) {
      _look.copy(flyer.pos).add(flyer.vel);
      flyer.group.lookAt(_look);
    }
    if (flyer.hits.size === 0) {
      const hit = closestPart(flyer.prev, flyer.pos, 0.04);
      if (hit) {
        strike(flyer, hit, _best);
        return;
      }
    }
    if (trunkHit(flyer.prev, flyer.pos, _sample)) {
      flyer.stuck = true;
      flyer.pos.copy(_sample);
      flyer.group.position.copy(_sample);
      tree.current?.attach(flyer.group);
      if (!flyer.barked) {
        flyer.barked = true;
        wood();
        useGame.getState().flash("WIDE · THE GUM");
      }
      return;
    }
    if (flyer.pos.y < 0.05) {
      flyer.stuck = true;
      flyer.pos.y = 0.05;
      flyer.group.position.copy(flyer.pos);
      flyer.group.rotation.x = Math.PI / 2.6;
      wood();
      if (flyer.hits.size === 0) useGame.getState().flash("WIDE · THE DIRT");
    }
  }

  function stepBoom(flyer: Flyer, sim: number) {
    flyer.prev.copy(flyer.pos);
    const outTime = 0.62 - flyer.power * 0.18;
    flyer.phase += sim / (flyer.phase < 1 ? outTime : 0.74);
    boomerangPosition(flyer.origin, flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, flyer.pos);
    flyer.group.position.copy(flyer.pos);
    boomerangTangent(flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, _dir);
    if (_dir.lengthSq() > 0.001) {
      _look.copy(flyer.pos).add(_dir);
      flyer.group.lookAt(_look);
    }
    flyer.spin += sim * 16;
    flyer.group.rotateZ(flyer.spin);
    if (flyer.phase < 1 && flyer.hits.size === 0) {
      const hit = closestPart(flyer.prev, flyer.pos, 0.16);
      if (hit) strike(flyer, hit, _best);
      else if (!flyer.barked && trunkHit(flyer.prev, flyer.pos, _sample)) {
        flyer.barked = true;
        flyer.phase = 1;
        wood();
        useGame.getState().flash("WIDE · THE GUM");
      }
    }
    if (flyer.phase >= 2) {
      flyer.alive = false;
      flyer.group.visible = false;
      if (flyer.hits.size === 0 && !flyer.barked) useGame.getState().flash("CAME HOME EMPTY");
    }
  }

  const ringZ = gumRadius(1.75);

  return (
    <group>
      <points geometry={stars}>
        <pointsMaterial color="#d7deee" size={0.07} sizeAttenuation />
      </points>

      <mesh position={[-6.2, 8.4, -12]}>
        <sphereGeometry args={[0.72, 24, 16]} />
        <meshBasicMaterial color="#f3f6ff" />
      </mesh>

      <group ref={ground}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[48, 48]} />
          <meshStandardMaterial map={groundTex} color="#ffffff" roughness={1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.4]}>
          <circleGeometry args={[3.4, 28]} />
          <meshBasicMaterial color="#140f0c" transparent opacity={0.45} />
        </mesh>
      </group>

      <FarGums />

      <group ref={tree}>
        <mesh geometry={trunkGeo} castShadow receiveShadow>
          <meshStandardMaterial map={barkTex} color="#ffffff" roughness={0.96} />
        </mesh>
        <BarkStrips />
        <mesh position={[0, 1.75, ringZ * 0.9]} castShadow name="ring-mesh">
          <torusGeometry args={[0.11, 0.02, 6, 14]} />
          <meshStandardMaterial color="#3a3632" metalness={0.9} roughness={0.34} />
        </mesh>
        <object3D name="anchor-ring" position={[0, 1.75, ringZ * 0.92]} />
      </group>

      <group ref={rig} position={[0.02, 0, 1.42]}>
        <Victim
          look={look}
          hips={hips}
          torso={torso}
          head={head}
          jaw={jaw}
          headHat={headHat}
          armL={armL}
          armR={armR}
          legL={legL}
          legR={legR}
        />
      </group>

      <mesh ref={rope} visible={false} frustumCulled={false}>
        <cylinderGeometry args={[0.022, 0.03, 1, 6]} />
        <meshStandardMaterial color="#6b4630" roughness={0.94} />
      </mesh>
      <mesh ref={noose} visible={false} frustumCulled={false}>
        <torusGeometry args={[0.1, 0.02, 6, 14]} />
        <meshStandardMaterial color="#5a3c28" roughness={0.92} />
      </mesh>

      <group ref={worldHat} visible={false}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 18]} />
          <meshStandardMaterial color="#241c16" roughness={0.84} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.115, 0.125, 0.15, 12]} />
          <meshStandardMaterial color="#241c16" roughness={0.84} />
        </mesh>
      </group>

      <group ref={holder} />
    </group>
  );
}

function BarkStrips() {
  const strips = [
    { pos: [1.05, 2.3, 0.25] as [number, number, number], rot: [0.1, 0.8, 0.15] as [number, number, number] },
    { pos: [-1.05, 3.0, 0.15] as [number, number, number], rot: [0.15, -0.6, -0.2] as [number, number, number] },
    { pos: [0.85, 4.0, -0.35] as [number, number, number], rot: [0.2, 1.2, 0.1] as [number, number, number] },
    { pos: [-0.7, 4.6, -0.25] as [number, number, number], rot: [0.25, -1, -0.15] as [number, number, number] },
  ];
  return (
    <>
      {strips.map((strip) => (
        <mesh key={strip.pos.join(",")} position={strip.pos} rotation={strip.rot} castShadow>
          <boxGeometry args={[0.34, 1.15, 0.035]} />
          <meshStandardMaterial color="#c8b48e" roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

function FarGums() {
  const spots: [number, number, number, number][] = [
    [-8.5, 0, -6, 1.15],
    [7.2, 0, -8, 0.85],
    [-4, 0, -11, 0.7],
    [10, 0, -3, 0.55],
    [3.5, 0, -13, 0.9],
  ];
  return (
    <>
      {spots.map(([x, y, z, s]) => (
        <group key={`${x},${z}`} position={[x, y, z]} scale={s}>
          <mesh position={[0, 2.4, 0]}>
            <cylinderGeometry args={[0.22, 0.45, 4.8, 6]} />
            <meshStandardMaterial color="#2a241c" roughness={1} />
          </mesh>
          <mesh position={[0, 5.1, 0]}>
            <icosahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#243028" flatShading roughness={1} />
          </mesh>
        </group>
      ))}
    </>
  );
}
