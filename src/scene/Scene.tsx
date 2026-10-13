import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'
import { typologies } from '../data/typologies'
import { useApp } from '../store/useApp'
import { Cohousing } from './Cohousing'
import { Colectiva } from './Colectiva'
import { Coliving } from './Coliving'
import { Cloud, FLOOR_GAP } from './kit'
import { pinEls } from './overlay'

function Island() {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.07
  })
  return (
    <group ref={ref}>
      {/* césped */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[6.9, 6.9, 0.24, 48]} />
        <meshStandardMaterial color="#86b36e" roughness={1} />
      </mesh>
      {/* borde de tierra */}
      <mesh position={[0, -1.55, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[6.9, 4.2, 2.6, 48]} />
        <meshStandardMaterial color="#8c6a4c" roughness={1} flatShading />
      </mesh>
      <mesh position={[0, -3.3, 0]}>
        <coneGeometry args={[4.2, 2.2, 24]} />
        <meshStandardMaterial color="#6e5239" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

function Sun({ color }: { color: string }) {
  const light = useRef<THREE.DirectionalLight>(null!)
  const orb = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    // el sol recorre un arco de este a oeste y las sombras barren la maqueta
    const a = Math.PI * (0.26 + 0.48 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.12)))
    const x = Math.cos(a) * 15
    const y = Math.sin(a) * 15
    light.current.position.set(x, y, 6)
    orb.current.position.set(x * 1.6, y * 1.4 + 3, -14)
  })
  return (
    <>
      <directionalLight
        ref={light}
        color={color}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-far={50}
      />
      <mesh ref={orb}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  )
}

function CameraRig() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null!)
  const goal = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3(), active: true })
  const typology = useApp((s) => s.typology)
  const step = useApp((s) => s.step)

  useEffect(() => {
    const t = typologies[typology]
    const g = goal.current
    // en vertical (móvil) hay que alejar la cámara para que quepa la maqueta
    const m = window.innerWidth < 640 ? 1.55 : 1
    if (step < 0) {
      const [tx, ty, tz] = t.overview.target
      const [px, py, pz] = t.overview.pos
      g.target.set(tx, ty, tz)
      g.pos.set(tx + (px - tx) * m, ty + (py - ty) * m, tz + (pz - tz) * m)
    } else {
      const s = t.steps[step]
      g.target.set(...s.anchor)
      const k = 1.6 * m // distancia de cámara: el ancla debe quedar rodeada de contexto
      g.pos.set(s.anchor[0] + s.view[0] * k, s.anchor[1] + s.view[1] * k + 1.6, s.anchor[2] + s.view[2] * k)
    }
    g.active = true
  }, [typology, step])

  useFrame(({ camera }, dt) => {
    const c = controls.current
    if (!c) return
    const g = goal.current
    if (g.active) {
      const k = 1 - Math.pow(0.04, dt)
      camera.position.lerp(g.pos, k)
      c.target.lerp(g.target, k)
      if (camera.position.distanceTo(g.pos) < 0.03) g.active = false
    }
    c.autoRotate = useApp.getState().step < 0 && !g.active
    c.update()
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      minDistance={3}
      maxDistance={42}
      maxPolarAngle={Math.PI / 2.05}
      autoRotateSpeed={0.7}
      onStart={() => {
        goal.current.active = false
      }}
    />
  )
}

/** Proyecta cada ancla 3D a pantalla y mueve su pin DOM (sin portales de React). */
function Projector() {
  const v = useRef(new THREE.Vector3())
  useFrame(({ camera, size }) => {
    const { typology, explode } = useApp.getState()
    for (const s of typologies[typology].steps) {
      const el = pinEls.get(s.id)
      if (!el) continue
      v.current.set(s.anchor[0], s.anchor[1] + explode * s.floor * FLOOR_GAP, s.anchor[2]).project(camera)
      const x = (v.current.x * 0.5 + 0.5) * size.width
      const y = (-v.current.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      el.style.opacity = v.current.z > 1 ? '0' : '1'
    }
  })
  return null
}

export function Scene() {
  const typology = useApp((s) => s.typology)
  const t = typologies[typology]

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: t.overview.pos, fov: 34, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.85} />
      <hemisphereLight args={['#cfe2ff', '#8a6a4c', 0.9]} />
      <Sun color={t.sun} />
      {typology !== 'colectiva' && <Stars radius={70} depth={30} count={1800} factor={4} fade speed={0.6} />}

      <Cloud y={9} z={-8} speed={0.35} scale={1.5} offset={4} />
      <Cloud y={11} z={-12} speed={0.22} scale={2} offset={22} />
      <Cloud y={7.5} z={6} speed={0.28} scale={1.1} offset={30} />

      <Island />
      {/* key: al cambiar de tipología se vuelve a montar y se reproduce la animación de construcción */}
      <group key={typology}>
        {typology === 'cohousing' && <Cohousing />}
        {typology === 'coliving' && <Coliving />}
        {typology === 'colectiva' && <Colectiva />}
      </group>
      <Projector />
      <CameraRig />
    </Canvas>
  )
}
