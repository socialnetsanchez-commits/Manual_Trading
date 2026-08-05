# Manual de Trading de Oro

Proyecto estático compatible con **VitePress**, **GitHub** y **Vercel**. No usa servidor Python ni React: Vercel solo instala Node.js y genera archivos estáticos.

## Publicar en Vercel

1. Sube el contenido de esta carpeta a un repositorio nuevo de GitHub.
2. En Vercel selecciona **Add New → Project** e importa ese repositorio.
3. Deja los valores que detecta Vercel. Si pide configurarlos manualmente, usa:
   - Framework Preset: `VitePress`
   - Build Command: `npm run build`
   - Output Directory: `docs/.vitepress/dist`
4. Pulsa **Deploy**.

La portada redirige automáticamente a `manual.html`, que contiene la aplicación y todos sus recursos. Los gráficos están dentro de `docs/public/charts`, por lo que VitePress los copia al resultado final.

## Probar en el ordenador

```bash
npm install
npm run dev
```

Para verificar la versión final:

```bash
npm run build
npm run preview
```

## Estructura

- `docs/public/manual.html`: la aplicación.
- `docs/public/styles.css`: estilos de la aplicación.
- `docs/public/app.js`: interacciones (tema, navegación y botones).
- `docs/public/charts/`: gráficos usados por el manual.
- `docs/.vitepress/config.mts`: configuración de VitePress.
