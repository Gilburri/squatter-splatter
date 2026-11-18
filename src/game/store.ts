import { create } from "zustand";
import { setMuted, unlockAudio } from "@/game/audio";
import { FIGURES } from "@/game/figures";

export type Weapon = "boomerang" | "spear" | "axe" | "rope";
export type Phase = "gate" | "left" | "scroll" | "arm" | "play" | "done";

type State = {
  phase: Phase;
  weapon: Weapon;
  figure: number;
  vitality: number;
  hits: number;
  gore: number;
  banner: string;
  bannerNonce: number;
  round: number;
  muted: boolean;
  shut: boolean;
  close: number;
  strung: boolean;
  enter: () => void;
  leave: () => void;
  back: () => void;
  toArm: () => void;
  begin: () => void;
  setWeapon: (weapon: Weapon) => void;
  wound: (amount: number, label: string) => void;
  flash: (text: string) => void;
  silence: () => void;
  setClose: (close: number) => void;
  stringUp: () => void;
  again: () => void;
  next: () => void;
  toggleMute: () => void;
};

const fresh = { vitality: 100, hits: 0, gore: 0, banner: "", shut: false, close: 0, strung: false };

export const useGame = create<State>((set) => ({
  phase: "gate",
  weapon: "spear",
  figure: 0,
  vitality: 100,
  hits: 0,
  gore: 0,
  banner: "",
  bannerNonce: 0,
  round: 1,
  muted: false,
  shut: false,
  close: 0,
  strung: false,
  enter: () => {
    try {
      localStorage.setItem("squatter-splatter-18", "1");
    } catch {
      /* private mode */
    }
    unlockAudio();
    set({ phase: "scroll", figure: 0, ...fresh });
  },
  leave: () => set({ phase: "left" }),
  back: () => set({ phase: "gate" }),
  toArm: () => set({ phase: "arm" }),
  begin: () => {
    unlockAudio();
    set({ phase: "play" });
  },
  setWeapon: (weapon) => set({ weapon }),
  wound: (amount, label) =>
    set((s) => {
      if (s.phase !== "play") return s;
      const vitality = Math.max(0, s.vitality - amount);
      return {
        vitality,
        hits: s.hits + 1,
        gore: Math.min(1, s.gore + amount / 110),
        banner: label,
        bannerNonce: s.bannerNonce + 1,
        phase: vitality <= 0 ? "done" : "play",
      };
    }),
  flash: (text) => set((s) => ({ banner: text, bannerNonce: s.bannerNonce + 1 })),
  silence: () => set({ shut: true }),
  setClose: (close) => set({ close }),
  stringUp: () => set({ strung: true }),
  again: () =>
    set((s) => ({
      phase: "play",
      ...fresh,
      round: s.round + 1,
    })),
  next: () =>
    set((s) => ({
      phase: "scroll",
      figure: (s.figure + 1) % FIGURES.length,
      ...fresh,
      round: s.round + 1,
    })),
  toggleMute: () =>
    set((s) => {
      const muted = !s.muted;
      setMuted(muted);
      try {
        localStorage.setItem("squatter-splatter-mute", muted ? "1" : "0");
      } catch {
        /* ignore */
      }
      return { muted };
    }),
}));
