# Skate Setups Showcase

A modern, dark-themed website to showcase skateboard setups and shoes. Built with Bun, Elysia, Next.js, and React.

## Features

- **Full-Page Scroll Snap**: Each skateboard component (deck, trucks, wheels, etc.) gets its own immersive full-viewport section
- **Animated Transitions**: Content fades and slides in as you scroll through sections
- **Current Setup Hero**: Displays the currently active skateboard setup and shoes
- **Archive Gallery**: Browse all previous setups and shoes with filtering
- **Filter Tabs**: Filter by "All", "Boards", or "Shoes"
- **Setup Detail Pages**: Click any setup in the archive for full details
- **Markdown Database**: Uses your existing Markdown files from Obsidian
- **Image Gallery**: Supports multiple images per setup
- **Responsive Design**: Works on all screen sizes
- **Dark Theme**: Clean, modern dark aesthetic perfect for showcasing gear
- **Dual Frontend**: React/Next.js app + legacy vanilla JS version

## Tech Stack

- **Runtime**: Bun
- **Backend**: Elysia (Bun-native web framework)
- **Frontend (React)**: Next.js 16 with App Router, React 19, Tailwind CSS v3
- **Frontend (Legacy)**: Vanilla JavaScript with Tailwind CSS (via CDN)
- **Markdown Parser**: `Bun.markdown` (built-in, uses md4c)
- **Image Serving**: Static files from Setup/Resources

## Project Structure

```
Skate Setups/
├── backend/
│   ├── index.ts              # Elysia server with API routes (port 3001)
│   └── src/
│       └── utils/
│           ├── markdown-parser.ts    # Parse YAML frontmatter & markdown
│           └── file-loader.ts        # Load markdown files from Setup/
├── frontend/                 # Next.js application (port 3000)
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page (scroll-snap sections)
│   │   ├── globals.css       # Tailwind + custom animations
│   │   └── setups/[id]/
│   │       └── page.tsx      # Setup detail page
│   ├── components/
│   │   ├── ComponentSection.tsx  # Full-page skateboard component section
│   │   ├── ShoeSection.tsx       # Full-page shoe section
│   │   ├── ArchiveSection.tsx    # Archive grid with filtering
│   │   └── shared.tsx            # Shared components (Stars, SpecValue)
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   └── types.ts          # TypeScript type definitions
│   ├── public/
│   │   └── index.html        # Legacy vanilla JS SPA
│   ├── next.config.mjs       # Next.js config (API + image rewrites)
│   ├── postcss.config.cjs    # PostCSS config
│   └── tailwind.config.cjs   # Tailwind CSS config
├── Setup/                    # Your existing Obsidian vault
│   ├── Skateboard Setups/    # Markdown files for skateboards
│   ├── Shoes/                # Markdown files for shoes
│   └── Resources/            # Images referenced in markdown
└── package.json
```

## Running

### Both servers (recommended)

```bash
bun install
bun run dev:all
```

This starts:
- **Port 3000**: Next.js React app
- **Port 3001**: Backend API + legacy vanilla JS app

### Individual servers

```bash
# Backend API + legacy HTML (port 3001)
bun run dev

# Next.js React frontend (port 3000) - requires backend running
bun run dev:frontend
```

### Open in browser

- **React version**: http://localhost:3000
- **Legacy HTML version**: http://localhost:3001

## Markdown File Format

Each setup is a Markdown file with YAML frontmatter:

```markdown
---
id: shoes-etnies-barge-ls
type: shoe
brand: Etnies
model: Barge LS
shoe-type: low-top
construction: vulcanized
rating: 9.5
active: true
date: 2026-01-09
---

![[Etnies Barge LS - 1.jpeg]]
![[Etnies Barge LS - 2.jpeg]]
![[Emerica Dickson - 3.png]]

### Pros
- Really cool stealthy style
- New 2026 model
- STI Comfort Level 1
```

### Required Fields
- `id`: Unique identifier for the setup
- `type`: Either "setup" (skateboard) or "shoe"
- `brand`: Brand name
- `model`: Model name

### Optional Fields
- `rating`: Rating out of 10
- `active`: Set to `true` for current setup (only one per category should be active)
- `date`: Date acquired
- Any other specs you want to display

### Image References
Images use Obsidian's wikilink format: `![[filename]]`. Place images in `Setup/Resources/`.

## API Endpoints

- `GET /api/setups` - List all setups (with optional `?type=skateboard|shoe` filter)
- `GET /api/setups/current` - Get the currently active skateboard and shoe setups
- `GET /api/setups/:id` - Get a specific setup by ID
- `GET /images/:filename` - Serve images from Setup/Resources

## Adding New Setups

1. Create a new Markdown file in `Setup/Skateboard Setups/` or `Setup/Shoes/`
2. Add YAML frontmatter with at least `id`, `type`, `brand`, and `model`
3. Reference images using `![[filename]]` syntax
4. Place images in `Setup/Resources/`
5. Set `active: true` if this is your current setup (remember to set others to `false`)
6. The server will automatically pick up the new file (reload the page)

## Development

The backend automatically reloads on file changes when running with `--hot`.

This project was created using `bun init` in bun v1.3.8. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
