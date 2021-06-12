/// <reference types="node" />
import { Writable } from "stream";
import { constant, edm, XmlNode, XmlWriter } from ".";
export declare const edmxNS = "http://docs.oasis-open.org/odata/ns/edmx";
export declare const edmNS = "http://docs.oasis-open.org/odata/ns/edm";
export declare function writeCsdl(schema: edm.IEdmSchema, stream: Writable): void;
export declare function writeValue(value: constant.IEdmValue, stream: Writable): void;
export declare class CsdlWriter {
    readonly writer: XmlWriter;
    constructor(writer: XmlWriter);
    writeSchema(schema: edm.IEdmSchema): void;
    writeSchemaElement(element: edm.IEdmSchemaElement): undefined;
    writeValue(value: constant.IEdmValue): void;
}
export declare function edmx(...xml: readonly XmlNode[]): XmlNode;
export declare function schema(...xml: readonly XmlNode[]): XmlNode;
