'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '../lib/api'
import type { Setup, SetupsResponse } from '../lib/types'
import { Stars } from './shared'

function ArchiveCard({ setup }: { setup: Setup }) {
  const isSkateboard = setup.category === 'skateboard'
  const title = isSkateboard
    ? setup.frontmatter.deck || 'Unknown Deck'
    : `${setup.frontmatter.brand || ''} ${setup.frontmatter.model || ''}`.trim()
  const firstImage = setup.images[0]

  return (
    <Link href={`/setups/${setup.id}`}>
      <div className="setup-card bg-zinc-900 rounded-xl overflow-hidden cursor-pointer">
        <div className="relative aspect-square bg-zinc-800">
          {firstImage ? (
            <img src={firstImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-1 text-zinc-100">{title}</h3>
          <p className="text-zinc-500 text-sm capitalize mb-2">{setup.category}</p>
          {setup.frontmatter.rating != null && setup.frontmatter.rating > 0 && (
            <div className="text-sm">
              <Stars rating={setup.frontmatter.rating} />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'skateboard', label: 'Boards' },
  { id: 'shoe', label: 'Shoes' },
] as const

export default function ArchiveSection() {
  const [filter, setFilter] = useState('all')
  const url = filter === 'all' ? '/api/setups' : `/api/setups?type=${filter}`
  const { data } = useSWR<SetupsResponse>(url, fetcher)

  const setups = data?.setups?.filter((s) => !s.frontmatter.active) ?? []

  return (
    <section className="archive-section" id="archive">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-2">Archive</h2>
              <p className="text-zinc-500">Browse previous setups and gear</p>
            </div>
            <div className="flex gap-2">
              {filters.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === id
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {setups.map((setup) => (
              <ArchiveCard key={setup.id} setup={setup} />
            ))}
          </div>

          {setups.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-600 text-lg">No setups found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
