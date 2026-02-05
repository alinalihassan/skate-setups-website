import { useEffect, type RefObject } from 'react'
import { useScrollStore } from './store'

/**
 * Observes scroll-snap sections inside a container and keeps
 * the zustand store + URL hash in sync with the visible section.
 */
export function useScrollSpy(
  containerRef: RefObject<HTMLDivElement | null>,
  sectionCount: number,
) {
  const setActiveSectionIndex = useScrollStore((s) => s.setActiveSectionIndex)
  const setProgress = useScrollStore((s) => s.setProgress)

  useEffect(() => {
    const container = containerRef.current
    if (!container || sectionCount === 0) return

    const cleanups: (() => void)[] = []

    // --- Section observer (component sections) ---
    const sections = container.querySelectorAll('.component-section')
    if (sections.length > 0) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const idx = parseInt(entry.target.getAttribute('data-index') || '0', 10)
              setActiveSectionIndex(idx)
              const id = entry.target.getAttribute('id')
              if (id) window.history.replaceState(null, '', `#${id}`)
            }
          }
        },
        { root: container, threshold: 0.5 },
      )
      sections.forEach((s) => sectionObserver.observe(s))
      cleanups.push(() => sectionObserver.disconnect())
    }

    // --- Archive observer ---
    const archive = container.querySelector('#archive')
    if (archive) {
      const archiveObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              window.history.replaceState(null, '', '#archive')
            }
          }
        },
        { root: container, threshold: 0.3 },
      )
      archiveObserver.observe(archive)
      cleanups.push(() => archiveObserver.disconnect())
    }

    // --- Scroll progress ---
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const max = scrollHeight - clientHeight
      setProgress(max > 0 ? (scrollTop / max) * 100 : 0)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    cleanups.push(() => container.removeEventListener('scroll', onScroll))

    // --- Restore position from hash ---
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
      }, 100)
    }

    return () => cleanups.forEach((fn) => fn())
  }, [containerRef, sectionCount, setActiveSectionIndex, setProgress])
}
