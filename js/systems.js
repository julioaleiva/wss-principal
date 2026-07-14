/**
 * WSS — Catálogo de sistemas
 * ---------------------------------------------
 * Para agregar un nuevo sistema, sumá un objeto al array SYSTEMS.
 * Campos:
 *  - id: string único
 *  - name: nombre comercial
 *  - category: debe coincidir con una key de CATEGORIES
 *  - description: breve pitch de venta
 *  - url: enlace al sistema (demo o producción). null = "Próximamente"
 *  - status: "live" | "soon" | "beta"
 *  - tags: array de strings cortos
 *  - icon: emoji o símbolo
 */

const CATEGORIES = {
  gestion: {
    id: "gestion",
    label: "Gestión",
    description: "Operaciones, procesos y control integral",
  },
  inmobiliaria: {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    description: "Propiedades, clientes y operaciones",
  },
  ia: {
    id: "ia",
    label: "Inteligencia Artificial",
    description: "Automatización inteligente y modelos",
  },
  juegos: {
    id: "juegos",
    label: "Juegos",
    description: "Experiencias interactivas y entretenimiento",
  },
  enfermeria: {
    id: "enfermeria",
    label: "Enfermería",
    description: "Salud, turnos y gestión clínica",
  },
  banca: {
    id: "banca",
    label: "Banca",
    description: "Productos financieros y operaciones bancarias",
  },
  finanzas: {
    id: "finanzas",
    label: "Finanzas",
    description: "Control económico, reportes y flujo de caja",
  },
  legales: {
    id: "legales",
    label: "Legales",
    description: "Expedientes, plazos y práctica jurídica",
  },
};

/**
 * CATÁLOGO
 * Reemplazá las URLs cuando publiques cada sistema.
 * Mientras tanto podés dejar url: null para mostrar "Próximamente".
 */
const SYSTEMS = [
  {
    id: "wss-gestion-core",
    name: "WSS Gestión Core",
    category: "gestion",
    description:
      "Plataforma integral para administrar procesos, usuarios, reportes y operación diaria de tu empresa.",
    url: null,
    status: "soon",
    tags: ["ERP", "Reportes", "Roles"],
    icon: "⚙️",
  },
  {
    id: "wss-inmo",
    name: "WSS Inmobiliaria",
    category: "inmobiliaria",
    description:
      "Gestión de propiedades, captaciones, clientes, visitas y operaciones de compra-venta o alquiler.",
    url: null,
    status: "soon",
    tags: ["Propiedades", "CRM", "Contratos"],
    icon: "🏢",
  },
  {
    id: "wss-ai-suite",
    name: "WSS AI Suite",
    category: "ia",
    description:
      "Herramientas de inteligencia artificial para automatizar tareas, asistentes y análisis de datos.",
    url: null,
    status: "soon",
    tags: ["LLM", "Automatización", "Analytics"],
    icon: "🤖",
  },
  {
    id: "wss-play",
    name: "WSS Play",
    category: "juegos",
    description:
      "Experiencias lúdicas y plataformas de juego con paneles de administración y métricas.",
    url: null,
    status: "soon",
    tags: ["Gaming", "UX", "Realtime"],
    icon: "🎮",
  },
  {
    id: "wss-nurse",
    name: "WSS Enfermería",
    category: "enfermeria",
    description:
      "Sistema para turnos, seguimiento de pacientes, registros clínicos y coordinación del equipo de salud.",
    url: null,
    status: "soon",
    tags: ["Turnos", "Historias", "Equipo"],
    icon: "🩺",
  },
  {
    id: "wss-bank",
    name: "WSS Banca",
    category: "banca",
    description:
      "Módulos para operaciones bancarias, productos, clientes y control de procesos financieros.",
    url: null,
    status: "soon",
    tags: ["Cuentas", "Operaciones", "Compliance"],
    icon: "🏦",
  },
  {
    id: "wss-finance",
    name: "WSS Finanzas",
    category: "finanzas",
    description:
      "Control de ingresos, egresos, presupuestos, indicadores y reportes para decisiones claras.",
    url: null,
    status: "soon",
    tags: ["Cashflow", "KPIs", "Presupuesto"],
    icon: "📈",
  },
  {
    id: "wss-legal",
    name: "WSS Legales",
    category: "legales",
    description:
      "Gestión de expedientes, plazos, clientes y documentación para estudios jurídicos y profesionales.",
    url: null,
    status: "soon",
    tags: ["Expedientes", "Plazos", "Docs"],
    icon: "⚖️",
  },
];

// Exponer globalmente para main.js
window.WSS = { CATEGORIES, SYSTEMS };
