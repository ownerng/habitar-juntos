import { RoundedBox } from '@react-three/drei'
import { Balcony, Bed, BikeRack, Bench, Car, Facade, Fence, Flowers, House, Lamp, Person, Pop, Road, Tree, Wind, ZMat } from './kit'

const H = 1.05
const SW = 2.05 // ancho de cada vivienda
const CW = 1.3 // ancho del núcleo
const D = 2.5
const SX = (SW + CW) / 2 // centro de cada lado

function SolarRoof() {
  const cols = 4
  const rows = 3
  const cells = []
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      cells.push(
        <mesh key={`${i}${j}`} position={[(i - (cols - 1) / 2) * 0.46, 0.055, (j - (rows - 1) / 2) * 0.7]}>
          <boxGeometry args={[0.42, 0.02, 0.66]} />
          <meshStandardMaterial color="#1f3a6b" roughness={0.25} metalness={0.6} emissive="#0e2a66" emissiveIntensity={0.35} />
        </mesh>,
      )
  return (
    <group rotation={[-0.38, 0, 0]} position={[0, 0.32, 0]}>
      <mesh castShadow>
        <boxGeometry args={[SW - 0.1, 0.07, D - 0.3]} />
        <ZMat zone="bioclimatico" color="#cfd6de" />
      </mesh>
      {cells}
    </group>
  )
}

export function Colectiva() {
  return (
    <group>
      {/* Viviendas: 3 plantas, 2 por planta */}
      {[0, 1, 2].map((f) =>
        [-1, 1].map((s) => (
          <Pop key={`${f}${s}`} position={[s * SX, f * H, 0]} floor={f} delay={0.1 + f * 0.15 + (s > 0 ? 0.05 : 0)}>
            <RoundedBox args={[SW, H, D]} radius={0.05} smoothness={3} position={[0, H / 2, 0]} castShadow receiveShadow>
              <ZMat zone="privado" color={s < 0 ? '#f2d6b8' : '#e8c4a8'} />
            </RoundedBox>
            <Facade w={SW} d={D} h={H} cols={3} zone="privado" door={false} winW={0.3} winH={0.44} />
            <group position={[0, 0, D / 2]}>
              <Balcony w={SW - 0.3} />
            </group>
          </Pop>
        )),
      )}

      {/* Núcleo de circulación central */}
      {[0, 1, 2].map((f) => (
        <Pop key={f} position={[0, f * H, 0]} floor={f} delay={0.1 + f * 0.1}>
          <RoundedBox args={[CW, H, D]} radius={0.04} smoothness={3} position={[0, H / 2, 0]} castShadow receiveShadow>
            <ZMat zone="circulacion" color="#e5e9ef" />
          </RoundedBox>
          <mesh position={[0, H * 0.55, D / 2 + 0.01]}>
            <boxGeometry args={[0.4, 0.72, 0.03]} />
            <ZMat zone="circulacion" color="#b8d4f0" glow />
          </mesh>
        </Pop>
      ))}
      <Pop position={[0, 3 * H, 0]} floor={3} delay={0.6}>
        <RoundedBox args={[CW, 0.55, D]} radius={0.04} smoothness={3} position={[0, 0.275, 0]} castShadow>
          <ZMat zone="circulacion" color="#e5e9ef" />
        </RoundedBox>
      </Pop>

      {/* Azotea: cubierta verde (izq.) y paneles solares (der.) */}
      <Pop position={[-SX, 3 * H, 0]} floor={3} delay={0.7}>
        <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
          <boxGeometry args={[SW, 0.14, D]} />
          <ZMat zone="bioclimatico" color="#5fa86a" />
        </mesh>
      </Pop>
      <Bed position={[-SX - 0.5, 3 * H + 0.14, -0.4]} w={0.9} d={0.9} floor={3} delay={0.9} />
      <Bed position={[-SX + 0.55, 3 * H + 0.14, 0.4]} w={0.9} d={0.9} floor={3} delay={0.95} />
      <Pop position={[SX, 3 * H, 0]} floor={3} delay={0.8}>
        <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
          <boxGeometry args={[SW, 0.14, D]} />
          <ZMat zone="bioclimatico" color="#cfd6de" />
        </mesh>
        <SolarRoof />
      </Pop>

      {/* Tanque de lluvia */}
      <Pop position={[3.9, 0, -0.9]} delay={0.9}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 1, 16]} />
          <ZMat zone="bioclimatico" color="#7fb7c9" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <ZMat zone="bioclimatico" color="#5e8fa0" />
        </mesh>
      </Pop>

      {/* Ventilación cruzada */}
      <Wind y={H * 1.5} xs={[-SX, SX]} />

      {/* Calle y acera frente al edificio */}
      <Road z={4.5} />
      <Car z={4.38} speed={0.6} color="#6ea8ff" offset={1} />
      <Car z={4.72} speed={0.5} color="#f2b134" offset={4} dir={-1} />
      <Pop position={[0, 0.02, 3.5]} delay={0.25}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 0.04, 0.8]} />
          <ZMat zone="circulacion" color="#e9dfcf" />
        </mesh>
      </Pop>

      {/* Casas del barrio */}
      <House position={[-5.2, 0, -0.2]} rotY={Math.PI / 2} w={2} d={1.5} stories={2} wall="#f0d6c0" roof="#b5473a" zone="privado" delay={0.4} chimney />
      <House position={[5.4, 0, -2.3]} rotY={-Math.PI / 2} w={1.8} d={1.4} stories={2} wall="#e4e8c4" roof="#6a8a3c" zone="privado" delay={0.5} />
      <House position={[-3.4, 0, -3.5]} w={1.7} d={1.4} wall="#d9e8f0" roof="#3f6e9a" zone="privado" delay={0.6} chimney />
      <House position={[0.2, 0, -4.2]} w={1.7} d={1.4} wall="#f6dca8" roof="#a8442f" zone="privado" delay={0.7} />
      <House position={[3.4, 0, -3.8]} w={1.7} d={1.4} wall="#e7d9f0" roof="#7a5a8c" zone="privado" delay={0.8} chimney />

      {/* Jardín y acceso */}
      <Fence position={[-2.6, 0, 3.0]} length={2.4} zone="privado" />
      <Fence position={[2.6, 0, 3.0]} length={2.4} zone="privado" delay={0.9} />
      <BikeRack position={[-1.1, 0, 2.7]} />
      <Bench position={[1.2, 0, 2.8]} rotY={Math.PI} delay={1} />
      <Flowers position={[-2.8, 0, 2.2]} n={9} delay={1.1} />
      <Flowers position={[2.8, 0, 2.2]} n={9} delay={1.15} />
      {[-3.6, -1.4, 1.4, 3.6].map((x, i) => (
        <Lamp key={x} position={[x, 0, 3.8]} delay={0.9 + i * 0.05} />
      ))}
      <Person from={[-3.5, 3.45]} to={[3.5, 3.45]} color="#e0556b" speed={0.07} />
      <Person from={[0, 2.4]} to={[0, 3.4]} color="#3aa6a0" speed={0.1} />

      {/* Entorno */}
      <Tree position={[-4.6, 0, 2.2]} s={1.1} delay={0.6} />
      <Tree position={[4.5, 0, 2.5]} s={1.05} delay={0.7} tone="#5f9a4a" />
      <Tree position={[-1.8, 0, -3.0]} s={1.1} delay={0.8} tone="#6aa65a" />
      <Tree position={[1.9, 0, -3.1]} s={0.9} delay={0.9} />
      <Tree position={[-5.6, 0, -2.6]} s={1.2} delay={1} />
    </group>
  )
}
