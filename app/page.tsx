'use client'

import { useRef } from 'react'
import useSWR from 'swr'
import { fetcher } from '../lib/api'
import { useScrollStore } from '../lib/store'
import { useScrollSpy } from '../lib/hooks'
import type { CurrentSetupsResponse } from '../lib/types'
import SkateboardSetup from '../components/SkateboardSetup'
import ShoeSetup from '../components/ShoeSetup'
import ArchiveSection from '../components/ArchiveSection'

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { activeSectionIndex, progress } = useScrollStore()

  const { data: current, isLoading } = useSWR<CurrentSetupsResponse>(
    '/api/setups/current',
    fetcher,
  )

  const skateboard = current?.skateboard ?? null
  const shoe = current?.shoe ?? null
  const components = skateboard?.components ?? []
  const skateboardComponentCount = components.length
  const hasSkateboardReview = skateboard?.content || (skateboard?.frontmatter.rating != null && skateboard?.frontmatter.rating > 0)
  const skateboardSections = skateboardComponentCount + (hasSkateboardReview ? 1 : 0)
  const totalSections = skateboardSections + (shoe ? 1 : 0)
  // Total component sections (excluding review) for counter display
  const totalComponentSections = skateboardComponentCount + (shoe ? 1 : 0)

  useScrollSpy(scrollRef, isLoading ? 0 : totalSections)

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-zinc-500">Loading setups…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      {totalSections > 0 && (
        <div className="scroll-indicator">
          {Array.from({ length: totalSections }, (_, i) => (
            <button
              key={`section-${i}`}
              type="button"
              aria-label={`Go to section ${i + 1}`}
              aria-current={activeSectionIndex === i ? 'true' : undefined}
              className={`scroll-dot ${activeSectionIndex === i ? 'active' : ''}`}
              onClick={() =>
                document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
              }
            />
          ))}
        </div>
      )}

      <div className="scroll-container" ref={scrollRef}>
        {skateboard && (
          <SkateboardSetup
            setup={skateboard}
            showBackButton={false}
            startIndex={0}
            totalSections={totalSections}
            isActive={(index) => activeSectionIndex === index}
          />
        )}

        {shoe && (
          <ShoeSetup
            shoe={shoe}
            showBackButton={false}
            index={skateboardSections}
            displayIndex={skateboardComponentCount}
            total={totalComponentSections}
            isActive={activeSectionIndex === skateboardSections}
          />
        )}

        <ArchiveSection />
      </div>
    </>
  )
}
