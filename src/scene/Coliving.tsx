import { RoundedBox } from '@react-three/drei'
import { Balcony, Bed, BikeRack, Bench, Car, Facade, Flowers, House, Lamp, Pergola, Person, Pop, Road, Tree, ZMat } from './kit'

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

      {/* Calle con tráfico y vereda */}
      <Road z={4.4} />
      <Car z={4.28} speed={0.7} color="#d8523f" offset={0} />
      <Car z={4.28} speed={0.55} color="#3aa6a0" offset={6} />
      <Car z={4.62} speed={0.65} color="#f2b134" offset={3} dir={-1} />
      <Pop position={[0, 0.02, 3.4]} delay={0.25}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 0.04, 0.8]} />
          <ZMat zone="circulacion" color="#e9dfcf" />
        </mesh>
      </Pop>

      {/* Edificios vecinos */}
      <House position={[-5.1, 0, -0.4]} rotY={Math.PI / 2} w={2} d={1.6} stories={3} wall="#e8d9c4" roof="#8a5a48" zone="privado" cols={2} delay={0.4} />
      <House position={[5.1, 0, -0.4]} rotY={-Math.PI / 2} w={2} d={1.6} stories={2} wall="#d6e2ea" roof="#4a6a8a" zone="privado" cols={2} delay={0.5} chimney />
      <House position={[-4.2, 0, -3.4]} w={1.6} d={1.4} stories={2} wall="#f0d6c0" roof="#b5473a" zone="privado" delay={0.6} />
      <House position={[3.9, 0, -3.4]} w={1.6} d={1.4} stories={2} wall="#e4e8c4" roof="#6a8a3c" zone="privado" delay={0.7} />

      {/* Planta baja: mobiliario exterior (bar, bicis) */}
      <BikeRack position={[-2.0, 0, 3.0]} />
      <BikeRack position={[-0.9, 0, 3.0]} delay={1} />
      <Bench position={[0.6, 0, 3.05]} rotY={Math.PI} delay={1} />
      <Bench position={[1.6, 0, 3.05]} rotY={Math.PI} delay={1.05} />
      {[-2.6, -0.3, 1.9, 3.6].map((x, i) => (
        <Lamp key={x} position={[x, 0, 3.7]} delay={0.9 + i * 0.05} />
      ))}
      <Flowers position={[-3.1, 0, 2.2]} n={9} delay={1.1} />
      <Flowers position={[3.3, 0, 2.4]} n={9} delay={1.15} />

      {/* Gente */}
      <Person from={[-3.5, 3.4]} to={[3.5, 3.4]} color="#e0556b" speed={0.07} />
      <Person from={[3, 3.45]} to={[-3, 3.45]} color="#3aa6a0" speed={0.05} />
      <Person from={[-1.4, 2.2]} to={[1.4, 2.2]} color="#f2b134" speed={0.08} />

      {/* Entorno */}
      <Tree position={[-4.6, 0, 2.2]} s={1.1} delay={0.6} />
      <Tree position={[4.6, 0, 2.6]} s={1} delay={0.7} tone="#5f9a4a" />
      <Tree position={[-2.4, 0, -3.6]} s={1.2} delay={0.8} tone="#6aa65a" />
      <Tree position={[1.6, 0, -3.8]} s={0.95} delay={0.9} />
      <Tree position={[0, 0, -4.8]} s={1.3} delay={1} tone="#6aa65a" />
      <Tree position={[-5.4, 0, -3]} s={1} delay={1.05} />
    </group>
  )
}
