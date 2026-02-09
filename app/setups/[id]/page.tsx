'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '../../../lib/api'
import type { Setup } from '../../../lib/types'
import { Stars, SpecValue } from '../../../components/shared'
import SkateboardSetup from '../../../components/SkateboardSetup'

export default function SetupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: setup, isLoading } = useSWR<Setup>(id ? `/api/setups/${id}` : null, fetcher)

  const isSkateboard = setup?.category === 'skateboard'

  if (isLoading) {
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

  if (isSkateboard) {
    return <SkateboardSetup setup={setup} showBackButton={true} />
  }

  // Shoe detail page layout
  const title = `${setup.frontmatter.brand || ''} ${setup.frontmatter.model || ''}`.trim()
  const component = setup.components?.[0]

  return (
    <main className="min-h-screen bg-zinc-950 px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
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
            {setup.images.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {setup.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                    <img src={img} alt={`${title} - Image ${idx + 1}`} className="w-full h-full object-contain" />
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

            {component && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(component.specs).map(([key, value]) => (
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

            {setup.content && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Review</h2>
                {setup.frontmatter.rating != null && setup.frontmatter.rating > 0 && (
                  <div className="mb-4">
                    <Stars rating={setup.frontmatter.rating} />
                  </div>
                )}
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
