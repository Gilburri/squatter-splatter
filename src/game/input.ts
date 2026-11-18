import { whoosh } from "@/game/audio";
import { useGame, type Weapon } from "@/game/store";

export const input = {
  yaw: 0,
  pitch: 0.02,
  charging: false,
  charge: 0,
  queued: false,
  power: 0.5,
  queuedWeapon: "spear" as Weapon,
  close: 0,
  dolly: 0,
  chop: 0,
  haul: false,
};

export const motion = {
  swing: 0,
  shake: 0,
  hitStop: 0,
};

export function startCharge() {
  if (useGame.getState().phase !== "play") return;
  if (input.charging) return;
  input.charging = true;
  input.charge = 0;
}

export function beginHaul() {
  if (useGame.getState().phase !== "play") return;
  if (useGame.getState().weapon !== "rope") return;
  if (useGame.getState().strung || input.haul) return;
  input.haul = true;
  useGame.getState().stringUp();
  motion.swing = 1;
  whoosh("rope", 1);
}

export function releaseThrow() {
  if (!input.charging) return;
  const held = input.charge;
  input.charging = false;
  input.charge = 0;
  if (useGame.getState().phase !== "play") return;
  const weapon = useGame.getState().weapon;
  if (weapon === "rope") {
    if (held < 0.35) {
      useGame.getState().flash("HAUL");
      return;
    }
    beginHaul();
    return;
  }
  const power = Math.max(0.45, held);
  if (weapon === "axe") {
    input.power = power;
    if (input.dolly < 0.55) {
      useGame.getState().flash("STEP IN");
      return;
    }
    motion.swing = 1;
    input.chop = 1;
    whoosh("axe", power);
    return;
  }
  input.power = power;
  input.queuedWeapon = weapon;
  input.queued = true;
  motion.swing = 1;
  whoosh(weapon, power);
}
