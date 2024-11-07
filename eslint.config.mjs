import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  ignorePatterns: ['**/node_modules/**', '**/dist/**']
})
