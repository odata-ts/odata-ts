import {
  Model,
  Schema,
  ISchemaElement,
  StructuredType,
  ComplexType,
  EntityType,
  Property,
  TypeReference,
  EnumType,
  EntityContainer
} from "./models";
import { XmlWriter } from "./xmlwriter"

const edmxNs = "http://docs.oasis-open.org/odata/ns/edmx";
const edmNs = "http://docs.oasis-open.org/odata/ns/edm";


// http://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html


export class CsdlSerializer {

  constructor(readonly writer: XmlWriter) { }


  public write(model: Model) {
    this.writeModel(model);
  }

  private writeModel(model: Model) {
    // TODO get namespace and alias
    this.writer.start("edmx:Edmx", { "xmlns:edmx": edmxNs, Version: "4.01" });

    for (const reference of model.references) {
      this.writer.start("edmx:Reference", { Uri: reference.uri });
      for (const include of reference.includes) {
        this.writer.empty("edmx:Include", { Namespace: include.schema });
      }
      this.writer.end();
    }

    this.writer.start("edmx:DataServices");
    for (const schema of model.schemas) {
      this.writeSchema(schema);
    }
    this.writer.end();

    this.writer.end();
  }

  private writeSchema(schema: Schema) {
    // TODO get namespace and alias
    this.writer.start("Schema", { "xmlns": edmNs, Alias: schema.alias, Namespace: schema.namespace });

    for (const element of schema.elements) {
      this.writeSchemaElement(element)
    }

    this.writeSchemaContainer(schema.container);

    this.writer.end();
  }

  private writeSchemaContainer(container: EntityContainer) {
    this.writer.start("EntityContainer", { Name: container.name });
    this.writer.end();
  }

  // dispatch on various types of schema elements
  private writeSchemaElement(element: ISchemaElement) {
    element.matchElement({
      StructuredType: (structured) => this.writeStructuredType(structured),
      EnumType: (enumType) => this.writeEnumType(enumType),
    });
  }

  writeEnumType(enumType: EnumType): any {

    this.writer.start("EnumType", { Name: enumType.name, UnderlyingType: enumType.underlyingType }) //TODO: IsFlags="true">

    for (const member of enumType.members) {
      this.writer.empty("Member", { Name: member.name, Value: member.value });
    }

    this.writer.end();
  }

  // dispatch on the two structured types
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
    this.writer.empty("Property", {
      Name: property.name,
      Type: this.getTypeRef(property.type),
      Optional: property.type.isOptional,
    });
  }

  private getTypeRef(ref: TypeReference) {
    if (ref.isCollection) {
      return `Collection(${ref.type.name})`;
    } else {
      return ref.type.name;
    }
  }
}
