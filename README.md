# Bearfrens

![estado](https://img.shields.io/badge/Estado-En%20desarrollo-darkred)
> [!WARNING]
> 
> *Este proyecto es parte de mi TFG y aún está en desarrollo. Por lo que faltan algunas funcionalidades por añadir/completar.*
>

[![My Skills](https://skillicons.dev/icons?i=react,js,html,css,java,spring,mysql)](https://skillicons.dev)

Aplicación web full stack para el Trabajo de Fin de Grado (TFG) de la UGR (Ingeniería informática) diseñada con **React en el frontend** y **Spring Boot en el backend**, dirigida a conectar viajeros con anfitriones. Esta aplicación está pensada para aquellos viajeros que buscan opciones de alojamiento económicas, pero con un enfoque personalizado. Los viajeros pueden elegir hospedarse en viviendas ofrecidas por anfitriones que comparten sus intereses, valores o características personales, permitiendo una conexión más allá de los simples servicios de alojamiento. Además, los anfitriones tienen la posibilidad de seleccionar viajeros (inquilinos) que encajen con su estilo de vida o preferencias, lo que genera un sistema de "match" similar al de otras plataformas de citas o colaboración. 

A lo largo de la web, los usuarios pueden interactuar con perfiles detallados de ambos, anfitriones y viajeros, y utilizar filtros basados en gustos, valoraciones previas o experiencias pasadas para tomar decisiones más informadas. La plataforma también incluye eventos comunitarios, como encuentros entre viajeros y anfitriones, que fomentan la interacción entre personas con intereses comunes y enriquecen la experiencia tanto de los viajeros como de los anfitriones.

El sistema está optimizado para facilitar la creación de perfiles y la gestión de estos desde ambos lados: anfitriones que desean ofrecer su vivienda y viajeros que buscan la mejor opción para hospedarse. Todo esto se gestiona de manera fluida gracias a la integración de React para el frontend y Spring Boot para el backend, lo que garantiza un rendimiento eficiente y una experiencia de usuario agradable.

--- 

## 🛠️ Instrucciones para poder visualizar el proyecto

> [!NOTE]
> 
> Antes de ejecutar el proyecto, es necesario asegurarse de tener **Node.js** instalado, disponible en https://nodejs.org/es
>
> Una vez instalado podemos ejecutar en nuestra terminal `node -vp` para verificar que se ha instalado correctamente

> [!IMPORTANT]
>
> **Configuración del archivo** `application.properties`
>
> Antes de ejecutar el proyecto, es **muy importante** configurar correctamente el archivo `application.properties` ubicado en `src/main/resources/` (explicado en el **Paso 6**). Este archivo contiene las **configuraciones necesarias** para la conexión a la base de datos y otras propiedades clave.

### **Paso 1: Clonar el repositorio en nuestra máquina local**
```bash
git clone https://github.com/{usuario}/{tu_repositorio}.git
cd tu_repositorio
```

### **Paso 2: (Opcional) Instalar Vite si no está configurado**
```bash
npm install @vitejs/plugin-react --save-dev
```

### **Paso 3: Instalar las dependencias necesarias**
```bash
npm install
```

### **Paso 4: Iniciar en nuestro servidor local**
```bash
npm run dev
```

### **Paso 5. Iniciar MySQL**
```bash
net start MySQL<VERSION_INSTALADA>
```

### **Paso 6. Configurar la base de datos**
Asegurar de que la base de datos `bearfrens_db` está creada en MySQL.
```bash
CREATE DATABASE bearfrens_db;
```

Configura y crea las credenciales de la base de datos en el archivo `application.properties` dentro del proyecto Spring Boot. 

Para ello crealo si no existe en la ruta `src/main/resources/application.properties`.

Luego, edita el archivo `application.properties` y proporciona los siguientes valores:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/bearfrens_db
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
spring.jpa.hibernate.ddl-auto=update

IMGBB_API_KEY=TU_CLAVE_API

JWT_SECRET_KEY=CLAVE_SECRETA_TOKEN
JWT_EXPIRATION=TIEMPO_EXPIRACIÓN
JWT_REFRESH_EXPIRATION=TIEMPO_REFRESCO

ADMIN_EMAIL=EMAIL_ADMIN
ADMIN_PASSWORD=PASSWORD_ADMIN

spring.servlet.multipart.max-file-size=31MB
spring.servlet.multipart.max-request-size=31MB
```


### **Paso 7. Compilar y ejecutar el backend**
```bash
mvn clean install
java -jar target/BearfrensBackendApplication.jar
```

### **Paso 8. Verificar la ejecución**
Finalmente el backend debería estar ejecutandose en `http://localhost:8080/` por defecto.

