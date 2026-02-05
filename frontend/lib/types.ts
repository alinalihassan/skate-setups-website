export interface Component {
  name: string
  title: string
  brand?: string
  model?: string
  image?: string
  specs: Record<string, any>
}

export interface Setup {
  id: string
  type: 'setup' | 'shoe'
  category: 'skateboard' | 'shoe'
  frontmatter: {
    id: string
    type: 'setup' | 'shoe'
    brand?: string
    model?: string
    rating?: number
    date?: string
    active?: boolean
    deck?: string
    [key: string]: any
  }
  images: string[]
  components: Component[]
  content?: string
}

export interface CurrentSetupsResponse {
  skateboard: Setup | null
  shoe: Setup | null
}

export interface SetupsResponse {
  setups: Setup[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
