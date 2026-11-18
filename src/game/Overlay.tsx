import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { input, beginHaul, releaseThrow, startCharge } from "@/game/input";
import { FIGURES } from "@/game/figures";
import { useGame, type Weapon } from "@/game/store";

function statusLine(vitality: number, shut: boolean) {
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
  const Icon = muted ? VolumeX : Volume2;
  return (
    <button
      type="button"
      data-ui
      onClick={toggleMute}
      className="flex min-h-12 min-w-12 items-center justify-center border border-fg/25 text-fg"
      aria-label={muted ? "Unmute" : "Mute"}
    >
      <Icon className="size-5" />
    </button>
  );
}

function WeaponButton({ id, label }: { id: Weapon; label: string }) {
  const weapon = useGame((s) => s.weapon);
  const setWeapon = useGame((s) => s.setWeapon);
  const on = weapon === id;
  return (
    <button
      type="button"
      data-ui
      aria-pressed={on}
      onClick={() => setWeapon(id)}
      className={`min-h-12 flex-1 px-3 font-sans text-base tracking-widest uppercase ${
        on ? "border border-blood text-fg" : "border border-fg/20 text-muted"
      }`}
    >
      {label}
    </button>
  );
}

function ChargeMeter() {
  const [charge, setCharge] = useState(0);
  const [charging, setCharging] = useState(false);
  useEffect(() => {
    let frame = 0;
    let last = -1;
    let was = false;
    const loop = () => {
      if (input.charging !== was) {
        was = input.charging;
        setCharging(was);
      }
      if (Math.abs(input.charge - last) > 0.03 || (input.charge === 0 && last !== 0)) {
        last = input.charge;
        setCharge(last);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!charging) return null;
  return (
    <div className="h-1 w-full bg-fg/15">
      <div className="h-full origin-left bg-blood" style={{ transform: `scaleX(${Math.max(0.04, charge)})` }} />
    </div>
  );
}

function HitFx() {
  const banner = useGame((s) => s.banner);
  const nonce = useGame((s) => s.bannerNonce);
  if (!banner || banner.startsWith("CAME") || banner.startsWith("WIDE")) {
    if (!banner) return null;
    return (
      <p
        key={nonce}
        className="hit-banner pointer-events-none absolute top-[30%] left-1/2 font-sans text-xl tracking-widest text-fg uppercase"
      >
        {banner}
      </p>
    );
  }
  const skull = banner.includes("SKULL");
  return (
    <>
      <div key={`flash-${nonce}`} className="flash pointer-events-none absolute inset-0" />
      {skull ? (
        <div key={`lens-${nonce}`} className="pointer-events-none absolute inset-0">
          <span className="lens lens-a" />
          <span className="lens lens-b" />
          <span className="lens lens-c" />
        </div>
      ) : null}
      <p
        key={nonce}
        className="hit-banner pointer-events-none absolute top-[28%] left-1/2 font-display text-4xl text-blood sm:text-6xl"
      >
        {banner}
      </p>
    </>
  );
}

function ThrowBar() {
  const weapon = useGame((s) => s.weapon);
  const axe = weapon === "axe";
  const rope = weapon === "rope";
  return (
    <div data-ui className="pointer-events-auto absolute right-4 bottom-4 left-4 flex flex-col gap-2 sm:left-auto sm:w-[28rem]">
      <ChargeMeter />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <WeaponButton id="boomerang" label="Boomerang" />
        <WeaponButton id="spear" label="Spear" />
        <WeaponButton id="axe" label="Axe" />
        <WeaponButton id="rope" label="Rope" />
      </div>
      {axe ? (
        <div className="flex gap-2">
          <button
            type="button"
            data-ui
            className="min-h-12 flex-1 border border-fg/25 font-sans text-base tracking-widest text-fg uppercase"
            onClick={() => useGame.getState().setClose(1)}
          >
            Step in
          </button>
          <button
            type="button"
            data-ui
            className="min-h-12 flex-1 border border-fg/25 font-sans text-base tracking-widest text-muted uppercase"
            onClick={() => useGame.getState().setClose(0)}
          >
            Step back
          </button>
        </div>
      ) : null}
      <button
        type="button"
        data-ui
        className="min-h-14 bg-blood font-sans text-lg tracking-widest text-fg uppercase"
        onPointerDown={(event) => {
          event.stopPropagation();
          if (useGame.getState().weapon === "rope") {
            beginHaul();
            return;
          }
          startCharge();
        }}
        onPointerUp={(event) => {
          event.stopPropagation();
          releaseThrow();
        }}
        onPointerCancel={() => releaseThrow()}
        onPointerLeave={() => {
          if (input.charging) releaseThrow();
        }}
      >
        {axe ? "Hold to chop" : rope ? "Haul him up" : "Hold to throw"}
      </button>
      <p className="hidden text-center font-sans text-sm tracking-widest text-muted uppercase sm:block">
        {axe
          ? "W step in · S step back · hold to chop the mouth"
          : rope
            ? "4 the rope · haul him off the gum"
            : "1 boomerang · 2 spear · 3 stone axe · 4 rope"}
      </p>
    </div>
  );
}

function Gate() {
  const phase = useGame((s) => s.phase);
  const enter = useGame((s) => s.enter);
  const leave = useGame((s) => s.leave);
  const back = useGame((s) => s.back);
  const left = phase === "left";
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
      <div className="pointer-events-none absolute top-8 right-8 hidden h-16 w-16 rounded-full bg-fg/10 sm:block" />
      <div className="pointer-events-none absolute right-16 bottom-0 hidden h-2/3 w-3 bg-fg/10 sm:block" />
      <p className="font-sans text-sm tracking-widest text-blood uppercase">18+ · Horror</p>
      <div className="max-w-xl">
        <div className="flex items-center gap-3">
          <img src="/gilburri.png" alt="" className="h-24 w-auto sm:h-28" />
          <p className="font-sans text-xl tracking-[0.18em] text-ochre uppercase sm:text-2xl">Gilburri Games</p>
        </div>
        <h1 className="mt-4">
          <img src="/title.svg" alt="Squatter Splatter" className="w-full max-w-lg" />
        </h1>
        {left ? (
          <p className="mt-6 max-w-md font-display text-xl leading-relaxed text-pretty text-muted">
            Leave it dark. The gum will still be standing when you come back.
          </p>
        ) : (
          <p className="mt-6 max-w-md font-display text-xl leading-relaxed text-pretty text-muted">
            You are the warrior. Three men of the colony, one at a time, ironed to the gum. Boomerang, spear, stone axe, or the rope.
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {left ? (
            <button
              type="button"
              data-ui
              onClick={back}
              className="min-h-12 bg-blood px-6 font-sans text-lg tracking-widest text-fg uppercase"
            >
              Turn back
            </button>
          ) : (
            <>
              <button
                type="button"
                data-ui
                onClick={enter}
                className="min-h-12 bg-blood px-6 font-sans text-lg tracking-widest text-fg uppercase"
              >
                I'm 18 — step in
              </button>
              <button
                type="button"
                data-ui
                onClick={leave}
                className="min-h-12 border border-fg/25 px-6 font-sans text-lg tracking-widest text-muted uppercase"
              >
                Walk away
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-right font-sans text-sm tracking-widest text-muted uppercase">Blood · No mercy</p>
    </div>
  );
}

function ArmCard() {
  const weapon = useGame((s) => s.weapon);
  const setWeapon = useGame((s) => s.setWeapon);
  const begin = useGame((s) => s.begin);
  const name = useGame((s) => FIGURES[s.figure]?.name ?? "");
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end p-4 sm:items-center sm:p-10">
      <section data-ui className="poster-card pointer-events-auto max-h-[86vh] w-full max-w-md overflow-y-auto border border-fg/25 bg-bg p-6">
        <p className="font-sans text-sm tracking-widest text-ochre uppercase">One tree</p>
        <h2 className="mt-2 font-display text-4xl leading-none text-balance text-fg">Choose the weapon.</h2>
        <p className="mt-3 font-display text-lg leading-relaxed text-pretty text-muted">
          {name} is ironed to the gum. Collar and both wrists.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            data-ui
            aria-pressed={weapon === "boomerang"}
            onClick={() => setWeapon("boomerang")}
            className={`border p-4 text-left ${weapon === "boomerang" ? "border-blood" : "border-fg/20"}`}
          >
            <span className="block font-sans text-xl tracking-widest text-fg uppercase">Boomerang</span>
            <span className="mt-1 block font-display text-base leading-snug text-muted">
              Curves out, comes home, opens whatever it crosses.
            </span>
          </button>
          <button
            type="button"
            data-ui
            aria-pressed={weapon === "spear"}
            onClick={() => setWeapon("spear")}
            className={`border p-4 text-left ${weapon === "spear" ? "border-blood" : "border-fg/20"}`}
          >
            <span className="block font-sans text-xl tracking-widest text-fg uppercase">Spear</span>
            <span className="mt-1 block font-display text-base leading-snug text-muted">
              Heavy and straight. Stays in whatever it finds.
            </span>
          </button>
          <button
            type="button"
            data-ui
            aria-pressed={weapon === "axe"}
            onClick={() => setWeapon("axe")}
            className={`border p-4 text-left ${weapon === "axe" ? "border-blood" : "border-fg/20"}`}
          >
            <span className="block font-sans text-xl tracking-widest text-fg uppercase">Stone axe</span>
            <span className="mt-1 block font-display text-base leading-snug text-muted">
              Step in. One chop. Shuts the mouth.
            </span>
          </button>
          <button
            type="button"
            data-ui
            aria-pressed={weapon === "rope"}
            onClick={() => setWeapon("rope")}
            className={`border p-4 text-left ${weapon === "rope" ? "border-blood" : "border-fg/20"}`}
          >
            <span className="block font-sans text-xl tracking-widest text-fg uppercase">The rope</span>
            <span className="mt-1 block font-display text-base leading-snug text-muted">
              Haul him off the gum. Feet leave the ground.
            </span>
          </button>
        </div>
        <button
          type="button"
          data-ui
          onClick={begin}
          className="mt-5 min-h-12 w-full bg-blood font-sans text-lg tracking-widest text-fg uppercase"
        >
          Step up to him
        </button>
      </section>
    </div>
  );
}

function Dossier() {
  const figure = useGame((s) => s.figure);
  const toArm = useGame((s) => s.toArm);
  const man = FIGURES[figure] ?? FIGURES[0];
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-4 sm:items-center">
      <article
        data-ui
        className="poster-card pointer-events-auto flex max-h-[78vh] w-full max-w-lg flex-col overflow-hidden border border-bg/30 bg-fg p-6 text-bg"
      >
        <p className="font-sans text-sm tracking-widest text-blood uppercase">
          {figure + 1} of {FIGURES.length} · On the iron
        </p>
        <h2 className="mt-2 font-display text-4xl leading-none text-balance text-bg sm:text-5xl">{man.name}</h2>
        <p className="mt-2 font-sans text-base tracking-widest text-blood uppercase">
          {man.years} · {man.role}
        </p>
        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto">
          {man.lines.map((line) => (
            <p key={line.slice(0, 24)} className="font-display text-lg leading-relaxed text-pretty">
              {line}
            </p>
          ))}
        </div>
        <img src={man.portrait} alt="" className="mt-4 max-h-44 w-full object-contain" />
        <button
          type="button"
          data-ui
          onClick={toArm}
          className="mt-4 min-h-12 w-full shrink-0 bg-blood font-sans text-lg tracking-widest text-fg uppercase"
        >
          Chain's on. Step up.
        </button>
      </article>
    </div>
  );
}

function DoneCard() {
  const nextMan = useGame((s) => s.next);
  const again = useGame((s) => s.again);
  const hits = useGame((s) => s.hits);
  const figure = useGame((s) => s.figure);
  const strung = useGame((s) => s.strung);
  const name = FIGURES[figure]?.name ?? "";
  const upcoming = FIGURES[(figure + 1) % FIGURES.length]?.name ?? "";
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-4 pb-8">
      <section data-ui className="poster-card pointer-events-auto w-full max-w-sm border border-fg/25 bg-bg p-6">
        <p className="font-sans text-sm tracking-widest text-blood uppercase">{strung ? "The rope held" : "The chain held"}</p>
        <h2 className="mt-2 font-display text-4xl leading-none text-balance text-fg">{name} is done.</h2>
        <p className="mt-3 font-display text-lg text-muted">
          {strung ? "Hauled off the gum." : <><span className="tabular-nums">{hits}</span> throws landed.</>}
        </p>
        <p className="mt-3 font-display text-lg leading-snug text-muted">Up next: {upcoming}.</p>
        <button
          type="button"
          data-ui
          onClick={nextMan}
          className="mt-5 min-h-12 w-full bg-blood font-sans text-lg tracking-widest text-fg uppercase"
        >
          Next on the iron
        </button>
        <button
          type="button"
          data-ui
          onClick={again}
          className="mt-2 min-h-12 w-full border border-fg/25 font-sans text-lg tracking-widest text-muted uppercase"
        >
          Run him again
        </button>
      </section>
    </div>
  );
}

function Hud() {
  const vitality = useGame((s) => s.vitality);
  const hits = useGame((s) => s.hits);
  const phase = useGame((s) => s.phase);
  const shut = useGame((s) => s.shut);
  const name = useGame((s) => FIGURES[s.figure]?.name ?? "");
  return (
    <>
      <div className="pointer-events-none absolute top-4 right-4 left-4 z-10 flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-sm tracking-widest text-blood uppercase">18+ · Squatter Splatter</p>
          <p className="mt-1 font-sans text-lg tracking-widest text-fg uppercase">{name}</p>
          <p className="font-sans text-sm tracking-widest text-muted uppercase">{statusLine(vitality, shut)}</p>
          <div className="mt-2 h-1 w-32 bg-fg/15">
            <div
              className="h-full origin-left bg-blood"
              style={{ transform: `scaleX(${Math.max(0, vitality) / 100})` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-sans text-sm tracking-widest text-muted uppercase tabular-nums">Hits {hits}</p>
          <MuteButton />
        </div>
      </div>
      <HitFx />
      {phase === "play" ? <ThrowBar /> : null}
    </>
  );
}

export function Overlay() {
  const phase = useGame((s) => s.phase);
  if (phase === "gate" || phase === "left") return <Gate />;
  return (
    <>
      <Hud />
      {phase === "scroll" ? <Dossier /> : null}
      {phase === "arm" ? <ArmCard /> : null}
      {phase === "done" ? <DoneCard /> : null}
    </>
  );
}
