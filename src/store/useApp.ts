import { create } from 'zustand'
import { typologies, type TypologyId, type Zone } from '../data/typologies'

export type Panel = 'comparar' | 'quiz' | 'glosario' | null

interface AppState {
  typology: TypologyId
  /** -1 = vista general; >= 0 = paso del recorrido */
  step: number
  explode: number
  inside: boolean
  focus: Zone | null
  panel: Panel
  setTypology: (t: TypologyId) => void
  setStep: (n: number) => void
  setExplode: (v: number) => void
  setInside: (v: boolean) => void
  setFocus: (z: Zone | null) => void
  setPanel: (p: Panel) => void
}

export const useApp = create<AppState>((set, get) => ({
  typology: 'colectiva',
  step: -1,
  explode: 0,
  inside: false,
  focus: null,
  panel: null,
  setTypology: (typology) => set({ typology, step: -1, focus: null, inside: false }),
  // los pasos "de interior" abren las paredes; el resto las cierra
  setStep: (step) =>
    set((st) => ({
      step,
      inside: step >= 0 ? !!typologies[get().typology].steps[step].inside : st.inside,
    })),
  setInside: (inside) => set({ inside }),
  setExplode: (explode) => set({ explode }),
  setFocus: (focus) => set({ focus }),
  setPanel: (panel) => set({ panel }),
}))
