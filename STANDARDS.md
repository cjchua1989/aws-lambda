# CODING STANDARDS

## Migrations
* When creating or updating views, tables, and stored procedure please create migration file 
* Utilize the command ```./artisan.sh make:migrate```
* Always run ```./artisan.sh migrate``` to update your local version of the database
* Migration can file can also be used to seed data to the database

## Unit Testing
* Create a test script for newly created functions
* Use the mocha and chai to assert result
* All test script should define at ```./tests``` folder
* Always run ```./artisan.sh test``` before creating a pull request
* Use ```faker``` to generate random data

## Coding Style
* Follow the ```AirBNB ESLint``` coding standard
* Install ```ESLint``` and ```SonarQube``` plugin on your IDE
* Set you indention to ```4 spaces```
* All variable and attributes should be in ```snake_case``` and descriptive
* All constant variables should be on ```SCREAMING_SNAKE_CASE```
* All variable that will be used on the function should be initialized prior to usage
* All function name or methods should be descriptive in name and ``camelCased``
* All class name should be in ```PascalCase```
* Use ```Repository Pattern``` to separate all the queries from the business logic

## Database MYSQL
* Implement normalization as much as possible
* Don't use ```SELECT *``` always define the columns that you want retrieve
* If you are expecting only one result add ```LIMIT = 1```
* Create an ```INDEX``` depending on the ```WHERE``` conditions and ```JOIN``` statements
* Use ```VIEWS``` or ```STORED PROCEDURE``` abstract queries that is complex
* All table should have ```createdAt TIMESTAMP```,  ```updatedAt TIMESTAMP```, and ```deletedAt TIMESTAMP```

## ORM

## Git Flow Process

## Node Modules
* ```axios``` - used for api calls
* ```uuid4``` - used to generate unit identification
* ```mocha & chai``` - used for unit testing 
* ```mysql``` - used for database integration
* ```dot-env``` - used to load environment variables from .env file
* ```moment-timezone``` - used for date time concerns
* ```sequelize``` - a database ORM library
