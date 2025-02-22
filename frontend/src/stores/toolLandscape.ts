import { defineStore } from 'pinia'
import type { ToolDomain, ToolCategory, Tool } from '../types/ToolTypes'
import toolYamlData from '@/assets/tool-landscape.yaml'

function generateUUIDv4(): string {
  // Generate a random UUID (version 4)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

interface ToolLandscapeState {
  domains: ToolDomain[]
  categories: ToolCategory[]
  tools: Tool[]
  searchQuery: string
  tags: string[]
  selectedTag: string | null
}

export const useToolLandscapeStore = defineStore('toolLandscape', {
  state: (): ToolLandscapeState => ({
    domains: [],
    categories: [],
    tools: [],
    searchQuery: '',
    tags: [],
    selectedTag: null,
  }),

  actions: {
    addDomain(domain: ToolDomain) {
      this.domains.push(domain)
    },

    deleteDomain(domain: ToolDomain) {
      this.domains = this.domains.filter((d) => d.uid !== domain.uid)
    },

    getDomainById(uid: string) {
      return this.domains.find((domain) => domain.uid === uid)
    },

    addCategory(category: ToolCategory) {
      this.categories.push(category)
    },

    deleteCategory(category: ToolCategory) {
      this.categories = this.categories.filter((c) => c.uid !== category.uid)
    },

    getCategoriesByDomainId(domainId: string) {
      return this.categories.filter((category) => category.domainId === domainId)
    },

    getCategoryById(uid: string) {
      return this.categories.find((category) => category.uid === uid)
    },

    addTool(tool: Tool) {
      this.tools.push(tool)
    },

    deleteTool(tool: Tool) {
      this.tools = this.tools.filter((t) => t.uid !== tool.uid)
    },

    getToolById(uid: string) {
      return this.tools.find((tool) => tool.uid === uid)
    },

    initializeFromYaml() {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const data = toolYamlData as any
      const domains = data.domains
      console.log('Loading YAML data:', data) // Debug log
      domains.forEach((domain: any) => {
        domain.uid = generateUUIDv4()
        console.log('Processing domain:', domain) // Debug log
        this.addDomain(domain)
        const categories = domain.categories

        // If there are categories, add them
        if (categories) {
          categories.forEach((category: any) => {
            category.uid = generateUUIDv4()
            category.domainId = domain.uid
            this.addCategory(category)
            const tools = category.tools

            // If there are tools, add them
            if (tools) {
              tools.forEach((tool: any) => {
                tool.uid = generateUUIDv4()
                tool.categoryId = category.uid
                this.addTool(tool)
              })
            }
          })
        }
      })
    },

    initializeFromYamlOrig() {
      const data = toolYamlData as {
        domains: ToolDomain[]
        categories: ToolCategory[]
        tools: Tool[]
      }
      data.domains.forEach((domain) => this.addDomain(domain))
      data.categories.forEach((category) => this.addCategory(category))
      data.tools.forEach((tool) => this.addTool(tool))
    },

    getToolsByCategoryId(categoryId: string) {
      return this.tools.filter((tool: Tool) => tool.categoryId === categoryId)
    },

    getToolsByDomainId(domainId: string) {
      return this.tools.filter((tool: Tool) => tool.domainId === domainId)
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setSelectedTag(tag: string | null) {
      this.selectedTag = tag
    },
  },

  getters: {
    getAllDomains: (state) => state.domains,
    getAllCategories: (state) => state.categories,
    filteredTools: (state) => {
      const query = state.searchQuery.toLowerCase().trim()
      if (!query) return state.tools

      return state.tools.filter((tool) => {
        const nameMatches = (tool.name?.toLowerCase() || '').includes(query)
        const descriptionMatches = (tool.description?.toLowerCase() || '').includes(query)
        return nameMatches || descriptionMatches
      })
    },
    getAllTags: (state) => {
      const tagSet = new Set<string>()
      state.tools.forEach(tool => {
        tool.tags?.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    },
    getSelectedTag: (state) => state.selectedTag,
  },
})
