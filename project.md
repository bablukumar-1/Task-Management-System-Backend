# project Intialize

* npm init -y

* install npm module and library
* npm i

        * express
        * dotenv
        * mongoose
        * cors
        * express
        * --save-dev prettier

* Create a root file

        * .prettierrc
        * .prettierignore
        * .env
        *.gitignore
        * .env.local
        * readme.md
        * project.md
        * package.json
        * package-lock.json

* Create a required folder

        * public
             * images
                * .gitkeep
        
        * src
          *controllers 
                * auth.controllers.js
                * healthcheck.controllers.js
                * project.controllers.js
                * task.controllers.js
          * db 
                * index.js
          * middlewares 
                * validator.middleware.js
          * models
                * user.models.js
                * task.models.js
                * subtask.models.js
                * project.models.js
                * note.models.js
                *projectmember.models.js
          * routes 
                * auth.routes.js
                * healthcheck.routes.js
                * project.routes.js
                * task.routes.js
          * utils 
                * api-error.js
                * api-response.js
                * async-handler.js
                * constant.js
          * validators
                * index.js
          - app.js
          - index.js
