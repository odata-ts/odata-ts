import {
  Schema,
  ISchemaElement,
  StructuredType,
  ComplexType,
  EntityType,
  Property,
  TypeReference,
} from "./model";
import { XmlWriter } from "./xmlwriter";

const edmx = "http://docs.oasis-open.org/odata/ns/edmx";
const edm = "http://docs.oasis-open.org/odata/ns/edm";

export class CsdlWriter {
  static write(schema: Schema, path: string) {
    var writer = new CsdlWriter(new XmlWriter(path));
    try {
      writer.writeEnvelope(schema);
    } catch (e) {
    } finally {
      writer.close();
    }
  }

  constructor(readonly writer: XmlWriter) {}

  private close() {
    this.writer.close();
  }

  private writeEnvelope(schema: Schema) {
    this.writer.start("edmx:Edmx", { "xmlns:edmx": edmx, Version: "4.01" });
    // this.writer.start("edmx:Reference", { Uri: "http://host/service/$metadata" });
    // this.writer.start( "edmx:Include", { Namespace: "ODataDemo", Alias: "target" }, true);
    // this.writer.end();

    this.writer.start("edmx:DataServices");
    this.writer.start("Schema", {
      xmlns: edm,
      Namespace: schema.name,
      //   Alias: "self",
    });
    for (const item of schema.elements) {
      this.writeSchemaElement(item);
    }
    this.writer.end("edmx:Edmx");
  }

  private writeSchemaElement(element: ISchemaElement) {
    element.matchElement({
      StructuredType: (structured) => this.writeStructuredType(structured),
    });
  }

  private writeStructuredType(structured: StructuredType) {
    structured.match({
      EntityType: (entity) => this.writeEntityType(entity),
      ComplexType: (complex) => this.writeComplexType(complex),
    });
  }

  private writeEntityType(entity: EntityType) {
    this.writer.start("EntityType", {
      Name: entity.name,
      BaseType: entity.baseType?.name ?? null,
    });
    for (const property of entity.declaredProperties) {
      this.writeProperty(property);
    }
    this.writer.end();
  }

  private writeComplexType(complex: ComplexType) {
    this.writer.start("ComplexType", {
      Name: complex.name,
      BaseType: complex.baseType?.name ?? null,
    });
    for (const property of complex.declaredProperties) {
      this.writeProperty(property);
    }
    this.writer.end();
  }
  private writeProperty(property: Property) {
    this.writer.startend("Property", {
      Name: property.name,
      Type: this.typeRef(property.type),
      Optional: property.type.isOptional,
    });
  }
  private typeRef(type: TypeReference) {
    if (type.isCollection) {
      return `Collection(${type.type.name})`;
    } else {
      return type.type.name;
    }
  }
}
