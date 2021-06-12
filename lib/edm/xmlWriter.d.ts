/// <reference types="node" />
import { Writable } from "stream";
declare type Attributes = {
    [key: string]: string | number | boolean | undefined;
};
export interface XmlNode {
    name: string;
    attributes?: Attributes;
    elements?: readonly XmlNode[];
}
export declare class XmlWriter {
    constructor(stream: Writable, options?: {
        indented: boolean;
    });
    private readonly lf;
    private readonly indent;
    private readonly stack;
    readonly stream: Writable;
    writePreamble(): void;
    writeOpen(name: string, attributes?: Attributes): void;
    writeElement(name: string, attributes?: Attributes): void;
    writeText(name: string, value: string): void;
    writeClose(name: string): void;
    writeNode(node: XmlNode): void;
    private writeIndented;
    private formatAttributes;
    private formatValue;
}
export {};
