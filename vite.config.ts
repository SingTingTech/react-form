import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import styleImport from 'vite-plugin-style-import'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    server: {
      port: 8080,
      host: '0.0.0.0',
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        // { find: '@', replacement: path.resolve(__dirname, 'src') },
        // fix less import by: @import ~
        // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
        { find: /^~/, replacement: '' },
      ],
    },
    plugins: [
      react(),
      styleImport({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => {
              return `antd/es/${name}/style/index`
            },
          },
        ],
      }),
    ],
  })
}
