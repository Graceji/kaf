/* eslint-disable no-unused-vars */
const replace = require('replace-in-file');

const indexPage = `# API手册V2.0

根据UI框架和运行环境的不同，请使用不同的Package：

- [@kaf/react-web](./react-web.md)
- [@kaf/react-taro](./react-taro.md)
- [@kaf/vue-web](./vue-web.md)
- [@kaf/vue-taro](./vue-taro.md)
- [@kaf/model](./model.md)
`;
replace.sync({
  files: './api/api/index.md',
  from: /[\d\D]*/,
  to: indexPage,
  countMatches: true,
});

replace.sync({
  files: ['./api/api/react-web.md', './api/api/react-taro.md', './api/api/vue-web.md', './api/api/vue-taro.md', './api/api/model.md'],
  from: [/## Interfaces[\d\D]*?## Variables/, /\n## Type Aliases[\d\D]*?$/],
  to: ['## Variables', ''],
  countMatches: true,
});
