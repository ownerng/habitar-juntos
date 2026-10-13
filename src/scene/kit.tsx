import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { zoneColors, type V3, type Zone } from '../data/typologies'
import { useApp } from '../store/useApp'
import { HomeInterior, Inside } from './interior'

/** distancia vertical entre plantas cuando se "despieza" la maqueta */
export const FLOOR_GAP = 1.15

const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/**
 * Material que reacciona al "foco" de zona: la zona elegida se tiñe con su color
 * y el resto se vuelve fantasma. `glow` = emisivo (ventanas).
 */
export function ZMat({
  zone,
  color,
  glow = false,
  shell = false,
  roughness = 0.85,
  metalness = 0,
}: {
  zone: Zone
  color: string
  glow?: boolean
  /** envolvente (muros, techos, ventanas): se vuelve fantasma al "ver interior" */
  shell?: boolean
  roughness?: number
  metalness?: number
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null!)
  const base = useMemo(() => new THREE.Color(color), [color])
  const tint = useMemo(() => new THREE.Color(zoneColors[zone]), [zone])

  useFrame(({ clock }, dt) => {
    const m = ref.current
    const f = useApp.getState().focus
    const hit = f === zone
    const k = 1 - Math.pow(0.0005, dt)
    m.color.lerp(hit && !glow ? tint : base, k)
    let to = f === null || hit ? 1 : 0.08
    if (shell && useApp.getState().inside) to = Math.min(to, 0.07)
    m.opacity += (to - m.opacity) * k
    const tr = m.opacity < 0.995
    if (m.transparent !== tr) {
      m.transparent = tr
      m.needsUpdate = true
    }
    m.depthWrite = !tr || m.opacity > 0.5
    if (glow) m.emissiveIntensity = 0.9 + Math.sin(clock.elapsedTime * 1.3 + base.r * 10) * 0.12
  })

  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive={glow ? color : '#000000'}
      emissiveIntensity={glow ? 1 : 0}
    />
  )
}

/** Entrada con rebote + desplazamiento vertical del despiece por planta. */
export function Pop({
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  delay = 0,
  floor = 0,
}: {
  children: ReactNode
  position?: V3
  rotation?: V3
  delay?: number
  floor?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const t = useRef(0)

  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.3)
    const g = ref.current
    const p = THREE.MathUtils.clamp((t.current - delay) / 0.8, 0, 1)
    g.scale.setScalar(p <= 0 ? 0.0001 : Math.max(easeOutBack(p), 0.0001))
    const targetY = position[1] + useApp.getState().explode * floor * FLOOR_GAP
    g.position.y += (targetY - g.position.y) * (1 - Math.pow(0.003, dt))
  })

  return (
    <group ref={ref} position={position} rotation={rotation} scale={0.0001}>
      {children}
    </group>
  )
}

/** Techo a dos aguas con frontón del color del muro. */
export function GableRoof({
  w,
  d,
  h,
  color,
  wall,
  zone = 'privado',
  o = 0.16,
}: {
  w: number
  d: number
  h: number
  color: string
  wall: string
  zone?: Zone
  o?: number
}) {
  const half = w / 2 + o
  const len = Math.hypot(half, h)
  const a = Math.atan2(h, half)
  const gable = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-w / 2, 0)
    s.lineTo(w / 2, 0)
    s.lineTo(0, h * 0.98)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false })
    g.translate(0, 0, -d / 2)
    return g
  }, [w, d, h])

  return (
    <group>
      <mesh geometry={gable} castShadow receiveShadow>
        <ZMat shell zone={zone} color={wall} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[(s * half) / 2, h / 2 + 0.03, 0]}
          rotation={[0, 0, s * -a]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[len, 0.09, d + o * 2]} />
          <ZMat shell zone={zone} color={color} roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[0, h + 0.03, 0]} castShadow>
        <boxGeometry args={[0.12, 0.08, d + o * 2 + 0.02]} />
        <ZMat shell zone={zone} color={color} roughness={0.65} />
      </mesh>
    </group>
  )
}

/** Ventanas (emisivas) por ambas fachadas y puerta opcional al frente (+z). */
export function Facade({
  w,
  d,
  h,
  cols,
  zone,
  door,
  winW = 0.3,
  winH = 0.4,
  glass = '#ffd98a',
}: {
  w: number
  d: number
  h: number
  cols: number
  zone: Zone
  door: boolean
  winW?: number
  winH?: number
  glass?: string
}) {
  const items: ReactNode[] = []
  for (const sgn of [1, -1]) {
    for (let i = 0; i < cols; i++) {
      const x = (i - (cols - 1) / 2) * (w / cols)
      if (door && sgn === 1 && Math.abs(x) < winW * 0.9) continue
      const z = sgn * (d / 2)
      items.push(
        <group key={`${sgn}-${i}`} position={[x, h * 0.58, z]}>
          <mesh position={[0, 0, sgn * 0.005]}>
            <boxGeometry args={[winW + 0.07, winH + 0.07, 0.03]} />
            <ZMat shell zone={zone} color="#fdf6e8" />
          </mesh>
          <mesh position={[0, 0, sgn * 0.025]}>
            <boxGeometry args={[winW, winH, 0.03]} />
            <ZMat shell zone={zone} color={glass} glow />
          </mesh>
        </group>,
      )
    }
  }
  if (door) {
    items.push(
      <mesh key="door" position={[0, 0.32, d / 2 + 0.015]}>
        <boxGeometry args={[0.32, 0.64, 0.05]} />
        <ZMat shell zone={zone} color="#6b4a3a" />
      </mesh>,
    )
  }
  return <>{items}</>
}

function Puff({ offset }: { offset: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame(({ clock }) => {
    const p = (clock.elapsedTime * 0.35 + offset) % 1
    ref.current.position.set(Math.sin(p * 5 + offset * 9) * 0.06 + p * 0.1, p * 0.9, 0)
    ref.current.scale.setScalar(0.07 + p * 0.16)
    mat.current.opacity = 0.55 * (1 - p)
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial ref={mat} color="#ffffff" transparent depthWrite={false} />
    </mesh>
  )
}

export function Smoke({ position }: { position: V3 }) {
  return (
    <group position={position}>
      {[0, 0.33, 0.66].map((o) => (
        <Puff key={o} offset={o} />
      ))}
    </group>
  )
}

/** Casa de techo a dos aguas, de una o varias plantas. */
export function House({
  position,
  rotY = 0,
  w = 1.8,
  d = 1.5,
  h = 1,
  roofH = 0.7,
  stories = 1,
  wall = '#f3e3c3',
  roof = '#c4553a',
  zone = 'privado',
  cols = 2,
  delay = 0,
  chimney = false,
  door = true,
  rooms,
}: {
  position: V3
  rotY?: number
  w?: number
  d?: number
  h?: number
  roofH?: number
  stories?: number
  wall?: string
  roof?: string
  zone?: Zone
  cols?: number
  delay?: number
  chimney?: boolean
  door?: boolean
  /** interior por planta; null = sin interior; por defecto, vivienda tipo */
  rooms?: ((story: number) => ReactNode) | null
}) {
  const seed = Math.abs(Math.round(position[0] * 7 + position[2] * 13))
  const parts: ReactNode[] = []
  for (let s = 0; s < stories; s++) {
    parts.push(
      <Pop key={s} position={[0, s * h, 0]} floor={s} delay={delay + s * 0.15}>
        <RoundedBox args={[w, h, d]} radius={0.05} smoothness={3} position={[0, h / 2, 0]} castShadow receiveShadow>
          <ZMat shell zone={zone} color={wall} />
        </RoundedBox>
        <Facade w={w} d={d} h={h} cols={cols} zone={zone} door={door && s === 0} />
        {rooms !== null && (
          <Inside>{rooms ? rooms(s) : <HomeInterior w={w} d={d} story={s} seed={seed + s} />}</Inside>
        )}
      </Pop>,
    )
  }
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {parts}
      <Pop position={[0, stories * h, 0]} floor={stories} delay={delay + stories * 0.15}>
        <GableRoof w={w} d={d} h={roofH} color={roof} wall={wall} zone={zone} />
        {chimney && (
          <>
            <mesh position={[w * 0.28, roofH * 0.62, -d * 0.2]} castShadow>
              <boxGeometry args={[0.2, 0.5, 0.2]} />
              <ZMat zone={zone} color="#8a5a48" />
            </mesh>
            <Smoke position={[w * 0.28, roofH * 0.62 + 0.3, -d * 0.2]} />
          </>
        )}
      </Pop>
    </group>
  )
}

export function Tree({
  position,
  s = 1,
  delay = 0,
  tone = '#4f8a5b',
}: {
  position: V3
  s?: number
  delay?: number
  tone?: string
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + position[0]) * 0.03
  })
  return (
    <Pop position={position} delay={delay}>
      <group ref={ref} scale={s}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.09, 0.6, 6]} />
          <ZMat zone="bioclimatico" color="#7a5a43" />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow>
          <icosahedronGeometry args={[0.46, 0]} />
          <ZMat zone="bioclimatico" color={tone} />
        </mesh>
        <mesh position={[0.16, 1.35, 0.05]} castShadow>
          <icosahedronGeometry args={[0.3, 0]} />
          <ZMat zone="bioclimatico" color={tone} />
        </mesh>
      </group>
    </Pop>
  )
}

export function Pergola({
  position,
  w = 2.4,
  d = 1.2,
  h = 0.95,
  zone = 'comun',
  delay = 0,
  floor = 0,
}: {
  position: V3
  w?: number
  d?: number
  h?: number
  zone?: Zone
  delay?: number
  floor?: number
}) {
  const slats = Math.max(4, Math.round(d / 0.2))
  return (
    <Pop position={position} delay={delay} floor={floor}>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[(sx * w) / 2, h / 2, (sz * d) / 2]} castShadow>
            <boxGeometry args={[0.07, h, 0.07]} />
            <ZMat shell zone={zone} color="#8b6a50" />
          </mesh>
        )),
      )}
      {Array.from({ length: slats }).map((_, i) => (
        <mesh key={i} position={[0, h, -d / 2 + (i * d) / (slats - 1)]} castShadow>
          <boxGeometry args={[w + 0.25, 0.04, 0.08]} />
          <ZMat shell zone={zone} color="#a98363" />
        </mesh>
      ))}
    </Pop>
  )
}

export function Bed({
  position,
  w = 1.2,
  d = 0.7,
  delay = 0,
  floor = 0,
  zone = 'bioclimatico',
}: {
  position: V3
  w?: number
  d?: number
  delay?: number
  floor?: number
  zone?: Zone
}) {
  const nx = Math.round(w / 0.3)
  const nz = Math.round(d / 0.3)
  const dots: ReactNode[] = []
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < nz; j++)
      dots.push(
        <mesh
          key={`${i}-${j}`}
          position={[(i - (nx - 1) / 2) * 0.3, 0.2, (j - (nz - 1) / 2) * 0.3]}
          scale={0.85 + ((i * 7 + j * 3) % 4) * 0.12}
          castShadow
        >
          <icosahedronGeometry args={[0.11, 0]} />
          <ZMat zone={zone} color={(i + j) % 2 ? '#6bbf59' : '#8fd06a'} />
        </mesh>,
      )
  return (
    <Pop position={position} delay={delay} floor={floor}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.16, d]} />
        <ZMat zone={zone} color="#7a5638" />
      </mesh>
      {dots}
    </Pop>
  )
}

export function Balcony({ w, zone = 'privado', color = '#f6efe2' }: { w: number; zone?: Zone; color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.04, 0.22]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.07, 0.44]} />
        <ZMat zone={zone} color={color} />
      </mesh>
      <mesh position={[0, 0.2, 0.42]}>
        <boxGeometry args={[w, 0.24, 0.025]} />
        <ZMat zone={zone} color="#2b3a46" />
      </mesh>
    </group>
  )
}

/** Flechas de aire que cruzan el edificio de fachada a fachada. */
function Arrow({ x, y, phase, z0, z1 }: { x: number; y: number; phase: number; z0: number; z1: number }) {
  const ref = useRef<THREE.Group>(null!)
  const mats = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(({ clock }) => {
    const p = (clock.elapsedTime * 0.3 + phase) % 1
    ref.current.position.z = z0 + (z1 - z0) * p
    const o = Math.sin(Math.PI * p) * 0.95
    mats.current.forEach((m) => (m.opacity = o))
  })
  const reg = (m: THREE.MeshBasicMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m)
  }
  return (
    <group ref={ref} position={[x, y, z0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={10}>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.1, 0.26, 8]} />
        <meshBasicMaterial ref={reg} color="#8cf5b8" transparent depthTest={false} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.32, 6]} />
        <meshBasicMaterial ref={reg} color="#8cf5b8" transparent depthTest={false} />
      </mesh>
    </group>
  )
}

export function Wind({ y, xs, z0 = -3.4, z1 = 3.4 }: { y: number; xs: number[]; z0?: number; z1?: number }) {
  return (
    <>
      {xs.flatMap((x, i) => [0, 0.5].map((o) => <Arrow key={`${i}-${o}`} x={x} y={y + o * 0.2} phase={i * 0.23 + o} z0={z0} z1={z1} />))}
    </>
  )
}

export function Cloud({ y, z, speed, scale = 1, offset = 0 }: { y: number; z: number; speed: number; scale?: number; offset?: number }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const x = ((clock.elapsedTime * speed + offset) % 44) - 22
    ref.current.position.x = x
  })
  return (
    <group ref={ref} position={[0, y, z]} scale={scale}>
      {(
        [
          [0, 0, 0, 1],
          [0.9, -0.1, 0.1, 0.75],
          [-0.9, -0.12, -0.05, 0.7],
          [0.3, 0.35, 0, 0.6],
        ] as const
      ).map(([x, yy, zz, r], i) => (
        <mesh key={i} position={[x, yy, zz]} scale={r}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function Lamp({ position, delay = 0.8 }: { position: V3; delay?: number }) {
  return (
    <Pop position={position} delay={delay}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.8, 6]} />
        <ZMat zone="circulacion" color="#2b3a46" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <ZMat zone="circulacion" color="#ffe3a3" glow />
      </mesh>
    </Pop>
  )
}

export function Bench({ position, rotY = 0, delay = 0.8, zone = 'comun' }: { position: V3; rotY?: number; delay?: number; zone?: Zone }) {
  return (
    <Pop position={position} rotation={[0, rotY, 0]} delay={delay}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.22]} />
        <ZMat zone={zone} color="#a98363" />
      </mesh>
      <mesh position={[0, 0.37, -0.1]} castShadow>
        <boxGeometry args={[0.7, 0.18, 0.04]} />
        <ZMat zone={zone} color="#a98363" />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <boxGeometry args={[0.05, 0.2, 0.2]} />
          <ZMat zone={zone} color="#4a4a4a" />
        </mesh>
      ))}
    </Pop>
  )
}

export function PicnicTable({ position, rotY = 0, delay = 0.8 }: { position: V3; rotY?: number; delay?: number }) {
  return (
    <Pop position={position} rotation={[0, rotY, 0]} delay={delay}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.05, 0.45]} />
        <ZMat zone="comun" color="#b08a66" />
      </mesh>
      {[-0.36, 0.36].map((z) => (
        <mesh key={z} position={[0, 0.17, z * 0.9 + (z > 0 ? 0.1 : -0.1)]} castShadow>
          <boxGeometry args={[0.9, 0.04, 0.14]} />
          <ZMat zone="comun" color="#b08a66" />
        </mesh>
      ))}
    </Pop>
  )
}

export function Flowers({ position, n = 7, delay = 0.9, spread = 0.5 }: { position: V3; n?: number; delay?: number; spread?: number }) {
  const cols = ['#ff7a9c', '#ffd24a', '#ffffff', '#c58bff']
  return (
    <Pop position={position} delay={delay}>
      {Array.from({ length: n }).map((_, i) => {
        const a = i * 2.4
        const r = ((i * 37) % 10) / 10 * spread
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.1, Math.sin(a) * r]}>
            <icosahedronGeometry args={[0.075, 0]} />
            <ZMat zone="bioclimatico" color={cols[i % cols.length]} />
          </mesh>
        )
      })}
    </Pop>
  )
}

export function Fence({ position, length = 2, rotY = 0, delay = 0.8, zone = 'privado' }: { position: V3; length?: number; rotY?: number; delay?: number; zone?: Zone }) {
  const n = Math.max(2, Math.round(length / 0.28))
  return (
    <Pop position={position} rotation={[0, rotY, 0]} delay={delay}>
      {Array.from({ length: n + 1 }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + (i * length) / n, 0.14, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <ZMat zone={zone} color="#f6efe2" />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[length, 0.035, 0.03]} />
        <ZMat zone={zone} color="#f6efe2" />
      </mesh>
    </Pop>
  )
}

const walkerPhase = (x: number, z: number) => (x * 3.1 + z * 1.7) % 6.28

/** Persona que camina de un punto a otro y vuelve. */
export function Person({
  from,
  to,
  speed = 0.12,
  color = '#e0556b',
  delay = 1,
}: {
  from: [number, number]
  to: [number, number]
  speed?: number
  color?: string
  delay?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const ph = walkerPhase(from[0], from[1])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (t < delay) {
      ref.current.visible = false
      return
    }
    ref.current.visible = true
    const u = (t * speed + ph) % 2
    const p = u < 1 ? u : 2 - u
    const x = from[0] + (to[0] - from[0]) * p
    const z = from[1] + (to[1] - from[1]) * p
    ref.current.position.set(x, 0.02 + Math.abs(Math.sin(t * 7 + ph)) * 0.025, z)
    const dir = u < 1 ? 1 : -1
    ref.current.rotation.y = Math.atan2((to[0] - from[0]) * dir, (to[1] - from[1]) * dir)
  })
  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, 0.17, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <ZMat zone="circulacion" color={color} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.055, 10, 10]} />
        <ZMat zone="circulacion" color="#f1c9a5" />
      </mesh>
    </group>
  )
}

/** Auto low-poly que circula por la calle (eje x) y reaparece al otro lado. */
export function Car({ z, speed = 0.8, color = '#d8523f', offset = 0, dir = 1, range = 5.2 }: { z: number; speed?: number; color?: string; offset?: number; dir?: number; range?: number }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const span = range * 2
    const x = ((clock.elapsedTime * speed * dir + offset) % span + span) % span - range
    ref.current.position.set(x, 0.03, z)
  })
  return (
    <group ref={ref} rotation={[0, dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.34, 0.14, 0.7]} />
        <ZMat zone="circulacion" color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.25, -0.03]} castShadow>
        <boxGeometry args={[0.3, 0.12, 0.36]} />
        <ZMat zone="circulacion" color="#bfe0f5" roughness={0.2} metalness={0.3} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * 0.18, 0.06, sz * 0.22]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 10]} />
            <ZMat zone="circulacion" color="#22262b" />
          </mesh>
        )),
      )}
    </group>
  )
}

export function BikeRack({ position, rotY = 0, delay = 0.9 }: { position: V3; rotY?: number; delay?: number }) {
  return (
    <Pop position={position} rotation={[0, rotY, 0]} delay={delay}>
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.1, 0.012, 6, 14]} />
            <ZMat zone="circulacion" color={['#3aa6a0', '#f2b134', '#d8523f', '#6ea8ff'][i]} />
          </mesh>
          <mesh position={[0, 0.1, 0.25]}>
            <torusGeometry args={[0.1, 0.012, 6, 14]} />
            <ZMat zone="circulacion" color={['#3aa6a0', '#f2b134', '#d8523f', '#6ea8ff'][i]} />
          </mesh>
        </group>
      ))}
    </Pop>
  )
}

export function Road({ z, w = 10.6, delay = 0.2 }: { z: number; w?: number; delay?: number }) {
  return (
    <Pop position={[0, 0.03, z]} delay={delay}>
      <mesh receiveShadow>
        <boxGeometry args={[w, 0.05, 1.0]} />
        <ZMat zone="circulacion" color="#4b5058" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-w / 2 + 0.8 + i * ((w - 1.6) / 7), 0.03, 0]}>
          <boxGeometry args={[0.4, 0.01, 0.05]} />
          <ZMat zone="circulacion" color="#f4e9c8" />
        </mesh>
      ))}
    </Pop>
  )
}
