import { defineStore } from 'pinia'
import type { ToolDomain, ToolCategory } from '../types/ToolTypes'
import yaml from 'js-yaml'

interface ToolLandscapeState {
    domains: ToolDomain[]
    categories: ToolCategory[]
}

export const useToolLandscapeStore = defineStore('toolLandscape', {
    state: (): ToolLandscapeState => ({
        domains: [],
        categories: []
    }),

    actions: {
        addDomain(domain: ToolDomain) {
            this.domains.push(domain)
        },
        addCategory(category: ToolCategory) {
            this.categories.push(category)
        },
        getDomainById(uid: string) {
            return this.domains.find(domain => domain.uid === uid)
        },
        getCategoriesByDomainId(domainId: string) {
            return this.categories.filter(category => category.domainId === domainId)
        },
 
    },

    getters: {
        getAllDomains: (state) => state.domains,
        getAllCategories: (state) => state.categories
    }
}) 