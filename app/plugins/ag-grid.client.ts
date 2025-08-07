import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

export default defineNuxtPlugin(() => {
  ModuleRegistry.registerModules([AllCommunityModule])
})