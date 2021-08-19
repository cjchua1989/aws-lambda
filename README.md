# Setup
* Install nvm and install node version 14 (reference: https://github.com/nvm-sh/nvm#installing-and-updating)
* Install docker (reference: https://docs.docker.com/engine/install/ubuntu/)
* Install Jest Runner, TSLint and SonarQube plugin on your IDE
* Clone the boiler plate by ```git clone https://github.com/cjchua1989/aws-lambda.git``` and run ```npm install```
* Install serverless via ```npm install -g serverless@2.43.1```
* Install ```ts-node```, via ```npm install -g typescript ts-node```
* Copy ```.env.example``` to ```.env```
* Edit ```API_SECRET=[generate a random string]```

# Filesystem
This is how the files of the framework are organized.

* ```code_templates``` - Where the code template is stored 
* ```docs``` - Holds the system documentations
* ```environment``` - Holds the Dockerfiles and mysql database data volume
* ```migrations``` - Migration files to update the database structure
* ```src``` - Where the magic happens
* ```src\libs``` - Holds the system libraries
* ```src\models``` - System data models
* ```src\repositories``` - System repositories to query models from database
* ```src\services``` - System services when logic happens
* ```src\functions``` - Stores the lambda functions
* ```src\functions\apis``` - Stores the api lambda functions
* ```src\functions\crons``` - Stores the cron lambda functions
* ```src\functions\events``` - Stores the events lambda functions
* ```src\functions\middlewares``` - Function that handles token validation
* ```.env.example``` - Environment file template
* ```buildspec.yml``` - Build script for deployment
* ```custom.yml``` - Connect the environment variable to the functions
* ```docker-compose.yml``` - Local environment configuration file
* ```migrations.js``` - Execute the migration files to the sync the databases
* ```resources.yml``` - API Gateway response structure
* ```serverless-api.yml``` - serverless.yml for the Application APIs
* ```serverless-crons.yml``` - serverless.yml for Cron functions
* ```serverless-events.yml``` - serverless.yml for Event functions
* ```artisan.ts``` - Helper bash script to generate code template

# Commands

## Artisan Commands
These are the commands that can help automate the generation of the files of the framework.
* ```ts-node artisan.ts make:migration <table_name>``` - Generate a new migration file and store it on the migrations folder
* ```ts-node artisan.ts make:event <function_name>``` - Generate an event function template
* ```ts-node artisan.ts make:api <function_name>``` - Generate an api function template
* ```ts-node artisan.ts make:cron <function_name>``` - Generate a cron function template
* ```ts-node artisan.ts make:model <model_name>``` - Generate a model code template
* ```ts-node artisan.ts make:repository <repository_name>``` - Generate a repository code template and model code  template if not existing
* ```ts-node artisan.ts dynamo:model <model_name>``` - Generate a dynamodb model code template
* ```ts-node artisan.ts dynamo:repository <repository_name>``` - Generate a dynamodb repository code template and dynamodb model code  template if not existing
* ```ts-node artisan.ts make:service <service_name>``` - Generate a service code template
* ```ts-node artisan.ts swagger:request <name>``` - Generate a swagger request definition file
* ```ts-node artisan.ts swagger:response <name>``` - Generate a swagger response definition file
* ```ts-node artisan.ts swagger:path <name>``` - Generate a swagger path file

## NPM Commands
These are some of the base npm commands that you can use on each project, you can add more custom commands through the package.json.

* ```npm run start``` - Initialize your local environment with the use of docker
* ```npm run stop``` - Stop your local environment
* ```npm run swagger:build``` - Build the swagger documentation
* ```npm run lint``` - Run tslint to clean codes
* ```npm run serve:app``` - Run the serverless offline to test application api
* ````npm run migrate```` - Execute all the new migration files
* ```npm run migrate:rollback``` - Rollback all migrations
* ```npm run migrate:refresh``` - Refresh the database by rolling back all migration and remigrating it all
* ```npm run test``` - Run the unit testing
