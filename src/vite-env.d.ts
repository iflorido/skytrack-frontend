/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_CESIUM_TOKEN: string
  readonly VITE_WS_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}