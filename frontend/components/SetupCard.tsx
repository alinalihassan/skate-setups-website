import Image from 'next/image'
import Link from 'next/link'
import type { Setup } from '../lib/types'

interface SetupCardProps {
  setup: Setup
}

export default function SetupCard({ setup }: SetupCardProps) {
  const firstImage = setup.images[0]
  
  return (
    <Link href={`/setups/${setup.id}`} className="group">
      <div className="bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square bg-zinc-800">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${setup.frontmatter.brand || 'Unknown'} ${setup.frontmatter.model || 'Setup'}`}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              No image
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-white transition-colors">
            {setup.frontmatter.brand} {setup.frontmatter.model}
          </h3>
          
          <p className="text-zinc-500 text-sm mt-1 capitalize">{setup.category}</p>
          
          {setup.frontmatter.rating && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={`${setup.id}-card-star-${i}`}
                  className={`w-4 h-4 ${
                    i < Math.floor(setup.frontmatter.rating! / 2) ? 'text-yellow-500' : 'text-zinc-700'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-zinc-400 text-sm">{setup.frontmatter.rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
