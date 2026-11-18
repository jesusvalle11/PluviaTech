/* PluviaTech — datos del prototipo.
   Todo lo marcado con demo:true son DATOS DE DEMOSTRACIÓN: reemplácelos por fichas verificadas.
   Las cifras de CONTEXTO son reales y llevan fuente. */
window.CTI_DATA = (function () {
  "use strict";

  // Plazo de revisión del piloto: una ficha sin verificar en más de 14 días queda "Pendiente de actualizar".
  var DIAS_REVISION = 14;

  var barrios = [
    {
      slug: "san-antonio", nombre: "San Antonio", zona: "Olaya Herrera", activo: true,
      estadoPiloto: "Candidato · pendiente de confirmación (semana 3)",
      novedades: [
        { fecha: "2026-11-14", entidad: "OAGRD", texto: "Terminó la limpieza manual del cauce en el tramo San Antonio.", fuente: "Comunicado oficial (demostración)", url: "", demo: true },
        { fecha: "2026-11-06", entidad: "Valorización Distrital", texto: "Se solicitaron los diseños de canalización del tramo final.", fuente: "Respuesta a derecho de petición (demostración)", url: "", demo: true }
      ]
    },
    {
      slug: "sector-central", nombre: "Sector Central", zona: "Olaya Herrera", activo: true,
      estadoPiloto: "Candidato · pendiente de confirmación (semana 3)",
      novedades: [
        { fecha: "2026-11-12", entidad: "OAGRD", texto: "Avanza el retiro de sedimentos bajo el puente de la avenida Pedro Romero.", fuente: "Comunicado oficial (demostración)", url: "", demo: true }
      ]
    },
    {
      slug: "sector-ricaurte", nombre: "Sector Ricaurte", zona: "Olaya Herrera", activo: true,
      estadoPiloto: "Candidato · pendiente de confirmación (semana 3)",
      novedades: [
        { fecha: "2026-11-09", entidad: "Secretaría de Infraestructura", texto: "Se firmó el contrato de mantenimiento con maquinaria del tramo Ricaurte.", fuente: "Publicación en SECOP II (demostración)", url: "", demo: true }
      ]
    },
    {
      slug: "trece-de-junio", nombre: "13 de Junio", zona: "Entorno del Canal Ricaurte", activo: false,
      estadoPiloto: "Candidato en evaluación · se incluirá si cumple las tres condiciones del piloto",
      novedades: []
    }
  ];

  /* Valores de dinero, fechas y porcentajes:
     { valor: 123, fuente: "..." }                 -> dato publicado
     { solicitada: { entidad: "OAGRD", fecha } }    -> "Información solicitada a … el …"
     null                                          -> "Información no disponible" */
  var intervenciones = [
    {
      id: 1, demo: true, tipo: "Dragado",
      titulo: "Retiro de sedimentos bajo el puente de la av. Pedro Romero",
      canal: "Canal Ricaurte", tramo: "Puente av. Pedro Romero", barrio: "sector-central",
      entidad: "OAGRD", estado: "En ejecución",
      queSeHace: "Sacar el lodo y la basura acumulados bajo el puente para que el agua corra mejor cuando llueve.",
      ultimoAvance: { fecha: "2026-11-12", texto: "La retroexcavadora trabaja en el costado norte del puente." },
      inicio: { valor: "2026-11-03", fuente: "Comunicado OAGRD" },
      entregaEstimada: { valor: "2026-12-15", fuente: "Comunicado OAGRD" },
      entregaReal: null,
      presupuesto: { solicitada: { entidad: "OAGRD", fecha: "2026-11-05" } },
      contratado: null,
      ejecutado: null,
      avanceFisico: { valor: 40, fuente: "Comunicado OAGRD" },
      avanceFinanciero: null,
      fuente: { nombre: "Comunicado OAGRD (demostración)", url: "" },
      verificado: "2026-11-12"
    },
    {
      id: 2, demo: true, tipo: "Limpieza",
      titulo: "Limpieza manual del cauce",
      canal: "Canal Ricaurte", tramo: "Tramo San Antonio", barrio: "san-antonio",
      entidad: "OAGRD", estado: "Terminada",
      queSeHace: "Retirar a mano basura, ramas y residuos del canal para evitar que se tape.",
      ultimoAvance: { fecha: "2026-10-24", texto: "Se entregó la limpieza del tramo completo." },
      inicio: { valor: "2026-10-01", fuente: "Contrato en SECOP II" },
      entregaEstimada: { valor: "2026-10-20", fuente: "Contrato en SECOP II" },
      entregaReal: { valor: "2026-10-24", fuente: "Acta de entrega" },
      presupuesto: { valor: 85000000, fuente: "Plan de acción OAGRD" },
      contratado: { valor: 82400000, fuente: "Contrato en SECOP II" },
      ejecutado: { valor: 82400000, fuente: "Acta de liquidación" },
      avanceFisico: { valor: 100, fuente: "Acta de entrega" },
      avanceFinanciero: { valor: 100, fuente: "Acta de liquidación" },
      fuente: { nombre: "Contrato y acta en SECOP II (demostración)", url: "" },
      verificado: "2026-11-10"
    },
    {
      id: 3, demo: true, tipo: "Obra",
      titulo: "Diseño de la canalización del tramo final",
      canal: "Canal Ricaurte", tramo: "Tramo final hacia la Ciénaga de la Virgen", barrio: "san-antonio",
      entidad: "Valorización Distrital", estado: "En diseño",
      queSeHace: "Preparar los planos para revestir el canal en su tramo final y reducir desbordamientos.",
      ultimoAvance: { fecha: "2026-10-20", texto: "La entidad informó que los estudios están en revisión." },
      inicio: null,
      entregaEstimada: { solicitada: { entidad: "Valorización Distrital", fecha: "2026-11-06" } },
      entregaReal: null,
      presupuesto: { solicitada: { entidad: "Valorización Distrital", fecha: "2026-11-06" } },
      contratado: null,
      ejecutado: null,
      avanceFisico: null,
      avanceFinanciero: null,
      fuente: { nombre: "Informe de gestión de Valorización (demostración)", url: "" },
      verificado: "2026-10-28"
    },
    {
      id: 4, demo: true, tipo: "Mantenimiento",
      titulo: "Mantenimiento con maquinaria del canal",
      canal: "Canal Ricaurte", tramo: "Tramo Ricaurte", barrio: "sector-ricaurte",
      entidad: "Secretaría de Infraestructura", estado: "Contratada",
      queSeHace: "Limpiar y perfilar el canal con maquinaria pesada para recuperar su capacidad.",
      ultimoAvance: { fecha: "2026-11-09", texto: "Contrato firmado; la obra aún no empieza." },
      inicio: { valor: "2026-12-01", fuente: "Contrato en SECOP II" },
      entregaEstimada: { valor: "2027-02-28", fuente: "Contrato en SECOP II" },
      entregaReal: null,
      presupuesto: { valor: 320000000, fuente: "Plan de acción de Infraestructura" },
      contratado: { valor: 310000000, fuente: "Contrato en SECOP II" },
      ejecutado: null,
      avanceFisico: null,
      avanceFinanciero: null,
      fuente: { nombre: "Contrato en SECOP II (demostración)", url: "" },
      verificado: "2026-11-09"
    },
    {
      id: 5, demo: true, tipo: "Reparación",
      titulo: "Reparación del talud erosionado",
      canal: "Canal Ricaurte", tramo: "Orilla sur, tramo San Antonio", barrio: "san-antonio",
      entidad: "Valorización Distrital", estado: "Anunciada",
      queSeHace: "Reforzar la orilla del canal que se está desmoronando junto a las viviendas.",
      ultimoAvance: { fecha: "2026-11-02", texto: "La Alcaldía anunció la reparación en una reunión con la comunidad." },
      inicio: null,
      entregaEstimada: null,
      entregaReal: null,
      presupuesto: null,
      contratado: null,
      ejecutado: null,
      avanceFisico: null,
      avanceFinanciero: null,
      fuente: { nombre: "Acta de reunión comunitaria (demostración)", url: "" },
      verificado: "2026-11-15"
    },
    {
      id: 6, demo: true, tipo: "Limpieza",
      titulo: "Recolección de residuos en las orillas",
      canal: "Canal Ricaurte", tramo: "Tramo Central", barrio: "sector-central",
      entidad: "Alcaldía Local", estado: "Terminada",
      queSeHace: "Recoger basura y escombros dejados en las orillas del canal.",
      ultimoAvance: { fecha: "2026-10-30", texto: "Jornada terminada con apoyo de la empresa de aseo." },
      inicio: { valor: "2026-10-29", fuente: "Comunicado Alcaldía Local" },
      entregaEstimada: { valor: "2026-10-30", fuente: "Comunicado Alcaldía Local" },
      entregaReal: { valor: "2026-10-30", fuente: "Comunicado Alcaldía Local" },
      presupuesto: null,
      contratado: null,
      ejecutado: null,
      avanceFisico: { valor: 100, fuente: "Comunicado Alcaldía Local" },
      avanceFinanciero: null,
      fuente: { nombre: "Comunicado Alcaldía Local (demostración)", url: "" },
      verificado: "2026-11-11"
    }
  ];

  // Canales de atención. Líneas verificadas en prensa local el 18 nov. 2026; los contactos "Por confirmar" deben pedirse a cada entidad.
  var FUENTE_LINEAS = { nombre: "El Universal, líneas de emergencia en Cartagena", url: "https://www.eluniversal.com.co/cartagena/2025/06/25/tormenta-en-cartagena-autoridades-reportaron-mas-de-80-emergencias/" };
  var FUENTE_DC = { nombre: "El Tiempo, líneas oficiales de emergencia en Cartagena", url: "https://www.eltiempo.com/colombia/emergencia-en-cartagena-por-tormenta-42-arboles-caidos-inundaciones-barrios-sin-energia-y-viviendas-afectadas-3466317" };
  var canales = [
    { nombre: "Línea 123 — Emergencias de Policía", num: "123", tel: "123", tipo: "emergencia", nota: "Policía Nacional. Inundación, derrumbe o riesgo para personas y viviendas.", fuente: FUENTE_LINEAS },
    { nombre: "Cuerpo de Bomberos", num: "119", tel: "119", tipo: "socorro", nota: "Rescates, árboles caídos, incendios, personas atrapadas por el agua.", fuente: FUENTE_LINEAS },
    { nombre: "Cruz Roja", num: "132", tel: "132", tipo: "socorro", nota: "Atención a personas afectadas y primeros auxilios.", fuente: FUENTE_LINEAS },
    { nombre: "Defensa Civil", num: "144", tel: "144", tipo: "socorro", nota: "Apoyo en emergencias, evacuación y deslizamientos.", fuente: FUENTE_DC },
    { nombre: "Gestión del Riesgo (OAGRD)", num: "317 503 0465", tel: "3175030465", tipo: "riesgo", nota: "Reportar afectaciones por lluvias en el barrio. También por WhatsApp.", fuente: FUENTE_LINEAS },
    { nombre: "Urgencias médicas (CRUE)", num: "125", tel: "125", tipo: "socorro", nota: "Personas heridas o enfermas que necesitan ambulancia.", fuente: FUENTE_LINEAS },
    { nombre: "Afinia (energía)", num: "115", tel: "115", tipo: "servicio", nota: "Cables caídos, postes o transformadores dañados. No se acerque.", fuente: FUENTE_LINEAS },
    { nombre: "Valorización Distrital", num: "Por confirmar con la entidad", tel: "", tipo: "obras", color: "azul", nota: "Diseños y obras de canales y drenajes pluviales." },
    { nombre: "Secretaría de Infraestructura", num: "Por confirmar con la entidad", tel: "", tipo: "obras", color: "verde", nota: "Mantenimiento de canales y obras civiles." },
    { nombre: "Alcaldía Local", num: "Por confirmar con la entidad", tel: "", tipo: "obras", color: "morado", nota: "Jornadas de limpieza y atención en el barrio." }
  ];

  // Contexto REAL con fuente (Valorización Distrital, informe de seguimiento al Plan de Acción, corte 15 sep. 2025).
  var contexto = {
    cifras: [
      { icono: "waves", num: "201", txt: "canales pluviales inventariados en el Distrito", fuente: "Valorización Distrital, Reporte de Buena Práctica", fecha: "2026", url: "" },
      { icono: "users", num: "12.181", txt: "familias afectadas por las lluvias de 2023 (más de 45.000 personas)", fuente: "OAGRD, citada por El Universal", fecha: "31 dic. 2023", url: "https://www.eluniversal.com.co/cartagena/los-estragos-de-la-temporada-de-lluvias-en-cartagena-en-2023-BD9720407" },
      { icono: "rain", num: "10", txt: "barrios y sectores con afectaciones tras un solo aguacero", fuente: "El Universal", fecha: "24 oct. 2026", url: "https://www.eluniversal.com.co/cartagena/2026/10/24/los-barrios-de-cartagena-donde-se-han-presentado-afectaciones-tras-las-fuertes-lluvias/" },
      { icono: "pin", num: "≈30", txt: "barrios en la zona de influencia del Canal Ricaurte", fuente: "El Heraldo", fecha: "2016", url: "https://www.elheraldo.co/bolivar/fuertes-lluvias-vuelven-causar-emergencias-en-cartagena-303892" }
    ],
    afectados2026: ["Olaya Herrera", "San Pedro", "El Pozón", "Las Palmeras", "Fredonia", "San Fernando", "Villa Rosita", "Cerros de Albornoz", "Nelson Mandela", "Cartagenita"],
    fuente: "Valorización Distrital, Informe de seguimiento al Plan de Acción, corte 15 sep. 2025",
    url: "https://www.cartagena.gov.co/sites/default/files/transparencia/documentos/2025-11/Informe%20Seguimiento%20P.A.I%20Valorizac%C3%B3n%20corte%20septiembre%202025.pdf",
    metas: [
      { meta: "Diseñar canales", ejecutado: 4.5, planeado: 10, unidad: "km", periodo: "meta 2025" },
      { meta: "Construir canales", ejecutado: 0.18, planeado: 1, unidad: "km", periodo: "meta 2025" },
      { meta: "Retirar sedimentos", ejecutado: 6826, planeado: 100000, unidad: "m³", periodo: "meta del cuatrienio" }
    ]
  };

  return { DIAS_REVISION: DIAS_REVISION, barrios: barrios, intervenciones: intervenciones, canales: canales, contexto: contexto };
})();
