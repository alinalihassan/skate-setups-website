import { NextResponse } from 'next/server'
import { loadAllSetups, getCurrentSetups } from '../../../../lib/file-loader'
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

export async function GET() {
  const setups = loadAllSetups()
  const { skateboard, shoe } = getCurrentSetups(setups)

  if (!skateboard && !shoe) {
    return NextResponse.json(
      { error: 'No active setups found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    skateboard: skateboard ? formatSetupResponse(skateboard, true) : null,
    shoe: shoe ? formatSetupResponse(shoe, true) : null,
  })
}
