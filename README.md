# PluviaTech 🌧️
 
**Innovación tecnológica aplicada al drenaje pluvial.**
 
PluviaTech es un portal ciudadano que explica en lenguaje sencillo, con fuente y fecha, las obras que el Distrito hace en los canales pluviales de Cartagena de Indias. Está pensado para los habitantes y los líderes comunitarios de los barrios que se inundan.
 
🔗 **Demo en línea:** https://pluviatech.onrender.com/
 
> Proyecto presentado en el **II Hackatón ESAPista**, con la Alcaldía de Cartagena como entidad de referencia.
> ⚠️ Las fichas de obras que trae el prototipo son **datos de demostración**. Las cifras de contexto son reales y citan su fuente.
 
---
 
## El problema
 
Quienes viven junto a los canales de barrios como Olaya Herrera no encuentran en un solo lugar, ni a tiempo, qué obra hace el Distrito en su canal, cuánto cuesta y cuándo termina. Sin esa información no pueden prepararse ni pedir cuentas.
 
- **Afectados:** la OAGRD reportó **12.181 familias afectadas** por las lluvias de 2023 (más de 45.000 personas).
- **Información técnica y dispersa:** Cartagena tiene un inventario oficial de **201 canales pluviales**. Ese inventario es de uso técnico interno, y los contratos, avances y comunicados de cada obra están en lugares distintos.
## La solución
 
PluviaTech responde cinco preguntas por cada obra:
 
1. ¿Qué van a arreglar?
2. ¿Cuándo empieza?
3. ¿Cómo va la obra?
4. ¿Cuánto cuesta?
5. ¿Cuándo la entregan?
Cada dato muestra **de dónde salió y en qué fecha se verificó**. Cuando un dato no existe, la ficha lo dice abiertamente: «Información no disponible» o «Información solicitada a [entidad] el [fecha]».
 
El piloto empieza en el entorno del **Canal Ricaurte** (Olaya Herrera), en 2 o 3 sectores.
 
## Funcionalidades
 
### Consulta pública (sin cuenta)
- 🏘️ **Página por barrio** con novedades oficiales, intervenciones y canales de atención.
- 📋 **Ficha por obra:**
  - estado (Anunciada → En diseño → Contratada → En ejecución → Terminada);
  - fechas de inicio y de entrega;
  - presupuesto anunciado, valor contratado y monto ejecutado;
  - avance físico y avance financiero, mostrados por separado.
- ⏱️ **Fichas «Pendiente de actualizar»:** se marcan así cuando pasan 14 días sin revisión.
- 📊 **El problema en datos:** cifras reales con fuente, barrios afectados y avance de las metas del Distrito, en paneles que se abren y se cierran.
- ☎️ **Canales oficiales:** Línea 123 (Policía), Bomberos 119, Cruz Roja 132, Defensa Civil 144, Gestión del Riesgo (OAGRD) y más.
- 💬 **Sugerencias:** formulario «¿Encontró lo que buscaba?» con una imagen opcional.
- 📤 **Compartir e imprimir:** cada página se puede compartir por WhatsApp e imprimir.
### Goti, el asistente 💧
- Personaje flotante en todas las páginas: una gota de lluvia con casco de obra.
- Responde sobre las obras (estado, fechas y costos) y sobre los canales pluviales: qué son, por qué se inundan los barrios, qué hacer antes, durante y después de la lluvia, y el Canal Ricaurte.
- **Cita la ficha o la fuente** de cada respuesta.
- **Habla:** lee sus respuestas en voz alta y se le puede preguntar por micrófono, con la síntesis y el reconocimiento de voz del navegador.
### Cuenta y reportes
- Registro, inicio y cierre de sesión. Las contraseñas se guardan cifradas con bcrypt.
- **Reportes de posibles fallas** en los canales (obstrucción, sedimentos, desbordamiento, daño visible), con foto opcional.
- Solo pueden reportar **mayores de 18 años**. La edad se comprueba en el servidor cada vez que se envía un reporte.
- Seguimiento del estado de cada reporte: **Recibido → En revisión → Remitido**.
### Panel del equipo revisor
- Revisa los reportes y las sugerencias sin ver nombres ni correos.
- Cambia el estado de los reportes. «Remitido» solo se marca cuando se confirma el envío a la entidad responsable.
### Accesibilidad y uso en celular
- Diseño pensado primero para celular, con páginas livianas para conexiones lentas.
- Botón para agrandar el texto, navegación con teclado y textos alternativos.
- **PWA:** se puede instalar como aplicación en el celular.
## Tecnologías
 
| Capa | Tecnología |
|---|---|
| Frontend | HTML, CSS y JavaScript sin frameworks |
| Servidor | Node.js 20+ y Express |
| Base de datos | PostgreSQL (las imágenes se guardan en la base de datos) |
| Sesiones | express-session + connect-pg-simple |
| Seguridad | bcryptjs, límites de intentos (express-rate-limit), cookies `httpOnly` y `secure` |
| Archivos | multer (imágenes de hasta 5 MB) |
| Despliegue | Render (Blueprint con `render.yaml`) |
 
## Estructura del proyecto
 
```
pluviatech/
├── server.js            # Servidor Express y API
├── db/
│   ├── index.js         # Conexión, creación de tablas y carga inicial
│   ├── schema.sql       # Esquema de la base de datos
│   └── seed-data.js     # Datos iniciales (fichas de demostración, canales, cifras)
├── public/              # Frontend
│   ├── index.html
│   ├── styles.css
│   ├── app.js           # Vistas, Goti, formularios y conexión con la API
│   ├── manifest.json    # PWA
│   ├── sw.js            # Service worker
│   └── icons/
├── render.yaml          # Despliegue en Render
├── .env.example
└── package.json
```
 
## Ejecutar en local
 
Requisitos: **Node.js 20+** y **PostgreSQL**.
 
```bash
git clone https://github.com/SU-USUARIO/pluviatech.git
cd pluviatech
npm install
cp .env.example .env      # edite DATABASE_URL, SESSION_SECRET y ADMIN_TOKEN
npm run local
```
 
Abra http://localhost:3000. Las tablas y los datos iniciales se crean solos la primera vez.
 
## Desplegar en Render
 
1. Suba el repositorio a GitHub.
2. En [Render](https://dashboard.render.com) vaya a **New → Blueprint** y elija el repositorio.
3. Render lee `render.yaml`, crea el servicio web y la base de datos PostgreSQL, y genera `SESSION_SECRET` y `ADMIN_TOKEN`.
4. Para entrar al panel del equipo revisor, abra `/#admin` e ingrese el valor de `ADMIN_TOKEN`. Lo encuentra en Render, en **Environment** del servicio.
> **Plan gratuito de Render:** el servicio se duerme tras 15 minutos sin visitas y tarda cerca de un minuto en despertar. La base de datos gratuita vence a los 30 días; haga una copia con `pg_dump` antes de esa fecha.
 
### Variables de entorno
 
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `SESSION_SECRET` | Secreto para firmar las cookies de sesión |
| `ADMIN_TOKEN` | Clave del panel del equipo revisor |
| `NODE_ENV` | `production` en Render |
 
## API
 
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/datos` | Barrios, novedades, fichas, canales y cifras |
| POST | `/api/sugerencias` | Enviar una sugerencia (imagen opcional) |
| POST | `/api/registro` · `/api/login` · `/api/logout` | Cuentas |
| GET | `/api/yo` | Usuario con sesión iniciada |
| POST · GET | `/api/reportes` | Crear un reporte y listar los propios |
| GET | `/api/reportes/:id` | Detalle y estado de un reporte |
| GET · POST | `/api/admin/...` | Panel del equipo revisor (encabezado `x-admin-token`) |
| GET | `/salud` | Comprobación de salud |
 
## Fuentes de los datos reales
 
- Valorización Distrital de Cartagena, *Reporte de Buena Práctica: Sistema de Canales Pluviales de Cartagena de Indias* (2026).
- Valorización Distrital, *Informe de seguimiento al Plan de Acción Institucional*, corte a septiembre de 2025.
- OAGRD (Oficina Asesora para la Gestión del Riesgo de Desastres), cifras citadas por *El Universal* (2023).
- *El Universal*, *El Heraldo* y *El Tiempo*: afectaciones por lluvias y líneas de emergencia en Cartagena.
## Próximos pasos
 
- [ ] Reemplazar las fichas de demostración por fichas verificadas con documentos oficiales.
- [ ] Conectar los datos de Valorización, SECOP II y la OAGRD.
- [ ] Configurar el envío de correos para recuperar la contraseña.
- [ ] Conectar un modelo de IA a Goti, limitado a la información publicada.
- [ ] Hacer el piloto de 10 semanas con las Juntas de Acción Comunal del entorno del Canal Ricaurte.
## Equipo
 
**[Nombre del equipo]**: II Hackatón ESAPista
 
- [Integrante 1]
- [Integrante 2]
- [Integrante 3]
---
 
*PluviaTech informa sobre obras y no atiende emergencias. En caso de riesgo, llame a la **Línea 123**.*
 
