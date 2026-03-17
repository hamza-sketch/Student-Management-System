@echo off

:: Create directories
mkdir server\src\api\routes
mkdir server\src\api\controllers
mkdir server\src\services
mkdir server\src\models
mkdir server\src\middlewares
mkdir server\src\config
mkdir server\src\utils
mkdir server\src\validations
mkdir server\src\constants
mkdir server\src\jobs
mkdir docs

:: Create route files
echo. > server\src\api\routes\auth.routes.js
echo. > server\src\api\routes\task.routes.js

:: Create controller files
echo. > server\src\api\controllers\auth.controller.js
echo. > server\src\api\controllers\task.controller.js

:: Create service files
echo. > server\src\services\auth.service.js
echo. > server\src\services\task.service.js

:: Create model files
echo. > server\src\models\user.model.js
echo. > server\src\models\task.model.js

:: Create middleware files
echo. > server\src\middlewares\auth.middleware.js
echo. > server\src\middlewares\error.middleware.js

:: Create config files
echo. > server\src\config\db.config.js
echo. > server\src\config\env.config.js

:: Create utility files
echo. > server\src\utils\token.utils.js
echo. > server\src\utils\logger.js

:: Create validation files
echo. > server\src\validations\auth.validation.js

:: Create constants
echo. > server\src\constants\roles.js

:: Create job files
echo. > server\src\jobs\email.job.js

:: Create root source files
echo. > server\src\app.js
echo. > server\src\server.js

:: Create root files
echo. > README.md

echo Folder structure created successfully!