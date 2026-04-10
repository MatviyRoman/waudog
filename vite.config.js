import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['css/']
      }
    }
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: './index.html',
        'account/personal': './account/account-personal.html',
        'account/orders': './account/orders.html',
        'account/orders-empty': './account/orders-empty.html',
        'account/viewed-products': './account/viewed-products.html',
        'account/viewed-products-empty': './account/viewed-products-empty.html',
        'account/favorites': './account/favorites.html',
        'account/favorites-empty.html': "./account/favorites-empty.html",
        '404': './404.html',
        'icons-demo': './icons-demo.html'
      }
    }
  },
  plugins: [
    {
      name: 'copy-js-files',
      closeBundle() {
        const jsDir = join(process.cwd(), 'js');
        const distJsDir = join(process.cwd(), 'docs', 'js');

        if (existsSync(jsDir)) {
          copyDirectory(jsDir, distJsDir);
          console.log('✅ JS files copied to dist/js/');
        }
      }
    }
  ]
});