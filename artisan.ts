import yargs, {Arguments} from 'yargs';
import {MigrationTemplate} from "./code_templates/MigrationTemplate";
import {ModelTemplate} from "./code_templates/ModelTemplate";
import {RepositoryTemplate} from "./code_templates/RepositoryTemplate";
import {ServiceTemplate} from "./code_templates/ServiceTemplate";
import {HandlerTemplate, Type} from "./code_templates/HandlerTemplate";
import {SwaggerRequestTemplate} from "./code_templates/SwaggerRequestTemplate";
import {SwaggerPathTemplate} from "./code_templates/SwaggerPathTemplate";
import {SwaggerResponseTemplate} from "./code_templates/SwaggerResponseTemplate";
import {UnitTestTemplate} from "./code_templates/UnitTestTemplate";

const commands = yargs(process.argv.slice(2));

try {

    commands.command('make:migration <table>', 'Create a migration file', () => {}, (argv: Arguments) => {
        const template = new MigrationTemplate(<string>argv.table);
        template.generate();
        console.log("Migration file successfully created");
    });

    commands.command('make:event <name>', 'Create a new event handler', () => {}, (argv: Arguments) => {
        const template = new HandlerTemplate(<string>argv.name, Type.EVENT);
        template.generate();
        console.log("Event Handler successfully created");
    });

    commands.command('make:api <name>', 'Create a new api handler', () => {}, (argv: Arguments) => {
        const template = new HandlerTemplate(<string>argv.name, Type.API);
        template.generate();
        console.log("API Handler successfully created");
    });

    commands.command('make:cron <name>', 'Create a new cron handler', () => {}, (argv: Arguments) => {
        const template = new HandlerTemplate(<string>argv.name, Type.CRON);
        template.generate();
        console.log("Cron Handler successfully created");
    });

    commands.command('make:model <name>', 'Create a model class', () => {}, (argv: Arguments) => {
        const template = new ModelTemplate(<string>argv.name);
        template.generate();

        console.log("Model successfully created");
    });

    commands.command('make:repository <name>', 'Create a repository class', () => {}, (argv: Arguments) => {
        const template = new ModelTemplate(<string>argv.name, true);
        template.generate();

        const repository = new RepositoryTemplate(<string>argv.name);
        repository.generate();

        console.log("Repository successfully created");
    });

    commands.command('make:service <name>', 'Create a service class', () => {}, (argv: Arguments) => {
        const template = new ServiceTemplate(<string>argv.name);
        template.generate();

        console.log("Service successfully created");
    });

    commands.command('swagger:request <name>', 'Create a swagger request definition file', () => {}, (argv: Arguments) => {
        const template = new SwaggerRequestTemplate(<string>argv.name);
        template.generate();

        console.log("Swagger definition successfully created");
    });

    commands.command('swagger:response <name>', 'Create a swagger response definition file', () => {}, (argv: Arguments) => {
        const template = new SwaggerResponseTemplate(<string>argv.name);
        template.generate();

        console.log("Swagger definition successfully created");
    });

    commands.command('swagger:path <name>', 'Create a swagger path file', () => {}, (argv: Arguments) => {
        const template = new SwaggerPathTemplate(<string>argv.name);
        template.generate();

        console.log("Swagger path successfully created");
    });

    commands.command('make:test <name>', 'Create a unit testing file', () => {}, (argv: Arguments) => {
        const template = new UnitTestTemplate(<string>argv.name);
        template.generate();

        console.log("Unit testing successfully created");
    });

    commands.strictCommands();
    commands.argv;

} catch (error) {
    console.log(error.message);
}