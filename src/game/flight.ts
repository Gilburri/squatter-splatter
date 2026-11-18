import * as THREE from "three";

export const GRAVITY = 3.5;
const PLANE_Z = 1.38;

const ab = new THREE.Vector3();
const ac = new THREE.Vector3();

export function spearSpeed(power: number) {
  return 14 + power * 16;
}

export function throwReach(origin: THREE.Vector3, forward: THREE.Vector3) {
  const denom = Math.min(forward.z, -0.2);
  const t = (PLANE_Z - origin.z) / denom;
  return THREE.MathUtils.clamp(t + 1.45, 4, 18);
}

export function boomerangPosition(
  origin: THREE.Vector3,
  forward: THREE.Vector3,
  right: THREE.Vector3,
  rf: number,
  side: number,
  phase: number,
  out: THREE.Vector3,
) {
  out.copy(origin);
  if (phase <= 1) {
    out.addScaledVector(forward, phase * rf);
    out.addScaledVector(right, Math.sin(phase * Math.PI) * side);
    return out;
  }
  const u = Math.min(1, phase - 1);
  out.addScaledVector(forward, (1 - u) * rf);
  out.addScaledVector(right, -Math.sin(u * Math.PI) * side * 1.7);
  return out;
}

export function boomerangTangent(
  forward: THREE.Vector3,
  right: THREE.Vector3,
  rf: number,
  side: number,
  phase: number,
  out: THREE.Vector3,
) {
  if (phase <= 1) {
    out.copy(forward).multiplyScalar(rf);
    out.addScaledVector(right, Math.cos(phase * Math.PI) * Math.PI * side);
    return out;
  }
  const u = phase - 1;
  out.copy(forward).multiplyScalar(-rf);
  out.addScaledVector(right, -Math.cos(u * Math.PI) * Math.PI * side * 1.7);
  return out;
}

export function segmentHitsSphere(
  a: THREE.Vector3,
  b: THREE.Vector3,
  center: THREE.Vector3,
  radius: number,
  out: THREE.Vector3,
) {
  ab.subVectors(b, a);
  const lenSq = ab.lengthSq();
  if (lenSq < 1e-8) {
    out.copy(a);
    return out.distanceToSquared(center) <= radius * radius;
  }
  const t = THREE.MathUtils.clamp(ac.subVectors(center, a).dot(ab) / lenSq, 0, 1);
  out.copy(a).addScaledVector(ab, t);
  return out.distanceToSquared(center) <= radius * radius;
}

export function gumRadius(y: number) {
  const t = THREE.MathUtils.clamp(y / 12.8, 0, 1);
  let r = 1.12 * Math.pow(1 - t, 0.58) + 0.08;
  if (y < 1.1) r += (1.1 - y) * 0.55;
  return r;
}
