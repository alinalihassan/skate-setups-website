import { create } from 'zustand'

interface ScrollState {
  activeSectionIndex: number
  progress: number
  setActiveSectionIndex: (index: number) => void
  setProgress: (progress: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  activeSectionIndex: 0,
  progress: 0,
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
  setProgress: (progress) => set({ progress }),
}))
