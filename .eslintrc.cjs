module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    eqeqeq: 'warn', // 要求使用 === 和 !==
    'no-else-return': 'error', // 禁止 if 语句中 return 语句之后有 else 块
    quotes: [2, 'single'], // 强制使用一致的单引号
    semi: [2, 'always'], // 强制是否使用分号
    'no-use-before-define': [1, 'nofunc'], // 未定义前不能使用
    'arrow-parens': 0, // 关闭箭头函数只有一个参数时要带括号
    'comma-dangle': ['error', 'only-multiline'], // 对象字面量项尾不能有逗号
    'react-refresh/only-export-components': 0, // 关闭只导出组件
    'no-unused-vars': 1, // 未使用的变量
    'react/prop-types': 0, // 关闭props校验
    'react-hooks/exhaustive-deps': 0, // 关闭useEffect 依赖空数组
  },
}
