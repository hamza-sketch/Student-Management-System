@echo off

:: Create directories
mkdir client\public
mkdir client\src\assets
mkdir client\src\components
mkdir client\src\pages
mkdir client\src\layouts
mkdir client\src\services
mkdir client\src\hooks
mkdir client\src\context
mkdir client\src\store
mkdir client\src\utils
mkdir client\src\routes

:: Create component files
echo. > client\src\components\Navbar.jsx
echo. > client\src\components\TaskCard.jsx

:: Create page files
echo. > client\src\pages\Login.jsx
echo. > client\src\pages\Register.jsx
echo. > client\src\pages\Dashboard.jsx

:: Create layout files
echo. > client\src\layouts\MainLayout.jsx

:: Create service files
echo. > client\src\services\api.js
echo. > client\src\services\authService.js
echo. > client\src\services\taskService.js

:: Create hook files
echo. > client\src\hooks\useAuth.js

:: Create context files
echo. > client\src\context\AuthContext.jsx

:: Create store files
echo. > client\src\store\store.js

:: Create utility files
echo. > client\src\utils\helpers.js

:: Create route files
echo. > client\src\routes\AppRoutes.jsx

:: Create root src files
echo. > client\src\App.jsx
echo. > client\src\main.jsx

:: Create root files
echo. > client\package.json

echo Client folder structure created successfully!