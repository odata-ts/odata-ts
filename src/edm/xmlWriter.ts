import { Writable } from "stream";

type Attributes = { [key: string]: string | number | boolean | undefined };

export interface XmlNode {
  name: string;
  attributes?: Attributes;
  elements?: readonly XmlNode[];
}

export class XmlWriter {
  constructor(stream: Writable, options?: { indented: boolean }) {
    this.stream = stream;
    this.lf = options == undefined || options.indented ? "\n" : "";
    this.indent = options == undefined || options.indented ? "  " : "";
  }
  private readonly lf: string;
  private readonly indent: string;
  private readonly stack: string[] = [];

  readonly stream: Writable;

  writePreamble() {
    if (this.stack.length != 0) {
      throw new Error("preamble must be first element written");
    }
    this.stream.write(`<?xml version="1.0"?>${this.lf}`); // encoding="UTF-8" standalone="yes"
  }

  writeOpen(name: string, attributes?: Attributes) {
    let attr = attributes ? this.formatAttributes(attributes) : undefined;
    this.writeIndented(`<${name}${attr ? " " + attr : ""}>`);
    this.stack.push(name);
  }

  writeElement(name: string, attributes?: Attributes) {
    let attr = attributes ? this.formatAttributes(attributes) : undefined;
    this.writeIndented(`<${name}${attr ? " " + attr : ""}/>`);
  }

  writeText(name: string, value: string) {
    this.writeIndented(`<${name}>${value}</${name}>`);
  }

  writeClose(name: string) {
    const top = this.stack.pop();
    if (top !== name) {
      throw new Error(`unbalanced XML tags acutal ${name} expected ${top}`);
    }
    this.writeIndented(`</${name}>`);
  }

  writeNode(node: XmlNode) {
    this.writeOpen(node.name, node.attributes);
    for (const item of node.elements ?? []) {
      this.writeNode(item);
    }
    this.writeClose(node.name);
  }

  // ---------------

  private writeIndented(text: string) {
    let indentation = this.indent.repeat(this.stack.length);
    this.stream.write(`${indentation}${text}${this.lf}`);
  }

  private formatAttributes(attributes: Attributes): string {
    return Object.keys(attributes)
      .filter((key) => attributes[key] !== undefined)
      .map((key) => {
        let val = attributes[key];
        return val === undefined ? undefined : `${key}="${this.formatValue(val)}"`;
      })
      .join(" ");
  }

  private formatValue(value: boolean | number | string): string {
    if (typeof value == "boolean") return value ? "True" : "False";
    if (typeof value == "number") return value.toString();
    return value;
  }
}
