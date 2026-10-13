import { Bed, Bench, Fence, Flowers, House, Lamp, Pergola, Person, PicnicTable, Pop, Tree, ZMat } from './kit'

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

      {/* Segunda hilera de viviendas */}
      <House position={[-5.15, 0, 0.75]} rotY={Math.PI / 2} w={1.7} d={1.4} wall="#d9e8f0" roof="#3f6e9a" zone="privado" delay={0.5} chimney />
      <House position={[5.15, 0, 0.75]} rotY={-Math.PI / 2} w={1.7} d={1.4} wall="#f6dca8" roof="#a8442f" zone="privado" delay={0.55} />
      <House position={[-3.3, 0, 4.2]} w={1.7} d={1.4} wall="#f0d0d0" roof="#8a3f4a" zone="privado" delay={0.6} stories={2} chimney />
      <House position={[3.3, 0, 4.2]} w={1.7} d={1.4} wall="#d6ead0" roof="#5c7f3c" zone="privado" delay={0.65} stories={2} />
      {/* Cercas bajas y flores en cada jardín */}
      <Fence position={[-2.05, 0, 0.75]} length={2.2} rotY={Math.PI / 2} delay={0.9} />
      <Fence position={[2.05, 0, 0.75]} length={2.2} rotY={Math.PI / 2} delay={0.95} />
      <Flowers position={[-2.6, 0, 3.0]} delay={1} />
      <Flowers position={[2.6, 0, 3.0]} delay={1.05} />
      <Flowers position={[-4.3, 0, 3.3]} n={9} delay={1.1} />
      <Flowers position={[4.3, 0, 3.3]} n={9} delay={1.15} />
      <Flowers position={[-1.6, 0, -4.1]} n={9} delay={1.1} spread={0.8} />
      <Flowers position={[1.6, 0, -4.1]} n={9} delay={1.15} spread={0.8} />

      {/* Mobiliario común */}
      <PicnicTable position={[-1.2, 0, -0.3]} rotY={0.3} />
      <PicnicTable position={[1.2, 0, -0.3]} rotY={-0.3} delay={0.9} />
      <Bench position={[-0.9, 0, 0.35]} rotY={Math.PI} delay={1} />
      <Bench position={[0.9, 0, 0.35]} rotY={Math.PI} delay={1.05} />
      {[[-1.6, 0.4], [1.6, 0.4], [-1.6, 1.8], [1.6, 1.8], [-0.4, 4.0], [0.4, 4.0]].map(([x, z], i) => (
        <Lamp key={i} position={[x, 0, z]} delay={0.9 + i * 0.05} />
      ))}

      {/* Vecinos */}
      <Person from={[-2, 0.9]} to={[2, 0.9]} color="#e0556b" speed={0.1} />
      <Person from={[0.1, -0.2]} to={[0.1, 3.9]} color="#3aa6a0" speed={0.08} />
      <Person from={[-1.5, 3.6]} to={[1.5, 3.6]} color="#f2b134" speed={0.07} />
      <Person from={[-4, 2.9]} to={[-2.4, 0.9]} color="#6ea8ff" speed={0.06} />

      {/* Vegetación */}
      <Tree position={[-5.6, 0, -2.6]} s={1.15} delay={0.5} />
      <Tree position={[5.6, 0, -2.6]} s={1.2} delay={0.6} tone="#5f9a4a" />
      <Tree position={[-5.2, 0, 3.4]} s={0.95} delay={0.7} tone="#6aa65a" />
      <Tree position={[5.2, 0, 3.4]} s={1} delay={0.8} />
      <Tree position={[2.6, 0, -5.0]} s={1.1} delay={0.9} tone="#5f9a4a" />
      <Tree position={[-2.6, 0, -5.0]} s={0.9} delay={1} />
      <Tree position={[0, 0, -5.3]} s={1.25} delay={1.05} tone="#6aa65a" />
      <Tree position={[-1.9, 0, 5.3]} s={0.9} delay={1.1} />
      <Tree position={[1.9, 0, 5.3]} s={1} delay={1.15} tone="#5f9a4a" />
    </group>
  )
}
