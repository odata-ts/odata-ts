import { DateTime } from "luxon";
import { Writable } from "stream";
import { constant, edm, XmlNode, XmlWriter } from ".";

export const edmxNS = "http://docs.oasis-open.org/odata/ns/edmx";
export const edmNS = "http://docs.oasis-open.org/odata/ns/edm";

export function writeCsdl(schema: edm.IEdmSchema, stream: Writable) {
  const xml = new XmlWriter(stream);
  const csdl = new CsdlWriter(xml);
  csdl.writeSchema(schema);
}

export function writeValue(value: constant.IEdmValue, stream: Writable) {
  const xml = new XmlWriter(stream);
  const csdl = new CsdlWriter(xml);
  csdl.writeValue(value);
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
      case "entity":
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
      case "complex":
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
      case "enum":
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

  writeValue(value: constant.IEdmValue) {
    switch (value.kind) {
      case constant.EdmValueKind.Binary:
        this.writer.writeText("Binary", arrayBufferToBase64(value.value));
        break;
      case constant.EdmValueKind.Boolean:
        this.writer.writeText("Boolean", value.value ? "true" : "false");
        break;
      case constant.EdmValueKind.Date:
        this.writer.writeText("Date", value.value.toISODate());
        break;
      case constant.EdmValueKind.DateTimeOffset:
        this.writer.writeText("DateTimeOffset", value.value.toISO());
        break;
      case constant.EdmValueKind.Decimal:
        this.writer.writeText("Decimal", value.value.toString());
        break;
      case constant.EdmValueKind.Duration:
        this.writer.writeText("DateTimeOffset", value.value.toISO());
        break;
      // case constant.EdmValueKind.EnumMember:
      //   this.writer.writeText("EnumMember", value.value);
      //   break;
      case constant.EdmValueKind.Floating:
        this.writer.writeText("Floating", value.value.toString());
        break;
      case constant.EdmValueKind.Guid:
        this.writer.writeText("Guid", value.value);
        break;
      case constant.EdmValueKind.Integer:
        this.writer.writeText("Integer", value.value.toString());
        break;
      case constant.EdmValueKind.String:
        this.writer.writeText("String", value.value);
        break;
      case constant.EdmValueKind.TimeOfDay:
        this.writer.writeText("TimeOfDay", value.value.toISOTime());
        break;
      case constant.EdmValueKind.Null:
        this.writer.writeElement("Null");
        break;
      case constant.EdmValueKind.Collection:
        this.writer.writeOpen("Collection");
        for (const element of value.elements) {
          this.writeValue(element);
        }
        this.writer.writeClose("Collection");
        break;
      case constant.EdmValueKind.Record:
        this.writer.writeOpen("Record");
        for (const element of value.properties) {
          // TODO: check if the property value can be written in attribute notation
          this.writer.writeOpen("PropertyValue", { Property: element.property });
          this.writeValue(element.value);
          this.writer.writeClose("PropertyValue");
        }
        this.writer.writeClose("Record");
        break;
    }
  }
}

function makeTypeName(type: edm.IEdmType): string {
  switch (type.typeKind) {
    case "entity":
    case "complex":
    case "enum":
      const ns = type.schema.alias;
      return ns + "." + type.name;
    case "collection":
      return `Collection(${makeTypeName(type.elementType)})`;
    case "primitive":
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

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  var base64 = "";
  var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + "==";
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + "=";
  }

  return base64;
}
