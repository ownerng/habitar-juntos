import { typologies, zoneColors, zoneLabels } from '../data/typologies'
import { pinEls } from '../scene/overlay'
import { useApp } from '../store/useApp'

/**
 * Pines y fichas de explicación. Son DOM normal (sin portales): el <Projector>
 * dentro del Canvas mueve cada uno a su posición de pantalla en cada frame.
 */
export function Pins() {
  const typology = useApp((s) => s.typology)
  const step = useApp((s) => s.step)
  const setStep = useApp((s) => s.setStep)
  const t = typologies[typology]

  return (
    <>
      {t.steps.map((s, i) => {
        const active = i === step
        const color = zoneColors[s.zone]
        return (
          <div
            key={`${typology}-${s.id}`}
            ref={(el) => {
              if (el) pinEls.set(s.id, el)
              else pinEls.delete(s.id)
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
            style={{ zIndex: active ? 11 : 10 }}
          >
            <div className="relative">
              <button
                onClick={() => setStep(active ? -1 : i)}
                aria-label={`Paso ${i + 1}: ${s.label}`}
                className="pin pointer-events-auto"
                data-active={active}
                style={{ ['--c' as string]: color }}
              >
                <span className="pin-ring" />
                <span className="pin-n">{i + 1}</span>
              </button>
              {active && (
                <div className="note pointer-events-auto max-sm:hidden" style={{ ['--c' as string]: color }}>
                  <span className="note-line" />
                  <div className="note-card note-body">
                    <NoteBody stepIndex={i} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

function NoteBody({ stepIndex }: { stepIndex: number }) {
  const typology = useApp((s) => s.typology)
  const s = typologies[typology].steps[stepIndex]
  const color = zoneColors[s.zone]
  return (
    <>
      <p className="note-kicker">
        <i style={{ background: color }} /> {zoneLabels[s.zone]} · {s.label}
      </p>
      <h3>{s.concept}</h3>
      <p className="note-text">{s.detail}</p>
      <p className="note-fact">{s.keyFact}</p>
    </>
  )
}

/** En móvil la explicación va como panel inferior en vez de flotar junto al pin. */
export function NoteSheet() {
  const typology = useApp((s) => s.typology)
  const step = useApp((s) => s.step)
  if (step < 0) return null
  const color = zoneColors[typologies[typology].steps[step].zone]
  return (
    <div
      key={`${typology}-${step}`}
      className="note-body sheet pointer-events-auto absolute inset-x-4 bottom-[88px] sm:hidden"
      style={{ ['--c' as string]: color }}
    >
      <NoteBody stepIndex={step} />
    </div>
  )
}
