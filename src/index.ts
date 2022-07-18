import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";

type CRUDMethod = "get" | "post" | "put" | "delete";

const makeEndpointFactory = (method: CRUDMethod, path: string) => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    if (!target.endpoints) target.endpoints = [];
    if (!target.isController) target.isController = true;
    target.endpoints.push(key);
    const fn = target[key];
    fn.isEndpoint = true;
    fn.method = method;
    fn.path = path;
    if (!fn._modules) fn._modules = [];
    return descriptor;
  };
};

export const Get = (path: string) => makeEndpointFactory("get", path);
export const Post = (path: string) => makeEndpointFactory("post", path);
export const Put = (path: string) => makeEndpointFactory("put", path);
export const Delete = (path: string) => makeEndpointFactory("delete", path);

export type RequestTypes = Partial<{
  Body: any;
  Querystring: any;
  Params: any;
}>;
export type Request<T extends RequestTypes = {}> = [
  req: FastifyRequest<T>,
  res: FastifyReply
];

export type IEndpoint = ((request: Request) => unknown) & {
  isEndpoint: true;
  method: CRUDMethod;
  path: string;
  _modules: Array<
    (endpoint: IEndpoint, req: FastifyRequest, res: FastifyReply) => any
  >;
};

export const Controller = (route: string) => {
  return <T extends { new (...args: any[]): { [key: string]: any } }>(
    Base: T
  ) => {
    return class extends Base {
      path = route;
      server?: FastifyInstance;
      endpoints!: Array<keyof typeof this>;
      isController!: true;
      _modules!: IEndpoint["_modules"];

      constructor(...args: any[]) {
        super(...args);

        if (!this.server)
          throw new Error(
            'Before using the "Controller" decorator, you need to set the "server" property at the controller'
          );

        if (this.server as FastifyInstance)
          if (!this.server.printPlugins)
            throw new Error(
              "Most likely, you are not using fastify as a server, or you are using an outdated version."
            );

        for (const prop of this.endpoints) {
          const endpoint = this[prop] as IEndpoint;
          this.server[endpoint.method](
            path.join("/", this.path, endpoint.path).split("\\").join("/"),
            async (req, res) => {
              try {
                for (const logic of endpoint._modules) {
                  const data = await logic.bind(this)(endpoint, req, res);
                  if (data) return data;
                }
                return await endpoint.bind(this)([req, res]);
              } catch (error) {
                console.error(error);
                return res.code(500).send();
              }
            }
          );
        }
      }
    };
  };
};
