# SOBREMESA - Project Brief

## Contexto Filosófico

Este proyecto nace de una investigación sobre bioética, psicopolítica digital y el impacto de las redes sociales en la salud mental. Desde 2010, los índices de depresión y ansiedad han crecido 100% correlativamente con la aparición de las redes sociales.

### Marco Teórico: Yuk Hui y Tecnodiversidad

El proyecto se inspira en Yuk Hui y su concepto de **tecnodiversidad**. No buscamos crear "mejores interfaces" dentro del mismo paradigma extractivo, sino pensar **cosmotécnicas alternativas** que no moneticen la subjetividad.

La propuesta es construir tecnología que:
- Privilegie el encuentro sobre la conexión
- El acontecimiento sobre el archivo
- La vulnerabilidad sobre el control
- La comunidad situada sobre la audiencia masiva

### El Concepto: La Sobremesa

La "sobremesa" es ese tiempo argentino/latinoamericano después de comer donde la conversación se extiende sin propósito productivo. Un espacio de conversación extendida que tiene raíz cultural específica. No como folklorismo, sino como cosmotécnica específica: el valor está en la conversación misma, no en su acumulación o circulación.

## Qué ES Sobremesa

**Sobremesa es una plataforma de encuentros sincrónicos con video obligatorio para conversaciones profundas entre personas.**

### Características Centrales

1. **Video obligatorio**: Los rostros están presentes desde el inicio
2. **Grupos pequeños**: 6-10 personas máximo (deliberadamente)
3. **Sincrónico**: Todos presentes al mismo tiempo
4. **Convocatoria por tema específico**: No es red social generalista
5. **Selección humana**: El convocante lee y elige, no hay algoritmos

### Diferencias con Otras Plataformas

**vs. Meetup:**
- Meetup = actividades (20-100+ personas, grupos permanentes, first-come-first-serve)
- Sobremesa = conversación (6-10 personas, eventos únicos, selección cuidadosa)

**vs. Reddit/Foros:**
- Reddit = asincrónico, textual, anónimo, con métricas
- Sobremesa = sincrónico, con rostros, seleccionado, sin métricas

**vs. Zoom/Meet:**
- Son herramientas, no plataformas de encuentro
- No tienen el sistema de convocatoria + selección + comunidad

## Arquitectura del Sistema

### Perfil de Usuario

**Datos mínimos (sin métricas ni gamificación):**
- Nombre real
- Contexto (carrera/facultad/ciudad/ocupación)
- Bio breve (2-3 líneas)
- Foto (opcional pero recomendada)

**Lo que NO tiene:**
- Seguidores/seguidos
- Cantidad de sobremesas participadas
- Historial público de conversaciones
- Métricas de ningún tipo
- "Actividad reciente"

### Flujo Completo de una Sobremesa

#### 1. Propuesta
- Alguien crea una "sobremesa" en la **cartelera pública**
- Define: Tema específico, fecha/hora, cuántas personas busca (sugerido 6-10)
- Ejemplo: "¿Puede haber IA ética bajo capitalismo? - Viernes 18/12 - 19hs - Busco 6 personas"

#### 2. Cartas de Intención
- Otros usuarios escriben una **carta de intención** (200-300 palabras)
- Explican por qué les interesa el tema, desde dónde piensan
- Esto NO es un perfil permanente - es específico para ESA sobremesa

#### 3. Selección
- El convocante lee todas las cartas
- Selecciona participantes (decisión humana, subjetiva)
- Los no seleccionados pueden **armar su propia sobremesa** sobre el tema

#### 4. Confirmación
- Los seleccionados reciben notificación en la app
- Ven la sobremesa confirmada en "Mis sobremesas"

#### 5. El Día del Encuentro
- Los participantes entran desde la app: botón "Entrar a sobremesa"
- Se abre videollamada con **sala de espera**
- Video **obligatorio** desde el inicio (no se puede entrar sin cámara)
- El convocante **aprueba entrada** de cada persona (ve su video)

#### 6. Durante la Sobremesa
- Duración: **Libre** (depende del grupo)
- Grabación: **Solo con consenso de todos**
- Moderación: El convocante puede expulsar si hay violencia/irrespeto

#### 7. Después de la Sobremesa
- Se guarda "**La mesa**": lista de participantes de ESA sobremesa
- No es "lista de amigos" permanente
- Es memoria de encuentros específicos
- Permite invitar a esas personas a futuras sobremesas

### Características Técnicas Clave

**Cartelera:**
- Todas las propuestas son igualmente visibles (sin ranking ni algoritmo)
- Orden cronológico simple
- Pública para todos

**Sin Métricas:**
- No hay likes, shares, views
- No hay "sobremesas más populares"
- No hay "usuarios destacados"

**Seguridad:**
- Sala de espera con video obligatorio
- El convocante aprueba cada entrada
- Expulsión disponible durante sobremesa
- El link en sí es "tonto" - la seguridad está en la aprobación humana

**Contexto Argentino:**
- Diseñado pensando en seguridad (especialmente para mujeres)
- Por eso es video en casa, no encuentros presenciales
- La vulnerabilidad es emocional/intelectual, no física

## Stack Tecnológico Sugerido

### Para MVP:

**Frontend:**
- Next.js 14 (App Router) o React con Vite
- TailwindCSS para estilos
- TypeScript

**Backend y Base de Datos:**
- Supabase (incluye auth + PostgreSQL + real-time)
- O Firebase (si se prefiere)

**Videollamadas:**
- Jitsi Meet (open source, integrable)
- O Daily.co API
- Sala de espera: puede ser feature nativa de Jitsi

**Hosting:**
- Vercel o Netlify (para frontend)
- Supabase maneja el backend

**Presupuesto inicial:** $0-20 USD/mes (planes gratuitos)

## Fases de Desarrollo

### Fase 0: Manual (2-4 semanas) - OPCIONAL

Validar concepto sin programar:
1. Google Form para propuestas y cartas
2. Matching manual vía email
3. Links de Jitsi enviados por mail
4. 3-5 sobremesas de prueba con círculo cercano

### Fase 1: MVP (1-3 meses)

**Features mínimas:**
1. Registro/Login (email + password)
2. Crear perfil mínimo
3. Cartelera de propuestas
4. Crear nueva sobremesa
5. Escribir carta de intención
6. Panel de convocante para leer cartas y seleccionar
7. Notificaciones por email
8. Botón "Entrar a sobremesa" que abre Jitsi
9. "La mesa" post-sobremesa con lista de participantes
10. Invitar a participantes anteriores a nueva sobremesa

**Lo que NO hace falta en MVP:**
- App mobile (solo web responsive)
- Sistema de pagos
- Chat interno entre usuarios
- Notificaciones push
- Algoritmos de recomendación
- Analytics complejos
- Sistema de reputación

### Fase 2: Refinamiento (post-MVP)

Basado en feedback de usuarios reales:
- Mejorar UX de cartelera
- Optimizar proceso de selección
- Herramientas para convocante
- Mejor integración de video
- Posible app mobile

## Estrategia de Lanzamiento

### Alcance:
- **Abierto** (no solo una universidad)
- Empezar en círculos académicos/intelectuales
- Crecimiento **lento e intencional** (no viral)

### Primera sobremesa:
- El creador convoca sobre su propia investigación (bioética/IA/redes sociales)
- Invita gente de facultad
- Documenta la experiencia

### Crecimiento:
- Boca a boca
- Los participantes invitan a otros
- Máximo 1-2 sobremesas simultáneas al inicio
- Escala orgánicamente según demanda real

## Proyecto Complementario: El Fogón

(Para fase futura, después de Sobremesa)

**El Fogón**: Archivo colectivo de saberes situados argentinos/latinoamericanos.

No es plataforma de conversación - es repositorio de conocimientos no-académicos que no están en ningún otro lado:
- Cómo organizarse en tomas de tierras
- Historia oral de fábricas recuperadas
- Estrategias comunitarias durante crisis
- Saberes de organizaciones barriales
- Tecnologías apropiadas locales

Complementa a Sobremesa porque:
- Sobremesa = conversación efímera entre pocos
- El Fogón = preservación permanente para muchos

## Modelo de Sostenibilidad (Futuro)

**NO es el foco ahora**, pero posibles modelos:
- Cooperativa digital (usuarios son co-dueños)
- Pago simbólico por crear sobremesas
- Donación voluntaria post-sobremesa
- Financiamiento público/becas
- **Nunca**: monetización de datos, ads, métricas extractivas

## Principios de Diseño

### Lo que Sobremesa ES:

1. **Anti-extractivo por diseño**: No puede monetizar atención fraccionada
2. **Privilegia profundidad**: Conversaciones largas, grupos chicos
3. **Deliberadamente ineficiente**: Lento, requiere compromiso
4. **Cosmotécnica situada**: Responde a contexto argentino/latinoamericano
5. **Vulnerable y seguro simultáneamente**: Video + espacio privado

### Lo que Sobremesa NO ES:

1. **No es red social**: No hay feed, followers, likes
2. **No escala viralmente**: El éxito NO es tener millones de usuarios
3. **No es para todos**: Requiere disponibilidad y compromiso específicos
4. **No es neutral**: Tiene posicionamiento político claro
5. **No es commodity**: No busca ser "Zoom pero mejor"

## Consideraciones Importantes

### Seguridad (Crítico)

- Diseñado para contexto argentino donde seguridad física es preocupación real
- POR ESO es video online, NO encuentros presenciales
- La vulnerabilidad es emocional/intelectual, no física
- Video obligatorio = responsabilización y seguridad
- Sala de espera = filtro humano contra trolls

### Moderación

- Responsabilidad distribuida (convocante puede expulsar)
- No hay moderación algorítmica centralizada
- Confianza en juicio humano situado

### Privacidad

- Sobremesas son efímeras por defecto (no se graban automáticamente)
- "La mesa" es privada (solo vos ves con quién estuviste)
- No hay extracción de datos para perfilamiento

## Vocabulario del Proyecto

- **Sobremesa**: Cada encuentro sincrónico
- **La mesa**: Lista de participantes de una sobremesa específica
- **Cartelera**: Listado público de sobremesas propuestas
- **Carta de intención**: Texto de 200-300 palabras para sumarse
- **Comensales**: Alternativa original a "la mesa" (más formal)
- **Convocante**: Quien propone y organiza la sobremesa

## Contexto del Usuario Final

- **Ubicación**: Buenos Aires, Argentina
- **Contexto**: Facultad (estudiante de grado/posgrado)
- **Investigación**: Bioética, impacto de IA y redes sociales
- **Motivación**: Crear alternativas no-extractivas a redes sociales actuales
- **Comunidad inicial**: Círculo académico/universitario interesado en filosofía, tecnología, política

## Notas de Implementación

### Nombres de Rutas/Componentes Sugeridos:

```
/cartelera          -> Ver todas las sobremesas propuestas
/sobremesa/nueva    -> Crear nueva sobremesa
/sobremesa/[id]     -> Ver detalles + escribir carta
/mis-sobremesas     -> Sobremesas confirmadas y pasadas
/sobremesa/[id]/sala -> Entrar a videollamada
/perfil/editar      -> Editar perfil
```

### Estructura de Datos Básica:

**User:**
- id, email, nombre, contexto, bio, foto_url

**Sobremesa:**
- id, titulo, descripcion, fecha_hora, max_participantes, convocante_id, estado (propuesta/confirmada/finalizada)

**CartaIntencion:**
- id, sobremesa_id, user_id, texto, estado (pendiente/aceptada/rechazada)

**Participacion:**
- id, sobremesa_id, user_id, rol (convocante/participante)

## Inspiración y Referencias

- Yuk Hui: "The Question Concerning Technology in China"
- Byung-Chul Han: "La sociedad del cansancio"
- Concepto de "sobremesa" como práctica cultural argentina/latina
- Tertulias, peñas, cafés literarios
- Filosofía peripatética (pensar caminando/conversando)
- Movimientos cooperativistas digitales

---

## Para el Claude que recibe esto:

Este es un proyecto real, con un usuario real en Argentina, que quiere construir esto. No es ejercicio académico - es para implementar.

El código base está en un repositorio llamado "codeteca" que ya tiene algo de estructura (parece tener signup, base de datos, protección de rutas según commits recientes).

**Tu tarea**: Ayudar a implementar Sobremesa siguiendo esta visión, respetando los principios, y construyendo algo funcional y útil.

**Actitud**: Este proyecto tiene posicionamiento político y ético claro. No lo diluyas ni lo conviertas en "otra app más". La incomodidad, la fricción, la limitación deliberada son features, no bugs.

¡Adelante!
