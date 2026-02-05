'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { Setup } from '../../../lib/types'
import { Stars, SpecValue } from '../../../components/shared'

export default function SetupDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [setup, setSetup] = useState<Setup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/setups/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setSetup(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-zinc-500">Loading setup...</p>
        </div>
      </div>
    )
  }

  if (!setup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Setup Not Found</h1>
          <p className="text-zinc-500 mb-8">This setup does not exist or has been removed.</p>
          <Link href="/#archive" className="text-zinc-400 hover:text-white transition-colors">
            &larr; Back to archive
          </Link>
        </div>
      </div>
    )
  }

  const isSkateboard = setup.category === 'skateboard'
  const title = isSkateboard
    ? setup.frontmatter.deck || `${setup.frontmatter.brand || ''} ${setup.frontmatter.model || ''}`.trim()
    : `${setup.frontmatter.brand || ''} ${setup.frontmatter.model || ''}`.trim()

  return (
    <main className="min-h-screen bg-zinc-950 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/#archive"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to archive
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {setup.images.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {setup.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                    <img
                      src={img}
                      alt={`${title} - Image ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600">
                No images available
              </div>
            )}

            {/* Skateboard component images */}
            {isSkateboard && setup.components && setup.components.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                {setup.components
                  .filter((c) => c.image)
                  .map((comp) => (
                    <div key={comp.name} className="space-y-2">
                      <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden">
                        <img
                          src={comp.image}
                          alt={comp.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider text-center">
                        {comp.name}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Setup Info */}
          <div className="space-y-8">
            <div>
              <p className="text-zinc-500 uppercase tracking-wider text-sm mb-2">{setup.category}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">{title}</h1>
            </div>

            {setup.frontmatter.rating != null && setup.frontmatter.rating > 0 && (
              <Stars rating={setup.frontmatter.rating} />
            )}

            {/* Components (for skateboards) */}
            {isSkateboard && setup.components && setup.components.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Components</h2>
                {setup.components.map((comp) => (
                  <div key={comp.name} className="space-y-3">
                    <h3 className="text-zinc-400 text-sm uppercase tracking-wider font-medium">
                      {comp.name}
                    </h3>
                    <p className="text-zinc-100 text-lg font-medium">{comp.title}</p>
                    {Object.entries(comp.specs).length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(comp.specs).map(([key, value]) => (
                          <div key={key} className="border-l-2 border-zinc-800 pl-3 py-1">
                            <p className="text-zinc-500 text-xs uppercase tracking-wider">
                              {key.replace(/_/g, ' ')}
                            </p>
                            <p className="text-zinc-200 text-sm font-medium">
                              <SpecValue value={String(value)} />
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Specs (for shoes) */}
            {!isSkateboard && setup.components?.[0] && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(setup.components[0].specs).map(([key, value]) => (
                    <div key={key} className="border-l-2 border-zinc-800 pl-4 py-1">
                      <p className="text-zinc-500 text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-zinc-200 font-medium">
                        <SpecValue value={String(value)} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {setup.content && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Review</h2>
                <div
                  className="prose prose-invert prose-zinc max-w-none"
                  dangerouslySetInnerHTML={{ __html: setup.content }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
