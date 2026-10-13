import { AnimatePresence, motion } from 'framer-motion'
import { typologies, typologyList, zoneColors, zoneLabels, type Zone } from '../data/typologies'
import { useApp, type Panel } from '../store/useApp'
import { Comparator, Glossary, Quiz } from './Learn'
import { NoteSheet, Pins } from './Pins'

const panels: { id: Exclude<Panel, null>; label: string }[] = [
  { id: 'comparar', label: 'Comparar' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'glosario', label: 'Glosario' },
]

function TopBar() {
  const panel = useApp((s) => s.panel)
  const setPanel = useApp((s) => s.setPanel)
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-5 sm:p-8">
      <p className="mono pointer-events-auto text-[11px] uppercase leading-tight tracking-[0.28em] text-white/80">
        Habitar
        <br />
        Juntos
      </p>
      <nav className="pointer-events-auto flex gap-1">
        {panels.map((p) => (
          <button
            key={p.id}
            onClick={() => setPanel(panel === p.id ? null : p.id)}
            className={`mono px-2 py-1.5 text-[11px] uppercase tracking-[0.14em] transition sm:px-3 sm:tracking-[0.18em] ${
              panel === p.id ? 'bg-white text-slate-900' : 'text-white/75 hover:text-white'
            }`}
          >
            {p.label}
            {panel === p.id ? ' ✕' : ''}
          </button>
        ))}
      </nav>
    </header>
  )
}

function Selector() {
  const current = useApp((s) => s.typology)
  const setTypology = useApp((s) => s.setTypology)
  return (
    <div className="pointer-events-auto absolute left-5 top-24 flex flex-col gap-1 sm:left-8 sm:top-1/3">
      {typologyList.map((t) => (
        <button
          key={t.id}
          onClick={() => setTypology(t.id)}
          className="group flex items-center gap-3 text-left"
          aria-current={current === t.id}
        >
          <span className="mono w-6 text-[11px] text-white/50">{t.num}</span>
          <span
            className={`display text-lg leading-none transition-all sm:text-2xl ${
              current === t.id ? 'text-white' : 'text-white/45 group-hover:text-white/80'
            }`}
          >
            {t.name}
          </span>
          <span
            className={`h-px bg-white transition-all duration-500 ${current === t.id ? 'w-10 opacity-100' : 'w-0 opacity-0'}`}
          />
        </button>
      ))}
    </div>
  )
}

function Intro() {
  const typology = useApp((s) => s.typology)
  const step = useApp((s) => s.step)
  const t = typologies[typology]
  return (
    <AnimatePresence mode="wait">
      {step < 0 && (
        <motion.section
          key={typology}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute bottom-40 left-5 right-5 max-w-sm sm:bottom-10 sm:left-8 sm:right-auto"
        >
          <p className="mono text-[11px] uppercase tracking-[0.22em] text-white/60">{t.tagline}</p>
          <h1 className="display mt-2 text-5xl leading-[0.95] sm:text-7xl">{t.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{t.summary}</p>
          <div className="mt-5 max-w-xs">
            <div className="flex h-1.5 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="bg-[#ffb15c]"
                initial={{ width: 0 }}
                animate={{ width: `${t.privatePct}%` }}
                transition={{ duration: 0.9, delay: 0.2 }}
              />
              <motion.div
                className="bg-[#6ea8ff]"
                initial={{ width: 0 }}
                animate={{ width: `${t.commonPct}%` }}
                transition={{ duration: 0.9, delay: 0.2 }}
              />
            </div>
            <div className="mono mt-1.5 flex justify-between text-[10px] uppercase tracking-widest text-white/60">
              <span>Privado {t.privatePct}%</span>
              <span>Común {t.commonPct}%</span>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

function Tour() {
  const typology = useApp((s) => s.typology)
  const step = useApp((s) => s.step)
  const setStep = useApp((s) => s.setStep)
  const steps = typologies[typology].steps
  const n = steps.length

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 sm:bottom-8">
      {step >= 0 && (
        <p className="mono text-[11px] uppercase tracking-[0.2em] text-white/70">
          {String(step + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} · {steps[step].label}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          className="btn btn-sm"
          onClick={() => setStep(step <= 0 ? -1 : step - 1)}
          disabled={step < 0}
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              aria-label={s.label}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-white' : 'w-3 bg-white/35 hover:bg-white/70'}`}
            />
          ))}
        </div>
        <button
          className="btn btn-sm"
          onClick={() => setStep(step >= n - 1 ? -1 : step + 1)}
          aria-label="Siguiente"
        >
          {step < 0 ? 'Iniciar recorrido →' : step >= n - 1 ? 'Vista general' : '→'}
        </button>
      </div>
    </div>
  )
}

function Tools() {
  const explode = useApp((s) => s.explode)
  const setExplode = useApp((s) => s.setExplode)
  const focus = useApp((s) => s.focus)
  const setFocus = useApp((s) => s.setFocus)
  const step = useApp((s) => s.step)
  return (
    <div className={`pointer-events-auto absolute inset-x-5 bottom-24 ${step >= 0 ? 'max-sm:hidden' : ''} flex items-center gap-4 sm:inset-x-auto sm:bottom-auto sm:right-8 sm:top-1/3 sm:w-48 sm:flex-col sm:items-stretch sm:gap-5`}>
      <label className="block flex-1 sm:flex-none">
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/60">Despiece</span>
        <input
          type="range"
          min={0}
          max={0.65}
          step={0.01}
          value={explode}
          onChange={(e) => setExplode(Number(e.target.value))}
          className="mt-2 w-full accent-white"
        />
      </label>
      <div>
        <span className="mono hidden text-[10px] uppercase tracking-[0.2em] text-white/60 sm:block">Resaltar zona</span>
        <div className="flex gap-3 sm:mt-2 sm:flex-col sm:gap-1">
          {(Object.keys(zoneColors) as Zone[]).map((z) => (
            <button
              key={z}
              onClick={() => setFocus(focus === z ? null : z)}
              aria-pressed={focus === z}
              aria-label={zoneLabels[z]}
              className={`flex items-center gap-2 py-0.5 text-left text-xs transition ${
                focus === z ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/50"
                style={{ background: zoneColors[z], opacity: focus && focus !== z ? 0.3 : 1 }}
              />
              <span className="hidden sm:inline">{zoneLabels[z]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Drawer() {
  const panel = useApp((s) => s.panel)
  const title = panels.find((p) => p.id === panel)?.label
  return (
    <AnimatePresence>
      {panel && (
        <motion.aside
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          className="pointer-events-auto absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col bg-[#0b1118]/97 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 px-6 pb-4 pt-20">
            <h2 className="display text-3xl">{title}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {panel === 'comparar' && <Comparator />}
            {panel === 'quiz' && <Quiz />}
            {panel === 'glosario' && <Glossary />}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export function Hud() {
  return (
    <div className="pointer-events-none absolute inset-0 text-white">
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/45 via-black/10 to-transparent sm:w-[55%]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
      <Pins />
      <TopBar />
      <Selector />
      <Intro />
      <Tools />
      <NoteSheet />
      <Tour />
      <Drawer />
    </div>
  )
}
