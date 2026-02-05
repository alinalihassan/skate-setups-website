import type { Setup } from '../lib/types'
import { Stars, SpecValue } from './shared'

interface ShoeSectionProps {
  shoe: Setup
  index: number
  total: number
  isActive: boolean
}

export default function ShoeSection({ shoe, index, total, isActive }: ShoeSectionProps) {
  const component = shoe.components?.[0]
  const specs = component ? Object.entries(component.specs) : []

  return (
    <section
      className={`component-section ${isActive ? 'active' : ''}`}
      data-index={index}
      id={`section-${index}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-screen py-20 flex flex-col justify-center">
            {/* Header */}
            <div className="component-content mb-12">
              <p className="text-zinc-500 text-sm uppercase tracking-widest mb-3 font-medium">
                Current Shoes
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                {component?.brand ? (
                  <>
                    <span className="brand-name">{component.brand}</span>{' '}
                    <span className="model-name">{component.model || component.title}</span>
                  </>
                ) : (
                  <span className="font-bold">{component?.title || 'Unknown Shoes'}</span>
                )}
              </h2>
              {shoe.frontmatter.rating != null && shoe.frontmatter.rating > 0 && (
                <div className="mb-6">
                  <Stars rating={shoe.frontmatter.rating} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Left: Image Gallery */}
              <div className="component-image">
                {shoe.images && shoe.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {shoe.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-square ${idx === 0 ? 'col-span-2' : ''}`}
                      >
                        <div
                          className={`absolute inset-0 bg-zinc-800 rounded-xl transform ${
                            idx % 2 === 0 ? 'rotate-1' : '-rotate-1'
                          } opacity-20`}
                        />
                        <img
                          src={img}
                          alt={`Shoe view ${idx + 1}`}
                          className="relative w-full h-full object-contain rounded-xl bg-zinc-900 shadow-xl"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-800">
                    <p className="text-zinc-600">No images available</p>
                  </div>
                )}
              </div>

              {/* Right: Specs and Description */}
              <div className="component-content">
                {/* Specs */}
                {specs.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-medium">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
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
                  </div>
                )}

                {/* Description / Review */}
                {shoe.content && (
                  <div className="spec-item">
                    <h3 className="text-zinc-500 text-sm uppercase tracking-widest mb-4 font-medium">
                      Review
                    </h3>
                    <div
                      className="prose prose-invert prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: shoe.content }}
                    />
                  </div>
                )}

                {/* Counter */}
                <div className="flex items-center gap-4 text-zinc-600 mt-8">
                  <span className="text-4xl font-bold text-zinc-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-16 h-px bg-zinc-700" />
                  <span className="text-sm">{String(total).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
