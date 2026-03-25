# SIT-Bolivia (Sistema de Información Territorial)

SIT-Bolivia es una plataforma web interactiva diseñada para explorar y gestionar la información territorial del país. Permite navegar a través de diferentes departamentos, visualizar información a nivel de ciudad (población, riesgos, etc.), y analizar en detalle la normativa vigente de zonas (incluyendo el destino o uso de suelo, patrones de asentamiento, alturas máximas y densidad).

## Tecnologías Principales
- **Framework:** Next.js (React 18)
- **Estilos:** Tailwind CSS
- **Mapas:** Leaflet / React-Leaflet
- **Datos Espaciales:** GeoJSON
- **Iconos:** Lucide React

## Requisitos Previos
Para correr el proyecto localmente, necesitas tener instalado:
- **Node.js** (versión 18 o superior recomendada)
- **npm** (viene instalado con Node.js), **yarn**, o **pnpm**

## Instalación y Ejecución

Sigue estos pasos para arrancar el entorno de desarrollo:

1. Ingresa a la carpeta del proyecto e instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador web y dirígete a [http://localhost:3000](http://localhost:3000) para ver e iterar sobre la aplicación.

## Estructura de Datos
El proyecto simula interacciones complejas en base a archivos GeoJSON estáticos ubicados en `/public/data`. La lógica de filtrado de capas en Leaflet se encarga de reestructurar y mostrar las fronteras según selecciones realizadas en el Sidebar.
