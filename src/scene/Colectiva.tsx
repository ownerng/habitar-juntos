import { RoundedBox } from '@react-three/drei'
import { Balcony, Bed, Facade, Pop, Tree, Wind, ZMat } from './kit'

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

      {/* Entorno */}
      <Tree position={[-4.6, 0, 2.4]} s={1.1} delay={0.6} />
      <Tree position={[4.5, 0, 2.8]} s={1.05} delay={0.7} tone="#5f9a4a" />
      <Tree position={[-4.2, 0, -3]} s={1.2} delay={0.8} tone="#6aa65a" />
      <Tree position={[2.2, 0, 3.7]} s={0.85} delay={0.9} />
    </group>
  )
}
