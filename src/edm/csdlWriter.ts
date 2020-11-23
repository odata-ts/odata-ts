import { writer } from "repl";
import { Writable } from "stream";

// import { IEdmType, IEdmSchema, IEdmSchemaElement, EdmTypeKind, EdmElementKind } from "../edm/interfaces";
import { edm } from "./interfaces";
import { XmlNode, XmlWriter } from "./xmlWriter";

export const edmxNS = "http://docs.oasis-open.org/odata/ns/edmx";
export const edmNS = "http://docs.oasis-open.org/odata/ns/edm";

export function writeCsdl(schema: edm.IEdmSchema, stream: Writable) {
  const xml = new XmlWriter(stream);
  const csdl = new CsdlWriter(xml);
  csdl.writeSchema(schema);
}

export class CsdlWriter {
  constructor(readonly writer: XmlWriter) {}

  writeSchema(schema: edm.IEdmSchema) {
    this.writer.writePreamble();
    this.writer.writeOpen("Schema", {
      Namespace: schema.namespace,
      Alias: schema.alias,
      xmlns: edmNS,
    });
    for (const element of schema.elements) {
      this.writeSchemaElement(element);
    }
    this.writer.writeClose("Schema");
  }

  writeSchemaElement(element: edm.IEdmSchemaElement) {
    switch (element.elementKind) {
      case edm.EdmElementKind.Entity:
        const entity = element;
        this.writer.writeOpen("Entity", { Name: entity.name });
        for (const prop of entity.properties) {
          this.writer.writeElement("Property", {
            Name: prop.name,
            Type: makeTypeName(prop.type),
          });
        }
        this.writer.writeClose("Entity");
        break;
      case edm.EdmElementKind.Complex:
        const complex = element;
        this.writer.writeOpen("Complex", { Name: complex.name });
        for (const prop of complex.properties) {
          this.writer.writeElement("Property", {
            Name: prop.name,
            Type: makeTypeName(prop.type),
          });
        }
        this.writer.writeClose("Complex");
        break;
      case edm.EdmElementKind.Enum:
        const enumeration = element;
        this.writer.writeOpen("Enum", { Name: enumeration.name });
        for (const member of enumeration.members) {
          this.writer.writeElement("Member", {
            Name: member.name,
            Value: member.value,
          });
        }
        this.writer.writeClose("Enum");
        break;
      default:
        return assertNever(element);
    }
  }
}

function makeTypeName(type: edm.IEdmType): string {
  switch (type.typeKind) {
    case edm.EdmTypeKind.Entity:
    case edm.EdmTypeKind.Complex:
    case edm.EdmTypeKind.Enum:
      const ns = type.schema.alias;
      return ns + "." + type.name;
    case edm.EdmTypeKind.Collection:
      return `Collection(${makeTypeName(type.elementType)})`;
    case edm.EdmTypeKind.Primitive:
      return "Edm" + "." + type.name;
    default:
      return assertNever(type);
  }
}

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export function edmx(...xml: readonly XmlNode[]): XmlNode {
  return {
    name: "edmx:Edmx",
    attributes: {
      "xmlns:edmx": edmxNS,
      Version: "4.01",
    },
    elements: [
      {
        name: "edmx:DataServices",
        elements: xml ? [...xml] : undefined,
      },
    ],
  };
}

export function schema(...xml: readonly XmlNode[]): XmlNode {
  return {
    name: "Schema",
    attributes: { xmlns: edmNS, Namespace: "org.example", Alias: undefined },
    elements: xml ? [...xml] : undefined,
  };
}
