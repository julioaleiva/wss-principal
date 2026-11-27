# WSS Web

Sitio público: https://wss-principal.netlify.app/

El catálogo se edita en **`catalogo.json`**. Para agregar, cambiar o quitar un sistema, modificá solo ese archivo y subí el cambio a la rama `master` de GitHub. Netlify ejecuta `node build.mjs` y publica `dist/index.html` automáticamente.

Para mostrar u ocultar la sección «Quién soy», cambiá `quiensoy_visible` a `true` o `false` en el mismo JSON. Cuando está oculta, también desaparecen sus enlaces del menú y del pie de página.

Cada ficha contiene:

- `id`: identificador único, en minúsculas y con guiones.
- `category`: clave de una categoría definida en `categories`.
- `name` y `description`: textos `es` y `en`. La descripción debe explicar el beneficio y el alcance sin presentar una propuesta como producto terminado.
- `tags`: listas `es` y `en`.
- `icon`: emoji de la tarjeta.
- `status`: `idea` o `live` (también se admiten `beta` y `soon`).
- `url`: URL HTTPS del sistema publicado, o `null` para una propuesta. Si el estado es `live`, la URL es obligatoria.

Para crear un rubro nuevo, agregá su clave y sus nombres `es` y `en` en `categories` del mismo JSON. El filtro y el formulario se actualizan en la compilación.

`index.html` incluye una copia generada del catálogo para que el contenido sea visible a buscadores antes de ejecutar JavaScript. **No edites manualmente esa copia**: el generador la reemplaza desde `catalogo.json` en cada despliegue.

## Verificación local

Ejecutá `node build.mjs` y abrí `dist/index.html` en el navegador. No hacen falta paquetes adicionales. El formulario de contacto usa FormSubmit y, si falla, abre un correo de respaldo.
