import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import type { V3 } from '../data/typologies'
import { useApp } from '../store/useApp'

/**
 * Interiores: se montan solo cuando se activa "Ver interior" (son cientos de mallas)
 * y crecen desde el piso con una animación suave.
 */
export function Inside({ children }: { children: ReactNode }) {
  const inside = useApp((s) => s.inside)
  const [mounted, setMounted] = useState(inside)
  const ref = useRef<THREE.Group>(null)
  const k = useRef(0)

  useEffect(() => {
    if (inside) {
      setMounted(true)
      return
    }
    const t = setTimeout(() => setMounted(false), 1100)
    return () => clearTimeout(t)
  }, [inside])

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const target = useApp.getState().inside ? 1 : 0
    k.current += (target - k.current) * (1 - Math.pow(0.003, dt))
    g.scale.y = Math.max(k.current, 0.0001)
    g.visible = k.current > 0.01
  })

  if (!mounted) return null
  return (
    <group ref={ref} scale={[1, 0.0001, 1]} visible={false}>
      {children}
    </group>
  )
}

function B({
  p,
  s,
  c,
  r = 0.85,
  glow = false,
  rot = 0,
}: {
  p: V3
  s: V3
  c: string
  r?: number
  glow?: boolean
  rot?: number
}) {
  return (
    <mesh position={p} rotation={[0, rot, 0]} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        roughness={r}
        emissive={glow ? c : '#000000'}
        emissiveIntensity={glow ? 0.9 : 0}
      />
    </mesh>
  )
}

type G = { position?: V3; rotY?: number; s?: number }
function Put({ position = [0, 0, 0], rotY = 0, s = 1, children }: G & { children: ReactNode }) {
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={s}>
      {children}
    </group>
  )
}

/* ---------- estructura ---------- */
export function Slab({ w, d, c = '#e9dcc3', y = 0.015 }: { w: number; d: number; c?: string; y?: number }) {
  return <B p={[0, y, 0]} s={[w, 0.03, d]} c={c} r={0.95} />
}

export function Part({ a, b, h = 0.9, c = '#f6f1e6' }: { a: [number, number]; b: [number, number]; h?: number; c?: string }) {
  const dx = b[0] - a[0]
  const dz = b[1] - a[1]
  const len = Math.hypot(dx, dz)
  return <B p={[(a[0] + b[0]) / 2, h / 2, (a[1] + b[1]) / 2]} s={[len, h, 0.035]} c={c} rot={Math.atan2(-dz, dx)} />
}

export function Rug({ position, w = 0.6, d = 0.4, c = '#c0634a' }: { position: [number, number]; w?: number; d?: number; c?: string }) {
  return <B p={[position[0], 0.035, position[1]]} s={[w, 0.012, d]} c={c} r={1} />
}

/* ---------- mobiliario ---------- */
export function BedD({ position, rotY = 0, s = 1, c = '#6ea8ff' }: G & { position: V3; c?: string }) {
  return (
    <Put position={position} rotY={rotY} s={s}>
      <B p={[0, 0.06, 0]} s={[0.5, 0.1, 0.7]} c="#8a6a50" />
      <B p={[0, 0.14, 0.02]} s={[0.46, 0.07, 0.64]} c="#fbf7ee" />
      <B p={[0, 0.17, 0.12]} s={[0.47, 0.05, 0.4]} c={c} />
      <B p={[-0.11, 0.19, -0.24]} s={[0.17, 0.05, 0.11]} c="#ffffff" />
      <B p={[0.11, 0.19, -0.24]} s={[0.17, 0.05, 0.11]} c="#ffffff" />
      <B p={[0, 0.2, -0.355]} s={[0.5, 0.3, 0.04]} c="#8a6a50" />
    </Put>
  )
}

export function Sofa({ position, rotY = 0, s = 1, c = '#4f7fa6', len = 0.6 }: G & { position: V3; c?: string; len?: number }) {
  return (
    <Put position={position} rotY={rotY} s={s}>
      <B p={[0, 0.08, 0]} s={[len, 0.14, 0.26]} c={c} r={0.95} />
      <B p={[0, 0.2, -0.1]} s={[len, 0.17, 0.07]} c={c} r={0.95} />
      <B p={[-len / 2 + 0.035, 0.15, 0]} s={[0.07, 0.15, 0.26]} c={c} r={0.95} />
      <B p={[len / 2 - 0.035, 0.15, 0]} s={[0.07, 0.15, 0.26]} c={c} r={0.95} />
    </Put>
  )
}

export function Chair({ position, rotY = 0, c = '#b08a66' }: G & { position: V3; c?: string }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.1, 0]} s={[0.1, 0.03, 0.1]} c={c} />
      <B p={[0, 0.17, -0.045]} s={[0.1, 0.12, 0.02]} c={c} />
      {[-0.04, 0.04].flatMap((x) => [-0.04, 0.04].map((z) => <B key={`${x}${z}`} p={[x, 0.05, z]} s={[0.015, 0.1, 0.015]} c="#6e5239" />))}
    </Put>
  )
}

export function Table({ position, w = 0.4, d = 0.26, rotY = 0, chairs = 4, c = '#c9a27c' }: G & { position: V3; w?: number; d?: number; chairs?: number; c?: string }) {
  const per = Math.ceil(chairs / 2)
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.2, 0]} s={[w, 0.03, d]} c={c} />
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => <B key={`${sx}${sz}`} p={[(sx * (w - 0.04)) / 2, 0.1, (sz * (d - 0.04)) / 2]} s={[0.025, 0.2, 0.025]} c="#6e5239" />))}
      {Array.from({ length: per }).flatMap((_, i) => {
        const x = per === 1 ? 0 : -w / 2 + 0.1 + (i * (w - 0.2)) / (per - 1)
        return [
          <Chair key={`a${i}`} position={[x, 0, d / 2 + 0.07]} rotY={Math.PI} />,
          <Chair key={`b${i}`} position={[x, 0, -d / 2 - 0.07]} />,
        ]
      })}
    </Put>
  )
}

export function Counter({ position, rotY = 0, len = 0.7, c = '#e9e2d4' }: G & { position: V3; len?: number; c?: string }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.085, 0]} s={[len, 0.17, 0.16]} c={c} />
      <B p={[0, 0.19, 0]} s={[len, 0.03, 0.18]} c="#3a4048" r={0.4} />
      <B p={[-len / 4, 0.215, 0]} s={[0.06, 0.012, 0.06]} c="#111" />
      <B p={[-len / 4 + 0.09, 0.215, 0]} s={[0.06, 0.012, 0.06]} c="#111" />
      <B p={[len / 4, 0.22, 0]} s={[0.08, 0.02, 0.06]} c="#9aa4ae" r={0.3} />
    </Put>
  )
}

export function Fridge({ position, rotY = 0 }: G & { position: V3 }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.17, 0]} s={[0.15, 0.34, 0.15]} c="#f4f6f8" r={0.3} />
      <B p={[0.045, 0.25, 0.077]} s={[0.012, 0.1, 0.01]} c="#9aa4ae" />
    </Put>
  )
}

export function Wardrobe({ position, rotY = 0, w = 0.22 }: G & { position: V3; w?: number }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.2, 0]} s={[w, 0.4, 0.1]} c="#b58f6b" />
      <B p={[0, 0.2, 0.052]} s={[0.012, 0.36, 0.006]} c="#6e5239" />
    </Put>
  )
}

export function TV({ position, rotY = 0 }: G & { position: V3 }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.16, 0]} s={[0.3, 0.17, 0.025]} c="#14181d" r={0.3} />
      <B p={[0, 0.16, 0.014]} s={[0.27, 0.14, 0.004]} c="#4a9bd1" glow />
      <B p={[0, 0.04, 0]} s={[0.34, 0.08, 0.1]} c="#8a6a50" />
    </Put>
  )
}

export function Desk({ position, rotY = 0, w = 0.32, screens = 1 }: G & { position: V3; w?: number; screens?: number }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.18, 0]} s={[w, 0.025, 0.17]} c="#d8c3a5" />
      {[-1, 1].map((s) => (
        <B key={s} p={[(s * (w - 0.03)) / 2, 0.09, 0]} s={[0.02, 0.18, 0.15]} c="#8a6a50" />
      ))}
      {Array.from({ length: screens }).map((_, i) => {
        const x = screens === 1 ? 0 : -w / 4 + (i * w) / 2
        return (
          <group key={i} position={[x, 0, -0.04]}>
            <B p={[0, 0.27, 0]} s={[0.13, 0.09, 0.012]} c="#14181d" r={0.3} />
            <B p={[0, 0.27, 0.008]} s={[0.115, 0.075, 0.004]} c="#8ad0ff" glow />
            <B p={[0, 0.2, 0]} s={[0.02, 0.03, 0.02]} c="#444" />
          </group>
        )
      })}
      <Chair position={[0, 0, 0.17]} rotY={Math.PI} c="#4a5568" />
    </Put>
  )
}

export function Shelf({ position, rotY = 0, w = 0.4, h = 0.42 }: G & { position: V3; w?: number; h?: number }) {
  const books = ['#c0634a', '#4f7fa6', '#e0b84a', '#5fa86a', '#8a5aa6']
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, h / 2, 0]} s={[w, h, 0.08]} c="#a9815f" />
      {[0.1, 0.22, 0.34].map((y, row) =>
        Array.from({ length: Math.floor(w / 0.05) }).map((_, i) => (
          <B key={`${row}-${i}`} p={[-w / 2 + 0.04 + i * 0.05, y, 0.045]} s={[0.035, 0.08, 0.04]} c={books[(i + row * 2) % 5]} />
        )),
      )}
    </Put>
  )
}

export function Toilet({ position, rotY = 0 }: G & { position: V3 }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.06, 0]} s={[0.09, 0.12, 0.13]} c="#ffffff" r={0.3} />
      <B p={[0, 0.17, -0.055]} s={[0.09, 0.12, 0.03]} c="#ffffff" r={0.3} />
    </Put>
  )
}

export function Sink({ position, rotY = 0 }: G & { position: V3 }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.1, 0]} s={[0.14, 0.2, 0.1]} c="#e9e2d4" />
      <B p={[0, 0.205, 0]} s={[0.11, 0.015, 0.08]} c="#ffffff" r={0.3} />
      <B p={[0, 0.27, -0.035]} s={[0.1, 0.1, 0.01]} c="#bfe0f5" r={0.2} />
    </Put>
  )
}

export function Tub({ position, rotY = 0, len = 0.5 }: G & { position: V3; len?: number }) {
  return (
    <Put position={position} rotY={rotY}>
      <B p={[0, 0.07, 0]} s={[0.22, 0.14, len]} c="#ffffff" r={0.3} />
      <B p={[0, 0.145, 0]} s={[0.17, 0.01, len - 0.06]} c="#9fd0ff" r={0.1} />
    </Put>
  )
}

export function Plant({ position, s = 1 }: { position: V3; s?: number }) {
  return (
    <Put position={position} s={s}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.1, 8]} />
        <meshStandardMaterial color="#b5653f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <icosahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#4f9a5b" roughness={0.9} />
      </mesh>
    </Put>
  )
}

export function Stool({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 10]} />
        <meshStandardMaterial color="#c0634a" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  )
}

export function Stairs({ position, rotY = 0, w = 0.4, rise, len = 1.4, n = 8 }: G & { position: V3; w?: number; rise: number; len?: number; n?: number }) {
  return (
    <Put position={position} rotY={rotY}>
      {Array.from({ length: n }).map((_, i) => {
        const hh = ((i + 1) * rise) / n
        return <B key={i} p={[0, hh / 2, -len / 2 + (i + 0.5) * (len / n)]} s={[w, hh, len / n]} c={i % 2 ? '#e6e0d4' : '#d9d2c4'} />
      })}
      <B p={[w / 2 + 0.01, rise * 0.4, 0]} s={[0.015, 0.05, len]} c="#333" />
    </Put>
  )
}

/* ---------- habitaciones completas ---------- */
const blankets = ['#6ea8ff', '#e0556b', '#5fa86a', '#e0b84a', '#8a5aa6', '#3aa6a0']

/** Vivienda unifamiliar tipo (espacio 1.8 x 1.5, frente en +z). */
export function HomeInterior({ w, d, story, seed = 0 }: { w: number; d: number; story: number; seed?: number }) {
  const c1 = blankets[seed % blankets.length]
  const c2 = blankets[(seed + 2) % blankets.length]
  return (
    <group scale={[w / 1.8, 1, d / 1.5]}>
      <Slab w={1.74} d={1.44} c={story === 0 ? '#e8d6b4' : '#dccaa6'} />
      {story === 0 ? (
        <>
          <Part a={[-0.9, -0.05]} b={[-0.2, -0.05]} />
          <Part a={[0.05, -0.05]} b={[0.9, -0.05]} />
          <Part a={[0.25, -0.75]} b={[0.25, -0.05]} />
          {/* estar */}
          <Rug position={[-0.45, 0.4]} w={0.7} d={0.45} c="#c0634a" />
          <Sofa position={[-0.45, 0, 0.55]} rotY={Math.PI} c="#4f7fa6" />
          <TV position={[-0.45, 0.14, 0.0]} />
          <Plant position={[-0.8, 0, 0.65]} />
          {/* cocina-comedor */}
          <Counter position={[0.8, 0, 0.45]} rotY={Math.PI / 2} len={0.7} />
          <Fridge position={[0.8, 0, 0.0]} />
          <Table position={[0.25, 0, 0.45]} w={0.36} d={0.24} chairs={2} rotY={Math.PI / 2} />
          {/* dormitorio */}
          <BedD position={[-0.5, 0, -0.4]} c={c1} />
          <Wardrobe position={[-0.05, 0, -0.68]} />
          {/* baño */}
          <Slab w={0.6} d={0.68} c="#bfe0e6" y={0.03} />
          <Tub position={[0.75, 0, -0.42]} len={0.5} />
          <Toilet position={[0.45, 0, -0.65]} />
          <Sink position={[0.5, 0, -0.2]} rotY={Math.PI / 2} />
        </>
      ) : (
        <>
          <Part a={[0.15, -0.75]} b={[0.15, 0.75]} />
          <Part a={[-0.9, 0.2]} b={[-0.3, 0.2]} h={0.9} />
          <BedD position={[-0.5, 0, -0.35]} c={c1} />
          <Wardrobe position={[-0.05, 0, -0.5]} rotY={Math.PI / 2} />
          <Slab w={0.7} d={0.55} c="#bfe0e6" y={0.03} />
          <Toilet position={[-0.7, 0, 0.55]} rotY={Math.PI} />
          <Sink position={[-0.45, 0, 0.62]} rotY={Math.PI} />
          <BedD position={[0.55, 0, -0.35]} s={0.85} c={c2} />
          <Desk position={[0.55, 0, 0.5]} rotY={Math.PI} w={0.3} />
          <Shelf position={[0.85, 0, 0.1]} rotY={-Math.PI / 2} w={0.3} />
        </>
      )}
    </group>
  )
}

/** Casa común del cohousing: gran comedor, cocina colectiva y rincón de estar. */
export function CommonHall() {
  return (
    <group>
      <Slab w={3.34} d={1.94} c="#e6d3ae" />
      <Rug position={[0, 0.25]} w={2.0} d={0.7} c="#d9a441" />
      <Table position={[0, 0, 0.25]} w={1.6} d={0.3} chairs={8} />
      <Counter position={[-1.0, 0, -0.85]} len={1.3} />
      <Counter position={[0.35, 0, -0.85]} len={0.7} />
      <Fridge position={[0.85, 0, -0.85]} />
      <Fridge position={[1.02, 0, -0.85]} />
      <Table position={[-1.0, 0, -0.45]} w={0.9} d={0.2} chairs={0} c="#e8dcc4" />
      <Stool position={[-1.3, 0, -0.62]} />
      <Stool position={[-1.0, 0, -0.62]} />
      <Stool position={[-0.7, 0, -0.62]} />
      <Sofa position={[1.45, 0, 0.1]} rotY={-Math.PI / 2} len={0.7} c="#c0634a" />
      <Sofa position={[1.1, 0, 0.62]} rotY={Math.PI} len={0.5} c="#4f7fa6" />
      <TV position={[1.65, 0.1, -0.5]} rotY={-Math.PI / 2} />
      <Shelf position={[-1.55, 0, 0.3]} rotY={Math.PI / 2} w={0.7} />
      <Plant position={[-1.5, 0, 0.8]} s={1.4} />
      <Plant position={[1.5, 0, 0.8]} s={1.2} />
      {[['#e0556b', -0.25], ['#e0b84a', -0.1], ['#4f7fa6', 0.05]].map(([c, x], i) => (
        <B key={i} p={[1.0 + (x as number) * 0.4, 0.04, -0.2 + i * 0.05]} s={[0.07, 0.07, 0.07]} c={c as string} />
      ))}
    </group>
  )
}

export function Workshop() {
  return (
    <group>
      <Slab w={1.14} d={0.94} c="#cdbb9b" />
      <Counter position={[0, 0, -0.3]} len={0.9} c="#b58f6b" />
      <Shelf position={[-0.45, 0, 0.1]} rotY={Math.PI / 2} w={0.5} h={0.4} />
      <B p={[0.3, 0.05, 0.25]} s={[0.2, 0.1, 0.12]} c="#c0634a" />
      <B p={[0.0, 0.04, 0.3]} s={[0.15, 0.08, 0.1]} c="#e0b84a" />
    </group>
  )
}

/** Planta baja del coliving: cocina, coworking y estar (espacio local, ancho 4.1 x 2.8). */
export function ColivingGround() {
  return (
    <group>
      <Slab w={4.04} d={2.74} c="#dcd6cc" />
      <Slab w={1.2} d={2.7} c="#b9d3da" y={0.025} />
      {/* cocina colectiva */}
      <Counter position={[-1.5, 0, -1.28]} len={1.0} />
      <Counter position={[-0.9, 0, -1.28]} len={0.4} />
      <Fridge position={[-0.62, 0, -1.28]} />
      <Table position={[-1.45, 0, -0.1]} w={0.9} d={0.26} chairs={0} c="#e8dcc4" />
      {[-1.8, -1.6, -1.4, -1.2].map((x) => (
        <Stool key={x} position={[x, 0, 0.12]} />
      ))}
      <Table position={[-1.45, 0, 0.75]} w={0.8} d={0.26} chairs={6} />
      {/* coworking */}
      <Desk position={[-0.15, 0, -1.0]} w={0.5} screens={2} />
      <Desk position={[0.55, 0, -1.0]} w={0.5} screens={2} />
      <Desk position={[-0.15, 0, 0.0]} w={0.5} rotY={Math.PI} screens={2} />
      <Desk position={[0.55, 0, 0.0]} w={0.5} rotY={Math.PI} screens={2} />
      <Table position={[0.2, 0, 1.0]} w={0.8} d={0.3} chairs={6} c="#e8dcc4" />
      <Shelf position={[0.2, 0, -1.34]} w={0.9} />
      {/* estar */}
      <Rug position={[1.5, 0.1]} w={0.9} d={1.2} c="#8a5aa6" />
      <Sofa position={[1.62, 0, 0.35]} rotY={-Math.PI / 2} len={0.8} c="#e0556b" />
      <Sofa position={[1.1, 0, 0.0]} rotY={Math.PI / 2} len={0.5} c="#3aa6a0" />
      <TV position={[1.0, 0.0, 1.3]} rotY={Math.PI} />
      <Plant position={[1.7, 0, -1.1]} s={1.5} />
      <Plant position={[-1.9, 0, 1.2]} s={1.3} />
    </group>
  )
}

function CompactUnit({ position, rotY = 0, tone }: { position: V3; rotY?: number; tone: number }) {
  return (
    <Put position={position} rotY={rotY}>
      <Slab w={0.98} d={1.18} c="#e9dcc3" />
      <Part a={[0.5, -0.6]} b={[0.5, 0.6]} />
      <Part a={[-0.5, -0.6]} b={[-0.12, -0.6]} />
      <Part a={[0.1, -0.6]} b={[0.5, -0.6]} />
      {/* baño */}
      <Slab w={0.38} d={0.4} c="#bfe0e6" y={0.03} />
      <Part a={[0.12, -0.6]} b={[0.12, -0.2]} h={0.45} />
      <Part a={[0.12, -0.2]} b={[0.5, -0.2]} h={0.45} />
      <Toilet position={[0.3, 0, -0.5]} />
      <Sink position={[0.43, 0, -0.34]} rotY={-Math.PI / 2} />
      <BedD position={[-0.2, 0, 0.22]} rotY={Math.PI} s={0.82} c={blankets[tone % blankets.length]} />
      <Desk position={[0.28, 0, 0.45]} rotY={Math.PI} w={0.3} />
      <Wardrobe position={[-0.37, 0, -0.52]} w={0.2} />
    </Put>
  )
}

/** Plantas de habitaciones del coliving: pasillo central y 4 + 4 unidades compactas. */
export function ColivingFloor({ floor }: { floor: number }) {
  const xs = [-1.54, -0.51, 0.51, 1.54]
  return (
    <group>
      <Slab w={4.04} d={0.36} c="#c3ccd8" y={0.02} />
      {xs.map((x, i) => (
        <CompactUnit key={`f${x}`} position={[x, 0, 0.79]} tone={i + floor * 2} />
      ))}
      {xs.map((x, i) => (
        <CompactUnit key={`b${x}`} position={[x, 0, -0.79]} rotY={Math.PI} tone={i + 3 + floor} />
      ))}
    </group>
  )
}

/** Núcleo con escalera y ascensor (circulación vertical). */
export function CoreInterior({ rise, w = 0.9, d = 2.8 }: { rise: number; w?: number; d?: number }) {
  return (
    <group>
      <Slab w={w - 0.04} d={d - 0.04} c="#cfd6df" />
      <Stairs position={[-w * 0.18, 0, -d * 0.18]} w={w * 0.4} rise={rise} len={d * 0.55} n={9} />
      <B p={[w * 0.2, rise * 0.48, d * 0.3]} s={[w * 0.4, rise * 0.96, d * 0.3]} c="#6a7683" r={0.3} />
      <B p={[w * 0.2, rise * 0.45, d * 0.3 + d * 0.152]} s={[w * 0.3, rise * 0.8, 0.01]} c="#9fd0ff" glow />
    </group>
  )
}

/** Vivienda tipo de la vivienda colectiva (espacio local 2.05 x 2.5, frente en +z). */
export function ApartmentInterior({ mirror = false, seed = 0 }: { mirror?: boolean; seed?: number }) {
  const c1 = blankets[seed % blankets.length]
  return (
    <group scale={[mirror ? -1 : 1, 1, 1]}>
      <Slab w={2.0} d={2.44} c="#e8d6b4" />
      {/* divisiones día / noche */}
      <Part a={[-1.02, 0.15]} b={[-0.25, 0.15]} />
      <Part a={[0.1, 0.15]} b={[1.02, 0.15]} />
      <Part a={[0.2, -1.22]} b={[0.2, -0.65]} />
      <Part a={[0.2, -0.25]} b={[0.2, 0.15]} />
      <Part a={[0.2, -0.55]} b={[0.65, -0.55]} h={0.9} />
      {/* estar */}
      <Rug position={[-0.5, 0.65]} w={0.9} d={0.6} c="#c0634a" />
      <Sofa position={[-0.5, 0, 0.9]} rotY={Math.PI} len={0.75} c="#4f7fa6" />
      <TV position={[-0.5, 0.14, 0.2]} />
      <Plant position={[-0.92, 0, 1.1]} s={1.3} />
      {/* cocina y comedor */}
      <Counter position={[0.97, 0, 0.8]} rotY={Math.PI / 2} len={0.9} />
      <Fridge position={[0.95, 0, 0.28]} />
      <Table position={[0.35, 0, 0.8]} w={0.5} d={0.26} chairs={4} rotY={Math.PI / 2} />
      {/* dormitorio principal */}
      <BedD position={[-0.55, 0, -0.75]} s={1.15} c={c1} />
      <Wardrobe position={[-0.95, 0, -0.2]} rotY={Math.PI / 2} w={0.4} />
      <B p={[-0.15, 0.06, -1.05]} s={[0.1, 0.12, 0.1]} c="#a9815f" />
      {/* baño */}
      <Slab w={0.75} d={0.65} c="#bfe0e6" y={0.03} />
      <Tub position={[0.62, 0, -1.0]} rotY={Math.PI / 2} len={0.5} />
      <Toilet position={[0.9, 0, -0.75]} rotY={-Math.PI / 2} />
      <Sink position={[0.4, 0, -0.7]} />
      {/* estudio / cuarto 2 */}
      <Desk position={[0.62, 0, -0.45]} rotY={0} w={0.4} screens={1} />
      <Shelf position={[1.0, 0, -0.1]} rotY={-Math.PI / 2} w={0.35} />
    </group>
  )
}
