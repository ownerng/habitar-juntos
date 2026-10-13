export interface QuizQuestion {
  q: string
  options: string[]
  answer: number
  explain: string
}

export const quiz: QuizQuestion[] = [
  {
    q: 'Un conjunto tiene un patio común, pero casi nadie lo utiliza. ¿Qué podría estar pasando?',
    options: [
      'El patio es compartido, así que necesariamente debería funcionar bien',
      'Puede estar mal conectado con las viviendas o no ofrecer motivos para utilizarlo',
      'La solución siempre es construir más pisos',
    ],
    answer: 1,
    explain:
      'Compartir un espacio no garantiza que se utilice. Su ubicación, accesibilidad, comodidad y relación con los recorridos pueden influir en la convivencia.',
  },
  {
    q: '¿Cuál es la idea principal del Conjunto Alcaraván?',
    options: ['Fragmentación y porosidad', 'Concentración', 'Integración por sustracción'],
    answer: 1,
    explain: 'Alcaraván concentra las actividades y las zonas comunes en un núcleo. Su pregunta guía: ¿dónde se reúnen las personas?',
  },
  {
    q: '¿Qué significa «fragmentación» en la Casa Moriyama?',
    options: [
      'Dividir la composición en varios volúmenes separados',
      'Reunir todo en un único edificio compacto',
      'Repetir la misma vivienda en altura',
    ],
    answer: 0,
    explain: 'Es como partir una construcción grande en piezas más pequeñas. Entre ellas quedan vacíos que generan recorridos y visuales.',
  },
  {
    q: '¿Qué es la sustracción, según el caso de Ventum?',
    options: [
      'Eliminar las zonas comunes del proyecto',
      'Retirar o dejar libre una parte de un volumen construido',
      'Separar las torres para generar vacíos',
    ],
    answer: 1,
    explain: 'Un retranqueo o un espacio abierto en un bloque puede generar terrazas, patios o recorridos: espacios de transición.',
  },
  {
    q: '¿Qué operación comparten los tres referentes?',
    options: ['La modulación', 'La cubierta verde', 'La propiedad horizontal'],
    answer: 0,
    explain: 'La modulación organiza o repite elementos siguiendo una regla. Se relaciona con la organización y con lo colectivo.',
  },
  {
    q: '¿Qué tensión presentan las torres separadas de Alcaraván?',
    options: [
      'Generan vacíos que pueden limitar la comunidad',
      'Impiden la privacidad de cada vivienda',
      'Eliminan los recorridos por completo',
    ],
    answer: 0,
    explain: 'Tener zonas comunes no basta: importan la distancia entre viviendas, la continuidad de los recorridos y la facilidad para encontrarse.',
  },
  {
    q: '¿Qué secuencia sigue la Casa Moriyama?',
    options: [
      'Núcleo → zonas comunes → unión',
      'Sustracción → recorridos → integración',
      'Fragmentación → vacíos → comunidad',
    ],
    answer: 2,
    explain: 'Estas secuencias explican la lógica analizada; no garantizan el resultado: generar vacíos no produce comunidad automáticamente.',
  },
  {
    q: '¿Qué debe aprender el usuario de Ventum sobre «integrar»?',
    options: [
      'Que consiste en colocar muchas viviendas en un mismo edificio',
      'Que también implica diseñar conexiones, espacios de transición y relación con el entorno',
      'Que exige eliminar el espacio privado',
    ],
    answer: 1,
    explain: 'Integrar es lograr que las partes funcionen relacionadas entre sí, no quedar como elementos aislados.',
  },
]

export const glossary: { term: string; def: string }[] = [
  { term: 'Núcleo', def: 'Concentra las actividades o espacios comunes en una zona determinada (Alcaraván).' },
  { term: 'Ciudad dentro de ciudad', def: 'Idea de un conjunto residencial con su propia organización interna (Alcaraván).' },
  { term: 'Modulación', def: 'Organizar o repetir elementos o unidades siguiendo una regla. Es la operación que comparten los tres referentes.' },
  { term: 'Fragmentación', def: 'Dividir la composición en varios volúmenes separados, en lugar de un único edificio compacto (Moriyama).' },
  { term: 'Vacíos', def: 'Espacios libres que quedan entre las piezas construidas. El espacio vacío también es arquitectura.' },
  { term: 'Porosidad', def: 'Espacios y aperturas que conectan el interior con el exterior: la construcción no se comporta como una masa cerrada.' },
  { term: 'Recorridos', def: 'Caminos que conectan las diferentes partes del proyecto y llevan de la entrada a la vivienda y a los espacios comunes.' },
  { term: 'Sustracción', def: 'Retirar o dejar libre una parte de un volumen construido; puede generar terrazas, patios o recorridos (Ventum).' },
  { term: 'Integración', def: 'Conseguir que distintas partes del proyecto funcionen relacionadas entre sí, en lugar de quedar aisladas (Ventum).' },
  { term: 'Retranqueo', def: 'Retiro de una parte del volumen respecto al resto de la fachada; genera espacios abiertos de transición.' },
]
