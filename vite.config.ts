import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Mapeia a variável GEMINI_API_KEY (do Vercel) para process.env.API_KEY (usado no código)
      // Adicionamos um fallback para env.API_KEY caso esteja rodando localmente com o nome antigo
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});