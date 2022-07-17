# 🐢 @angonoka/core

## Faster than it seems

_Angonoka_ - Modular backend framework with full freedom of will.

Modular backend framework with the principle of personal responsibility. We provide ready-made code for a quick and convenient workflow for creating a server - you are responsible for its performance. In return, you get complete freedom of action. Write the code as you whish, call it in any sequence and modify the workflow at any time if you have thoughts on how to make it better

## The basics

### Controller

Imagine your server and endpoints as a folder with files. [Controller](#controller) is a folder that stores any set of endpoints

```ts
@Controller(fastifyServer, 'example')
export const ExampleController {
    constructor(public server: FastifyInstance) {}
...
}
```

> You may have noticed that we use decorators. Alas, so far this is the only way to work with the framework. Most likely, this will remain the only true way of development. So let's add the necessary strings to our tsconfig.json

#### tsconfig.json

You need to add the following lines to the compiler settings, otherwise nothing will work 😔

```json
...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
```

> The second thing that catches your eye is the mandatory [fasitfy](https://www.npmjs.com/package/fastify) server declaration. So far, it is mandatory to use [fastify](https://www.npmjs.com/package/fastify), but for full independence and convenience of developers, we will support as many server libraries as possible [#ToDo](#todo)

### Endpoint

One look is worth a thousand words.

```ts
@Controller('example')
export const ExampleController {
...

    @Get('hello')
    getHelloWorld() {
        return 'Hello, outer space! 👽'
    }
}
```

You can use any CRUD method as a decorator.

Remember, until you initialize the endpoint with a decorator, this method will remain an ordinary function inside the [Controller](#controller) class. Also, you will not be able to use other features of the framework

### Start/Initialization

Here is a minimal example of how to connect everything together.

```ts
import fastify from "fastify";
import ExampleController from "controllers/example";

const server = fastify();

new ExampleController();

await server.listen({ port: 1234, host: "127.0.0.1" });
console.log("Started");
```

> In the near future, an extension module for automatic import of endpoints may appear, which simplifies life even more, but slightly reduces your freedom of architecture development

### Modules

Since we followed a modular distribution strategy, there should be extension modules. They will add the necessary logic for your endpoints

- [@angonoka/validation](https://www.npmjs.com/@angonoka/validation) - Validation and semi-automatic generation of OpenAPI documentation
- [@angonoka/auth](https://www.npmjs.com/@angonoka/auth) - Authorization of requests

## #Todo

- [ ] Using server abstractions, instead of binding to a specific library
- [ ] Automatic import of controllers
