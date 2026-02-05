import { Elysia, t } from 'elysia'
import { watch } from 'node:fs'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { loadAllSetups, getCurrentSetups, getSetupById, filterSetupsByCategory } from './src/utils/file-loader'
import type { ParsedSetup } from './src/utils/markdown-parser'

// --- Setup data with file watching ---
const SETUP_DIR = join(process.cwd(), 'Setup')

let setups = loadAllSetups()
console.log('Loading setups from:', SETUP_DIR)
console.log('Found', setups.length, 'setups')

// Watch the Setup/ directory recursively for changes
const watcher = watch(SETUP_DIR, { recursive: true }, (event, filename) => {
  if (!filename) return

  // Only reload for markdown file changes (ignore image/resource changes)
  if (filename.endsWith('.md')) {
    console.log(`📝 Detected ${event} in ${filename} — reloading setups...`)
    setups = loadAllSetups()
    console.log(`   Reloaded ${setups.length} setups`)
  }
})

process.on('SIGINT', () => {
  watcher.close()
  process.exit(0)
})

// --- Helpers ---

function formatSetupResponse(setup: ParsedSetup, includeContent = false) {
  const response: any = {
    id: setup.id,
    type: setup.type,
    category: setup.category,
    frontmatter: setup.frontmatter,
    images: setup.images.map(img => `/images/${img}`),
    components: setup.components,
  }

  if (includeContent) {
    response.content = Bun.markdown.html(setup.content)
  }

  return response
}

// --- API routes ---

const app = new Elysia()
  .get('/api/setups', ({ query }) => {
    let filtered = setups

    if (query.type === 'skateboard') {
      filtered = filterSetupsByCategory(setups, 'skateboard')
    } else if (query.type === 'shoe') {
      filtered = filterSetupsByCategory(setups, 'shoe')
    }

    const page = parseInt(query.page || '1', 10)
    const limit = parseInt(query.limit || '12', 10)
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return {
      setups: paginated.map(s => formatSetupResponse(s, false)),
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      },
    }
  }, {
    query: t.Object({
      type: t.Optional(t.Union([t.Literal('skateboard'), t.Literal('shoe')])),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })

  .get('/api/setups/current', () => {
    const { skateboard, shoe } = getCurrentSetups(setups)

    if (!skateboard && !shoe) {
      return new Response('No active setups found', { status: 404 })
    }

    return {
      skateboard: skateboard ? formatSetupResponse(skateboard, true) : null,
      shoe: shoe ? formatSetupResponse(shoe, true) : null,
    }
  })

  .get('/api/setups/:id', ({ params }) => {
    const setup = getSetupById(setups, params.id)

    if (!setup) {
      return new Response('Setup not found', { status: 404 })
    }

    return formatSetupResponse(setup, true)
  }, {
    params: t.Object({
      id: t.String(),
    }),
  })

  .get('/api/setups/type/:type', ({ params, query }) => {
    const filtered = filterSetupsByCategory(setups, params.type as 'skateboard' | 'shoe')

    const page = parseInt(query.page || '1', 10)
    const limit = parseInt(query.limit || '12', 10)
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    return {
      setups: paginated.map(s => formatSetupResponse(s, false)),
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      },
    }
  }, {
    params: t.Object({
      type: t.Union([t.Literal('skateboard'), t.Literal('shoe')]),
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })

// --- Static files ---

app.get('/images/*', async ({ request }) => {
  const url = new URL(request.url)
  const filename = decodeURIComponent(url.pathname.replace('/images/', ''))
  const filePath = join(process.cwd(), 'Setup', 'Resources', filename)

  if (!existsSync(filePath)) {
    return new Response('Image not found', { status: 404 })
  }

  const file = Bun.file(filePath)
  return new Response(file)
})

// --- Start server ---

app.listen(3001, () => {
  console.log('🛹 Skate Setups server running at http://localhost:3001')
  console.log('👀 Watching Setup/ for changes...')
})
