import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom to simulate browser APIs (sessionStorage, localStorage, etc.)
    environment: 'jsdom',

    // Auto-import vitest globals (describe, it, expect) — no imports needed
    globals: true,

    // Match all files in __tests__ folders or *.test.ts(x) files
    include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],

    // Setup file for jest-dom matchers (if needed for component tests later)
    setupFiles: ['src/__tests__/setup.ts'],

    // Show detailed output with file names
    reporters: ['verbose'],
  },
})
