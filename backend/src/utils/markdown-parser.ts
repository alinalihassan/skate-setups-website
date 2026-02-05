export interface SetupMetadata {
  id: string
  type: 'setup' | 'shoe'
  [key: string]: string | boolean | number | undefined
}

export interface Component {
  name: string
  title: string
  brand?: string
  model?: string
  image?: string
  specs: Record<string, any>
}

export interface ParsedSetup {
  id: string
  type: 'setup' | 'shoe'
  frontmatter: SetupMetadata
  images: string[]
  content: string
  filePath: string
  category: 'skateboard' | 'shoe'
  components?: Component[]
}

export function parseYamlFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content }
  }

  const yamlText = frontmatterMatch[1] || ''
  const body = frontmatterMatch[2] || ''

  const frontmatter: Record<string, any> = {}
  const lines = yamlText.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value: any = line.slice(colonIndex + 1).trim()
      
      // Try to parse as boolean
      if (value === 'true') value = true
      else if (value === 'false') value = false
      // Try to parse as number
      else if (!isNaN(Number(value)) && value !== '') value = Number(value)
      // Remove quotes from strings
      else if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      
      frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

export function extractImages(content: string): string[] {
  const images: string[] = []
  const imageRegex = /!\[\[([^\]]+)\]\]/g
  
  let match = imageRegex.exec(content)
  while (match !== null) {
    if (match[1]) {
      images.push(match[1])
    }
    match = imageRegex.exec(content)
  }
  
  return images
}

export function removeImageReferences(content: string): string {
  return content.replace(/!\[\[([^\]]+)\]\]\n?/g, '')
}

// Component definitions for skateboard setups
const COMPONENT_DEFINITIONS = [
  { name: 'deck', label: 'Deck', mainField: 'deck' },
  { name: 'trucks', label: 'Trucks', mainField: 'trucks' },
  { name: 'wheels', label: 'Wheels', mainField: 'wheels' },
  { name: 'bearings', label: 'Bearings', mainField: 'bearings' },
  { name: 'hardware', label: 'Hardware', mainField: 'hardware' },
  { name: 'bushings', label: 'Bushings', mainField: 'bushings' },
  { name: 'griptape', label: 'Grip Tape', mainField: 'griptape' },
]

export function extractComponents(frontmatter: Record<string, any>, category: 'skateboard' | 'shoe'): Component[] {
  if (category === 'shoe') {
    // For shoes, return a single component with all specs
    const shoeSpecs: Record<string, any> = {}
    Object.entries(frontmatter).forEach(([key, value]) => {
      if (!['id', 'type', 'brand', 'model', 'active', 'date', 'rating'].includes(key)) {
        shoeSpecs[key] = value
      }
    })
    
    return [{
      name: 'shoe',
      brand: frontmatter.brand || undefined,
      model: frontmatter.model || undefined,
      title: `${frontmatter.brand || ''} ${frontmatter.model || ''}`.trim() || 'Unknown Shoe',
      specs: shoeSpecs
    }]
  }
  
  // For skateboards, extract each component
  const components: Component[] = []
  
  // Fields to exclude from specs (they get their own dedicated properties)
  const excludedSpecSuffixes = ['image', 'brand', 'model']
  
  for (const def of COMPONENT_DEFINITIONS) {
    const mainValue = frontmatter[def.mainField]
    if (!mainValue) continue
    
    const imageField = `${def.name}_image`
    const image = frontmatter[imageField]
    const brand = frontmatter[`${def.name}_brand`]
    const model = frontmatter[`${def.name}_model`]
    
    // Collect all specs that start with this component name (excluding image, brand, model)
    const specs: Record<string, any> = {}
    Object.entries(frontmatter).forEach(([key, value]) => {
      if (key.startsWith(`${def.name}_`)) {
        const specName = key.slice(def.name.length + 1)
        if (!excludedSpecSuffixes.includes(specName)) {
          specs[specName] = value
        }
      }
    })
    
    components.push({
      name: def.name,
      title: String(mainValue),
      brand: brand ? String(brand) : undefined,
      model: model ? String(model) : undefined,
      image: image ? `/images/${image}` : undefined,
      specs
    })
  }
  
  return components
}

export function parseMarkdownFile(fileContent: string, filePath: string): ParsedSetup {
  const { frontmatter, body } = parseYamlFrontmatter(fileContent)
  const images = extractImages(body)
  const contentWithoutImages = removeImageReferences(body)
  
  const category = filePath.includes('Skateboard') ? 'skateboard' : 'shoe'
  const components = extractComponents(frontmatter, category)
  
  return {
    id: (frontmatter.id as string) || '',
    type: (frontmatter.type as 'setup' | 'shoe') || 'setup',
    frontmatter: frontmatter as SetupMetadata,
    images,
    content: contentWithoutImages,
    filePath,
    category,
    components,
  }
}
