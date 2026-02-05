'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Setup } from '../lib/types'

interface CurrentSetupProps {
  setup: Setup
}

export default function CurrentSetup({ setup }: CurrentSetupProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-4">
          <span className="text-zinc-500 text-sm uppercase tracking-wider">Currently Riding</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-900 rounded-lg overflow-hidden">
              {setup.images[selectedImage] ? (
                <Image
                  src={setup.images[selectedImage]}
                  alt={`${setup.frontmatter.brand || 'Unknown'} ${setup.frontmatter.model || 'Setup'} - Main View`}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  No image
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {setup.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {setup.images.map((img, idx) => (
                  <button
                    type="button"
                    key={`${setup.id}-thumb-${idx}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden transition-all ${
                      selectedImage === idx ? 'ring-2 ring-zinc-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${setup.frontmatter.brand || 'Unknown'} ${setup.frontmatter.model || 'Setup'} - Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Setup Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                {setup.frontmatter.brand} {setup.frontmatter.model}
              </h1>
              <p className="mt-2 text-zinc-500 capitalize">{setup.category}</p>
            </div>
            
            {setup.frontmatter.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={`star-${i}`}
                    className={`w-5 h-5 ${
                      i < Math.floor(setup.frontmatter.rating!) ? 'text-yellow-500' : 'text-zinc-700'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-zinc-400">{setup.frontmatter.rating}/10</span>
              </div>
            )}
            
            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(setup.frontmatter)
                .filter(([key]) => !['id', 'type', 'brand', 'model', 'rating', 'active', 'date'].includes(key))
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={`${setup.id}-spec-${key}`} className="border-l-2 border-zinc-800 pl-4">
                    <p className="text-zinc-500 text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-zinc-200">{String(value)}</p>
                  </div>
                ))}
            </div>
            
            {/* Render markdown content safely */}
            {setup.content && (
              <div 
                className="prose prose-invert prose-zinc max-w-none"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: setup.content }}
              />
            )}
            
            <Link
              href={`/setups/${setup.id}`}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              View full details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
