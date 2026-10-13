import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { glossary, quiz } from '../data/learn'
import { typologyList } from '../data/typologies'
import { useApp } from '../store/useApp'

const rows = [
  ['Diseño', 'diseno'],
  ['Estancia', 'estancia'],
  ['Espacio privado', 'privado'],
  ['Gestión', 'gestion'],
] as const

export function Comparator() {
  const current = useApp((s) => s.typology)
  const setTypology = useApp((s) => s.setTypology)
  return (
    <div className="space-y-5">
      {rows.map(([label, key]) => (
        <div key={key}>
          <p className="mono mb-2 text-[11px] uppercase tracking-[0.18em] text-white/50">{label}</p>
          <div className="grid gap-1.5">
            {typologyList.map((t) => (
              <button
                key={t.id}
                onClick={() => setTypology(t.id)}
                className={`flex items-baseline justify-between gap-4 border-l-2 px-3 py-2 text-left transition ${
                  current === t.id ? 'border-white bg-white/10 text-white' : 'border-white/15 text-white/60 hover:text-white'
                }`}
              >
                <span className="display text-sm">{t.name}</span>
                <span className="text-right text-sm">{t.compare[key]}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="mono mb-2 text-[11px] uppercase tracking-[0.18em] text-white/50">Privado / Común</p>
        <div className="grid gap-3">
          {typologyList.map((t) => (
            <div key={t.id}>
              <div className="mb-1 flex justify-between text-xs text-white/70">
                <span>{t.name}</span>
                <span className="mono">
                  {t.privatePct} / {t.commonPct}
                </span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="bg-[#ffb15c]"
                  initial={{ width: 0 }}
                  animate={{ width: `${t.privatePct}%` }}
                  transition={{ duration: 0.8 }}
                />
                <motion.div
                  className="bg-[#6ea8ff]"
                  initial={{ width: 0 }}
                  animate={{ width: `${t.commonPct}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Quiz() {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const done = i >= quiz.length
  const q = quiz[i]

  const reset = () => {
    setI(0)
    setPicked(null)
    setScore(0)
  }

  const pick = (n: number) => {
    if (picked !== null) return
    setPicked(n)
    if (n === q.answer) setScore((s) => s + 1)
  }

  if (done) {
    return (
      <div className="py-6 text-center">
        <p className="display text-7xl">
          {score}
          <span className="text-white/40">/{quiz.length}</span>
        </p>
        <p className="mt-3 text-white/70">
          {score >= 4 ? 'Dominas la vivienda compartida.' : 'Recorre la maqueta otra vez y vuelve a intentarlo.'}
        </p>
        <button onClick={reset} className="btn mt-6">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
        <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/50">
          Pregunta {i + 1} / {quiz.length}
        </p>
        <h3 className="display mt-2 text-xl leading-snug">{q.q}</h3>
        <div className="mt-5 grid gap-2">
          {q.options.map((o, n) => {
            const state =
              picked === null
                ? 'border-white/20 hover:border-white/60'
                : n === q.answer
                  ? 'border-[#6fe3a0] bg-[#6fe3a0]/15'
                  : n === picked
                    ? 'border-[#ff7a7a] bg-[#ff7a7a]/15'
                    : 'border-white/10 text-white/40'
            return (
              <button key={o} onClick={() => pick(n)} className={`border px-4 py-3 text-left text-sm transition ${state}`}>
                {o}
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <>
            <p className="mt-4 text-sm text-white/70">{q.explain}</p>
            <button
              onClick={() => {
                setI(i + 1)
                setPicked(null)
              }}
              className="btn mt-5"
            >
              {i + 1 === quiz.length ? 'Ver resultado' : 'Siguiente'}
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function Glossary() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {glossary.map((g) => (
        <div key={g.term}>
          <button
            onClick={() => setOpen(open === g.term ? null : g.term)}
            aria-expanded={open === g.term}
            className="flex w-full items-center justify-between py-3 text-left"
          >
            <span className="display text-lg">{g.term}</span>
            <span className="mono text-white/40">{open === g.term ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === g.term && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pb-3 text-sm text-white/65"
              >
                {g.def}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
