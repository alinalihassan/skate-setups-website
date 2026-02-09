import { NextResponse } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const RESOURCES_DIR = join(process.cwd(), 'data', 'Resources')

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const filename = path.join('/')
  const filePath = join(RESOURCES_DIR, filename)

  // Security check: ensure the file is within the Resources directory
  if (!filePath.startsWith(RESOURCES_DIR)) {
    return NextResponse.json(
      { error: 'Invalid path' },
      { status: 400 }
    )
  }

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    )
  }

  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  const file = readFileSync(filePath)

  return new NextResponse(file, {
    headers: {
      'Content-Type': contentType,
    },
  })
}
