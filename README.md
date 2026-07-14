# WSS — Eclipse de Sistemas

Landing estática moderna para presentar y vender sistemas de información.

**Autor:** Julio A. Leiva — Ingeniero en Sistemas de Información y Abogado  
**Contacto:** [wssarg@gmail.com](mailto:wssarg@gmail.com)  
**GitHub:** [julioaleiva](https://github.com/julioaleiva)

## Stack

- HTML5
- CSS3 (tema eclipse: negros, blancos y grises)
- JavaScript vanilla

Sin frameworks. Sin build. Lista para GitHub Pages.

## Estructura

```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── systems.js   ← catálogo de sistemas (editar aquí)
│   └── main.js
└── README.md
```

## Cómo agregar un nuevo sistema

Editá `js/systems.js` y sumá un objeto al array `SYSTEMS`:

```js
{
  id: "mi-nuevo-sistema",
  name: "Nombre comercial",
  category: "gestion", // gestion | inmobiliaria | ia | juegos | enfermeria | banca | finanzas | legales
  description: "Pitch breve de venta.",
  url: "https://tu-demo.com", // o null si aún no está publicado
  status: "live", // live | beta | soon
  tags: ["Tag1", "Tag2"],
  icon: "🚀",
}
```

Guardá y listo: la página lo muestra filtrado por rubro.

## Contacto (email)

El formulario envía a **wssarg@gmail.com** mediante [FormSubmit](https://formsubmit.co).

La primera vez que alguien envíe un mensaje, FormSubmit pedirá confirmar el correo.  
Si el servicio no responde, el sitio abre un `mailto:` de respaldo.

## Publicar en GitHub Pages

1. Creá el repositorio (si aún no existe).
2. Subí estos archivos a la rama `main`.
3. En el repo: **Settings → Pages → Source: Deploy from a branch → Branch: main / root**.
4. La URL quedará similar a:  
   `https://julioaleiva.github.io/<nombre-del-repo>/`

Si usás el repo de usuario `julioaleiva.github.io`, la home será:

`https://julioaleiva.github.io/`

## Vista local

Abrí `index.html` en el navegador, o serví la carpeta:

```bash
# Python
python -m http.server 5500

# Node (si tenés npx)
npx serve .
```

## Rubros incluidos

- Gestión  
- Inmobiliaria  
- Inteligencia Artificial  
- Juegos  
- Enfermería  
- Banca  
- Finanzas  
- Legales  

---

© WSS — Sistemas que eclipsan lo común.
