import { NextResponse } from 'next/server'
import { loadAllSetups, getSetupById } from '../../../../lib/file-loader'
import type { ParsedSetup } from '../../../../lib/markdown-parser'
import { renderMarkdown } from '../../../../lib/markdown'

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const setups = loadAllSetups()
  const setup = getSetupById(setups, id)

  if (!setup) {
    return NextResponse.json(
      { error: 'Setup not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(formatSetupResponse(setup, true))
}
