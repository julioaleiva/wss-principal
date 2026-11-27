# WSS Web

Sitio público: https://wss-principal.netlify.app/

La página completa está en `index.html`: HTML, estilos, catálogo y comportamiento JavaScript. No necesita archivos CSS ni JS externos.

## Catálogo

Incluye 25 ideas en 7 rubros. Para editar una tarjeta, modificá el array `SYSTEMS` dentro del bloque `<script>` de `index.html`. Las categorías están en `CATEGORIES`. Cada idea usa `status: "idea"` y `url: null`; al publicar un producto, agregá su URL y cambiá el estado a `live` o `beta`.

## Uso local

Abrí `index.html` directamente en el navegador. El formulario de contacto usa FormSubmit y, si falla, abre un correo de respaldo.
