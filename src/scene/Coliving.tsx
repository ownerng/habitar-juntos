import { RoundedBox } from '@react-three/drei'
import { Balcony, Bed, Facade, Pergola, Pop, Tree, ZMat } from './kit'

const H = 1.1
const BW = 4.1 // ancho del volumen de habitaciones
const BX = -0.45 // desplazamiento a la izquierda; el núcleo va a la derecha
const D = 2.8

function Strings() {
  // guirnalda de luces en la terraza
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-1.9 + i * 0.47, 0.98 - Math.sin((i / 8) * Math.PI) * 0.12, 1.1]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffe3a3" />
        </mesh>
      ))}
    </>
  )
}

export function Coliving() {
  return (
    <group>
      {/* Planta baja compartida (acristalada) */}
      <Pop position={[BX, 0, 0]} floor={0} delay={0.1}>
        <RoundedBox args={[BW, H, D]} radius={0.05} smoothness={3} position={[0, H / 2, 0]} castShadow receiveShadow>
          <ZMat zone="comun" color="#dfe6ee" />
        </RoundedBox>
        {/* grandes ventanales */}
        {[1, -1].map((s) => (
          <mesh key={s} position={[0, 0.58, s * (D / 2 + 0.01)]}>
            <boxGeometry args={[BW - 0.35, 0.78, 0.03]} />
            <ZMat zone="comun" color="#9fd0ff" glow />
          </mesh>
        ))}
        {/* mullions */}
        {[-1.4, -0.7, 0, 0.7, 1.4].map((x) => (
          <mesh key={x} position={[x, 0.58, D / 2 + 0.03]}>
            <boxGeometry args={[0.04, 0.8, 0.02]} />
            <ZMat zone="comun" color="#fdf6e8" />
          </mesh>
        ))}
      </Pop>

      {/* Habitaciones: plantas 1 y 2 */}
      {[1, 2].map((f) => (
        <Pop key={f} position={[BX, f * H, 0]} floor={f} delay={0.2 + f * 0.15}>
          <RoundedBox args={[BW, H, D]} radius={0.05} smoothness={3} position={[0, H / 2, 0]} castShadow receiveShadow>
            <ZMat zone="privado" color={f === 1 ? '#f4c9a8' : '#efb597'} />
          </RoundedBox>
          <Facade w={BW} d={D} h={H} cols={5} zone="privado" door={false} winW={0.34} winH={0.46} />
          {/* balcones al frente */}
          <group position={[0, 0, D / 2]}>
            {[-1.4, -0.35, 0.7, 1.75].map((x) => (
              <group key={x} position={[x, 0, 0]}>
                <Balcony w={0.7} />
              </group>
            ))}
          </group>
        </Pop>
      ))}

      {/* Núcleo vertical (escalera + ascensor) */}
      {[0, 1, 2].map((f) => (
        <Pop key={f} position={[2.05, f * H, 0]} floor={f} delay={0.15 + f * 0.1}>
          <RoundedBox args={[0.9, H, D]} radius={0.04} smoothness={3} position={[0, H / 2, 0]} castShadow receiveShadow>
            <ZMat zone="circulacion" color="#e4e8ee" />
          </RoundedBox>
          <mesh position={[0, H * 0.55, D / 2 + 0.01]}>
            <boxGeometry args={[0.22, 0.7, 0.03]} />
            <ZMat zone="circulacion" color="#b8d4f0" glow />
          </mesh>
        </Pop>
      ))}
      {/* remate del núcleo */}
      <Pop position={[2.05, 3 * H, 0]} floor={3} delay={0.6}>
        <RoundedBox args={[0.9, 0.5, D]} radius={0.04} smoothness={3} position={[0, 0.25, 0]} castShadow>
          <ZMat zone="circulacion" color="#e4e8ee" />
        </RoundedBox>
      </Pop>

      {/* Terraza común en cubierta */}
      <Pop position={[BX, 3 * H, 0]} floor={3} delay={0.7}>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[BW, 0.12, D]} />
          <ZMat zone="comun" color="#d9cdb8" />
        </mesh>
        <mesh position={[0, 0.3, D / 2 - 0.03]}>
          <boxGeometry args={[BW, 0.36, 0.05]} />
          <ZMat zone="comun" color="#fdf6e8" />
        </mesh>
        <mesh position={[0, 0.3, -D / 2 + 0.03]}>
          <boxGeometry args={[BW, 0.36, 0.05]} />
          <ZMat zone="comun" color="#fdf6e8" />
        </mesh>
      </Pop>
      <Pergola position={[BX - 0.9, 3 * H + 0.12, -0.2]} w={1.8} d={1.2} h={0.9} zone="comun" floor={3} delay={0.9} />
      <Pop position={[BX - 0.9, 3 * H + 0.12, -0.2]} floor={3} delay={1}>
        <Strings />
      </Pop>
      <Bed position={[BX + 1.3, 3 * H + 0.12, 0.3]} w={1.2} d={0.6} floor={3} delay={1} />
      <Bed position={[BX + 1.3, 3 * H + 0.12, -0.7]} w={1.2} d={0.6} floor={3} delay={1.05} />

      {/* Entorno */}
      <Tree position={[-4.6, 0, 1.8]} s={1.1} delay={0.6} />
      <Tree position={[4.4, 0, 2.6]} s={1} delay={0.7} tone="#5f9a4a" />
      <Tree position={[-3.6, 0, -3.3]} s={1.2} delay={0.8} tone="#6aa65a" />
      <Tree position={[3.8, 0, -3.4]} s={0.95} delay={0.9} />
    </group>
  )
}
