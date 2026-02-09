import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseMarkdownFile, type ParsedSetup, type SetupMetadata } from './markdown-parser'

const SETUP_DIR = join(process.cwd(), 'data')

export function findMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverseDirectory(currentDir: string) {
    const entries = readdirSync(currentDir)
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        // Skip Resources folder as it contains images, not markdown
        if (entry !== 'Resources') {
          traverseDirectory(fullPath)
        }
      } else if (entry.endsWith('.md') && entry !== 'Training Practice.md') {
        files.push(fullPath)
      }
    }
  }
  
  traverseDirectory(dir)
  return files
}

export function loadAllSetups(): ParsedSetup[] {
  const markdownFiles = findMarkdownFiles(SETUP_DIR)
  const setups: ParsedSetup[] = []
  
  for (const filePath of markdownFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const setup = parseMarkdownFile(content, filePath)
      setups.push(setup)
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error)
    }
  }
  
  return setups
}

export function getCurrentSetup(setups: ParsedSetup[]): ParsedSetup | null {
  return setups.find(s => s.frontmatter.active === true) || null
}

export function getCurrentSetups(setups: ParsedSetup[]): { skateboard: ParsedSetup | null; shoe: ParsedSetup | null } {
  return {
    skateboard: setups.find(s => s.frontmatter.active === true && s.category === 'skateboard') || null,
    shoe: setups.find(s => s.frontmatter.active === true && s.category === 'shoe') || null,
  }
}

export function getSetupById(setups: ParsedSetup[], id: string): ParsedSetup | null {
  return setups.find(s => s.frontmatter.id === id) || null
}

export function filterSetupsByCategory(setups: ParsedSetup[], category: 'skateboard' | 'shoe'): ParsedSetup[] {
  return setups.filter(s => s.category === category)
}
