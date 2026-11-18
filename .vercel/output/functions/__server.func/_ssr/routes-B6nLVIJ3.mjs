import { i as __toESM } from "../_runtime.mjs";
import { A as require_react, k as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as Volume2, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B6nLVIJ3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var ctx = null;
var master = null;
var noiseBuf = null;
var bedStarted = false;
var muted = false;
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
		master = ctx.createGain();
		master.gain.value = muted ? 0 : .9;
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function setMuted(next) {
	muted = next;
	if (master) master.gain.value = next ? 0 : .9;
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
		last = (last + white * .02) / 1.02;
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
	filter.Q.value = .55;
	const gain = c.createGain();
	gain.gain.value = .018;
	src.connect(filter);
	filter.connect(gain);
	gain.connect(master);
	src.start();
	const drone = c.createOscillator();
	const droneGain = c.createGain();
	drone.type = "sine";
	drone.frequency.value = 52;
	droneGain.gain.value = .035;
	drone.connect(droneGain);
	droneGain.connect(master);
	drone.start();
}
function unlockAudio() {
	if (!ac() || bedStarted) return;
	bedStarted = true;
	startBed();
}
function burstNoise(freq, q, dur, gainValue, type) {
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
	gain.gain.setValueAtTime(Math.max(.001, gainValue), now);
	gain.gain.exponentialRampToValueAtTime(.001, now + dur);
	src.connect(filter);
	filter.connect(gain);
	gain.connect(master);
	src.start(now);
	src.stop(now + dur + .02);
}
function whoosh(kind, power) {
	unlockAudio();
	burstNoise(kind === "boomerang" ? 980 : kind === "axe" ? 140 : 380, kind === "axe" ? 1.4 : .7, .16 + power * .12, kind === "axe" ? .32 : .2, "bandpass");
}
function wet(amount) {
	unlockAudio();
	burstNoise(240, 1.1, .28, .35 + Math.min(.35, amount / 90), "lowpass");
	const c = ac();
	if (!c || !master) return;
	const osc = c.createOscillator();
	const gain = c.createGain();
	const now = c.currentTime;
	osc.type = "sine";
	osc.frequency.setValueAtTime(130, now);
	osc.frequency.exponentialRampToValueAtTime(48, now + .14);
	gain.gain.setValueAtTime(.3, now);
	gain.gain.exponentialRampToValueAtTime(.001, now + .18);
	osc.connect(gain);
	gain.connect(master);
	osc.start(now);
	osc.stop(now + .2);
}
function wood() {
	unlockAudio();
	burstNoise(160, 2.4, .1, .22, "bandpass");
}
function chainClank() {
	unlockAudio();
	const c = ac();
	if (!c || !master) return;
	const osc = c.createOscillator();
	const gain = c.createGain();
	const now = c.currentTime;
	osc.type = "square";
	osc.frequency.setValueAtTime(480 + Math.random() * 260, now);
	gain.gain.setValueAtTime(.045, now);
	gain.gain.exponentialRampToValueAtTime(.001, now + .07);
	osc.connect(gain);
	gain.connect(master);
	osc.start(now);
	osc.stop(now + .08);
}
function choke() {
	unlockAudio();
	burstNoise(180, 1.6, .22, .4, "lowpass");
	wet(40);
}
var groan = null;
function setGroan(on) {
	if (!on) {
		if (!groan || !ctx) return;
		const now = ctx.currentTime;
		groan.gain.gain.cancelScheduledValues(now);
		groan.gain.gain.setValueAtTime(Math.max(.001, groan.gain.gain.value), now);
		groan.gain.gain.exponentialRampToValueAtTime(.001, now + .18);
		groan.osc.stop(now + .2);
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
	gain.gain.value = .028;
	osc.connect(filter);
	filter.connect(gain);
	gain.connect(master);
	osc.start();
	groan = {
		osc,
		gain
	};
}
function death() {
	unlockAudio();
	wet(90);
	burstNoise(80, .7, .7, .5, "lowpass");
	chainClank();
}
if (typeof document !== "undefined") document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "visible" && ctx?.state === "suspended") ctx.resume();
});
var FIGURES = [
	{
		id: "leichhardt",
		name: "Ludwig Leichhardt",
		years: "1813–1848",
		role: "Explorer",
		lines: [
			"Prussian naturalist. He landed in Sydney in February 1842 and spent the next years collecting specimens from Newcastle up through Moreton Bay.",
			"In October 1844 he left Jimbour — a Darling Downs squatting run — and walked to Port Essington. The Dawson and the Burdekin took their colonial names on that trip. A second expedition fell apart in the bush.",
			"In April 1848 he left the Downs again, aiming for the west coast. He was not seen after. The colony filed him as an explorer. The country he crossed was already being cut into runs."
		],
		look: {
			skin: "#c4a892",
			hair: "#2a211c",
			beard: "#3a2a22",
			beardW: .95,
			beardH: .85,
			beardY: -.08,
			bulk: .92,
			hairStyle: "wavy",
			beardStyle: "trimmed",
			iris: "#3a2a18",
			nose: 1.15,
			cravat: 1
		}
	},
	{
		id: "leslie",
		name: "Patrick Leslie",
		years: "1815–1881",
		role: "Squatter",
		lines: [
			"Scot. He came into Sydney in May 1835. In 1840 he and his brothers Walter and George put sheep on the Darling Downs — Toolburra, then Canning Downs — and the colony called them the first squatters there.",
			"Assigned convicts worked the run. He marked the place that became Warwick. The depression of the early forties broke the venture. He came back with Goomburra.",
			"He sat a few weeks in the New South Wales parliament for the northern seats, then left the colony. He died in Sydney in 1881."
		],
		look: {
			skin: "#d2bba8",
			hair: "#c8c2b8",
			beard: "#e4e0d8",
			beardW: 1.28,
			beardH: 1.75,
			beardY: -.15,
			bulk: 1.06,
			hairStyle: "receding",
			beardStyle: "patriarch",
			iris: "#6a7a88",
			nose: 1.05,
			cravat: .35
		}
	},
	{
		id: "petrie",
		name: "Andrew Petrie",
		years: "1798–1872",
		role: "Superintendent of Works",
		lines: [
			"Scot, stonemason and builder. In 1837 Moreton Bay sent for a man who could repair the penal settlement, and Sydney sent him up as Superintendent of Works.",
			"When the district opened to free settlement in 1842, the Petrie family stayed — counted as Brisbane's first free settlers. That year he took a boat north into Wide Bay and the river Governor Gipps named the Mary, on as far as the island.",
			"Sandy blight blinded him not long after. He kept building. His son Tom grew up with Turrbal people and wrote the old names down. The colony put the father first on the plaque."
		],
		look: {
			skin: "#cbb5a2",
			hair: "#ddd8d0",
			beard: "#f3f0ea",
			beardW: 1.4,
			beardH: 2,
			beardY: -.17,
			bulk: 1.14,
			hairStyle: "curly",
			beardStyle: "bushy",
			iris: "#4a3828",
			nose: 1.22,
			cravat: .4
		}
	}
];
var fresh = {
	vitality: 100,
	hits: 0,
	gore: 0,
	banner: "",
	shut: false,
	close: 0
};
var useGame = create((set) => ({
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
	enter: () => {
		try {
			localStorage.setItem("squatter-splatter-18", "1");
		} catch {}
		unlockAudio();
		set({
			phase: "scroll",
			figure: 0,
			...fresh
		});
	},
	leave: () => set({ phase: "left" }),
	back: () => set({ phase: "gate" }),
	toArm: () => set({ phase: "arm" }),
	begin: () => {
		unlockAudio();
		set({ phase: "play" });
	},
	setWeapon: (weapon) => set({ weapon }),
	wound: (amount, label) => set((s) => {
		if (s.phase !== "play") return s;
		const vitality = Math.max(0, s.vitality - amount);
		return {
			vitality,
			hits: s.hits + 1,
			gore: Math.min(1, s.gore + amount / 110),
			banner: label,
			bannerNonce: s.bannerNonce + 1,
			phase: vitality <= 0 ? "done" : "play"
		};
	}),
	flash: (text) => set((s) => ({
		banner: text,
		bannerNonce: s.bannerNonce + 1
	})),
	silence: () => set({ shut: true }),
	setClose: (close) => set({ close }),
	again: () => set((s) => ({
		phase: "play",
		...fresh,
		round: s.round + 1
	})),
	next: () => set((s) => ({
		phase: "scroll",
		figure: (s.figure + 1) % FIGURES.length,
		...fresh,
		round: s.round + 1
	})),
	toggleMute: () => set((s) => {
		const muted = !s.muted;
		setMuted(muted);
		try {
			localStorage.setItem("squatter-splatter-mute", muted ? "1" : "0");
		} catch {}
		return { muted };
	})
}));
var input = {
	yaw: 0,
	pitch: .02,
	charging: false,
	charge: 0,
	queued: false,
	power: .5,
	queuedWeapon: "spear",
	close: 0,
	dolly: 0,
	chop: 0
};
var motion = {
	swing: 0,
	shake: 0,
	hitStop: 0
};
function startCharge() {
	if (useGame.getState().phase !== "play") return;
	if (input.charging) return;
	input.charging = true;
	input.charge = 0;
}
function releaseThrow() {
	if (!input.charging) return;
	const power = Math.max(.45, input.charge);
	input.charging = false;
	input.charge = 0;
	if (useGame.getState().phase !== "play") return;
	const weapon = useGame.getState().weapon;
	if (weapon === "axe") {
		input.power = power;
		if (input.dolly < .55) {
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
function statusLine(vitality, shut) {
	if (shut && vitality > 8) return "SHUT";
	if (vitality > 82) return "STILL STANDING";
	if (vitality > 58) return "BLEEDING";
	if (vitality > 32) return "COMING APART";
	if (vitality > 8) return "BARELY HUNG";
	return "DONE";
}
function MuteButton() {
	const muted = useGame((s) => s.muted);
	const toggleMute = useGame((s) => s.toggleMute);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-ui": true,
		onClick: toggleMute,
		className: "flex min-h-12 min-w-12 items-center justify-center border border-fg/25 text-fg",
		"aria-label": muted ? "Unmute" : "Mute",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(muted ? VolumeX : Volume2, { className: "size-5" })
	});
}
function WeaponButton({ id, label }) {
	const weapon = useGame((s) => s.weapon);
	const setWeapon = useGame((s) => s.setWeapon);
	const on = weapon === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"data-ui": true,
		"aria-pressed": on,
		onClick: () => setWeapon(id),
		className: `min-h-12 flex-1 px-3 font-sans text-base tracking-widest uppercase ${on ? "border border-blood text-fg" : "border border-fg/20 text-muted"}`,
		children: label
	});
}
function ChargeMeter() {
	const [charge, setCharge] = (0, import_react.useState)(0);
	const [charging, setCharging] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		let last = -1;
		let was = false;
		const loop = () => {
			if (input.charging !== was) {
				was = input.charging;
				setCharging(was);
			}
			if (Math.abs(input.charge - last) > .03 || input.charge === 0 && last !== 0) {
				last = input.charge;
				setCharge(last);
			}
			frame = requestAnimationFrame(loop);
		};
		frame = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(frame);
	}, []);
	if (!charging) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1 w-full bg-fg/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full origin-left bg-blood",
			style: { transform: `scaleX(${Math.max(.04, charge)})` }
		})
	});
}
function HitFx() {
	const banner = useGame((s) => s.banner);
	const nonce = useGame((s) => s.bannerNonce);
	if (!banner || banner.startsWith("CAME") || banner.startsWith("WIDE")) {
		if (!banner) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hit-banner pointer-events-none absolute top-[30%] left-1/2 font-sans text-xl tracking-widest text-fg uppercase",
			children: banner
		}, nonce);
	}
	const skull = banner.includes("SKULL");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flash pointer-events-none absolute inset-0" }, `flash-${nonce}`),
		skull ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute inset-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lens lens-a" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lens lens-b" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "lens lens-c" })
			]
		}, `lens-${nonce}`) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hit-banner pointer-events-none absolute top-[28%] left-1/2 font-display text-4xl text-blood sm:text-6xl",
			children: banner
		}, nonce)
	] });
}
function ThrowBar() {
	const axe = useGame((s) => s.weapon) === "axe";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-ui": true,
		className: "pointer-events-auto absolute right-4 bottom-4 left-4 flex flex-col gap-2 sm:left-auto sm:w-[28rem]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChargeMeter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeaponButton, {
						id: "boomerang",
						label: "Boomerang"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeaponButton, {
						id: "spear",
						label: "Spear"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeaponButton, {
						id: "axe",
						label: "Axe"
					})
				]
			}),
			axe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					className: "min-h-12 flex-1 border border-fg/25 font-sans text-base tracking-widest text-fg uppercase",
					onClick: () => useGame.getState().setClose(1),
					children: "Step in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					className: "min-h-12 flex-1 border border-fg/25 font-sans text-base tracking-widest text-muted uppercase",
					onClick: () => useGame.getState().setClose(0),
					children: "Step back"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-ui": true,
				className: "min-h-14 bg-blood font-sans text-lg tracking-widest text-fg uppercase",
				onPointerDown: (event) => {
					event.stopPropagation();
					startCharge();
				},
				onPointerUp: (event) => {
					event.stopPropagation();
					releaseThrow();
				},
				onPointerCancel: () => releaseThrow(),
				onPointerLeave: () => {
					if (input.charging) releaseThrow();
				},
				children: axe ? "Hold to chop" : "Hold to throw"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden text-center font-sans text-sm tracking-widest text-muted uppercase sm:block",
				children: axe ? "W step in · S step back · hold to chop the mouth" : "1 boomerang · 2 spear · 3 stone axe"
			})
		]
	});
}
function Gate() {
	const phase = useGame((s) => s.phase);
	const enter = useGame((s) => s.enter);
	const leave = useGame((s) => s.leave);
	const back = useGame((s) => s.back);
	const left = phase === "left";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 flex flex-col justify-between p-6 sm:p-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-8 right-8 hidden h-16 w-16 rounded-full bg-fg/10 sm:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-16 bottom-0 hidden h-2/3 w-3 bg-fg/10 sm:block" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-sans text-sm tracking-widest text-blood uppercase",
				children: "18+ · Horror"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-sm tracking-widest text-ochre uppercase",
						children: "Carby night work"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 font-display text-5xl leading-none text-balance text-fg sm:text-7xl",
						children: ["Squatter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-blood",
							children: "Splatter"
						})]
					}),
					left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md font-display text-xl leading-relaxed text-pretty text-muted",
						children: "Leave it dark. The gum will still be standing when you come back."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md font-display text-xl leading-relaxed text-pretty text-muted",
						children: "You are the warrior. Three men of the colony, one at a time, ironed to the gum. Boomerang, spear, or step in with the stone axe."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row",
						children: left ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-ui": true,
							onClick: back,
							className: "min-h-12 bg-blood px-6 font-sans text-lg tracking-widest text-fg uppercase",
							children: "Turn back"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-ui": true,
							onClick: enter,
							className: "min-h-12 bg-blood px-6 font-sans text-lg tracking-widest text-fg uppercase",
							children: "I'm 18 — step in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-ui": true,
							onClick: leave,
							className: "min-h-12 border border-fg/25 px-6 font-sans text-lg tracking-widest text-muted uppercase",
							children: "Walk away"
						})] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-right font-sans text-sm tracking-widest text-muted uppercase",
				children: "Blood · No mercy"
			})
		]
	});
}
function ArmCard() {
	const weapon = useGame((s) => s.weapon);
	const setWeapon = useGame((s) => s.setWeapon);
	const begin = useGame((s) => s.begin);
	const name = useGame((s) => FIGURES[s.figure]?.name ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex items-end p-4 sm:items-center sm:p-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"data-ui": true,
			className: "poster-card pointer-events-auto w-full max-w-md border border-fg/25 bg-bg p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-sm tracking-widest text-ochre uppercase",
					children: "One tree"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl leading-none text-balance text-fg",
					children: "Choose the weapon."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-display text-lg leading-relaxed text-pretty text-muted",
					children: [name, " is ironed to the gum. Collar and both wrists."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-ui": true,
							"aria-pressed": weapon === "boomerang",
							onClick: () => setWeapon("boomerang"),
							className: `border p-4 text-left ${weapon === "boomerang" ? "border-blood" : "border-fg/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-sans text-xl tracking-widest text-fg uppercase",
								children: "Boomerang"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-display text-base leading-snug text-muted",
								children: "Curves out, comes home, opens whatever it crosses."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-ui": true,
							"aria-pressed": weapon === "spear",
							onClick: () => setWeapon("spear"),
							className: `border p-4 text-left ${weapon === "spear" ? "border-blood" : "border-fg/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-sans text-xl tracking-widest text-fg uppercase",
								children: "Spear"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-display text-base leading-snug text-muted",
								children: "Heavy and straight. Stays in whatever it finds."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-ui": true,
							"aria-pressed": weapon === "axe",
							onClick: () => setWeapon("axe"),
							className: `border p-4 text-left ${weapon === "axe" ? "border-blood" : "border-fg/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-sans text-xl tracking-widest text-fg uppercase",
								children: "Stone axe"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-display text-base leading-snug text-muted",
								children: "Step in. One chop. Shuts the mouth."
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					onClick: begin,
					className: "mt-5 min-h-12 w-full bg-blood font-sans text-lg tracking-widest text-fg uppercase",
					children: "Step up to him"
				})
			]
		})
	});
}
function Dossier() {
	const figure = useGame((s) => s.figure);
	const toArm = useGame((s) => s.toArm);
	const man = FIGURES[figure] ?? FIGURES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-4 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			"data-ui": true,
			className: "poster-card pointer-events-auto max-h-[78vh] w-full max-w-lg overflow-y-auto border border-bg/30 bg-fg p-6 text-bg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-sm tracking-widest text-blood uppercase",
					children: [
						figure + 1,
						" of ",
						FIGURES.length,
						" · On the iron"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl leading-none text-balance text-bg sm:text-5xl",
					children: man.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-sans text-base tracking-widest text-blood uppercase",
					children: [
						man.years,
						" · ",
						man.role
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: man.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-relaxed text-pretty",
						children: line
					}, line.slice(0, 24)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					onClick: toArm,
					className: "mt-6 min-h-12 w-full bg-blood font-sans text-lg tracking-widest text-fg uppercase",
					children: "Chain's on. Step up."
				})
			]
		})
	});
}
function DoneCard() {
	const nextMan = useGame((s) => s.next);
	const again = useGame((s) => s.again);
	const hits = useGame((s) => s.hits);
	const figure = useGame((s) => s.figure);
	const name = FIGURES[figure]?.name ?? "";
	const upcoming = FIGURES[(figure + 1) % FIGURES.length]?.name ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-4 pb-8 sm:items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"data-ui": true,
			className: "poster-card pointer-events-auto w-full max-w-sm border border-fg/25 bg-bg p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-sm tracking-widest text-blood uppercase",
					children: "The chain held"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-2 font-display text-4xl leading-none text-balance text-fg",
					children: [name, " is done."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-display text-lg text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: hits
					}), " throws landed."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-display text-lg leading-snug text-muted",
					children: [
						"Up next: ",
						upcoming,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					onClick: nextMan,
					className: "mt-5 min-h-12 w-full bg-blood font-sans text-lg tracking-widest text-fg uppercase",
					children: "Next on the iron"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-ui": true,
					onClick: again,
					className: "mt-2 min-h-12 w-full border border-fg/25 font-sans text-lg tracking-widest text-muted uppercase",
					children: "Run him again"
				})
			]
		})
	});
}
function Hud() {
	const vitality = useGame((s) => s.vitality);
	const hits = useGame((s) => s.hits);
	const phase = useGame((s) => s.phase);
	const shut = useGame((s) => s.shut);
	const name = useGame((s) => FIGURES[s.figure]?.name ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute top-4 right-4 left-4 z-10 flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-sm tracking-widest text-blood uppercase",
					children: "18+ · Squatter Splatter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-sans text-lg tracking-widest text-fg uppercase",
					children: name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-sm tracking-widest text-muted uppercase",
					children: statusLine(vitality, shut)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-1 w-32 bg-fg/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full origin-left bg-blood",
						style: { transform: `scaleX(${Math.max(0, vitality) / 100})` }
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-sm tracking-widest text-muted uppercase tabular-nums",
					children: ["Hits ", hits]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuteButton, {})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitFx, {}),
		phase === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThrowBar, {}) : null
	] });
}
function Overlay() {
	const phase = useGame((s) => s.phase);
	if (phase === "gate" || phase === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
		phase === "scroll" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dossier, {}) : null,
		phase === "arm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArmCard, {}) : null,
		phase === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneCard, {}) : null
	] });
}
var Stage = (0, import_react.lazy)(() => import("./Stage-Qznrq1wc.mjs"));
function Game() {
	const phase = useGame((s) => s.phase);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		try {
			if (localStorage.getItem("squatter-splatter-mute") === "1") {
				useGame.setState({ muted: true });
				setMuted(true);
			}
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg select-none",
		children: [mounted && phase !== "gate" && phase !== "left" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute bottom-8 left-6 font-sans tracking-widest text-muted uppercase",
				children: "Walking in."
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Game, {});
}
//#endregion
export { startCharge as a, chainClank as c, setGroan as d, unlockAudio as f, releaseThrow as i, choke as l, wood as m, input as n, useGame as o, wet as p, motion as r, FIGURES as s, routes_exports as t, death as u };
