import { Parser } from "xml2js";
import { model } from "./model";
import { edm } from "./interfaces";

export function readCsdl(xml: string, cb: (schema: edm.IEdmSchema) => void) {
  var parser = new Parser();

  parser.parseString(xml, (err: any, result: any) => {
    var schema: edm.IEdmSchema = makeSchema(result.Schema);
    cb(schema);
  });
}

export function makeSchema(xml: any): edm.IEdmSchema {
  var attr = xml.$;
  const schema = new model.EdmSchema(attr.Namespace, attr.Alias);
  const queue: [model.EdmSchemaElement, any][] = [];

  for (const entity of xml.Entity ?? []) {
    const item = makeEntity(schema, entity);
    schema.elements.push(item);
    queue.push([item, entity]);
  }
  for (const entity of xml.Complex ?? []) {
    const item = makeComplex(schema, entity);
    schema.elements.push(item);
    queue.push([item, entity]);
  }
  for (const enumType of xml.Enum ?? []) {
    const item = makeEnum(schema, enumType);
    schema.elements.push(item);
    queue.push([item, enumType]);
  }

  for (const [item, xml] of queue) {
    buildElement(schema, item, xml);
  }
  return schema;
}

function makeEntity(schema: edm.IEdmSchema, xml: any): model.EdmEntityType {
  var attr = xml.$;
  return new model.EdmEntityType(attr.Name, schema);
}

function makeComplex(schema: edm.IEdmSchema, xml: any): model.EdmComplexType {
  var attr = xml.$;
  return new model.EdmComplexType(attr.Name, schema);
}

function makeEnum(schema: edm.IEdmSchema, xml: any): model.EdmEnumType {
  var attr = xml.$;
  return new model.EdmEnumType(attr.Name, schema);
}

function buildElement(schema: edm.IEdmSchema, element: model.EdmSchemaElement, xml: any): void {
  switch (element.elementKind) {
    case "entity":
    case "complex":
      for (const prop of xml.Property) {
        element.properties.push(makeProperty(schema, prop));
      }
      break;
    case "enum":
      for (const member of xml.Member) {
        element.members.push(makeMember(schema, member));
      }
      break;
  }
}

function makeProperty(schema: edm.IEdmSchema, xml: any): model.EdmStructuralProperty {
  var attr = xml.$;
  var type = findType(schema, attr.Type);
  if (type === undefined) {
    throw new Error(`can't find type ${attr.Type}`);
  }
  return new model.EdmStructuralProperty(attr.Name, type);
}

function makeMember(schema: edm.IEdmSchema, xml: any): model.EdmEnumMember {
  var attr = xml.$;
  return new model.EdmEnumMember(attr.Name, attr.Value);
}

function findType(schema: edm.IEdmSchema, name: string): edm.IEdmType | undefined {
  // console.log(`searching: ${name}`);

  // builtin
  let builtIn = model.CoreModel.findType(name);
  if (builtIn !== undefined) {
    return builtIn;
  }

  // collection
  const elementTypeName = matchesCollection(name);
  if (elementTypeName) {
    const elementType = findType(schema, elementTypeName);
    if (elementType !== undefined) {
      return new model.EdmCollectionType(elementType);
    }
    return undefined;
  }

  // search in schema
  for (const element of schema.elements) {
    switch (element.elementKind) {
      case "entity":
      case "complex":
        if (schema.namespace + "." + element.name === name) {
          return element;
        }
        if (schema.alias + "." + element.name === name) {
          return element;
        }
    }
  }
}

function matchesCollection(typeName: string): string | undefined {
  const regex = /^\s*Collection\s*\(\s*(?<element>[a-z][a-z0-9_\.]*)\s*\)\s*$/i;
  const match = typeName.match(regex);
  //   console.log(`match: ${match}`);
  if (match !== null && match.groups !== undefined) {
    let grp = { ...match.groups };
    // console.log(`match: ${grp}`);
    return grp["element"];
  }
  return undefined;
}
