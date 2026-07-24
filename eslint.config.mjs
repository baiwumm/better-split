import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  typescript: true,
  stylistic: true,
  tailwindcss: true,
  rules: {
    'node/prefer-global/process': ['error', 'always'], // 允许使用全局 process
  },
})
