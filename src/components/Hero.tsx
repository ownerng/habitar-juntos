import { motion } from 'framer-motion'
import { useApp } from '../store/useApp'

const pillars = [
  {
    n: '01',
    title: 'Lo privado',
    color: '#ffb15c',
    text: 'Espacios que pertenecen a cada vivienda: habitaciones, baño o cocina privada. Dan intimidad, tranquilidad y autonomía.',
  },
  {
    n: '02',
    title: 'Lo compartido',
    color: '#6ea8ff',
    text: 'Espacios que pueden usar varias personas: patios, jardines, zonas comunes, circulaciones o lugares de encuentro.',
  },
  {
    n: '03',
    title: 'La conexión',
    color: '#e8ecf3',
    text: 'La manera de pasar de lo privado a lo común: pasillos, patios, accesos, visuales o espacios intermedios.',
  },
]

export function Hero() {
  const setStarted = useApp((s) => s.setStarted)
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-[#0b1118]/80 text-white backdrop-blur-sm">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-10 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mono text-[11px] uppercase tracking-[0.28em] text-white/70"
        >
          Habitar Juntos
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="display mt-4 text-5xl leading-[0.95] sm:text-7xl"
        >
          La vivienda
          <br />
          que comparte
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg"
        >
          Una manera de habitar en la que la vida privada se relaciona con espacios o experiencias comunes. No significa
          compartir la misma habitación o cocina: lo importante es entender <em>qué comparte cada habitante, cómo lo
          comparte y qué relación establece con los demás</em>.
        </motion.p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
              className="border-t pt-3"
              style={{ borderColor: p.color }}
            >
              <p className="mono text-[11px] tracking-widest" style={{ color: p.color }}>
                {p.n}
              </p>
              <h2 className="display mt-1 text-2xl">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <button onClick={() => setStarted(true)} className="btn">
            Explorar los referentes →
          </button>
          <p className="mt-3 text-xs text-white/55">
            Tres referentes en 3D: Conjunto Alcaraván, Casa Moriyama y Edificio Ventum.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
