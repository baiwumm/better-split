import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  react: true,
  stylistic: true,
  tailwindcss: true,
  typescript: true,
  rules: {
  // 允许使用全局 process（Node.js 环境）
    'node/prefer-global/process': ['error', 'always'],

    // 排序 export 导出顺序
    // 例如 export { A }、export { B } 按字母升序排列
    'perfectionist/sort-exports': [
      'warn',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // import 分组及排序
    // side-effect → Node 内置 → 第三方依赖 → 项目内部 → 相对路径 → 类型导入
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'side-effect',
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'type',
        ],

        // 不同 import 分组之间保留 1 行空行
        newlinesBetween: 1,

        // 按字母升序排列
        order: 'asc',

        // 使用字母排序规则
        type: 'alphabetical',
      },
    ],

    // 排序具名 export
    // 例如 export { Button, Avatar } 按名称排序
    'perfectionist/sort-named-exports': [
      'warn',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // 排序 import 中的具名导入
    // 例如 import { useEffect, useState } from 'react'
    'perfectionist/sort-named-imports': [
      'warn',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // 禁止无意义 React Fragment
    // 例如避免 <><div /></>，推荐直接使用 <div />
    'react/jsx-no-useless-fragment': [
      'warn',
    ],

    // JSX 表达式大括号空格规则
    // 统一使用 {value}，禁止 { value }
    'style/jsx-curly-spacing': [
      'error',
      {
        children: true,
        when: 'never',
      },
    ],

    // JSX 属性换行规则
    // 每行最多 3 个 props，超过后换行
    'style/jsx-max-props-per-line': [
      'error',
      {
        maximum: 3,
      },
    ],

    // JSX 自闭合标签规则
    // 空组件和 HTML 标签必须使用自闭合形式
    // 例如 <Icon /> 而不是 <Icon></Icon>
    'style/jsx-self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
  },
})
