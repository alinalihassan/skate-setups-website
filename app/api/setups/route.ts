import { NextResponse } from 'next/server'
import { loadAllSetups, filterSetupsByCategory } from '../../../lib/file-loader'
import type { ParsedSetup } from '../../../lib/markdown-parser'
import { renderMarkdown } from '../../../lib/markdown'

function formatSetupResponse(setup: ParsedSetup, includeContent = false) {
  const response: any = {
    id: setup.id,
    type: setup.type,
    category: setup.category,
    frontmatter: setup.frontmatter,
    images: setup.images.map(img => `/api/images/${img}`),
    components: setup.components,
  }

  if (includeContent) {
    response.content = renderMarkdown(setup.content)
  }

  return response
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as 'skateboard' | 'shoe' | null
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  const setups = loadAllSetups()
  let filtered = setups

  if (type === 'skateboard') {
    filtered = filterSetupsByCategory(setups, 'skateboard')
  } else if (type === 'shoe') {
    filtered = filterSetupsByCategory(setups, 'shoe')
  }

  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)

  return NextResponse.json({
    setups: paginated.map(s => formatSetupResponse(s, false)),
    pagination: {
      page,
      limit,
      total: filtered.length,
      pages: Math.ceil(filtered.length / limit),
    },
  })
}
