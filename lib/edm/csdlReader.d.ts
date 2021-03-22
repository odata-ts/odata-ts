import { model } from "./model";
export declare function readCsdl(xml: string, cb: (schema: model.EdmSchema) => void): void;
export declare function makeSchema(xml: any): model.EdmSchema;
