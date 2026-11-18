let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let bedStarted = false;
let muted = false;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(next: boolean) {
  muted = next;
  if (master) master.gain.value = next ? 0 : 0.9;
}

function noise() {
  const c = ac();
  if (!c) return null;
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const data = noiseBuf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + white * 0.02) / 1.02;
    data[i] = last * 3.5;
  }
  return noiseBuf;
}

function startBed() {
  const c = ac();
  const buf = noise();
  if (!c || !buf || !master) return;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1700;
  filter.Q.value = 0.55;
  const gain = c.createGain();
  gain.gain.value = 0.018;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start();

  const drone = c.createOscillator();
  const droneGain = c.createGain();
  drone.type = "sine";
  drone.frequency.value = 52;
  droneGain.gain.value = 0.035;
  drone.connect(droneGain);
  droneGain.connect(master);
  drone.start();
}

export function unlockAudio() {
  const c = ac();
  if (!c || bedStarted) return;
  bedStarted = true;
  startBed();
}

function burstNoise(freq: number, q: number, dur: number, gainValue: number, type: BiquadFilterType) {
  const c = ac();
  const buf = noise();
  if (!c || !buf || !master) return;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = c.createGain();
  const now = c.currentTime;
  gain.gain.setValueAtTime(Math.max(0.001, gainValue), now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  src.start(now);
  src.stop(now + dur + 0.02);
}

export function whoosh(kind: "boomerang" | "spear" | "axe" | "rope", power: number) {
  unlockAudio();
  if (kind === "rope") {
    burstNoise(90, 1.8, 0.55, 0.34, "lowpass");
    return;
  }
  const freq = kind === "boomerang" ? 980 : kind === "axe" ? 140 : 380;
  burstNoise(freq, kind === "axe" ? 1.4 : 0.7, 0.16 + power * 0.12, kind === "axe" ? 0.32 : 0.2, "bandpass");
}

export function wet(amount: number) {
  unlockAudio();
  burstNoise(240, 1.1, 0.28, 0.35 + Math.min(0.35, amount / 90), "lowpass");
  const c = ac();
  if (!c || !master) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const now = c.currentTime;
  osc.type = "sine";
  osc.frequency.setValueAtTime(130, now);
  osc.frequency.exponentialRampToValueAtTime(48, now + 0.14);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 0.2);
}

export function wood() {
  unlockAudio();
  burstNoise(160, 2.4, 0.1, 0.22, "bandpass");
}

export function chainClank() {
  unlockAudio();
  const c = ac();
  if (!c || !master) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const now = c.currentTime;
  osc.type = "square";
  osc.frequency.setValueAtTime(480 + Math.random() * 260, now);
  gain.gain.setValueAtTime(0.045, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 0.08);
}

export function choke() {
  unlockAudio();
  burstNoise(180, 1.6, 0.22, 0.4, "lowpass");
  wet(40);
}

let groan: { osc: OscillatorNode; gain: GainNode } | null = null;

export function setGroan(on: boolean) {
  if (!on) {
    if (!groan || !ctx) return;
    const now = ctx.currentTime;
    groan.gain.gain.cancelScheduledValues(now);
    groan.gain.gain.setValueAtTime(Math.max(0.001, groan.gain.gain.value), now);
    groan.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    groan.osc.stop(now + 0.2);
    groan = null;
    return;
  }
  const c = ac();
  if (!c || !master || groan) return;
  const osc = c.createOscillator();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 86;
  filter.type = "lowpass";
  filter.frequency.value = 240;
  gain.gain.value = 0.028;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  osc.start();
  groan = { osc, gain };
}

export function death() {
  unlockAudio();
  wet(90);
  burstNoise(80, 0.7, 0.7, 0.5, "lowpass");
  chainClank();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && ctx?.state === "suspended") void ctx.resume();
  });
}
