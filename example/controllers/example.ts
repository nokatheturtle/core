import { FastifyInstance } from "fastify";
import { Controller, Get } from "../../src/index.js";

@Controller("example")
class ExampleController {
  constructor(public server: FastifyInstance) {}

  @Get("hello")
  getHelloWorld() {
    return "Hello from outer space! 👽";
  }
}

export default ExampleController;
