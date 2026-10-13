export type TypologyId = 'cohousing' | 'coliving' | 'colectiva'
export type Zone = 'privado' | 'comun' | 'circulacion' | 'bioclimatico'
export type V3 = [number, number, number]

export interface Step {
  id: string
  label: string
  zone: Zone
  /** planta a la que pertenece el ancla (para seguir el despiece) */
  floor: number
  anchor: V3
  /** offset de la cámara respecto al ancla */
  view: V3
  concept: string
  detail: string
  keyFact: string
  /** abre el corte interior (paredes y techos en transparencia) */
  inside?: boolean
}

export interface Typology {
  id: TypologyId
  num: string
  name: string
  tagline: string
  summary: string
  /** secuencia conceptual entre los referentes */
  sequence: [string, string, string]
  /** pregunta que guía el referente */
  question: string
  overview: { pos: V3; target: V3 }
  /** degradado del cielo [arriba, horizonte] y color del sol */
  sky: [string, string]
  sun: string
  steps: Step[]
  compare: {
    idea: string
    pregunta: string
    secuencia: string
    positivo: string
    tension: string
  }
}

export const zoneColors: Record<Zone, string> = {
  privado: '#ffb15c',
  comun: '#6ea8ff',
  circulacion: '#e8ecf3',
  bioclimatico: '#6fe3a0',
}

export const zoneLabels: Record<Zone, string> = {
  privado: 'Privado',
  comun: 'Común',
  circulacion: 'Circulación',
  bioclimatico: 'Bioclimático',
}

export const typologies: Record<TypologyId, Typology> = {
  // Conjunto Alcaraván: concentración (maqueta de bloque modular con núcleo central)
  colectiva: {
    id: 'colectiva',
    num: '01',
    name: 'Alcaraván',
    tagline: 'Conjunto Alcaraván · Concentrar',
    summary:
      'Las viviendas se organizan dentro de un conjunto residencial y las zonas comunes adquieren importancia. Aunque cada familia tiene su propio apartamento, comparte espacios y pertenece a una comunidad: una «ciudad dentro de ciudad».',
    sequence: ['Núcleo', 'Zonas comunes', 'Unión'],
    question: '¿Dónde se reúnen las personas?',
    overview: { pos: [10.5, 7.5, 12.5], target: [0, 1.4, 0] },
    sky: ['#0f3a5c', '#a9dcd6'],
    sun: '#fff3c8',
    steps: [
      {
        id: 'vc-nucleo',
        label: 'Núcleo',
        zone: 'circulacion',
        floor: 1,
        anchor: [0, 1.7, 1.3],
        view: [3.2, 1.6, 5.2],
        concept: 'Concentrar las actividades en un núcleo',
        detail:
          'El núcleo reúne en una zona determinada las actividades y espacios comunes, y desde él se organizan las viviendas. Es el punto de partida de la secuencia: núcleo → zonas comunes → unión.',
        keyFact: 'Pregunta guía: ¿dónde se reúnen las personas?',
      },
      {
        id: 'vc-viento',
        label: 'Modulación',
        zone: 'privado',
        floor: 1,
        anchor: [1.7, 1.7, 0],
        view: [7, 2.4, 3.2],
        concept: 'Repetir una unidad para ordenar el conjunto',
        detail:
          'La modulación repite elementos o unidades siguiendo una regla. Aquí, la misma vivienda se multiplica por plantas y a ambos lados del núcleo. Es una operación que comparten los tres referentes.',
        keyFact: 'La repetición permite construir un conjunto ordenado.',
      },
      {
        id: 'vc-azotea',
        label: 'Zonas comunes',
        zone: 'comun',
        floor: 3,
        anchor: [0, 3.6, 0],
        view: [5.4, 4.2, 6.2],
        concept: 'Espacios que pueden usar varios residentes',
        detail:
          'Las zonas comunes reúnen los espacios compartidos y concentran las actividades colectivas, lo que facilita organizarlos. El reto es que no queden desconectados de la vida cotidiana.',
        keyFact: 'Tener zonas comunes no garantiza que las personas se relacionen.',
      },
      {
        id: 'vc-tipo',
        label: 'Tensión: vacíos entre torres',
        zone: 'circulacion',
        floor: 0,
        anchor: [-1.7, 0.7, 1.3],
        view: [-4.4, 1.8, 5],
        concept: 'Cuando las torres se separan, aparecen vacíos',
        detail:
          'Las torres separadas generan vacíos que pueden limitar la comunidad. Importan la distancia entre las viviendas, la continuidad de los recorridos y la facilidad para encontrarse.',
        keyFact: 'Los vacíos suman en Moriyama, pero restan en Alcaraván.',
      },
      {
        id: 'vc-interior',
        label: 'Dentro de una vivienda',
        zone: 'privado',
        floor: 1,
        anchor: [-1.7, 1.6, 0],
        view: [0.4, 1.0, 1.7],
        inside: true,
        concept: 'Lo privado dentro del conjunto',
        detail:
          'Cada familia tiene su propio apartamento: habitaciones, baño y cocina privada que dan intimidad, tranquilidad y autonomía. Desde aquí se sale hacia el núcleo y las zonas comunes.',
        keyFact: 'Privado, compartido y conexión: los tres elementos de la vivienda que comparte.',
      },
    ],
    compare: {
      idea: 'Concentración',
      pregunta: '¿Dónde se reúnen las personas?',
      secuencia: 'Núcleo → zonas comunes → unión',
      positivo: 'Organiza las viviendas y concentra las zonas comunes; la repetición ordena el conjunto.',
      tension: 'Las torres separadas generan vacíos que pueden limitar la comunidad.',
    },
  },

  // Casa Moriyama: fragmentación y porosidad (maqueta de volúmenes separados)
  cohousing: {
    id: 'cohousing',
    num: '02',
    name: 'Casa Moriyama',
    tagline: 'Tokio, Japón · Separar y conectar',
    summary:
      'En lugar de reunir todo en un único edificio compacto, el proyecto se divide en varios volúmenes separados. Los espacios vacíos entre las piezas adquieren importancia: conectan interior y exterior y generan recorridos y visuales.',
    sequence: ['Fragmentación', 'Vacíos', 'Comunidad'],
    question: '¿Qué sucede entre las viviendas?',
    overview: { pos: [12.5, 9.5, 15], target: [0, 0.4, 0] },
    sky: ['#1b3a44', '#f0b27a'],
    sun: '#ffd9a0',
    steps: [
      {
        id: 'co-casa',
        label: 'Fragmentación',
        zone: 'comun',
        floor: 0,
        anchor: [0, 1.1, -2.6],
        view: [3.2, 1.6, 5.2],
        concept: 'Dividir una construcción grande en piezas pequeñas',
        detail:
          'La composición se divide en varios volúmenes separados, como partir un edificio compacto en piezas más pequeñas. Es el primer paso de la secuencia: fragmentación → vacíos → comunidad.',
        keyFact: 'Fragmentar es lo opuesto a concentrar, como en Alcaraván.',
      },
      {
        id: 'co-privada',
        label: 'Modulación y privacidad',
        zone: 'privado',
        floor: 0,
        anchor: [3.3, 1.0, -0.4],
        view: [-5.2, 1.8, 3.2],
        concept: 'Cada pieza, una unidad con su grado de privacidad',
        detail:
          'Los volúmenes se organizan con unidades y reglas de repetición. Al estar separados permiten estudiar distintos grados de privacidad: ¿se puede compartir sin perder la intimidad?',
        keyFact: 'La modulación es una operación que comparten los tres referentes.',
      },
      {
        id: 'co-huerto',
        label: 'Vacíos',
        zone: 'comun',
        floor: 0,
        anchor: [0, 0.4, 2.4],
        view: [3.6, 2.6, 4.6],
        concept: 'El espacio vacío también es arquitectura',
        detail:
          'Los vacíos son los espacios libres que quedan entre las piezas construidas. Pueden ser tan importantes como los edificios mismos, pero generar vacíos no produce comunidad automáticamente: importa cómo se usan.',
        keyFact: 'Los vacíos suman en Moriyama.',
      },
      {
        id: 'co-patio',
        label: 'Recorridos y visuales',
        zone: 'circulacion',
        floor: 0,
        anchor: [0, 0.1, 0.8],
        view: [0.5, 6.5, 5.5],
        concept: 'Conectar las piezas',
        detail:
          'Los recorridos conectan las distintas partes del proyecto y las separaciones permiten relaciones visuales entre viviendas. Si los recorridos no están bien resueltos, la separación dificulta la continuidad.',
        keyFact: 'La tensión: separar puede abrir, pero también desconectar.',
      },
      {
        id: 'co-interior',
        label: 'Porosidad',
        zone: 'privado',
        floor: 0,
        anchor: [-3.3, 0.5, -0.4],
        view: [1.1, 0.9, 0.5],
        inside: true,
        concept: 'Interior y exterior en relación',
        detail:
          'La porosidad son los espacios y aperturas que conectan el interior con el exterior: la construcción no es una masa cerrada. Favorece la entrada de luz y la conexión con el exterior.',
        keyFact: 'Compartir sin perder la intimidad: transición clara entre lo privado y lo común.',
      },
      {
        id: 'co-comedor',
        label: 'Comunidad y zonas comunes',
        zone: 'comun',
        floor: 0,
        anchor: [0, 0.5, -2.6],
        view: [0.3, 1.0, 2.0],
        inside: true,
        concept: 'Lugares para encontrarse',
        detail:
          'Los espacios comunes permiten conversar, jugar o hacer actividades juntos. La app te invita a estudiar cómo esta distribución de piezas y vacíos puede favorecer la convivencia.',
        keyFact: 'Un patio compartido que nadie usa suele estar mal conectado con las viviendas.',
      },
    ],
    compare: {
      idea: 'Fragmentación y porosidad',
      pregunta: '¿Qué sucede entre las viviendas?',
      secuencia: 'Fragmentación → vacíos → comunidad',
      positivo: 'Los vacíos y recorridos amplían las relaciones visuales, la luz y la conexión con el exterior.',
      tension: 'Si los recorridos no están bien resueltos, la separación dificulta la continuidad entre viviendas.',
    },
  },

  // Edificio Ventum: integración (maqueta de torre con sustracción en cubierta)
  coliving: {
    id: 'coliving',
    num: '03',
    name: 'Ventum',
    tagline: 'Edificio Ventum · Integrar',
    summary:
      'Representa la integración mediante la sustracción, la modulación y la organización de recorridos. Retirar o dejar libre parte de un volumen genera terrazas, patios o recorridos que relacionan las distintas áreas.',
    sequence: ['Sustracción', 'Recorridos', 'Integración'],
    question: '¿Cómo se conectan las partes?',
    overview: { pos: [10.5, 8, 13], target: [0, 1.6, 0] },
    sky: ['#231a4a', '#e8789f'],
    sun: '#ffc2d8',
    steps: [
      {
        id: 'cl-baja',
        label: 'Altura y entorno',
        zone: 'comun',
        floor: 0,
        anchor: [-0.4, 0.6, 1.5],
        view: [-2.8, 1.4, 5.6],
        concept: 'Vivienda concentrada en altura',
        detail:
          'Ventum concentra la vivienda en altura y su relación con el entorno es limitada. Es una interpretación comparativa, no una afirmación de que todos los edificios en altura tengan este problema.',
        keyFact: 'Tensión: altura vs. porosidad.',
      },
      {
        id: 'cl-unidad',
        label: 'Modulación',
        zone: 'privado',
        floor: 1,
        anchor: [-1.3, 1.8, 1.5],
        view: [-3.4, 1.6, 5.2],
        concept: 'Reglas de repetición',
        detail:
          'La modulación organiza los elementos mediante reglas de repetición. Puede contribuir a una organización clara de las viviendas, planta tras planta.',
        keyFact: 'Modular: repetir elementos siguiendo una regla.',
      },
      {
        id: 'cl-nucleo',
        label: 'Recorridos',
        zone: 'circulacion',
        floor: 1,
        anchor: [2.05, 1.8, 0],
        view: [5.4, 2.2, 4.2],
        concept: 'Conectar las distintas zonas',
        detail:
          'Los recorridos conectan las distintas zonas del edificio. Integrar no es colocar muchas viviendas en un mismo edificio: también es diseñar las conexiones entre ellas.',
        keyFact: 'Sustracción → recorridos → integración.',
      },
      {
        id: 'cl-terraza',
        label: 'Sustracción',
        zone: 'comun',
        floor: 3,
        anchor: [0, 3.9, 0],
        view: [5.6, 3.6, 6.2],
        concept: 'Retirar para generar espacio',
        detail:
          'Sustraer es retirar o dejar libre una parte de un volumen construido. Si a un bloque de apartamentos se le deja un espacio abierto o un retranqueo, aparecen terrazas, patios o recorridos: espacios de transición.',
        keyFact: 'La sustracción crea espacios libres a partir del volumen.',
      },
      {
        id: 'cl-hab',
        label: 'Dentro de una unidad',
        zone: 'privado',
        floor: 1,
        anchor: [-1.0, 1.5, 0.8],
        view: [0.3, 0.9, 1.6],
        inside: true,
        concept: 'Lo privado en el edificio',
        detail:
          'Cada unidad conserva su espacio privado (habitación, baño) para la intimidad y la autonomía, y se conecta con el resto mediante los recorridos del edificio.',
        keyFact: 'Del espacio privado al común: la conexión es parte del diseño.',
      },
      {
        id: 'cl-cowork-int',
        label: 'Integración',
        zone: 'comun',
        floor: 0,
        anchor: [-0.4, 0.4, 0],
        view: [0.4, 1.0, 1.8],
        inside: true,
        concept: 'Que las partes funcionen relacionadas',
        detail:
          'Integrar es conseguir que las distintas partes del proyecto funcionen relacionadas entre sí, en lugar de quedar como elementos aislados: organización interior y relación con el entorno.',
        keyFact: 'Integrar también es diseñar transiciones y la relación con el entorno.',
      },
    ],
    compare: {
      idea: 'Integración',
      pregunta: '¿Cómo se conectan las partes?',
      secuencia: 'Sustracción → recorridos → integración',
      positivo: 'La sustracción crea espacios de transición y la modulación aporta una organización clara.',
      tension: 'Vivienda concentrada en altura, con una relación limitada con el entorno.',
    },
  },
}

export const typologyList = Object.values(typologies)

/** Tensiones identificadas entre los referentes (interpretaciones, no reglas universales) */
export const tensions: { title: string; text: string }[] = [
  {
    title: 'Vacíos',
    text: 'Suman en Moriyama, pero restan en Alcaraván y Ventum por la separación en torres.',
  },
  {
    title: 'Dispersión vs. núcleo',
    text: 'La fragmentación asociada con Ventum y Moriyama se contrapone a la concentración en el núcleo de Alcaraván.',
  },
  {
    title: 'Altura vs. porosidad',
    text: 'Ventum concentra la vivienda en altura con una relación limitada con el entorno; Alcaraván combina torres rígidas con espacios comunes concentrados.',
  },
]
