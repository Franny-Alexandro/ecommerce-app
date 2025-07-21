# 🛒 Plataforma E-commerce - TiendaWeb

Una plataforma de e-commerce completa desarrollada con React + TypeScript, Firebase y diseño moderno tipo Amazon.

## 🔐 Sistema de Roles y Seguridad

### Roles Disponibles:
- **Cliente (user)**: Usuarios normales que pueden comprar productos
- **Supervisor**: Pueden gestionar sus propios productos y ventas
- **Administrador (admin)**: Acceso completo al sistema

### 🛡️ Asignación Segura de Roles

**IMPORTANTE**: Por motivos de seguridad, todos los usuarios se registran automáticamente como "Cliente". Los roles de Supervisor y Admin deben ser asignados manualmente desde Firebase.

#### Cómo asignar roles de Supervisor o Admin:

1. **Accede a Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto

2. **Navega a Firestore Database**
   - En el menú lateral, selecciona "Firestore Database"
   - Ve a la colección `users`

3. **Encuentra el usuario**
   - Busca el documento del usuario por su UID
   - Haz clic en el documento para editarlo

4. **Cambia el rol**
   - Busca el campo `role`
   - Cambia el valor de `"user"` a:
     - `"supervisor"` para supervisores
     - `"admin"` para administradores

5. **Guarda los cambios**
   - El usuario tendrá acceso inmediato a su nuevo rol

### 📍 URLs de Acceso por Rol

- **Todos los usuarios**: `/profile` - Ver información personal
- **Clientes**: Acceso a compras, carrito, lista de deseos
- **Supervisores**: `/supervisor` - Panel de gestión de productos
- **Administradores**: `/admin` - Panel de administración completo

### 🔒 Seguridad Implementada

- ✅ Registro automático como "user"
- ✅ Rutas protegidas por rol
- ✅ Verificación de permisos en tiempo real
- ✅ Redirección automática si no tienes permisos
- ✅ Validación de roles en el backend

## 🚀 Funcionalidades Principales

### Para Clientes:
- Registro e inicio de sesión (email, Google, Facebook)
- Navegación y búsqueda de productos
- Carrito de compras
- Lista de deseos
- Sistema de reseñas
- Historial de compras

### Para Supervisores:
- Panel de gestión de productos
- CRUD completo de productos propios
- Gestión de inventario
- Visualización de estadísticas de ventas

### Para Administradores:
- Acceso completo al sistema
- Gestión de todos los usuarios y productos
- Panel de estadísticas globales
- Configuración del sistema

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + TypeScript
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Autenticación**: Firebase Auth (Email, Google, Facebook)
- **Base de Datos**: Firestore
- **Almacenamiento**: Firebase Storage

## 📦 Instalación y Configuración

1. **Clona el repositorio**
   ```bash
   git clone [tu-repositorio]
   cd ecommerce-platform
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura Firebase**
   - Crea un proyecto en Firebase Console
   - Habilita Authentication (Email, Google, Facebook)
   - Crea una base de datos Firestore
   - Actualiza las credenciales en `src/config/firebase.ts`

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🔧 Configuración de Firebase

### Habilitar Autenticación:
1. Ve a Authentication → Sign-in method
2. Habilita:
   - Email/Password
   - Google
   - Facebook

### Configurar Firestore:
1. Crea una base de datos Firestore
2. Configura las reglas de seguridad
3. Las colecciones se crearán automáticamente

### Reglas de Firestore Recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by supervisors/admins
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['supervisor', 'admin']);
    }
    
    // Orders are readable/writable by the user who created them
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── common/         # Componentes comunes
│   └── product/        # Componentes de productos
├── context/            # Contextos de React
├── pages/              # Páginas principales
├── services/           # Servicios de Firebase
├── types/              # Tipos de TypeScript
└── config/             # Configuración
```

## 📝 Próximas Funcionalidades

- [ ] Integración con PayPal
- [ ] Generación de facturas PDF
- [ ] Notificaciones por email
- [ ] Sistema de cupones
- [ ] Chat en vivo
- [ ] Análisis avanzado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
