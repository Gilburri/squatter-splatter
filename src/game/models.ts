import * as THREE from "three";

const wood = new THREE.MeshStandardMaterial({ color: "#7a4328", roughness: 0.74 });
const woodDark = new THREE.MeshStandardMaterial({ color: "#4a2a1c", roughness: 0.7 });
const stone = new THREE.MeshStandardMaterial({ color: "#c2bbb0", roughness: 0.48, metalness: 0.08 });

export function buildBoomerang() {
  const group = new THREE.Group();
  group.name = "boomerang";
  const geo = new THREE.BoxGeometry(0.075, 0.46, 0.03);
  const left = new THREE.Mesh(geo, wood);
  left.position.set(-0.09, 0, 0);
  left.rotation.z = -0.58;
  const right = new THREE.Mesh(geo, wood);
  right.position.set(0.09, 0, 0);
  right.rotation.z = 0.58;
  group.add(left, right);
  return group;
}

export function buildSpear() {
  const group = new THREE.Group();
  group.name = "spear";
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 1.45, 7), woodDark);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.z = 0.2;
  const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.14, 7), wood);
  wrap.rotation.x = Math.PI / 2;
  wrap.position.z = 0.72;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.26, 6), stone);
  tip.rotation.x = Math.PI / 2;
  tip.position.z = 1.02;
  group.add(shaft, wrap, tip);
  return group;
}

export function buildAxe() {
  const group = new THREE.Group();
  group.name = "axe";
  const sinew = new THREE.MeshStandardMaterial({ color: "#c4622d", roughness: 0.6 });
  const groundstone = new THREE.MeshStandardMaterial({ color: "#8d9288", roughness: 0.78 });
  const edge = new THREE.MeshStandardMaterial({ color: "#e4dfd4", roughness: 0.38 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.78, 7), woodDark);
  handle.rotation.x = Math.PI / 2;
  handle.position.z = 0.02;
  const bind = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.1, 7), sinew);
  bind.rotation.x = Math.PI / 2;
  bind.position.z = 0.34;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.07), groundstone);
  head.position.set(0, 0.01, 0.44);
  const bit = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.14, 4), edge);
  bit.rotation.x = Math.PI / 2;
  bit.scale.set(1.55, 1, 1);
  bit.position.set(0, 0.01, 0.52);
  group.add(handle, bind, head, bit);
  return group;
}

export function buildFlyer() {
  const group = new THREE.Group();
  const boomerang = buildBoomerang();
  const spear = buildSpear();
  boomerang.scale.setScalar(1.5);
  group.add(boomerang, spear);
  group.visible = false;
  return group;
}
