import { Bed, House, Pergola, Pop, Tree, ZMat } from './kit'

const homes: { pos: [number, number, number]; rot: number; wall: string; roof: string }[] = [
  { pos: [-3.3, 0, -0.4], rot: Math.PI / 2, wall: '#f4d6b0', roof: '#c4553a' },
  { pos: [-3.3, 0, 1.9], rot: Math.PI / 2, wall: '#cfe0c3', roof: '#d9822b' },
  { pos: [3.3, 0, -0.4], rot: -Math.PI / 2, wall: '#f0b9a0', roof: '#b5473a' },
  { pos: [3.3, 0, 1.9], rot: -Math.PI / 2, wall: '#e7d9f0', roof: '#7a5a8c' },
]

export function Cohousing() {
  return (
    <group>
      {/* Casa común */}
      <House
        position={[0, 0, -2.6]}
        w={3.4}
        d={2}
        h={1.2}
        roofH={0.95}
        cols={4}
        zone="comun"
        wall="#f6e8c8"
        roof="#2f7f84"
        chimney
        delay={0.1}
      />
      <Pergola position={[0, 0, -1.2]} w={2.6} d={1.1} zone="comun" delay={0.5} />
      {/* Taller */}
      <House
        position={[-2.9, 0, -2.9]}
        w={1.2}
        d={1}
        h={0.8}
        roofH={0.5}
        cols={1}
        zone="comun"
        wall="#e6d2b5"
        roof="#2f7f84"
        delay={0.45}
        door={false}
      />

      {/* Viviendas privadas */}
      {homes.map((h, i) => (
        <House
          key={i}
          position={h.pos}
          rotY={h.rot}
          wall={h.wall}
          roof={h.roof}
          zone="privado"
          delay={0.25 + i * 0.12}
          chimney={i % 2 === 0}
        />
      ))}

      {/* Recorridos */}
      <Pop position={[0, 0.03, 0.8]} delay={0.2}>
        <mesh receiveShadow>
          <boxGeometry args={[5.4, 0.05, 0.6]} />
          <ZMat zone="circulacion" color="#e9dfcf" />
        </mesh>
      </Pop>
      <Pop position={[0, 0.03, 0.9]} delay={0.25}>
        <mesh receiveShadow>
          <boxGeometry args={[0.6, 0.05, 4.4]} />
          <ZMat zone="circulacion" color="#e9dfcf" />
        </mesh>
      </Pop>

      {/* Huerto compartido */}
      <Bed position={[-1.05, 0, 1.7]} delay={0.6} />
      <Bed position={[1.05, 0, 1.7]} delay={0.7} />
      <Bed position={[-1.05, 0, 3.0]} delay={0.8} />
      <Bed position={[1.05, 0, 3.0]} delay={0.9} />

      {/* Vegetación */}
      <Tree position={[-5.2, 0, -2]} s={1.15} delay={0.5} />
      <Tree position={[5.2, 0, -2.4]} s={1.2} delay={0.6} tone="#5f9a4a" />
      <Tree position={[-4.6, 0, 3.6]} s={0.95} delay={0.7} tone="#6aa65a" />
      <Tree position={[4.7, 0, 3.8]} s={1} delay={0.8} />
      <Tree position={[2.4, 0, -4.6]} s={1.1} delay={0.9} tone="#5f9a4a" />
      <Tree position={[-2.2, 0, -4.7]} s={0.9} delay={1} />
    </group>
  )
}
