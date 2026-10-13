import { create } from 'zustand'
import type { TypologyId, Zone } from '../data/typologies'

export type Panel = 'comparar' | 'quiz' | 'glosario' | null

interface AppState {
  typology: TypologyId
  /** -1 = vista general; >= 0 = paso del recorrido */
  step: number
  explode: number
  focus: Zone | null
  panel: Panel
  setTypology: (t: TypologyId) => void
  setStep: (n: number) => void
  setExplode: (v: number) => void
  setFocus: (z: Zone | null) => void
  setPanel: (p: Panel) => void
}

export const useApp = create<AppState>((set) => ({
  typology: 'cohousing',
  step: -1,
  explode: 0,
  focus: null,
  panel: null,
  setTypology: (typology) => set({ typology, step: -1, focus: null }),
  setStep: (step) => set({ step }),
  setExplode: (explode) => set({ explode }),
  setFocus: (focus) => set({ focus }),
  setPanel: (panel) => set({ panel }),
}))
