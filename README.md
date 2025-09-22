# 📦 CDS-ClientApp - Sistema de Gestión de Cadena de Suministro

Una aplicación web moderna para gestión integral de cadenas de suministro desarrollada con React, TypeScript y Material-UI, basada en MaterialPro React Admin Template.

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14-blue?logo=mui)
![Vite](https://img.shields.io/badge/Vite-5.0-yellow?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Características Principales

### Módulos Empresariales
- **👥 Gestión de Clientes**: Control completo de información de clientes y contactos
- **🛍️ Gestión de Pedidos**: Creación, seguimiento y procesamiento de órdenes de venta
- **🛒 Gestión de Compras**: Control de órdenes de compra y relaciones con proveedores
- **📦 Gestión de Productos**: Catálogo de productos con especificaciones técnicas
- **🔧 Gestión de Servicios**: Administración de servicios profesionales
- **📋 Gestión de Proyectos**: Planificación y seguimiento de proyectos empresariales
- **🏪 Gestión de Almacén**: Control de inventario, ubicaciones y movimientos de stock
- **📊 Sistema de Facturación**: Generación automática de facturas y control de pagos

### Características del Template Base
- **🎨 MaterialPro Design**: Interfaz moderna basada en Material Design
- **📱 Diseño Responsive**: Experiencia optimizada para todos los dispositivos
- **⚡ Vite Development**: Desarrollo ultra-rápido con Hot Module Replacement
- **📊 ApexCharts**: Visualizaciones interactivas de datos empresariales
- **🔧 TypeScript**: Código tipado para mayor robustez y mantenibilidad

## 🛠️ Stack Tecnológico

### Core Framework
- **React 18.2+** - Biblioteca principal para UI
- **TypeScript 5.0+** - Tipado estático para JavaScript
- **Vite** - Build tool y servidor de desarrollo de alta velocidad
- **Material-UI (MUI) 5.14+** - Sistema de componentes Material Design

### Librerías y Herramientas
- **ApexCharts** - Gráficos y visualizaciones de datos
- **React Router 6+** - Navegación y enrutamiento SPA
- **React Query/TanStack Query** - Gestión de estado del servidor
- **Formik + Yup** - Manejo avanzado de formularios y validaciones
- **Date-fns** - Manipulación y formateo de fechas

### Desarrollo y Calidad
- **ESLint** - Análisis estático de código
- **Prettier** - Formateo automático de código
- **Husky** - Git hooks para CI/CD local

## 📁 Estructura del Proyecto

```
CDS-ClientApp/
├── public/                  # Archivos públicos y assets
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── dashboard/       # Componentes del dashboard
│   │   ├── forms/           # Componentes de formularios
│   │   ├── charts/          # Componentes de gráficos
│   │   └── shared/          # Componentes compartidos
│   ├── layouts/             # Layouts principales
│   │   ├── full/            # Layout principal con sidebar
│   │   └── blank/           # Layout limpio para login/registro
│   ├── views/               # Páginas/Vistas principales
│   │   ├── customers/       # Módulo de clientes
│   │   ├── orders/          # Módulo de pedidos
│   │   ├── purchases/       # Módulo de compras
│   │   ├── products/        # Módulo de productos
│   │   ├── services/        # Módulo de servicios
│   │   ├── projects/        # Módulo de proyectos
│   │   ├── warehouse/       # Módulo de almacén
│   │   ├── billing/         # Módulo de facturación
│   │   └── dashboard/       # Dashboard principal
│   ├── theme/               # Configuración de tema MaterialPro
│   ├── utils/               # Utilidades y helpers
│   ├── services/            # Servicios API y llamadas HTTP
│   ├── hooks/               # Custom React hooks
│   ├── types/               # Definiciones TypeScript
│   └── store/               # Gestión de estado global
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Instalación y Configuración

### Prerrequisitos
- **Node.js** 18.0 o superior
- **npm** 9.0+ o **yarn** 1.22+
- **Git** para control de versiones

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/carlos123ordaz/CDS-ClientApp.git
   cd CDS-ClientApp
   git checkout carlos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Configurar las variables necesarias:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_APP_NAME=CDS Supply Chain Manager
   VITE_APP_VERSION=1.0.0
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run dev:host     # Servidor accesible desde red local

# Build y Producción
npm run build        # Build optimizado para producción
npm run preview      # Preview de la build de producción
npm run serve        # Servir build de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores automáticamente
npm run format       # Formatear código con Prettier
npm run type-check   # Verificar tipos de TypeScript

# Utilidades
npm run clean        # Limpiar node_modules y builds
npm run analyze      # Analizar bundle size
```

## 🏗️ Módulos de la Aplicación

### 📊 Dashboard Principal
- **Métricas en tiempo real** de ventas, compras e inventario
- **Gráficos interactivos** con ApexCharts para análisis de tendencias
- **Alertas y notificaciones** del sistema
- **Resumen de actividad** reciente por módulo

### 👥 Gestión de Clientes
- **Registro completo** de información de clientes
- **Historial de transacciones** y pedidos
- **Segmentación** por tipo, región o volumen de compra
- **Información de contacto** y datos de facturación

### 🛍️ Gestión de Pedidos
- **Creación y edición** de órdenes de venta
- **Workflow de aprobación** con estados configurables
- **Seguimiento en tiempo real** del estado de pedidos
- **Integración automática** con inventario y facturación

### 🛒 Gestión de Compras
- **Órdenes de compra** a proveedores
- **Sistema de cotizaciones** y comparativas
- **Control de recepción** de mercancías
- **Gestión de pagos** y términos comerciales

### 📦 Gestión de Productos
- **Catálogo detallado** con especificaciones técnicas
- **Control de precios** por cliente o volumen
- **Gestión de categorías** y clasificaciones
- **Imágenes y documentación** técnica

### 🔧 Gestión de Servicios
- **Catálogo de servicios** profesionales
- **Asignación de recursos** humanos y técnicos
- **Control de tiempo** y tareas
- **Facturación de servicios** por horas o proyecto

### 📋 Gestión de Proyectos
- **Planificación** con diagramas de Gantt
- **Asignación de tareas** y recursos
- **Seguimiento de progreso** y entregables
- **Control de presupuesto** y rentabilidad

### 🏪 Gestión de Almacén
- **Control de inventario** en tiempo real
- **Ubicaciones y zonas** de almacenamiento
- **Movimientos de stock** con trazabilidad completa
- **Alertas automáticas** de stock mínimo y máximo

### 📊 Sistema de Facturación
- **Generación automática** de facturas
- **Plantillas personalizables** por tipo de cliente
- **Control de pagos** y cuentas por cobrar
- **Reportes financieros** y análisis de flujo de caja

## 🎨 Personalización del Tema

CDS-ClientApp utiliza el sistema de temas de MaterialPro basado en MUI:

```typescript
// src/theme/Theme.ts
import { createTheme } from '@mui/material/styles';

export const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#5D87FF',
      light: '#ECF2FF',
      dark: '#4570EA',
    },
    secondary: {
      main: '#49BEFF',
      light: '#E8F7FF',
      dark: '#23afdb',
    },
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    // ... más configuraciones
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif;",
    h1: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: '2.75rem',
    },
    // ... más configuraciones tipográficas
  },
});
```

## 📈 Características de ApexCharts

La aplicación incluye múltiples tipos de gráficos:

- **Gráficos de líneas** para tendencias de ventas
- **Gráficos de barras** para comparativas de productos
- **Gráficos de área** para análisis de inventario
- **Gráficos de dona** para distribución por categorías
- **Gráficos de radar** para análisis de performance
- **Mapas de calor** para visualización de datos geográficos

## 🔒 Seguridad y Autenticación

- **Sistema de login** con JWT tokens
- **Roles y permisos** granulares por módulo
- **Rutas protegidas** con guards de autenticación
- **Gestión de sesiones** seguras
- **Validación de formularios** en cliente y servidor

## 🚀 Despliegue en Producción

### Build Optimizado
```bash
npm run build
```

### Variables de Entorno de Producción
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_ENV=production
VITE_ENABLE_ANALYTICS=true
```

### Opciones de Despliegue
- **Vercel**: Deploy automático desde GitHub
- **Netlify**: Hosting estático con funciones serverless
- **AWS S3 + CloudFront**: Distribución global
- **Docker**: Contenedorización para cualquier plataforma

## 🧪 Testing y Calidad

```bash
# Testing (cuando se implemente)
npm run test              # Ejecutar tests unitarios
npm run test:coverage     # Reporte de cobertura
npm run test:e2e         # Tests end-to-end

# Análisis de Código
npm run analyze          # Análisis del bundle
npm run audit            # Auditoría de seguridad
```

## 🤝 Contribución al Proyecto

### Workflow de Desarrollo
1. **Fork** el repositorio
2. **Crear rama** de feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Desarrollar** siguiendo las convenciones establecidas
4. **Commit** con mensajes descriptivos
5. **Push** y crear **Pull Request**

### Convenciones de Código
- **TypeScript** obligatorio para nuevas funcionalidades
- **Material-UI** para todos los componentes de interfaz
- **Funcional Components** con hooks de React
- **ESLint** y **Prettier** configurados automáticamente
- **Conventional Commits** para mensajes de commit

## 📋 Roadmap de Desarrollo

### Versión 1.1 (Q1 2026)
- [ ] **Módulo de Reportes** avanzados con exportación PDF/Excel
- [ ] **API REST** completa para todos los módulos
- [ ] **Notificaciones en tiempo real** con WebSockets
- [ ] **Módulo de configuración** del sistema

### Versión 1.2 (Q2 2026)
- [ ] **App móvil** complementaria con React Native
- [ ] **Integración con sistemas ERP** externos
- [ ] **Inteligencia artificial** para predicción de demanda
- [ ] **Módulo de calidad** y trazabilidad de productos

### Versión 2.0 (Q3 2026)
- [ ] **Multi-tenancy** para múltiples empresas
- [ ] **API GraphQL** para consultas complejas
- [ ] **Módulo de e-commerce** B2B
- [ ] **Análisis predictivo** avanzado con ML

## 📞 Soporte y Contacto

- **Desarrollador**: carlos123ordaz
- **Repositorio**: [GitHub - CDS-ClientApp](https://github.com/carlos123ordaz/CDS-ClientApp)
- **Issues**: [Reportar problemas](https://github.com/carlos123ordaz/CDS-ClientApp/issues)
- **Documentación**: Wiki del proyecto (próximamente)

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **MaterialPro React Admin** - Template base de alta calidad
- **Material-UI Team** - Excelente sistema de componentes
- **React Community** - Por las mejores prácticas y herramientas
- **Vite Team** - Por la experiencia de desarrollo ultrarrápida

---

<div align="center">
  
**⭐ Si te gusta el proyecto, ¡dale una estrella en GitHub!**

Desarrollado con ❤️ por carlos123ordaz usando React + TypeScript + Material-UI

</div>