import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Generates manifest file needed for asset mapping
    manifest: true,
  }
})