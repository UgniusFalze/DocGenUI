/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_LOGIN_SERVICE_URL: string
    readonly VITE_API_URL: string
    readonly VITE_REDIRECT_URI: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }