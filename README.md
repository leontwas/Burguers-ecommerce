Proyecto Ficticio de Hamburguesería¡Bienvenido al repositorio de nuestro proyecto de hamburguesería! Este es un proyecto ficticio desarrollado como una aplicación web interactiva para la gestión de productos de una hamburguesería.Tecnologías UtilizadasEste proyecto está construido utilizando:React: Una biblioteca de JavaScript para construir interfaces de usuario.Vite: Un entorno de desarrollo frontend de próxima generación que ofrece una experiencia de desarrollo extremadamente rápida.Bootstrap: Un framework de CSS para un diseño responsivo y estilizado.SweetAlert2: Una librería para alertas personalizables y atractivas.React Router DOM: Para manejar la navegación en la aplicación de una sola página.Prop-types: Para la validación de tipos de propiedades en componentes React.js-sha1: Para hashing SHA-1.Axios: Un cliente HTTP basado en promesas para el navegador y Node.js, utilizado aquí para interactuar con una API externa (aunque las operaciones CRUD locales se manejan en memoria).Cómo Poner en Marcha el ProyectoPara clonar este repositorio y ejecutar el proyecto en tu máquina local, sigue los siguientes pasos:1. Clonar el RepositorioAbre tu terminal o línea de comandos y ejecuta el siguiente comando para clonar el proyecto desde GitHub:git clone <URL_DEL_REPOSITORIO>
(Reemplaza <URL_DEL_REPOSITORIO> con la URL real de tu repositorio de GitHub)2. Navegar al Directorio del ProyectoUna vez clonado, entra en el directorio del proyecto:cd <nombre-del-directorio-del-proyecto>
3. Instalar DependenciasEste proyecto utiliza npm como gestor de paquetes. Necesitarás instalar todas las dependencias listadas en package.json. Además, si estás iniciando un proyecto Vite desde cero, el comando npm create vite@latest es el primer paso, pero si ya has clonado el repositorio, solo necesitas instalar las dependencias existentes.Ejecuta los siguientes comandos para instalar las dependencias:# Si aún no tienes un proyecto Vite inicializado (normalmente no necesario después de clonar)
# npm create vite@latest

# Instala las dependencias principales del proyecto
npm install

# Instala las dependencias específicas (si no se instalaron con npm install)
npm install bootstrap@5.3.7
npm install sweetalert2
npm install react-router-dom
npm install prop-types
npm install js-sha1
npm install axios
4. Iniciar el Servidor de DesarrolloUna vez que todas las dependencias estén instaladas, puedes iniciar el servidor de desarrollo de Vite:npm run dev
Esto iniciará la aplicación en tu navegador, generalmente en http://localhost:5173 (o un puerto similar).¡Listo! Ahora deberías poder interactuar con la aplicación de hamburguesería en tu navegador.