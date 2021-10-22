module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
    'ecmaFeatures': {
      'jsx': true
    },
    sourceType: 'module',
  },
  plugins: [
    'import',
    'react',
    'sort-class-members',
    'sort-keys-fix'
  ],
  rules: {
    'import/order': 'error',
    'indent': ['error', 4, { SwitchCase: 1 }],
    'max-classes-per-file': ['error', 1],
    'max-len': ['error', { code: 140 }],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-multi-spaces': 'error',
    'no-undef': 'off',
    'object-curly-spacing': ['error', 'never'],
    'quotes': ['error', 'single'],
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-spacing': ['error', { when: 'never' }],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-indent': ['error', 4],
    'react/jsx-key': 'error',
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    'react/jsx-no-bind': 0,
    'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    'react/jsx-pascal-case': 'error',
    'react/jsx-props-no-multi-spaces': 'error',
    'react/jsx-sort-props': 'error',
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'never', beforeClosing: 'never' }],
    'react/jsx-wrap-multilines': 'error',
    'semi': ['error', 'always'],
    'sort-class-members/sort-class-members': [2, {
      accessorPairPositioning: 'getThenSet',
      groups: {
        constructor: { name: 'constructor', sort: 'alphabetical', type: 'method' },
        properties: { sort: 'alphabetical', type: 'property' },
        'static-properties': { sort: 'alphabetical', static: true, type: 'property' },
        'conventional-private-properties': { name: '/_.+/', sort: 'alphabetical', type: 'property' },
        methods: { sort: 'alphabetical', type: 'method' },
        'static-methods': { static: true, sort: 'alphabetical', type: 'method' },
        'conventional-private-methods': { name: '/_.+/', sort: 'alphabetical', type: 'method' },
      },
      order: [
        '[static-properties]',
        '[static-methods]',
        '[properties]',
        '[conventional-private-properties]',
        'constructor',
        '[methods]',
        '[conventional-private-methods]'
      ]
    }],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys-fix/sort-keys-fix': ['error', 'asc', { natural: true }]
  },
};
