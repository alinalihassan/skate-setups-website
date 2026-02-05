'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Setup } from '../lib/types'
import ComponentSection from '../components/ComponentSection'
import ShoeSection from '../components/ShoeSection'
import ArchiveSection from '../components/ArchiveSection'

export default function HomePage() {
  const [skateboard, setSkateboard] = useState<Setup | null>(null)
  const [shoe, setShoe] = useState<Setup | null>(null)
  const [allSetups, setAllSetups] = useState<Setup[]>([])
  const [filter, setFilter] = useState('all')
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      fetch('/api/setups/current').then((r) => (r.ok ? r.json() : { skateboard: null, shoe: null })),
      fetch('/api/setups').then((r) => (r.ok ? r.json() : { setups: [] })),
    ])
      .then(([current, all]) => {
        setSkateboard(current.skateboard)
        setShoe(current.shoe)
        setAllSetups(all.setups)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Compute sections
  const components = skateboard?.components || []
  const totalSections = components.length + (shoe ? 1 : 0)

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const container = scrollRef.current
    if (!container || totalSections === 0) return

    const sections = container.querySelectorAll('.component-section')
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-index') || '0', 10)
            setActiveSectionIndex(idx)
          }
        })
      },
      { root: container, threshold: 0.5 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [totalSections, loading])

  // Scroll progress tracking
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const maxScroll = scrollHeight - clientHeight
      setProgress(maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [loading])

  // Activate first section on load, or scroll to #archive if hash is present
  useEffect(() => {
    if (!loading && totalSections > 0) {
      setActiveSectionIndex(0)

      if (window.location.hash === '#archive') {
        // Small delay to let the DOM render, then scroll to archive
          const archive = document.getElementById('archive')
          if (archive) {
            archive.scrollIntoView({ behavior: 'instant' })
          }
      }
    }
  }, [loading, totalSections])

  // Filter handler for archive
  const handleFilter = useCallback(async (type: string) => {
    setFilter(type)
    try {
      const url = type === 'all' ? '/api/setups' : `/api/setups?type=${type}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setAllSetups(data.setups)
      }
    } catch (err) {
      console.error('Error filtering setups:', err)
    }
  }, [])

  // Scroll to section
  const scrollToSection = useCallback((index: number) => {
    const section = document.getElementById(`section-${index}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-zinc-500">Loading setups...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {/* Scroll indicator dots */}
      {totalSections > 0 && (
        <div className="scroll-indicator">
          {Array.from({ length: totalSections }, (_, i) => (
            <div
              key={i}
              className={`scroll-dot ${activeSectionIndex === i ? 'active' : ''}`}
              onClick={() => scrollToSection(i)}
            />
          ))}
        </div>
      )}

      {/* Main scroll container */}
      <div className="scroll-container" ref={scrollRef}>
        {/* Skateboard component sections */}
        {components.map((component, i) => (
          <ComponentSection
            key={component.name}
            component={component}
            index={i}
            total={totalSections}
            isActive={activeSectionIndex === i}
          />
        ))}

        {/* Shoe section */}
        {shoe && (
          <ShoeSection
            shoe={shoe}
            index={components.length}
            total={totalSections}
            isActive={activeSectionIndex === components.length}
          />
        )}

        {/* Archive section */}
        <ArchiveSection
          setups={allSetups}
          filter={filter}
          onFilterChange={handleFilter}
        />
      </div>
    </>
  )
}
