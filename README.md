# Baby Shower Invitation App

Landing page interactiva para Baby Shower construida con Next.js, React, Tailwind y Google Sheets como base de datos.

## Características

- 📱 Diseño Mobile-first y responsive.
- 💌 RSVP con formulario validado.
- 🎁 Lista de Regalos con control de estado (Disponibles/Seleccionados) para evitar duplicados.
- 💬 Libro de mensajes para los papás.
- 🔐 Panel de Administración simple para ver respuestas.
- 🚀 Integración con Google Sheets en tiempo real.

## Configuración Local

1. **Clonar/Descargar** el proyecto.
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Variables de Entorno**:
   El proyecto ya incluye un archivo `.env.local` pre-configurado con las credenciales de Service Account (según instrucciones).
   
   **IMPORTANTE**: Debes actualizar `GOOGLE_SHEETS_SPREADSHEET_ID` en el archivo `.env.local` con el ID de tu hoja de cálculo.

## Configuración de Google Sheets

1. Crea una nueva Hoja de Cálculo en Google Sheets.
2. El ID de la hoja es la parte larga de la URL: `https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit...`
3. **Compartir la hoja**:
   Debes dar acceso de edición al Service Account email:
   `sheets-writer@serpa-inmersivo.iam.gserviceaccount.com`
   (Dale rol de "Editor").
4. **Crear las pestañas (Tabs)**:
   Debes crear 3 pestañas con los siguientes nombres exactos y columnas en la fila 1:

   **Tab "Gifts"**
   - A: `gift_id` (Identificador único, ej: "gift-1", "gift-2")
   - B: `title` (Nombre del regalo)
   - C: `store_url` (Link de compra)
   - D: `notes` (Notas opcionales)
   - E: `status` (Dejar vacío o escribir "available". El sistema pondrá "claimed" cuando se elija)
   - F: `claimed_by`
   - G: `claimed_phone`
   - H: `claimed_email`
   - I: `claimed_at`

   **Tab "RSVP"**
   - A: `timestamp`
   - B: `name`
   - C: `phone`
   - D: `email`
   - E: `attending`
   - F: `guest_count`
   - G: `notes`

   **Tab "Messages"**
   - A: `timestamp`
   - B: `name`
   - C: `message`

## Ejecutar Localmente

```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).

## Despliegue en Vercel

1. Sube este código a GitHub.
2. Crea un nuevo proyecto en [Vercel](https://vercel.com) importando el repo.
3. En la configuración del proyecto en Vercel, ve a **Environment Variables** y agrega las siguientes:

   | Nombre | Valor |
   |--------|-------|
   | `GOOGLE_SHEETS_CLIENT_EMAIL` | `sheets-writer@serpa-inmersivo.iam.gserviceaccount.com` |
   | `GOOGLE_SHEETS_PRIVATE_KEY` | (El contenido de la llave privada. **Nota**: En Vercel, copia todo el bloque incluyendo `-----BEGIN...` y `-----END...`. Vercel maneja los saltos de línea automáticamente o puedes usar `\n` literal si tienes problemas, pero el código está preparado para reemplazar `\n` string por saltos reales). |
   | `GOOGLE_SHEETS_SPREADSHEET_ID`| Tu ID de hoja de cálculo |
   | `ADMIN_PASSWORD` | Contraseña para el panel admin (ej: `admin123`) |

4. Deploy!

## Uso del Admin Panel

Accede a `/admin` e ingresa la contraseña configurada en `ADMIN_PASSWORD`.
Podrás ver las tablas de RSVP, Regalos y Mensajes en tiempo real.
# BabyShower_Maria_Franchesca
