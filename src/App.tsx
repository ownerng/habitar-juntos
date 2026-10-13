import { lazy, Suspense } from 'react'
import { Hero } from './components/Hero'
import { Hud } from './components/Hud'
import { typologyList } from './data/typologies'
import { useApp } from './store/useApp'

const Scene = lazy(() => import('./scene/Scene').then((m) => ({ default: m.Scene })))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const webgl = hasWebGL()

export default function App() {
  const typology = useApp((s) => s.typology)
  const started = useApp((s) => s.started)
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0b1118]">
      {/* cielos: uno por tipología, con fundido entre ellos */}
      {typologyList.map((t) => (
        <div
          key={t.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: t.id === typology ? 1 : 0,
            background: `linear-gradient(to bottom, ${t.sky[0]} 0%, ${t.sky[0]} 25%, ${t.sky[1]} 100%)`,
          }}
        />
      ))}

      {webgl ? (
        <Suspense fallback={<p className="mono absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.3em] text-white/70">Construyendo…</p>}>
          <div className="absolute inset-0">
            <Scene />
          </div>
        </Suspense>
      ) : (
        <p className="absolute inset-0 grid place-items-center p-8 text-center text-white/80">
          Tu navegador no soporta WebGL, necesario para la maqueta 3D.
        </p>
      )}

      {started ? <Hud /> : <Hero />}
    </div>
  )
}
