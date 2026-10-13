export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain: string
}

export const quiz: QuizQuestion[] = [
  {
    q: '¿Qué modelo se caracteriza por ser autogestionado y diseñado con participación de los futuros residentes?',
    options: ['Coliving', 'Cohousing', 'Vivienda colectiva tradicional'],
    answer: 1,
    explain:
      'El cohousing nace del grupo: los residentes participan en el diseño y se encargan del mantenimiento.',
  },
  {
    q: '¿Cuál ofrece unidades privadas más compactas y gestión por una empresa externa?',
    options: ['Coliving', 'Cohousing', 'Ninguno'],
    answer: 0,
    explain:
      'En coliving el espacio privado se reduce y los servicios los provee un operador a cambio de un alquiler.',
  },
  {
    q: 'En la vivienda colectiva, ¿qué criterios actuales buscan optimizar energía y suelo?',
    options: ['Decoración interior', 'Bioclimática, flexibilidad y servicios compartidos', 'Solo mayor altura'],
    answer: 1,
    explain:
      'Las tendencias actuales integran arquitectura bioclimática y flexibilidad espacial en la vivienda colectiva.',
  },
  {
    q: '¿Cómo es la estancia típica en un cohousing?',
    options: ['Temporal y flexible', 'Permanente o de largo plazo', 'Solo por semanas'],
    answer: 1,
    explain: 'El derecho de uso suele ser indefinido, lo que favorece la comunidad.',
  },
  {
    q: '¿Cuál es el objetivo principal del coliving en las grandes ciudades?',
    options: [
      'Combatir el aislamiento con huertos comunitarios',
      'Optimizar espacio urbano y costos con servicios incluidos',
      'Construir viviendas unifamiliares',
    ],
    answer: 1,
    explain:
      'Delega la administración en una empresa y concentra el programa social en áreas compartidas.',
  },
]

export const glossary: { term: string; def: string }[] = [
  { term: 'Autogestión', def: 'Los residentes toman las decisiones de diseño, uso y mantenimiento del conjunto.' },
  { term: 'Espacio común', def: 'Área de uso compartido por los residentes: comedor, lavandería, huerto, taller, terraza.' },
  { term: 'Propiedad horizontal', def: 'Régimen en el que cada propietario tiene su unidad y comparte la copropiedad de las áreas comunes.' },
  { term: 'Arquitectura bioclimática', def: 'Diseño que aprovecha sol, viento y vegetación para reducir el consumo energético.' },
  { term: 'Flexibilidad espacial', def: 'Capacidad de una vivienda de adaptarse a distintos usos o tamaños de hogar sin cambiar la estructura.' },
  { term: 'Ventilación cruzada', def: 'Corriente de aire entre fachadas opuestas que renueva y refresca el interior.' },
  { term: 'Gradiente de privacidad', def: 'Transición graduada entre lo público, lo común, el umbral y lo privado.' },
  { term: 'Núcleo de circulación', def: 'Agrupación de escaleras, ascensores y pasillos que organizan los recorridos del edificio.' },
]
