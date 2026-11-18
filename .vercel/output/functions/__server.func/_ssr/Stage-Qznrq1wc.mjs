import { i as __toESM } from "../_runtime.mjs";
import { A as require_react, C as SRGBColorSpace, D as Vector3, E as Vector2, S as RepeatWrapping, T as TorusGeometry, _ as Mesh, a as BoxGeometry, b as Object3D, c as CanvasTexture, d as CylinderGeometry, f as Group, g as MathUtils, h as LatheGeometry, k as require_jsx_runtime, l as Color, m as InstancedMesh, n as useFrame, o as BufferAttribute, p as IcosahedronGeometry, r as useThree, s as BufferGeometry, t as Canvas, u as ConeGeometry, v as MeshBasicMaterial, w as SphereGeometry, x as PlaneGeometry, y as MeshStandardMaterial } from "../_libs/@react-three/fiber+[...].mjs";
import { a as startCharge, c as chainClank, d as setGroan, f as unlockAudio, i as releaseThrow, l as choke, m as wood$1, n as input, o as useGame, p as wet, r as motion, s as FIGURES, u as death } from "./routes-B6nLVIJ3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Stage-Qznrq1wc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GRAVITY = 3.5;
var PLANE_Z = 1.38;
var ab = new Vector3();
var ac = new Vector3();
function spearSpeed(power) {
	return 14 + power * 16;
}
function throwReach(origin, forward) {
	const denom = Math.min(forward.z, -.2);
	const t = (PLANE_Z - origin.z) / denom;
	return MathUtils.clamp(t + 1.45, 4, 18);
}
function boomerangPosition(origin, forward, right, rf, side, phase, out) {
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
function boomerangTangent(forward, right, rf, side, phase, out) {
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
function segmentHitsSphere(a, b, center, radius, out) {
	ab.subVectors(b, a);
	const lenSq = ab.lengthSq();
	if (lenSq < 1e-8) {
		out.copy(a);
		return out.distanceToSquared(center) <= radius * radius;
	}
	const t = MathUtils.clamp(ac.subVectors(center, a).dot(ab) / lenSq, 0, 1);
	out.copy(a).addScaledVector(ab, t);
	return out.distanceToSquared(center) <= radius * radius;
}
function gumRadius(y) {
	const t = MathUtils.clamp(y / 12.8, 0, 1);
	let r = 1.12 * Math.pow(1 - t, .58) + .08;
	if (y < 1.1) r += (1.1 - y) * .55;
	return r;
}
var wood = new MeshStandardMaterial({
	color: "#7a4328",
	roughness: .74
});
var woodDark = new MeshStandardMaterial({
	color: "#4a2a1c",
	roughness: .7
});
var stone = new MeshStandardMaterial({
	color: "#c2bbb0",
	roughness: .48,
	metalness: .08
});
function buildBoomerang() {
	const group = new Group();
	group.name = "boomerang";
	const geo = new BoxGeometry(.075, .46, .03);
	const left = new Mesh(geo, wood);
	left.position.set(-.09, 0, 0);
	left.rotation.z = -.58;
	const right = new Mesh(geo, wood);
	right.position.set(.09, 0, 0);
	right.rotation.z = .58;
	group.add(left, right);
	return group;
}
function buildSpear() {
	const group = new Group();
	group.name = "spear";
	const shaft = new Mesh(new CylinderGeometry(.016, .022, 1.45, 7), woodDark);
	shaft.rotation.x = Math.PI / 2;
	shaft.position.z = .2;
	const wrap = new Mesh(new CylinderGeometry(.028, .028, .14, 7), wood);
	wrap.rotation.x = Math.PI / 2;
	wrap.position.z = .72;
	const tip = new Mesh(new ConeGeometry(.05, .26, 6), stone);
	tip.rotation.x = Math.PI / 2;
	tip.position.z = 1.02;
	group.add(shaft, wrap, tip);
	return group;
}
function buildAxe() {
	const group = new Group();
	group.name = "axe";
	const sinew = new MeshStandardMaterial({
		color: "#c4622d",
		roughness: .6
	});
	const groundstone = new MeshStandardMaterial({
		color: "#8d9288",
		roughness: .78
	});
	const edge = new MeshStandardMaterial({
		color: "#e4dfd4",
		roughness: .38
	});
	const handle = new Mesh(new CylinderGeometry(.02, .026, .78, 7), woodDark);
	handle.rotation.x = Math.PI / 2;
	handle.position.z = .02;
	const bind = new Mesh(new CylinderGeometry(.034, .034, .1, 7), sinew);
	bind.rotation.x = Math.PI / 2;
	bind.position.z = .34;
	const head = new Mesh(new BoxGeometry(.2, .12, .07), groundstone);
	head.position.set(0, .01, .44);
	const bit = new Mesh(new ConeGeometry(.085, .14, 4), edge);
	bit.rotation.x = Math.PI / 2;
	bit.scale.set(1.55, 1, 1);
	bit.position.set(0, .01, .52);
	group.add(handle, bind, head, bit);
	return group;
}
function buildFlyer() {
	const group = new Group();
	const boomerang = buildBoomerang();
	const spear = buildSpear();
	boomerang.scale.setScalar(1.5);
	group.add(boomerang, spear);
	group.visible = false;
	return group;
}
function canvasTexture(draw, size = 512) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("no canvas");
	draw(ctx, size);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.wrapS = RepeatWrapping;
	texture.wrapT = RepeatWrapping;
	texture.anisotropy = 4;
	return texture;
}
function makeBark() {
	const texture = canvasTexture((ctx, size) => {
		ctx.fillStyle = "#d2c0a0";
		ctx.fillRect(0, 0, size, size);
		for (let i = 0; i < 90; i++) {
			ctx.strokeStyle = `rgba(70, 52, 32, ${.15 + Math.random() * .45})`;
			ctx.lineWidth = 1 + Math.random() * 3;
			ctx.beginPath();
			const x = Math.random() * size;
			ctx.moveTo(x, 0);
			ctx.bezierCurveTo(x + 20, size * .3, x - 24, size * .6, x + 8, size);
			ctx.stroke();
		}
		for (let i = 0; i < 18; i++) {
			ctx.fillStyle = `rgba(92, 78, 64, ${.18 + Math.random() * .25})`;
			ctx.beginPath();
			ctx.ellipse(Math.random() * size, Math.random() * size, 18 + Math.random() * 40, 8 + Math.random() * 16, Math.random(), 0, Math.PI * 2);
			ctx.fill();
		}
		for (let i = 0; i < 24; i++) {
			ctx.fillStyle = `rgba(230, 214, 186, ${.12 + Math.random() * .2})`;
			ctx.fillRect(Math.random() * size, Math.random() * size, 8 + Math.random() * 20, 40 + Math.random() * 90);
		}
	});
	texture.repeat.set(1.6, 4.2);
	return texture;
}
function makeGround() {
	const texture = canvasTexture((ctx, size) => {
		ctx.fillStyle = "#2a241c";
		ctx.fillRect(0, 0, size, size);
		for (let i = 0; i < 1400; i++) {
			const shade = 20 + Math.floor(Math.random() * 40);
			ctx.fillStyle = `rgba(${shade + 30}, ${shade + 18}, ${shade}, 0.45)`;
			ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 4, 2 + Math.random() * 3);
		}
		for (let i = 0; i < 40; i++) {
			ctx.strokeStyle = "rgba(60, 48, 28, 0.45)";
			ctx.lineWidth = 2;
			ctx.beginPath();
			const x = Math.random() * size;
			const y = Math.random() * size;
			ctx.moveTo(x, y);
			ctx.quadraticCurveTo(x + 30, y - 10, x + 50, y + 8);
			ctx.stroke();
		}
	});
	texture.repeat.set(7, 7);
	return texture;
}
function makeBlood() {
	return canvasTexture((ctx, size) => {
		ctx.clearRect(0, 0, size, size);
		const rad = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size * .46);
		rad.addColorStop(0, "rgba(110, 8, 10, 0.95)");
		rad.addColorStop(.35, "rgba(130, 16, 14, 0.72)");
		rad.addColorStop(.68, "rgba(80, 4, 6, 0.28)");
		rad.addColorStop(1, "rgba(0, 0, 0, 0)");
		ctx.fillStyle = rad;
		ctx.fillRect(0, 0, size, size);
		ctx.strokeStyle = "rgba(120, 10, 12, 0.65)";
		for (let i = 0; i < 9; i++) {
			const ang = i / 9 * Math.PI * 2 + Math.random() * .4;
			ctx.lineWidth = 3 + Math.random() * 6;
			ctx.beginPath();
			ctx.moveTo(size / 2, size / 2);
			ctx.lineTo(size / 2 + Math.cos(ang) * size * .48, size / 2 + Math.sin(ang) * size * .48);
			ctx.stroke();
		}
	}, 256);
}
function Hair({ look }) {
	const color = look.hair;
	if (look.hairStyle === "receding") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.105,
				0,
				-.01
			],
			scale: [
				.7,
				.85,
				.75
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.09,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .96
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.105,
				0,
				-.01
			],
			scale: [
				.7,
				.85,
				.75
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.09,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .96
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.02,
				-.11
			],
			scale: [
				1.05,
				.55,
				.42
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.11,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .96
			})]
		})
	] });
	if (look.hairStyle === "curly") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: [
		[
			0,
			.13,
			-.01,
			.055
		],
		[
			-.07,
			.11,
			.02,
			.05
		],
		[
			.08,
			.11,
			.01,
			.05
		],
		[
			-.04,
			.14,
			-.05,
			.046
		],
		[
			.05,
			.135,
			-.06,
			.048
		],
		[
			0,
			.05,
			-.12,
			.06
		],
		[
			-.12,
			.04,
			-.02,
			.048
		],
		[
			.12,
			.05,
			-.03,
			.05
		],
		[
			-.08,
			.08,
			-.08,
			.042
		],
		[
			.09,
			.07,
			-.09,
			.044
		]
	].map(([x, y, z, r]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			x,
			y,
			z
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			r,
			8,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			roughness: .98
		})]
	}, `${x},${y},${z}`)) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.015,
				.09,
				-.02
			],
			scale: [
				1.02,
				.46,
				.82
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.15,
				14,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.05,
				.105,
				.03
			],
			scale: [
				.55,
				.32,
				.5
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.1,
				10,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.01,
				-.1
			],
			scale: [
				.9,
				.62,
				.4
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				12,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.12,
				-.02,
				.02
			],
			scale: [
				.4,
				.85,
				.45
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.06,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.12,
				-.02,
				.02
			],
			scale: [
				.4,
				.85,
				.45
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.06,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		})
	] });
}
function Beard({ look }) {
	const color = look.beard;
	if (look.beardStyle === "patriarch") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.08,
				.04
			],
			scale: [
				1.15,
				.8,
				.85
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.09,
				10,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.2,
				.05
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.07,
				.16,
				4,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .95
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.06,
				-.22,
				.04
			],
			rotation: [
				.1,
				0,
				.15
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.045,
				.18,
				3,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .95
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.06,
				-.22,
				.04
			],
			rotation: [
				.1,
				0,
				-.15
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.045,
				.18,
				3,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .95
			})]
		})
	] });
	if (look.beardStyle === "bushy") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: [
		[
			0,
			-.08,
			.05,
			.07
		],
		[
			-.07,
			-.06,
			.04,
			.055
		],
		[
			.07,
			-.06,
			.04,
			.055
		],
		[
			0,
			-.14,
			.05,
			.06
		],
		[
			-.05,
			-.13,
			.045,
			.05
		],
		[
			.05,
			-.14,
			.04,
			.05
		],
		[
			0,
			-.2,
			.04,
			.045
		]
	].map(([x, y, z, r]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			x,
			y,
			z
		],
		userData: {
			paint: true,
			gore: "head"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			r,
			8,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			roughness: .97
		})]
	}, `${x},${y}`)) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.06,
				-.04,
				.05
			],
			scale: [
				.7,
				.85,
				.7
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.055,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.06,
				-.04,
				.05
			],
			scale: [
				.7,
				.85,
				.7
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.055,
				8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			name: "beard",
			position: [
				0,
				-.08,
				.045
			],
			scale: [
				1,
				.85,
				.8
			],
			userData: {
				paint: true,
				gore: "head"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.07,
				10,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .94
			})]
		})
	] });
}
function Eye({ x, iris, skin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			.02,
			.09
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					-.012
				],
				scale: [
					1.05,
					.7,
					.35
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.028,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#1a1412",
					roughness: 1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.02,
				12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f4f1ea",
				roughness: .28
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					.012
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.01,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: iris,
					roughness: .32
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					0,
					.018
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.005,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#100c0a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.012,
					.006
				],
				scale: [
					1.15,
					.28,
					.55
				],
				userData: {
					paint: true,
					gore: "head"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.024,
					8,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: skin,
					roughness: .6
				})]
			})
		]
	});
}
function Arm({ side, group, skin }) {
	const sign = side === "L" ? -1 : 1;
	const id = side === "L" ? "armL" : "armR";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			sign * .32,
			.55,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `sleeve${side}`,
				position: [
					0,
					-.16,
					0
				],
				castShadow: true,
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.075,
					.22,
					5,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2b2723",
					roughness: .82
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.34,
					0
				],
				castShadow: true,
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.062,
					.16,
					4,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#322c27",
					roughness: .84
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.3,
					.02
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.07,
					.078,
					.04,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#1c1814",
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `hand${side}`,
				position: [
					0,
					-.46,
					.02
				],
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.05,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: skin,
					roughness: .58
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					sign * .04,
					-.45,
					.04
				],
				rotation: [
					.4,
					0,
					sign * .6
				],
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.014,
					.04,
					3,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: skin,
					roughness: .58
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.5,
					.03
				],
				rotation: [
					.5,
					0,
					0
				],
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.05,
					.02,
					.04
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: skin,
					roughness: .58
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.42,
					0
				],
				rotation: [
					Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.055,
					.012,
					6,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#3e3a36",
					metalness: .86,
					roughness: .36
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
				name: `anchor-${id}`,
				position: [
					0,
					-.42,
					.02
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `wound-${id}`,
				userData: { wound: id },
				position: [
					0,
					-.22,
					.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.05,
					6,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#7a1418" })]
			})
		]
	});
}
function Leg({ side, group }) {
	const sign = side === "L" ? -1 : 1;
	const id = side === "L" ? "legL" : "legR";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position: [
			sign * .12,
			.02,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `thigh${side}`,
				position: [
					0,
					-.26,
					0
				],
				castShadow: true,
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.09,
					.28,
					4,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#3a342e",
					roughness: .86
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `shin${side}`,
				position: [
					0,
					-.64,
					.02
				],
				castShadow: true,
				userData: {
					paint: true,
					gore: id
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.065,
					.22,
					4,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#2e2924",
					roughness: .88
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.86,
					.04
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.11,
					.16,
					.24
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#161311",
					roughness: .62
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.93,
					.1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.12,
					.04,
					.08
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#0e0c0a",
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
				name: `anchor-${id}`,
				position: [
					0,
					-.28,
					.1
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				name: `wound-${id}`,
				userData: { wound: id },
				position: [
					0,
					-.28,
					.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.06,
					6,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#7a1418" })]
			})
		]
	});
}
function Victim({ look, hips, torso, head, jaw, headHat, armL, armR, legL, legR }) {
	const coat = "#2a2622";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: hips,
		position: [
			0,
			.96,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: torso,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.16,
							0
						],
						castShadow: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.07,
							.09,
							.12,
							8
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: look.skin,
							roughness: .6
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						name: "coat",
						position: [
							0,
							.34,
							0
						],
						scale: [
							look.bulk,
							1,
							.92
						],
						castShadow: true,
						userData: {
							paint: true,
							gore: "chest",
							gore2: "gut"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
							.2,
							.28,
							6,
							10
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: coat,
							roughness: .8
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.52,
							0
						],
						scale: [
							look.bulk * 1.15,
							.55,
							.85
						],
						castShadow: true,
						userData: {
							paint: true,
							gore: "chest"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.24,
							14,
							10
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: coat,
							roughness: .82
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							-.09,
							.4,
							.14
						],
						rotation: [
							.15,
							.35,
							.55
						],
						userData: {
							paint: true,
							gore: "chest"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.1,
							.28,
							.025
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#241f1b",
							roughness: .78
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							.09,
							.4,
							.14
						],
						rotation: [
							.15,
							-.35,
							-.55
						],
						userData: {
							paint: true,
							gore: "chest"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.1,
							.28,
							.025
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#241f1b",
							roughness: .78
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						name: "shirt",
						position: [
							0,
							.3,
							.14
						],
						userData: {
							paint: true,
							gore: "chest",
							gore2: "gut"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.12,
							.28,
							.03
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#e7dfd0",
							roughness: .66
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.18,
							.15
						],
						userData: {
							paint: true,
							gore: "gut"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.16,
							.16,
							.03
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#3a2420",
							roughness: .74
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.5,
							.12
						],
						scale: [
							1,
							look.cravat,
							1
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.14,
							.1,
							.05
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#f3eee4",
							roughness: .62
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							-.07,
							.44,
							.13
						],
						rotation: [
							.2,
							.2,
							.8
						],
						scale: [
							1,
							look.cravat,
							1
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.1,
							.045,
							.02
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#f7f3ea",
							roughness: .6
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							.07,
							.44,
							.13
						],
						rotation: [
							.2,
							-.2,
							-.8
						],
						scale: [
							1,
							look.cravat,
							1
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
							.1,
							.045,
							.02
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: "#f7f3ea",
							roughness: .6
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							.02,
							-.02
						],
						scale: [
							look.bulk,
							1,
							.9
						],
						userData: {
							paint: true,
							gore: "gut"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
							.2,
							.24,
							.28,
							10
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: coat,
							roughness: .84
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
						name: "anchor-chest",
						position: [
							0,
							.42,
							.2
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
						name: "anchor-gut",
						position: [
							0,
							.16,
							.2
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						name: "wound-chest",
						userData: { wound: "chest" },
						position: [
							0,
							.4,
							.2
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.09,
							8,
							6
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#7a1418" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						name: "wound-gut",
						userData: { wound: "gut" },
						position: [
							0,
							.16,
							.18
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
							.08,
							8,
							6
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#7a1418" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
						ref: head,
						position: [
							0,
							.84,
							.03
						],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								name: "skin",
								scale: [
									.92,
									1.05,
									.88
								],
								castShadow: true,
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.155,
									22,
									16
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .55
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									0,
									.055,
									.09
								],
								scale: [
									1.15,
									.28,
									.45
								],
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.08,
									10,
									8
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .6
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									-.055,
									.055,
									.1
								],
								rotation: [
									0,
									0,
									.45
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
									.055,
									.016,
									.02
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#2a211c",
									roughness: .7
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									.055,
									.055,
									.1
								],
								rotation: [
									0,
									0,
									-.45
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
									.055,
									.016,
									.02
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#2a211c",
									roughness: .7
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								x: -.05,
								iris: look.iris,
								skin: look.skin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
								x: .05,
								iris: look.iris,
								skin: look.skin
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									0,
									.01,
									.12
								],
								rotation: [
									.55,
									0,
									0
								],
								scale: [
									.65,
									look.nose,
									1
								],
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
									.016,
									.055,
									3,
									6
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .52
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								name: "nose",
								position: [
									0,
									-.028,
									.145
								],
								scale: [
									1,
									.85,
									look.nose
								],
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.028,
									12,
									10
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .5
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									-.018,
									-.04,
									.15
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.01,
									6,
									6
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#8a5a52",
									roughness: .7
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									.018,
									-.04,
									.15
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.01,
									6,
									6
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#8a5a52",
									roughness: .7
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									-.145,
									0,
									0
								],
								rotation: [
									0,
									0,
									.4
								],
								scale: [
									.45,
									.85,
									.35
								],
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.07,
									10,
									8
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .6
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									.145,
									0,
									0
								],
								rotation: [
									0,
									0,
									-.4
								],
								scale: [
									.45,
									.85,
									.35
								],
								userData: {
									paint: true,
									gore: "head"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.07,
									10,
									8
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.skin,
									roughness: .6
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									-.05,
									-.045,
									.12
								],
								rotation: [
									.2,
									.3,
									.4
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
									.012,
									.04,
									3,
									5
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.beard,
									roughness: .9
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									.05,
									-.045,
									.12
								],
								rotation: [
									.2,
									-.3,
									-.4
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
									.012,
									.04,
									3,
									5
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: look.beard,
									roughness: .9
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									0,
									-.055,
									.125
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
									.05,
									.012,
									.02
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#8d534c",
									roughness: .55
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									0,
									-.07,
									.11
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
									.045,
									.028,
									.02
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#1a0c0c" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hair, { look }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
								ref: jaw,
								position: [
									0,
									-.04,
									.02
								],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											0,
											-.06,
											.03
										],
										scale: [
											.82,
											.62,
											.78
										],
										userData: {
											paint: true,
											gore: "head"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
											.11,
											14,
											10
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
											color: look.skin,
											roughness: .58
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
										position: [
											0,
											-.02,
											.1
										],
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
											.05,
											.014,
											.02
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
											color: "#a8645c",
											roughness: .5
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beard, { look })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
								ref: headHat,
								position: [
									0,
									.12,
									-.01
								],
								rotation: [
									-.18,
									0,
									.04
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									castShadow: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
										.2,
										.2,
										.018,
										18
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
										color: "#241c16",
										roughness: .8
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
									position: [
										0,
										.08,
										0
									],
									castShadow: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
										.105,
										.118,
										.14,
										12
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
										color: "#241c16",
										roughness: .8
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
								name: "anchor-head",
								position: [
									0,
									.02,
									.1
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								name: "wound-head",
								userData: { wound: "head" },
								position: [
									.02,
									.02,
									.12
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
									.05,
									8,
									6
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#7a1418" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
								position: [
									0,
									-.16,
									0
								],
								rotation: [
									Math.PI / 2,
									0,
									0
								],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
									.09,
									.015,
									6,
									14
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
									color: "#3e3a36",
									metalness: .86,
									roughness: .36
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
								name: "anchor-neck",
								position: [
									0,
									-.16,
									-.02
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arm, {
						side: "L",
						group: armL,
						skin: look.skin
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arm, {
						side: "R",
						group: armR,
						skin: look.skin
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leg, {
				side: "L",
				group: legL
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leg, {
				side: "R",
				group: legR
			})
		]
	});
}
var BLOOD = new Color("#6e1216");
var UP = new Vector3(0, 1, 0);
var DOWN = new Vector3(0, -1, 0);
var Z_AXIS = new Vector3(0, 0, 1);
var _o$1 = new Vector3();
var _f$1 = new Vector3();
var _r$1 = new Vector3();
var _p$1 = new Vector3();
var _p2 = new Vector3();
var _hit = new Vector3();
var _best = new Vector3();
var _look = new Vector3();
var _mid = new Vector3();
var _dir = new Vector3();
var _local = new Vector3();
var _aim = new Vector3();
var _sample = new Vector3();
var PART_META = [
	{
		id: "head",
		label: "SKULL",
		radius: .2,
		mult: 1.65
	},
	{
		id: "chest",
		label: "RIBS",
		radius: .28,
		mult: 1
	},
	{
		id: "gut",
		label: "GUT",
		radius: .22,
		mult: 1.05
	},
	{
		id: "armL",
		label: "ARM",
		radius: .14,
		mult: .58
	},
	{
		id: "armR",
		label: "ARM",
		radius: .14,
		mult: .58
	},
	{
		id: "legL",
		label: "THIGH",
		radius: .16,
		mult: .7
	},
	{
		id: "legR",
		label: "THIGH",
		radius: .16,
		mult: .7
	}
];
function quad(a, b, c, t, out) {
	const u = 1 - t;
	out.set(0, 0, 0);
	out.addScaledVector(a, u * u);
	out.addScaledVector(b, 2 * u * t);
	out.addScaledVector(c, t * t);
}
function trunkHit(a, b, out) {
	for (let i = 1; i <= 4; i++) {
		out.lerpVectors(a, b, i / 4);
		if (out.y < .25 || out.y > 8.5) continue;
		const r = gumRadius(out.y) * .96;
		if (out.x * out.x + out.z * out.z < r * r) {
			const radial = Math.hypot(out.x, out.z) || 1;
			out.x = out.x / radial * r;
			out.z = out.z / radial * r;
			return true;
		}
	}
	return false;
}
function Clearing() {
	const { camera } = useThree();
	const barkTex = (0, import_react.useMemo)(() => makeBark(), []);
	const groundTex = (0, import_react.useMemo)(() => makeGround(), []);
	const bloodTex = (0, import_react.useMemo)(() => makeBlood(), []);
	const look = useGame((s) => FIGURES[s.figure]?.look ?? FIGURES[0].look);
	const trunkGeo = (0, import_react.useMemo)(() => {
		const pts = [];
		for (let i = 0; i <= 30; i++) pts.push(new Vector2(gumRadius(i / 30 * 12.8), i / 30 * 12.8));
		const geo = new LatheGeometry(pts, 18);
		const pos = geo.attributes.position;
		if (!pos) return geo;
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const z = pos.getZ(i);
			const n = 1 + Math.sin(y * 2.4 + x) * .025 + Math.sin(y * 14) * .012;
			pos.setXYZ(i, x * n, y, z * n);
		}
		pos.needsUpdate = true;
		geo.computeVertexNormals();
		return geo;
	}, []);
	const stars = (0, import_react.useMemo)(() => {
		const geo = new BufferGeometry();
		const arr = /* @__PURE__ */ new Float32Array(210);
		for (let i = 0; i < 70; i++) {
			const ang = Math.random() * Math.PI * 2;
			const rad = 22 + Math.random() * 16;
			arr[i * 3] = Math.cos(ang) * rad;
			arr[i * 3 + 1] = 6 + Math.random() * 14;
			arr[i * 3 + 2] = Math.sin(ang) * rad;
		}
		geo.setAttribute("position", new BufferAttribute(arr, 3));
		return geo;
	}, []);
	const tree = (0, import_react.useRef)(null);
	const rig = (0, import_react.useRef)(null);
	const hips = (0, import_react.useRef)(null);
	const torso = (0, import_react.useRef)(null);
	const head = (0, import_react.useRef)(null);
	const jaw = (0, import_react.useRef)(null);
	const armL = (0, import_react.useRef)(null);
	const armR = (0, import_react.useRef)(null);
	const legL = (0, import_react.useRef)(null);
	const legR = (0, import_react.useRef)(null);
	const headHat = (0, import_react.useRef)(null);
	const worldHat = (0, import_react.useRef)(null);
	const holder = (0, import_react.useRef)(null);
	const ground = (0, import_react.useRef)(null);
	const parts = (0, import_react.useRef)([]);
	const paintLists = (0, import_react.useRef)({});
	const flyers = (0, import_react.useRef)([]);
	const drops = (0, import_react.useRef)([]);
	const decals = (0, import_react.useRef)([]);
	const links = (0, import_react.useRef)([]);
	const decalCursor = (0, import_react.useRef)(0);
	const hang = (0, import_react.useRef)(0);
	const recoil = (0, import_react.useRef)(0);
	const alive = (0, import_react.useRef)(true);
	const hatLost = (0, import_react.useRef)(false);
	const hatVel = (0, import_react.useRef)(new Vector3());
	const voice = (0, import_react.useRef)(false);
	const drip = (0, import_react.useRef)(0);
	const bleed = (0, import_react.useRef)({});
	(0, import_react.useLayoutEffect)(() => {
		const root = rig.current;
		const bin = holder.current;
		const floor = ground.current;
		const trunk = tree.current;
		if (!root || !bin || !floor || !trunk) return;
		const lists = {};
		const take = (name) => root.getObjectByName(name);
		const assign = (id, names) => {
			lists[id] = names.map((name) => take(name)).filter((mesh) => Boolean(mesh));
		};
		assign("head", [
			"skin",
			"nose",
			"beard"
		]);
		assign("chest", ["coat", "shirt"]);
		assign("gut", ["coat", "shirt"]);
		assign("armL", ["sleeveL", "handL"]);
		assign("armR", ["sleeveR", "handR"]);
		assign("legL", ["thighL", "shinL"]);
		assign("legR", ["thighR", "shinR"]);
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			const gore = mesh.userData.gore;
			const gore2 = mesh.userData.gore2;
			if (gore) (lists[gore] ??= []).push(mesh);
			if (gore2) (lists[gore2] ??= []).push(mesh);
		});
		paintLists.current = lists;
		root.traverse((obj) => {
			const mesh = obj;
			if (!mesh.isMesh) return;
			const mat = mesh.material;
			if (mesh.userData.paint && mat.color) {
				const standard = mat;
				mesh.userData.base = standard.color.clone();
				mesh.userData.rough = standard.roughness;
			}
			if (typeof mesh.userData.wound === "string") {
				mesh.visible = false;
				mesh.userData.n = 0;
			}
		});
		const found = [];
		for (const meta of PART_META) {
			const anchor = root.getObjectByName(`anchor-${meta.id}`);
			if (!anchor) continue;
			found.push({
				...meta,
				anchor,
				world: new Vector3()
			});
		}
		parts.current = found;
		const iron = new MeshStandardMaterial({
			color: "#4a453f",
			metalness: .88,
			roughness: .36
		});
		const linkGeo = new TorusGeometry(.048, .014, 6, 8);
		const chain = [];
		for (let i = 0; i < 33; i++) {
			const link = new Mesh(linkGeo, iron);
			link.castShadow = true;
			bin.add(link);
			chain.push(link);
		}
		links.current = chain;
		const made = [];
		for (let i = 0; i < 6; i++) {
			const group = buildFlyer();
			bin.add(group);
			made.push({
				group,
				kind: "spear",
				alive: false,
				stuck: false,
				phase: 0,
				pos: new Vector3(),
				prev: new Vector3(),
				vel: new Vector3(),
				origin: new Vector3(),
				forward: new Vector3(),
				right: new Vector3(),
				rf: 8,
				side: .75,
				power: .5,
				hits: /* @__PURE__ */ new Set(),
				spin: 0,
				barked: false
			});
		}
		flyers.current = made;
		const bloodGeo = new SphereGeometry(1, 6, 5);
		const bloodMat = new MeshStandardMaterial({
			color: "#7c1418",
			roughness: .32,
			metalness: .06,
			emissive: "#3a0808",
			emissiveIntensity: .4
		});
		const dropList = [];
		for (let i = 0; i < 90; i++) {
			const mesh = new Mesh(bloodGeo, bloodMat);
			mesh.visible = false;
			mesh.castShadow = false;
			bin.add(mesh);
			dropList.push({
				mesh,
				vel: new Vector3(),
				life: 0,
				max: 1,
				stained: false,
				base: .05
			});
		}
		drops.current = dropList;
		const decalMat = new MeshBasicMaterial({
			map: bloodTex,
			color: "#8a1418",
			transparent: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -4
		});
		const decalGeo = new PlaneGeometry(1, 1);
		const decalList = [];
		for (let i = 0; i < 48; i++) {
			const mesh = new Mesh(decalGeo, decalMat);
			mesh.visible = false;
			mesh.renderOrder = 2;
			bin.add(mesh);
			decalList.push(mesh);
		}
		decals.current = decalList;
		const branchMat = new MeshStandardMaterial({
			map: barkTex,
			color: "#cbb892",
			roughness: .94
		});
		const branchMeshes = [];
		const ends = [];
		for (const [x1, y1, z1, x2, y2, z2, radius] of [
			[
				.15,
				4.3,
				.1,
				2.6,
				5.4,
				1.4,
				.16
			],
			[
				-.1,
				4.8,
				-.05,
				-2.8,
				5.7,
				-.6,
				.15
			],
			[
				.05,
				5.7,
				-.1,
				1.4,
				6.9,
				-2.4,
				.13
			],
			[
				0,
				6.5,
				.05,
				-1.9,
				7.7,
				1.7,
				.12
			],
			[
				.1,
				7.4,
				0,
				2.3,
				8.6,
				.5,
				.1
			],
			[
				-.1,
				8.2,
				0,
				-.7,
				9.6,
				-1.6,
				.09
			]
		]) {
			const from = new Vector3(x1, y1, z1);
			const to = new Vector3(x2, y2, z2);
			const dir = to.clone().sub(from);
			const len = dir.length();
			const mesh = new Mesh(new CylinderGeometry(radius * .55, radius, len, 6), branchMat);
			mesh.position.copy(from).add(to).multiplyScalar(.5);
			mesh.quaternion.setFromUnitVectors(UP, dir.normalize());
			mesh.castShadow = true;
			trunk.add(mesh);
			branchMeshes.push(mesh);
			ends.push(to);
		}
		const leafGeo = new IcosahedronGeometry(.42, 0);
		const leafMat = new MeshStandardMaterial({
			color: "#3e4a32",
			roughness: .92,
			flatShading: true
		});
		const leaves = new InstancedMesh(leafGeo, leafMat, 64);
		const dummy = new Object3D();
		let n = 0;
		for (const end of ends) for (let k = 0; k < 8 && n < 64; k++) {
			dummy.position.set(end.x + (Math.random() - .5) * 1.4, end.y + (Math.random() - .4) * 1.1, end.z + (Math.random() - .5) * 1.4);
			dummy.rotation.set(Math.random() * 3, Math.random() * 6, Math.random() * 3);
			dummy.scale.setScalar(.7 + Math.random() * .9);
			dummy.updateMatrix();
			leaves.setMatrixAt(n, dummy.matrix);
			n++;
		}
		for (let i = n; i < 64; i++) {
			dummy.position.set(0, -20, 0);
			dummy.scale.setScalar(.001);
			dummy.updateMatrix();
			leaves.setMatrixAt(i, dummy.matrix);
		}
		leaves.instanceMatrix.needsUpdate = true;
		trunk.add(leaves);
		const grassGeo = new ConeGeometry(.08, 1, 4);
		const grassMat = new MeshStandardMaterial({
			color: "#243024",
			roughness: 1
		});
		const grass = new InstancedMesh(grassGeo, grassMat, 160);
		let g = 0;
		for (let i = 0; i < 160; i++) {
			const ang = Math.random() * Math.PI * 2;
			const rad = 2.2 + Math.random() * 13;
			const x = Math.cos(ang) * rad;
			const z = Math.sin(ang) * rad;
			if (x * x + z * z < 2.2) continue;
			dummy.position.set(x, .15, z);
			dummy.rotation.set(0, Math.random() * 6, 0);
			dummy.scale.set(.7 + Math.random(), .35 + Math.random() * .7, .7);
			dummy.updateMatrix();
			grass.setMatrixAt(g, dummy.matrix);
			g++;
		}
		for (let i = g; i < 160; i++) {
			dummy.position.set(0, -5, 0);
			dummy.scale.setScalar(.001);
			dummy.updateMatrix();
			grass.setMatrixAt(i, dummy.matrix);
		}
		grass.instanceMatrix.needsUpdate = true;
		floor.add(grass);
		return () => {
			for (const flyer of made) {
				flyer.group.traverse((obj) => {
					const mesh = obj;
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
		const dt = Math.min(delta, .05);
		let sim = dt;
		if (motion.hitStop > 0) {
			motion.hitStop -= dt;
			sim *= .22;
		}
		const t = performance.now() * .001;
		const idle = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
		const hangTarget = useGame.getState().vitality <= 0 ? 1 : 0;
		hang.current = MathUtils.damp(hang.current, hangTarget, hangTarget > 0 ? 2.4 : 1.5, sim);
		recoil.current = Math.max(0, recoil.current - sim * 2.4);
		const rec = recoil.current;
		const h = hang.current;
		if (hips.current) hips.current.position.y = MathUtils.lerp(.96, .42, h) + Math.sin(t * 1.7) * .01 * idle * (1 - h);
		if (torso.current) {
			torso.current.rotation.x = MathUtils.lerp(.04, .72, h) - rec * .28;
			torso.current.rotation.y = Math.sin(t * .85) * .05 * idle * (1 - h);
		}
		if (head.current) {
			const talk = useGame.getState().shut ? .15 : 1;
			head.current.rotation.x = Math.sin(t * 1.4) * .05 * idle * talk + h * .85 - rec * .45;
			head.current.rotation.y = Math.sin(t * .65) * .16 * idle * (1 - h) * talk;
			head.current.rotation.z = rec * Math.sin(t * 36) * .18;
		}
		if (jaw.current) {
			const shut = useGame.getState().shut || h > .2;
			jaw.current.rotation.x = shut ? 0 : -(.06 + Math.sin(t * 6.2) * .07) * idle;
		}
		const groaning = useGame.getState().phase === "play" && useGame.getState().vitality > 0 && !useGame.getState().shut;
		if (groaning !== voice.current) {
			voice.current = groaning;
			setGroan(groaning);
		}
		const spreadStruggle = Math.sin(t * 8) * .06 * idle * (1 - h);
		const yUp = MathUtils.lerp(.12, .9, h);
		const zBack = MathUtils.lerp(-.95, -.4, h);
		const xOut = MathUtils.lerp(.95, .32, h);
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
		rig.current?.updateWorldMatrix(true, true);
		for (const part of parts.current) part.anchor.getWorldPosition(part.world);
		if (input.chop > 0) {
			const prev = input.chop;
			input.chop = Math.max(0, input.chop - sim / .32);
			if (prev > .5 && input.chop <= .5) axeChop();
		}
		const ring = tree.current?.getObjectByName("anchor-ring");
		const neck = rig.current?.getObjectByName("anchor-neck");
		const wristL = rig.current?.getObjectByName("anchor-armL");
		const wristR = rig.current?.getObjectByName("anchor-armR");
		if (ring && neck && wristL && wristR && links.current.length === 33) {
			ring.getWorldPosition(_o$1);
			const sag = .18 * (1 - h * .65) + Math.sin(t * 3) * .012 * idle;
			const place = (index, target) => {
				target.getWorldPosition(_f$1);
				_mid.copy(_o$1).lerp(_f$1, .5);
				_mid.y -= sag;
				for (let i = 0; i < 11; i++) {
					const u = (i + .5) / 11;
					quad(_o$1, _mid, _f$1, u, _p$1);
					quad(_o$1, _mid, _f$1, Math.min(.98, u + .07), _p2);
					const link = links.current[index + i];
					if (!link) continue;
					link.position.copy(_p$1);
					_dir.subVectors(_p2, _p$1);
					if (_dir.lengthSq() > 1e-6) {
						link.quaternion.setFromUnitVectors(Z_AXIS, _dir.normalize());
						if (i % 2 === 1) link.rotateZ(Math.PI / 2);
					}
				}
			};
			place(0, neck);
			place(11, wristL);
			place(22, wristR);
		}
		if (hatLost.current && worldHat.current) {
			hatVel.current.y -= 9 * sim;
			worldHat.current.position.addScaledVector(hatVel.current, sim);
			worldHat.current.rotation.x += sim * 4;
			worldHat.current.rotation.z += sim * 2.4;
			if (worldHat.current.position.y < .12) {
				worldHat.current.position.y = .12;
				hatVel.current.y *= -.28;
				hatVel.current.x *= .6;
				hatVel.current.z *= .6;
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
		if (useGame.getState().gore > .18 && hang.current < .95) {
			drip.current += sim;
			if (drip.current > .14) {
				drip.current = 0;
				const bleeding = parts.current.filter((part) => (bleed.current[part.id] ?? 0) > 0);
				const part = bleeding[Math.floor(Math.random() * bleeding.length)];
				if (part) {
					_dir.set((Math.random() - .5) * .3, -.4, .4);
					burst(part.world, _dir, 2, 1.2);
				}
			}
		}
		for (const drop of drops.current) {
			if (!drop.mesh.visible) continue;
			drop.life -= sim;
			drop.vel.y -= 12 * sim;
			drop.mesh.position.addScaledVector(drop.vel, sim);
			if (drop.mesh.position.y < .03 && ground.current) {
				drop.mesh.position.y = .03;
				if (!drop.stained) {
					drop.stained = true;
					putDecal(ground.current, drop.mesh.position, UP, .16 + Math.random() * .22);
				}
				drop.vel.multiplyScalar(.2);
			}
			const k = Math.max(0, drop.life / drop.max);
			const s = drop.base * (.55 + .45 * k);
			drop.mesh.scale.set(s * .7, s * .7, s * 1.7);
			if (drop.vel.lengthSq() > .15) {
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
	function launch(kind, power) {
		const flyer = takeFlyer();
		if (!flyer) return;
		camera.getWorldPosition(_o$1);
		_f$1.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
		_r$1.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
		flyer.kind = kind;
		flyer.alive = true;
		flyer.stuck = false;
		flyer.power = power;
		flyer.phase = .05;
		flyer.spin = 0;
		flyer.barked = false;
		flyer.hits.clear();
		flyer.group.visible = true;
		const boom = flyer.group.getObjectByName("boomerang");
		const spear = flyer.group.getObjectByName("spear");
		if (boom) boom.visible = kind === "boomerang";
		if (spear) spear.visible = kind === "spear";
		if (kind === "spear") {
			flyer.vel.copy(_f$1).multiplyScalar(spearSpeed(power));
			flyer.pos.copy(_o$1).addScaledVector(_f$1, .7);
			flyer.prev.copy(flyer.pos);
			flyer.group.position.copy(flyer.pos);
			_look.copy(flyer.pos).add(flyer.vel);
			flyer.group.lookAt(_look);
		} else {
			flyer.origin.copy(_o$1);
			flyer.forward.copy(_f$1);
			flyer.right.copy(_r$1);
			flyer.rf = throwReach(_o$1, _f$1);
			flyer.side = .75;
			boomerangPosition(flyer.origin, flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, flyer.pos);
			flyer.prev.copy(flyer.pos);
			flyer.group.position.copy(flyer.pos);
		}
	}
	function burst(point, dir, count, force) {
		for (let i = 0; i < count; i++) {
			let drop = drops.current.find((item) => !item.mesh.visible);
			if (!drop) drop = drops.current.reduce((a, b) => a.life < b.life ? a : b);
			drop.mesh.visible = true;
			drop.mesh.position.copy(point);
			drop.vel.copy(dir);
			if (drop.vel.lengthSq() < 1e-4) drop.vel.copy(UP);
			drop.vel.normalize().multiplyScalar(force * (.35 + Math.random()));
			drop.vel.x += (Math.random() - .5) * force * 1.4;
			drop.vel.y += Math.random() * force * .8;
			drop.vel.z += (Math.random() - .5) * force * 1.4;
			drop.life = .65 + Math.random() * .85;
			drop.max = drop.life;
			drop.stained = false;
			drop.base = .035 + Math.random() * (force > 3 ? .1 : .045);
			drop.mesh.scale.setScalar(drop.base);
		}
	}
	function putDecal(parent, worldPoint, normal, size) {
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
		mesh.translateZ(.02);
		const s = size * (.75 + Math.random() * .7);
		mesh.scale.set(s, s * (.75 + Math.random() * .5), 1);
	}
	function paintPart(id, amount) {
		const list = paintLists.current[id] ?? [];
		const seen = /* @__PURE__ */ new Set();
		for (const mesh of list) {
			if (seen.has(mesh)) continue;
			seen.add(mesh);
			const mat = mesh.material;
			const base = mesh.userData.base;
			if (!base || !mat.color) continue;
			const next = Math.min(1, (mesh.userData.blood ?? 0) + amount);
			mesh.userData.blood = next;
			mat.color.copy(base).lerp(BLOOD, next * .9);
			if (typeof mesh.userData.rough === "number") mat.roughness = Math.max(.25, mesh.userData.rough - next * .4);
		}
	}
	function growWound(id) {
		const mesh = rig.current?.getObjectByName(`wound-${id}`);
		if (!mesh) return;
		const next = Math.min(2.5, (mesh.userData.n ?? 0) + .8);
		mesh.userData.n = next;
		mesh.visible = true;
		mesh.scale.setScalar(Math.max(.7, next));
		bleed.current[id] = (bleed.current[id] ?? 0) + 1;
	}
	function popHat() {
		if (hatLost.current || !headHat.current || !worldHat.current) return;
		hatLost.current = true;
		headHat.current.getWorldPosition(worldHat.current.position);
		headHat.current.getWorldQuaternion(worldHat.current.quaternion);
		headHat.current.visible = false;
		worldHat.current.visible = true;
		hatVel.current.set((Math.random() - .5) * 2.4, 4.4, 1.8);
	}
	function strike(flyer, part, point) {
		flyer.hits.add(part.id);
		const dmg = (flyer.kind === "spear" ? 33 : 21) * (.72 + flyer.power * .6) * part.mult;
		const verb = flyer.kind === "spear" ? "STUCK" : "OPENED";
		burst(point, flyer.kind === "spear" ? flyer.vel : flyer.forward, flyer.kind === "spear" ? 28 : 40, flyer.kind === "spear" ? 5.5 : 4.2);
		const parent = part.anchor.parent ?? holder.current;
		if (parent) {
			_dir.copy(camera.position).sub(point).normalize();
			putDecal(parent, point, _dir, .32 + Math.random() * .35);
		}
		if (tree.current) {
			const r = gumRadius(point.y);
			_sample.set(point.x * .2, point.y, r * .98);
			putDecal(tree.current, _sample, Z_AXIS, .45 + Math.random() * .55);
		}
		paintPart(part.id, .32 + flyer.power * .28);
		growWound(part.id);
		if (part.id === "head") popHat();
		motion.shake = Math.min(1.25, motion.shake + .72);
		motion.hitStop = .05;
		recoil.current = 1;
		wet(dmg);
		chainClank();
		useGame.getState().wound(dmg, `${part.label} · ${verb}`);
		if (flyer.kind === "spear") {
			flyer.stuck = true;
			part.anchor.attach(flyer.group);
		}
	}
	function chopConnect(part, point) {
		const power = Math.max(.45, input.power);
		const headHit = part.id === "head";
		const dmg = 42 * (.7 + power * .55) * part.mult;
		burst(point, _f$1, headHit ? 48 : 30, 6.4);
		const parent = part.anchor.parent ?? holder.current;
		if (parent) {
			_dir.copy(camera.position).sub(point).normalize();
			putDecal(parent, point, _dir, headHit ? .58 : .4);
		}
		paintPart(part.id, headHit ? .75 : .48);
		growWound(part.id);
		if (headHit) popHat();
		motion.shake = Math.min(1.45, motion.shake + 1);
		motion.hitStop = .08;
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
		if (input.dolly < .55) {
			useGame.getState().flash("STEP IN");
			return;
		}
		camera.getWorldPosition(_o$1);
		_f$1.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
		_p$1.copy(_o$1).addScaledVector(_f$1, .25);
		_p2.copy(_o$1).addScaledVector(_f$1, 1.2);
		const hit = closestPart(_p$1, _p2, .2);
		if (hit) {
			chopConnect(hit, _best);
			return;
		}
		if (trunkHit(_p$1, _p2, _sample)) {
			wood$1();
			useGame.getState().flash("THE GUM");
			return;
		}
		useGame.getState().flash("WIDE");
	}
	function closestPart(a, b, slash) {
		let best = null;
		let bestD = Infinity;
		for (const part of parts.current) if (segmentHitsSphere(a, b, part.world, part.radius + slash, _hit)) {
			const d = _hit.distanceToSquared(part.world);
			if (d < bestD) {
				bestD = d;
				best = part;
				_best.copy(_hit);
			}
		}
		return best;
	}
	function stepSpear(flyer, sim) {
		flyer.prev.copy(flyer.pos);
		flyer.vel.y -= GRAVITY * sim;
		flyer.pos.addScaledVector(flyer.vel, sim);
		flyer.group.position.copy(flyer.pos);
		if (flyer.vel.lengthSq() > .01) {
			_look.copy(flyer.pos).add(flyer.vel);
			flyer.group.lookAt(_look);
		}
		if (flyer.hits.size === 0) {
			const hit = closestPart(flyer.prev, flyer.pos, .04);
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
				wood$1();
				useGame.getState().flash("WIDE · THE GUM");
			}
			return;
		}
		if (flyer.pos.y < .05) {
			flyer.stuck = true;
			flyer.pos.y = .05;
			flyer.group.position.copy(flyer.pos);
			flyer.group.rotation.x = Math.PI / 2.6;
			wood$1();
			if (flyer.hits.size === 0) useGame.getState().flash("WIDE · THE DIRT");
		}
	}
	function stepBoom(flyer, sim) {
		flyer.prev.copy(flyer.pos);
		const outTime = .62 - flyer.power * .18;
		flyer.phase += sim / (flyer.phase < 1 ? outTime : .74);
		boomerangPosition(flyer.origin, flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, flyer.pos);
		flyer.group.position.copy(flyer.pos);
		boomerangTangent(flyer.forward, flyer.right, flyer.rf, flyer.side, flyer.phase, _dir);
		if (_dir.lengthSq() > .001) {
			_look.copy(flyer.pos).add(_dir);
			flyer.group.lookAt(_look);
		}
		flyer.spin += sim * 16;
		flyer.group.rotateZ(flyer.spin);
		if (flyer.phase < 1 && flyer.hits.size === 0) {
			const hit = closestPart(flyer.prev, flyer.pos, .16);
			if (hit) strike(flyer, hit, _best);
			else if (!flyer.barked && trunkHit(flyer.prev, flyer.pos, _sample)) {
				flyer.barked = true;
				flyer.phase = 1;
				wood$1();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
			geometry: stars,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
				color: "#d7deee",
				size: .07,
				sizeAttenuation: true
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-6.2,
				8.4,
				-12
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.72,
				24,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#f3f6ff" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: ground,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					0,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [48, 48] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					map: groundTex,
					color: "#ffffff",
					roughness: 1
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.02,
					.4
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [3.4, 28] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#140f0c",
					transparent: true,
					opacity: .45
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FarGums, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: tree,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
					geometry: trunkGeo,
					castShadow: true,
					receiveShadow: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						map: barkTex,
						color: "#ffffff",
						roughness: .96
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarkStrips, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						1.75,
						ringZ * .9
					],
					castShadow: true,
					name: "ring-mesh",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
						.11,
						.02,
						6,
						14
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#3a3632",
						metalness: .9,
						roughness: .34
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("object3D", {
					name: "anchor-ring",
					position: [
						0,
						1.75,
						ringZ * .92
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: rig,
			position: [
				.02,
				0,
				1.42
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Victim, {
				look,
				hips,
				torso,
				head,
				jaw,
				headHat,
				armL,
				armR,
				legL,
				legR
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: worldHat,
			visible: false,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.22,
				.22,
				.02,
				18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#241c16",
				roughness: .84
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.09,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.115,
					.125,
					.15,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#241c16",
					roughness: .84
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { ref: holder })
	] });
}
function BarkStrips() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
		{
			pos: [
				1.05,
				2.3,
				.25
			],
			rot: [
				.1,
				.8,
				.15
			]
		},
		{
			pos: [
				-1.05,
				3,
				.15
			],
			rot: [
				.15,
				-.6,
				-.2
			]
		},
		{
			pos: [
				.85,
				4,
				-.35
			],
			rot: [
				.2,
				1.2,
				.1
			]
		},
		{
			pos: [
				-.7,
				4.6,
				-.25
			],
			rot: [
				.25,
				-1,
				-.15
			]
		}
	].map((strip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: strip.pos,
		rotation: strip.rot,
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.34,
			1.15,
			.035
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#c8b48e",
			roughness: 1,
			side: 2
		})]
	}, strip.pos.join(","))) });
}
function FarGums() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [
		[
			-8.5,
			0,
			-6,
			1.15
		],
		[
			7.2,
			0,
			-8,
			.85
		],
		[
			-4,
			0,
			-11,
			.7
		],
		[
			10,
			0,
			-3,
			.55
		],
		[
			3.5,
			0,
			-13,
			.9
		]
	].map(([x, y, z, s]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			y,
			z
		],
		scale: s,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				2.4,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.22,
				.45,
				4.8,
				6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2a241c",
				roughness: 1
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				5.1,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [1.5, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#243028",
				flatShading: true,
				roughness: 1
			})]
		})]
	}, `${x},${z}`)) });
}
function Viewmodel() {
	const ref = (0, import_react.useRef)(null);
	const weapon = useGame((s) => s.weapon);
	const { camera } = useThree();
	const boomerang = (0, import_react.useMemo)(() => buildBoomerang(), []);
	const spear = (0, import_react.useMemo)(() => buildSpear(), []);
	const axe = (0, import_react.useMemo)(() => buildAxe(), []);
	(0, import_react.useLayoutEffect)(() => {
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
		const dt = Math.min(delta, .05);
		if (motion.swing > 0) motion.swing = Math.max(0, motion.swing - dt / .28);
		const pull = input.charging ? input.charge : 0;
		const axeOn = weapon === "axe";
		const through = motion.swing > 0 ? Math.sin((1 - motion.swing) * Math.PI) : 0;
		if (axeOn) {
			group.position.set(.2, -.18 - pull * .14, -.32);
			group.rotation.set(-1.4 + pull * .4 + through * 2.15, -.18, .32);
		} else {
			group.position.set(.46, -.48 - pull * .05, -.42);
			group.rotation.set(-.42 + pull * .62 - through * 1.15, -.25, .18);
		}
		boomerang.visible = weapon === "boomerang";
		spear.visible = weapon === "spear";
		axe.visible = axeOn;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		frustumCulled: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.02,
					-.02,
					.12
				],
				rotation: [
					.55,
					0,
					.35
				],
				frustumCulled: false,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.055,
					.32,
					4,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#5c3a2c",
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.06,
					.02,
					.02
				],
				rotation: [
					.55,
					0,
					.35
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.064,
					.012,
					6,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#c4622d",
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.12,
					.22
				],
				rotation: [
					.55,
					0,
					.35
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					.06,
					.01,
					6,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#c4622d",
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.1,
					-.18,
					-.08
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.064,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#5c3a2c",
					roughness: .68
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: boomerang,
				position: [
					.12,
					-.16,
					-.28
				],
				rotation: [
					.2,
					Math.PI,
					.4
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: spear,
				position: [
					.08,
					-.14,
					-.2
				],
				rotation: [
					.15,
					Math.PI,
					.08
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
				object: axe,
				position: [
					.02,
					-.08,
					-.05
				],
				rotation: [
					.15,
					0,
					0
				]
			})
		]
	});
}
var _o = new Vector3();
var _f = new Vector3();
var _r = new Vector3();
var _p = new Vector3();
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function CameraRig() {
	const { camera } = useThree();
	useFrame((_, delta) => {
		const dt = Math.min(delta, .05);
		if (input.charging) input.charge = Math.min(1, input.charge + dt / .62);
		motion.shake = Math.max(0, motion.shake - dt * 1.8);
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const s = reduce ? 0 : motion.shake;
		const want = useGame.getState().weapon === "axe" && useGame.getState().phase === "play" ? useGame.getState().close : 0;
		input.dolly = MathUtils.damp(input.dolly, want, 4.2, dt);
		const y = MathUtils.lerp(1.66, 1.7, input.dolly);
		const z = MathUtils.lerp(7.5, 2.05, input.dolly);
		camera.position.set(Math.sin(s * 48) * .05 * s, y + Math.cos(s * 33) * .035 * s, z);
		camera.rotation.order = "YXZ";
		camera.rotation.y = input.yaw;
		camera.rotation.x = input.pitch;
		camera.rotation.z = reduce ? 0 : Math.sin(s * 62) * .012 * s;
	});
	return null;
}
function Lights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", {
			color: "#9aadc8",
			groundColor: "#2a2218",
			intensity: .55
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
			color: "#202430",
			intensity: .35
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-7,
				11,
				-5
			],
			intensity: 2.35,
			color: "#e7eeff",
			castShadow: true,
			"shadow-mapSize-width": 1024,
			"shadow-mapSize-height": 1024,
			"shadow-camera-near": 1,
			"shadow-camera-far": 36,
			"shadow-camera-left": -12,
			"shadow-camera-right": 12,
			"shadow-camera-top": 12,
			"shadow-camera-bottom": -12,
			"shadow-bias": -8e-4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				3.5,
				4.5,
				8
			],
			intensity: .55,
			color: "#ffd2b4"
		})
	] });
}
function AimGuide() {
	const { camera } = useThree();
	const refs = (0, import_react.useRef)([]);
	useFrame(() => {
		const show = input.charging && useGame.getState().phase === "play" && useGame.getState().weapon !== "axe";
		const weapon = useGame.getState().weapon;
		const power = Math.max(input.charge, .45);
		camera.getWorldPosition(_o);
		_f.set(0, 0, -1).applyQuaternion(camera.quaternion);
		_r.set(1, 0, 0).applyQuaternion(camera.quaternion);
		const rf = throwReach(_o, _f);
		refs.current.forEach((mesh, index) => {
			if (!mesh) return;
			mesh.visible = show;
			if (!show) return;
			const t = (index + 1) / refs.current.length;
			if (weapon === "boomerang") boomerangPosition(_o, _f, _r, rf, .75, t * .92, _p);
			else {
				const speed = spearSpeed(power);
				const time = t * .48;
				_p.copy(_o).addScaledVector(_f, .45 + speed * time);
				_p.y -= .5 * GRAVITY * time * time;
			}
			mesh.position.copy(_p);
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref: (node) => {
			refs.current[i] = node;
		},
		visible: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.04,
			6,
			6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#e6d7c3",
			transparent: true,
			opacity: .5
		})]
	}, i)) });
}
function StageWorld() {
	const round = useGame((s) => s.round);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#12151c"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#12151c",
				16,
				46
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clearing, {}, round),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewmodel, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AimGuide, {})
	] });
}
function Stage() {
	const rootRef = (0, import_react.useRef)(null);
	const touch = (0, import_react.useRef)(null);
	const gore = useGame((s) => s.gore);
	(0, import_react.useEffect)(() => {
		const root = rootRef.current;
		if (!root) return;
		const onDown = (event) => {
			if (event.target?.closest("[data-ui]")) return;
			unlockAudio();
			if (event.pointerType === "touch") {
				touch.current = {
					x: event.clientX,
					y: event.clientY,
					id: event.pointerId
				};
				return;
			}
			if (event.button !== 0) return;
			startCharge();
		};
		const onMove = (event) => {
			if (event.pointerType === "touch") {
				if (!touch.current || event.pointerId !== touch.current.id) return;
				const dx = event.clientX - touch.current.x;
				const dy = event.clientY - touch.current.y;
				touch.current = {
					x: event.clientX,
					y: event.clientY,
					id: event.pointerId
				};
				input.yaw = clamp(input.yaw - dx * .0048, -.78, .78);
				input.pitch = clamp(input.pitch - dy * .0036, -.5, .46);
				return;
			}
			const target = event.target;
			if (target instanceof HTMLElement && target.closest("[data-ui]")) return;
			if (!root.contains(target)) return;
			const rect = root.getBoundingClientRect();
			const nx = (event.clientX - rect.left) / rect.width * 2 - 1;
			const ny = (event.clientY - rect.top) / rect.height * 2 - 1;
			input.yaw = clamp(-nx * .62, -.78, .78);
			input.pitch = clamp(.04 - ny * .34, -.5, .46);
		};
		const onUp = (event) => {
			if (event.pointerType === "touch") {
				if (touch.current?.id === event.pointerId) touch.current = null;
				return;
			}
			if (input.charging) releaseThrow();
		};
		const onKey = (event) => {
			if (event.repeat) return;
			if (event.code === "Digit1") useGame.getState().setWeapon("boomerang");
			if (event.code === "Digit2") useGame.getState().setWeapon("spear");
			if (event.code === "Digit3") useGame.getState().setWeapon("axe");
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
				startCharge();
			}
		};
		const onKeyUp = (event) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "absolute inset-0 touch-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: true,
				dpr: [1, 1.6],
				camera: {
					fov: 50,
					near: .08,
					far: 70,
					position: [
						0,
						1.66,
						7.5
					]
				},
				gl: {
					antialias: true,
					powerPreference: "high-performance",
					failIfMajorPerformanceCaveat: false
				},
				onCreated: ({ gl }) => {
					gl.toneMapping = 4;
					gl.toneMappingExposure = 1.12;
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageWorld, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vig pointer-events-none absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vig-gore pointer-events-none absolute inset-0",
				style: { ["--vig"]: String(Math.min(.72, gore * .85)) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute top-1/2 left-1/2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 -left-4 h-px w-2.5 bg-blood" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0 left-1.5 h-px w-2.5 bg-blood" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-4 left-0 h-2.5 w-px bg-blood" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 left-0 h-2.5 w-px bg-blood" })
				]
			})
		]
	});
}
//#endregion
export { Stage as default };
