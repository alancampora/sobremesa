# 🍷 Sobremesa

**Plataforma de encuentros sincrónicos para conversaciones profundas entre personas**

Sobremesa es una plataforma anti-extractiva que privilegia el encuentro sobre la conexión, el acontecimiento sobre el archivo, y la vulnerabilidad sobre el control. No es una red social: es un espacio para conversaciones genuinas en grupos pequeños.

## 🎯 Filosofía del Proyecto

Inspirado en el concepto de **tecnodiversidad** de Yuk Hui, Sobremesa no busca crear "mejores interfaces" dentro del mismo paradigma extractivo, sino pensar **cosmotécnicas alternativas** que no moneticen la subjetividad.

### Principios

- ✅ **Sin métricas**: No hay likes, followers, views ni rankings
- ✅ **Grupos pequeños**: 6-10 personas máximo
- ✅ **Video obligatorio**: Rostros presentes desde el inicio
- ✅ **Selección humana**: El convocante lee y elige participantes
- ✅ **Sincrónico**: Todos presentes al mismo tiempo
- ✅ **Efímero por defecto**: No se graba automáticamente

## 🚀 Tecnologías

### Frontend
- **React** + Vite
- **TypeScript**
- **TailwindCSS** + Shadcn/ui
- **React Router**

### Backend
- **Express** + TypeScript
- **MongoDB** + Mongoose
- **JWT** para autenticación
- **bcrypt** para passwords

## 📦 Instalación

### Requisitos previos

- Node.js 18+
- MongoDB 6+ (corriendo localmente o MongoDB Atlas)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd sobremesa
```

### 2. Instalar dependencias

```bash
# Root
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Configurar variables de entorno

#### Server (`.env` en `/server`)

```env
# Server
SERVER_PORT=3000
ENV=dev

# Database
DB_URI_DEV=mongodb://localhost:27017/sobremesa
DB_URI_PROD=tu_mongodb_uri_produccion

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_cambialo_en_produccion

# Frontend
FE_URI=http://localhost:5173
```

#### Client (`.env` en `/client`)

```env
VITE_API_URL=http://localhost:3000
```

### 4. Compilar tipos comunes

```bash
# Desde la raíz
npm run build:common
```

Si da error, instalá TypeScript globalmente:
```bash
npm install -g typescript
```

## 🏃‍♂️ Ejecutar el proyecto

### Opción 1: Desarrollo (recomendado)

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Opción 2: Ambos en paralelo

```bash
# Desde la raíz
npm run dev:start
```

Luego abrí http://localhost:5173

## 📁 Estructura del Proyecto

```
sobremesa/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas de la app
│   │   ├── api/            # Llamadas al backend
│   │   ├── context/        # React Context (auth)
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── server/                 # Backend Express
│   ├── src/
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Rutas de la API
│   │   ├── middleware/     # Auth middleware
│   │   └── index.ts        # Entry point
│   └── package.json
│
├── common/                 # Types compartidos
│   └── src/
│       ├── User.ts
│       ├── Sobremesa.ts
│       ├── CartaIntencion.ts
│       └── Participacion.ts
│
└── README.md
```

## 🎨 Features Implementadas (MVP)

### ✅ Autenticación
- [x] Registro con email y contraseña
- [x] Login
- [x] Protección de rutas
- [x] Perfil de usuario editable

### ✅ Perfil de Usuario
- [x] Nombre real
- [x] Contexto (carrera/facultad/ciudad/ocupación)
- [x] Bio opcional (2-3 líneas)
- [x] Foto opcional (por URL)

### ✅ Sobremesas
- [x] Crear sobremesa (título, descripción, fecha, participantes máximos)
- [x] Cartelera pública (ver todas las sobremesas propuestas)
- [x] Ver detalles de una sobremesa

### ✅ Cartas de Intención
- [x] Escribir carta (200-500 palabras)
- [x] Validación de longitud
- [x] Estado: pendiente/aceptada/rechazada

### ✅ Panel de Convocante
- [x] Ver todas las cartas recibidas
- [x] Leer perfiles de quienes aplican
- [x] Aceptar/rechazar participantes
- [x] Ver estadísticas (aceptados/pendientes/lugares)
- [x] Agregar link de videollamada

### ✅ Mis Sobremesas
- [x] Ver sobremesas confirmadas
- [x] Separación: próximas / pasadas
- [x] Botón "Entrar a la sala" (cuando hay link)
- [x] Diferenciación convocante/participante

## 🎯 Rutas de la Aplicación

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Landing page | No |
| `/cartelera` | Ver todas las sobremesas | No |
| `/login` | Iniciar sesión | No |
| `/signup` | Crear cuenta | No |
| `/sobremesa/nueva` | Crear sobremesa | Sí |
| `/sobremesa/:id` | Ver detalles y escribir carta | No |
| `/sobremesa/:id/seleccionar` | Panel del convocante | Sí |
| `/mis-sobremesas` | Mis sobremesas | Sí |
| `/profile` | Editar perfil | Sí |

## 🗄️ Modelos de Base de Datos

### User
```typescript
{
  email: string,
  password: string,  // hasheado
  name: string,
  context: string,
  bio?: string,
  photo?: string
}
```

### Sobremesa
```typescript
{
  title: string,
  description: string,
  date_time: Date,
  max_participants: number,
  convocante_id: ObjectId,
  status: 'proposed' | 'confirmed' | 'completed' | 'cancelled',
  meeting_link?: string
}
```

### CartaIntencion
```typescript
{
  sobremesa_id: ObjectId,
  user_id: ObjectId,
  text: string,
  status: 'pending' | 'accepted' | 'rejected'
}
```

### Participacion
```typescript
{
  sobremesa_id: ObjectId,
  user_id: ObjectId,
  role: 'convocante' | 'participant'
}
```

## 🔮 Próximos Pasos (Post-MVP)

- [ ] Integración directa con Jitsi (sin link manual)
- [ ] Notificaciones por email
- [ ] "La mesa" - memoria de participantes por sobremesa
- [ ] Invitar participantes anteriores a nuevas sobremesas
- [ ] Upload de imágenes de perfil
- [ ] Sala de espera con aprobación del convocante
- [ ] Sistema de grabación con consenso
- [ ] App mobile

## 🤝 Contribuir

Este proyecto busca mantener sus principios anti-extractivos y su enfoque en profundidad sobre velocidad. Si querés contribuir, por favor:

1. Leé el [project-brief.md](./project-brief.md) completo
2. Respetá los principios de diseño
3. No agregues métricas, gamificación ni features extractivas
4. Priorizá la simplicidad y la intencionalidad

## 📝 Convenciones de Código

- **Rutas/URLs**: En español (`/cartelera`, `/mis-sobremesas`)
- **Código/propiedades**: En inglés (`max_participants`, `meeting_link`)
- **Conceptos del proyecto**: En español (`Sobremesa`, `CartaIntencion`)

## 📄 Licencia

[Definir licencia - sugerido: GPL o similar para mantener open source]

## 💬 Contacto

Para preguntas, sugerencias o reportar problemas, creá un issue en este repositorio.

---

**🍷 Sobremesa** - Porque la profundidad requiere tiempo.
