import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { useApp } from '../store/useApp'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" {...stroke}>
    {children}
  </svg>
)

const icons = {
  privado: (
    <Icon>
      <path d="M5 15 16 6l11 9" />
      <path d="M8 13v13h16V13" />
      <rect x="13.5" y="18" width="5" height="8" />
    </Icon>
  ),
  compartido: (
    <Icon>
      <circle cx="11" cy="12" r="3.5" />
      <circle cx="22" cy="12" r="3.5" />
      <path d="M4 25c0-4 3-6.5 7-6.5s7 2.5 7 6.5M15 25c0-4 3-6.5 7-6.5s6 2.5 6 6.5" />
    </Icon>
  ),
  conexion: (
    <Icon>
      <rect x="3" y="11" width="8" height="10" />
      <rect x="21" y="11" width="8" height="10" />
      <path d="M11 16h10M18 13l3 3-3 3" />
    </Icon>
  ),
  organizacion: (
    <Icon>
      <rect x="4" y="4" width="10" height="10" />
      <rect x="18" y="4" width="10" height="10" />
      <rect x="4" y="18" width="10" height="10" />
      <rect x="18" y="18" width="10" height="10" />
    </Icon>
  ),
  recorridos: (
    <Icon>
      <path d="M5 26c0-8 8-4 10-10s9-2 12-10" />
      <circle cx="5" cy="26" r="2" />
      <circle cx="27" cy="6" r="2" />
    </Icon>
  ),
  visual: (
    <Icon>
      <path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16Z" />
      <circle cx="16" cy="16" r="4" />
    </Icon>
  ),
  comunidad: (
    <Icon>
      <path d="M4 26h24M7 26v-6l9-7 9 7v6" />
      <circle cx="16" cy="22" r="2" />
      <path d="M16 8V4M12 6l4-2 4 2" />
    </Icon>
  ),
  privacidad: (
    <Icon>
      <rect x="7" y="14" width="18" height="13" />
      <path d="M11 14v-3a5 5 0 0 1 10 0v3" />
      <circle cx="16" cy="20.5" r="1.5" />
    </Icon>
  ),
}

interface Item {
  icon: keyof typeof icons
  color: string
  title: string
  text: string
}

const elementos: Item[] = [
  { icon: 'privado', color: '#ffb15c', title: 'Lo privado', text: 'Espacios que pertenecen a cada vivienda, como las habitaciones, el baño o la cocina privada. Permiten tener intimidad, tranquilidad y autonomía.' },
  { icon: 'compartido', color: '#6ea8ff', title: 'Lo compartido', text: 'Espacios que pueden utilizar varias personas, como patios, jardines, zonas comunes, circulaciones o lugares de encuentro.' },
  { icon: 'conexion', color: '#e8ecf3', title: 'La conexión', text: 'La manera en que las personas pasan de lo privado a lo común: pasillos, patios, accesos, visuales o espacios intermedios.' },
]

const decisiones: Item[] = [
  { icon: 'organizacion', color: '#ffb15c', title: 'Organización', text: '¿Las viviendas se agrupan alrededor de un patio, se distribuyen en torres o se separan en pequeños volúmenes?' },
  { icon: 'recorridos', color: '#e8ecf3', title: 'Recorridos', text: '¿Cómo entra una persona, llega a su vivienda y se desplaza por los espacios comunes?' },
  { icon: 'visual', color: '#6ea8ff', title: 'Relación visual', text: '¿Las personas pueden verse desde sus viviendas, balcones, ventanas o patios, o están aisladas?' },
  { icon: 'comunidad', color: '#6fe3a0', title: 'Comunidad', text: '¿Existen lugares para encontrarse, conversar, jugar o realizar actividades juntos?' },
  { icon: 'privacidad', color: '#ff9db1', title: 'Privacidad', text: '¿Es posible compartir sin perder la intimidad? ¿Hay una transición clara entre lo privado y lo común?' },
]

function Cards({ items, cols }: { items: Item[]; cols: string }) {
  return (
    <div className={`mt-8 grid gap-6 ${cols}`}>
      {items.map((p, i) => (
        <motion.div
          key={p.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
          className="border-t pt-3"
          style={{ borderColor: p.color }}
        >
          <div style={{ color: p.color }}>{icons[p.icon]}</div>
          <h3 className="display mt-2 text-xl">{p.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/70">{p.text}</p>
        </motion.div>
      ))}
    </div>
  )
}

const slides = [
  {
    kicker: '01 · Introducción',
    title: '¿Qué es la vivienda que comparte?',
    body: (
      <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-white/85 sm:text-lg">
        <p>
          Imagina que varias personas viven en un mismo conjunto residencial. Cada una tiene su espacio privado para
          dormir, cocinar, descansar y realizar sus actividades personales, pero también existen espacios, recorridos o
          áreas que conectan sus viviendas.
        </p>
        <p>
          No significa que todas las personas compartan la misma habitación o cocina. Lo importante es entender{' '}
          <em>qué comparte cada habitante, cómo lo comparte y qué relación establece con los demás</em>.
        </p>
      </div>
    ),
  },
  {
    kicker: '02 · Los tres elementos fundamentales',
    title: 'Privado, compartido y conexión',
    body: <Cards items={elementos} cols="sm:grid-cols-3" />,
  },
  {
    kicker: '03 · Desde la arquitectura',
    title: '¿Cómo se desarrolla la vivienda que comparte?',
    body: (
      <>
        <p className="mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
          Para comprenderla hay que observar cinco decisiones de diseño. Una vivienda puede tener zonas comunes y aun así no
          fomentar convivencia: importa cómo están diseñadas.
        </p>
        <Cards items={decisiones} cols="grid-cols-2 sm:grid-cols-5" />
      </>
    ),
  },
]

export function Hero() {
  const setStarted = useApp((s) => s.setStarted)
  const [i, setI] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const last = i === slides.length - 1
  const s = slides[i]

  // el texto desaparece, luego se quita el blur y recién entonces aparece el HUD
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setStarted(true), 1900)
    return () => clearTimeout(t)
  }, [leaving, setStarted])

  return (
    <div className="absolute inset-0 z-40 text-white">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(11,17,24,0)' }}
        animate={
          leaving
            ? { backdropFilter: 'blur(0px)', backgroundColor: 'rgba(11,17,24,0)' }
            : { backdropFilter: 'blur(14px)', backgroundColor: 'rgba(11,17,24,0.68)' }
        }
        transition={leaving ? { delay: 0.55, duration: 1.2, ease: 'easeInOut' } : { duration: 1.2 }}
      >
        {/* manchas de color en movimiento */}
        {[
          ['#ffb15c', '-10%', '10%', 22],
          ['#6ea8ff', '60%', '-5%', 26],
          ['#6fe3a0', '30%', '60%', 30],
        ].map(([c, x, y, d], n) => (
          <motion.div
            key={n}
            className="absolute h-[45vmax] w-[45vmax] rounded-full opacity-25 blur-3xl"
            style={{ background: c as string, left: x as string, top: y as string }}
            animate={{ x: [0, 90, -60, 0], y: [0, -70, 80, 0], scale: [1, 1.2, 0.9, 1] }}
            transition={{ duration: d as number, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
          <AnimatePresence mode="wait">
            {!leaving && (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                transition={{ duration: 0.5 }}
              >
                <p className="mono text-[11px] uppercase tracking-[0.28em] text-white/65">{s.kicker}</p>
                <h1 className="display mt-3 text-4xl leading-[1] sm:text-6xl">{s.title}</h1>
                {s.body}
                <div className="mt-10 flex items-center gap-4">
                  {i > 0 && (
                    <button className="btn btn-sm" onClick={() => setI(i - 1)} aria-label="Anterior">
                      ←
                    </button>
                  )}
                  <button className="btn" onClick={() => (last ? setLeaving(true) : setI(i + 1))}>
                    {last ? 'Explorar los referentes →' : 'Siguiente →'}
                  </button>
                  <div className="flex gap-1.5">
                    {slides.map((_, n) => (
                      <span key={n} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-8 bg-white' : 'w-3 bg-white/35'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
