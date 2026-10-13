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
}

export interface Typology {
  id: TypologyId
  num: string
  name: string
  tagline: string
  summary: string
  privatePct: number
  commonPct: number
  overview: { pos: V3; target: V3 }
  /** degradado del cielo [arriba, horizonte] y color del sol */
  sky: [string, string]
  sun: string
  steps: Step[]
  compare: {
    diseno: string
    estancia: string
    privado: string
    gestion: string
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
  cohousing: {
    id: 'cohousing',
    num: '01',
    name: 'Cohousing',
    tagline: 'Vivienda colaborativa',
    summary:
      'Autogestionado y cooperativo: los futuros residentes participan en el diseño y el mantenimiento. Cada hogar tiene su casa completa e independiente; lo común se concentra en espacios de alto valor compartido.',
    privatePct: 60,
    commonPct: 40,
    overview: { pos: [12.5, 9.5, 15], target: [0, 0.4, 0] },
    sky: ['#1b3a44', '#f0b27a'],
    sun: '#ffd9a0',
    steps: [
      {
        id: 'co-casa',
        label: 'Casa común',
        zone: 'comun',
        floor: 0,
        anchor: [0, 1.1, -2.6],
        view: [3.2, 1.6, 5.2],
        concept: 'El corazón social del conjunto',
        detail:
          'Comedor, cocina colectiva y sala de reunión en un único volumen. Se ubica donde se cruzan los recorridos para que el encuentro sea espontáneo y no una obligación.',
        keyFact: 'Suele ocupar entre el 15 % y el 25 % de la superficie construida.',
      },
      {
        id: 'co-privada',
        label: 'Vivienda privada',
        zone: 'privado',
        floor: 0,
        anchor: [3.3, 1.0, -0.4],
        view: [-5.2, 1.8, 3.2],
        concept: 'Independencia total en lo privado',
        detail:
          'Cada familia tiene vivienda completa con cocina, baño y habitaciones. La identidad de cada casa (color, techo) refuerza la sensación de hogar propio dentro de la comunidad.',
        keyFact: 'El derecho de uso es indefinido: los residentes se quedan a largo plazo.',
      },
      {
        id: 'co-huerto',
        label: 'Huerto compartido',
        zone: 'bioclimatico',
        floor: 0,
        anchor: [0, 0.4, 2.4],
        view: [3.6, 2.6, 4.6],
        concept: 'Un recurso que se cuida entre todos',
        detail:
          'El huerto y los exteriores comunes son tareas colectivas: generan vínculo, producen alimento y suavizan el microclima del patio.',
        keyFact: 'La autogestión se ejercita también en lo cotidiano.',
      },
      {
        id: 'co-patio',
        label: 'Patio y recorridos',
        zone: 'circulacion',
        floor: 0,
        anchor: [0, 0.1, 0.8],
        view: [0.5, 6.5, 5.5],
        concept: 'Gradiente de privacidad',
        detail:
          'Las casas miran al patio central: el recorrido diario pasa por lo común antes de llegar a lo privado (calle → patio → umbral → casa).',
        keyFact: 'Privado → umbral → común.',
      },
    ],
    compare: {
      diseno: 'Participativo por los usuarios',
      estancia: 'Permanente / largo plazo',
      privado: 'Completo (vivienda entera)',
      gestion: 'Autogestionada por vecinos',
    },
  },

  coliving: {
    id: 'coliving',
    num: '02',
    name: 'Coliving',
    tagline: 'Vivienda compartida flexible',
    summary:
      'Evolución moderna para estudiantes, jóvenes profesionales y nómadas digitales. La unidad privada se compacta (habitación y baño) y el edificio se apoya en grandes áreas comunes con servicios.',
    privatePct: 35,
    commonPct: 65,
    overview: { pos: [10.5, 8, 13], target: [0, 1.6, 0] },
    sky: ['#231a4a', '#e8789f'],
    sun: '#ffc2d8',
    steps: [
      {
        id: 'cl-baja',
        label: 'Planta baja compartida',
        zone: 'comun',
        floor: 0,
        anchor: [-0.4, 0.6, 1.5],
        view: [-2.8, 1.4, 5.6],
        concept: 'La vida social baja a la calle',
        detail:
          'Cocinas profesionales, coworking y zonas de estar ocupan la planta baja, acristalada hacia el espacio público. Aquí está el programa que justifica vivir en una unidad pequeña.',
        keyFact: 'Se administra como un servicio, no como un jardín compartido.',
      },
      {
        id: 'cl-unidad',
        label: 'Unidad compacta',
        zone: 'privado',
        floor: 1,
        anchor: [-1.3, 1.8, 1.5],
        view: [-3.4, 1.6, 5.2],
        concept: 'Espacio privado reducido',
        detail:
          'Habitación y baño optimizados: mobiliario integrado, baño prefabricado y una ventana por unidad. Se gana densidad y se baja el costo por habitante.',
        keyFact: 'Unidades de 12 a 20 m² con contratos flexibles.',
      },
      {
        id: 'cl-nucleo',
        label: 'Núcleo vertical',
        zone: 'circulacion',
        floor: 1,
        anchor: [2.05, 1.8, 0],
        view: [5.4, 2.2, 4.2],
        concept: 'Una sola circulación para todos',
        detail:
          'Escalera y ascensor concentrados en un extremo liberan la planta para habitaciones y simplifican la gestión del edificio.',
        keyFact: 'Planta tipo repetible = construcción más eficiente.',
      },
      {
        id: 'cl-terraza',
        label: 'Terraza común',
        zone: 'comun',
        floor: 3,
        anchor: [0, 3.9, 0],
        view: [5.6, 3.6, 6.2],
        concept: 'Amenities en la cubierta',
        detail:
          'Terraza, huerto urbano y cine al aire libre compensan la compacidad de las habitaciones con espacio de ocio y vistas.',
        keyFact: 'Delega la administración a una empresa operadora a cambio de un alquiler mensual.',
      },
    ],
    compare: {
      diseno: 'Diseñado por desarrolladores',
      estancia: 'Temporal / flexible',
      privado: 'Reducido (estudio o habitación)',
      gestion: 'Empresa administradora externa',
    },
  },

  colectiva: {
    id: 'colectiva',
    num: '03',
    name: 'Vivienda Colectiva',
    tagline: 'Muchos hogares, una estructura',
    summary:
      'Edificio residencial para múltiples familias bajo una misma estructura. Las tendencias actuales integran criterios bioclimáticos, flexibilidad espacial y servicios compartidos para optimizar energía y suelo.',
    privatePct: 75,
    commonPct: 25,
    overview: { pos: [10.5, 7.5, 12.5], target: [0, 1.4, 0] },
    sky: ['#0f3a5c', '#a9dcd6'],
    sun: '#fff3c8',
    steps: [
      {
        id: 'vc-nucleo',
        label: 'Núcleo de circulación',
        zone: 'circulacion',
        floor: 1,
        anchor: [0, 1.7, 1.3],
        view: [3.2, 1.6, 5.2],
        concept: 'Escalera y ascensor al centro',
        detail:
          'Un núcleo central reparte a dos viviendas por planta. Con una buena distribución, cada vivienda tiene doble orientación y puede ventilar de lado a lado.',
        keyFact: 'Eficiencia = superficie útil / superficie construida.',
      },
      {
        id: 'vc-viento',
        label: 'Ventilación cruzada',
        zone: 'bioclimatico',
        floor: 1,
        anchor: [1.7, 1.7, 0],
        view: [7, 2.4, 3.2],
        concept: 'Aire que atraviesa la vivienda',
        detail:
          'Las ventanas en fachadas opuestas crean una corriente que renueva y refresca el interior sin energía. Es la estrategia bioclimática más barata y más olvidada.',
        keyFact: 'Se diseña con la planta: ventanas enfrentadas y sin muros que bloqueen.',
      },
      {
        id: 'vc-azotea',
        label: 'Azotea bioclimática',
        zone: 'bioclimatico',
        floor: 3,
        anchor: [0, 3.6, 0],
        view: [5.4, 4.2, 6.2],
        concept: 'Recursos que se comparten',
        detail:
          'Paneles solares orientados al sol, cubierta verde que aísla y retiene el agua, y un tanque de lluvia: beneficios comunes para todos los hogares.',
        keyFact: 'Compartir recursos baja costos y huella de carbono.',
      },
      {
        id: 'vc-tipo',
        label: 'Vivienda tipo',
        zone: 'privado',
        floor: 0,
        anchor: [-1.7, 0.7, 1.3],
        view: [-4.4, 1.8, 5],
        concept: 'Flexibilidad espacial',
        detail:
          'Plantas libres con tabiquería removible permiten adaptar la vivienda al tamaño del hogar a lo largo del tiempo, sin tocar la estructura.',
        keyFact: 'Gestión por copropiedad (propiedad horizontal).',
      },
    ],
    compare: {
      diseno: 'Arquitectos / promotores',
      estancia: 'Permanente / variable',
      privado: 'Completo (vivienda entera)',
      gestion: 'Copropiedad o administración básica',
    },
  },
}

export const typologyList = Object.values(typologies)
