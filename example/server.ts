import fastify from "fastify";
import ExampleController from "./controllers/example.js";

export const server = fastify();

new ExampleController(server);

await server.listen({ port: 1234, host: "127.0.0.1" });
console.log("Started");
