import * as THREE from "three";

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export function makeBark() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = "#d2c0a0";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 90; i++) {
      ctx.strokeStyle = `rgba(70, 52, 32, ${0.15 + Math.random() * 0.45})`;
      ctx.lineWidth = 1 + Math.random() * 3;
      ctx.beginPath();
      const x = Math.random() * size;
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + 20, size * 0.3, x - 24, size * 0.6, x + 8, size);
      ctx.stroke();
    }
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = `rgba(92, 78, 64, ${0.18 + Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * size,
        Math.random() * size,
        18 + Math.random() * 40,
        8 + Math.random() * 16,
        Math.random(),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = `rgba(230, 214, 186, ${0.12 + Math.random() * 0.2})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 8 + Math.random() * 20, 40 + Math.random() * 90);
    }
  });
  texture.repeat.set(1.6, 4.2);
  return texture;
}

export function makeGround() {
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

export function makeBlood() {
  return canvasTexture((ctx, size) => {
    ctx.clearRect(0, 0, size, size);
    const rad = ctx.createRadialGradient(size / 2, size / 2, 8, size / 2, size / 2, size * 0.46);
    rad.addColorStop(0, "rgba(110, 8, 10, 0.95)");
    rad.addColorStop(0.35, "rgba(130, 16, 14, 0.72)");
    rad.addColorStop(0.68, "rgba(80, 4, 6, 0.28)");
    rad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(120, 10, 12, 0.65)";
    for (let i = 0; i < 9; i++) {
      const ang = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
      ctx.lineWidth = 3 + Math.random() * 6;
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.lineTo(size / 2 + Math.cos(ang) * size * 0.48, size / 2 + Math.sin(ang) * size * 0.48);
      ctx.stroke();
    }
  }, 256);
}
