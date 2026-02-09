'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import type { Setup } from '../lib/types'
import { Stars, SpecValue } from './shared'

interface SkateboardSetupProps {
  setup: Setup
  showBackButton?: boolean
  startIndex?: number
  totalSections?: number
  isActive?: (index: number) => boolean
}

export default function SkateboardSetup({
  setup,
  showBackButton = false,
  startIndex = 0,
  totalSections,
  isActive,
}: SkateboardSetupProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const components = setup.components || []
  const hasReviewOrRating = setup.content || (setup.frontmatter.rating != null && setup.frontmatter.rating > 0)
  const localTotalSections = totalSections ?? components.length + (hasReviewOrRating ? 1 : 0)

  // Scroll observer - only if managing own scroll container (totalSections undefined)
  useEffect(() => {
    if (totalSections !== undefined || !scrollRef.current || localTotalSections === 0) return

    const container = scrollRef.current
    const sections = container.querySelectorAll('.component-section')

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-index') || '0', 10)
            setActiveSectionIndex(idx - startIndex)
          }
        }
      },
      { root: container, threshold: 0.5 },
    )

    sections.forEach((s) => sectionObserver.observe(s))

    return () => {
      sectionObserver.disconnect()
    }
  }, [totalSections, localTotalSections, startIndex])

  const getIsActive = (index: number) => {
    if (isActive) return isActive(index)
    return activeSectionIndex === index
  }

  // Render sections
  const sections = (
    <>
        {/* Component Sections */}
        {components.map((component, index) => {
          const specs = Object.entries(component.specs)
          const sectionIndex = startIndex + index

          return (
            <section
              key={component.name}
              className={`component-section ${getIsActive(index) ? 'active' : ''}`}
              data-index={sectionIndex}
              id={`section-${sectionIndex}`}
            >
              <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-20">
                    {/* Left side: Image */}
                    <div className="component-image order-1">
                      {component.image ? (
                        <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
                          <div className="absolute inset-0 bg-zinc-800 rounded-2xl transform rotate-3 opacity-20" />
                          <img
                            src={component.image}
                            alt={component.title}
                            className="relative w-full h-full object-contain rounded-2xl bg-zinc-900 shadow-2xl"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square max-w-lg mx-auto lg:mx-0 bg-zinc-900 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-800">
                          <div className="text-center p-8">
                            <svg className="w-20 h-20 mx-auto mb-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-zinc-600 text-lg">No image available</p>
                            <p className="text-zinc-700 text-sm mt-2">{component.title}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right side: Specs */}
                    <div className="component-content order-2">
                      <div className="lg:pl-8">
                        {/* Component label */}
                        <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3 font-medium">
                          {component.name}
                        </p>

                        {/* Component title — brand + model */}
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-8 leading-tight">
                          {component.brand ? (
                            <>
                              <span className="brand-name">{component.brand}</span>{' '}
                              <span className="model-name">{component.model || component.title}</span>
                            </>
                          ) : (
                            <span className="font-bold">{component.title}</span>
                          )}
                        </h2>

                        {/* Specs grid */}
                        {specs.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                            {specs.map(([key, value]) => (
                              <div key={key} className="spec-item border-l-2 border-zinc-700 pl-4 py-2">
                                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                                  {key.replace(/_/g, ' ')}
                                </p>
                                <p className="text-zinc-200 text-lg font-medium">
                                  <SpecValue value={String(value)} />
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="spec-item border-l-2 border-zinc-700 pl-4 py-2 mb-8">
                            <p className="text-zinc-500 text-sm">No additional specifications</p>
                          </div>
                        )}

                        {/* Component counter */}
                        <div className="flex items-center gap-4 text-zinc-600">
                          <span className="text-4xl font-bold text-zinc-700">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="w-16 h-px bg-zinc-700" />
                          <span className="text-sm">{String(components.length).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        {/* Review Section or Rating Section */}
        {hasReviewOrRating && (
          <section
            className={`component-section ${getIsActive(components.length) ? 'active' : ''}`}
            data-index={startIndex + components.length}
            id={`section-${startIndex + components.length}`}
          >
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="min-h-screen py-20 flex flex-col justify-center">
                  <div className="component-content">
                    {setup.content && (
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-8 font-bold">Review</h2>
                    )}
                    {setup.frontmatter.rating != null && setup.frontmatter.rating > 0 && (
                      <div className={setup.content ? 'mb-8' : ''}>
                        <Stars rating={setup.frontmatter.rating} />
                      </div>
                    )}
                    {setup.content && (
                      <div
                        className="prose prose-invert prose-zinc max-w-none"
                        dangerouslySetInnerHTML={{ __html: setup.content }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    )

  return (
    <>
      {showBackButton && (
        <Link
          href="/#archive"
          className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to archive
        </Link>
      )}

      {totalSections === undefined && localTotalSections > 0 && (
        <div className="scroll-indicator">
          {Array.from({ length: localTotalSections }, (_, i) => (
            <div
              key={i}
              className={`scroll-dot ${getIsActive(i) ? 'active' : ''}`}
              onClick={() =>
                document.getElementById(`section-${startIndex + i}`)?.scrollIntoView({ behavior: 'smooth' })
              }
            />
          ))}
        </div>
      )}

      {totalSections === undefined ? (
        <div className="scroll-container" ref={scrollRef}>
          {sections}
        </div>
      ) : (
        sections
      )}
    </>
  )
}
