import { edm } from "./interfaces";

export namespace model {
  export class EdmPrimitiveType implements edm.IEdmPrimitiveType {
    constructor(readonly name: string) {}
    typeKind: "primitive" = "primitive";
  }

  export class EdmCollectionType implements edm.IEdmCollectionType {
    constructor(readonly elementType: edm.IEdmType) {}
    typeKind: "collection" = "collection";
  }

  export class EdmEntityType implements edm.IEdmEntityType {
    constructor(readonly name: string, readonly schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmEntityType, "name" | "schema">>) {
      this.properties = params?.properties?.slice() ?? [];
    }
    elementKind: "entity" = "entity";
    typeKind: "entity" = "entity";
    properties: edm.IEdmStructuralProperty[];
  }

  export class EdmComplexType implements edm.IEdmComplexType {
    constructor(readonly name: string, readonly schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmComplexType, "name" | "schema">>) {
      this.properties = params?.properties?.slice() ?? [];
    }
    elementKind: "complex" = "complex";
    typeKind: "complex" = "complex";
    properties: edm.IEdmStructuralProperty[];
  }

  export class EdmStructuralProperty implements edm.IEdmStructuralProperty {
    constructor(readonly name: string, readonly type: edm.IEdmType) {}
  }

  export class EdmEnumType implements edm.IEdmEnumType {
    constructor(readonly name: string, readonly schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmEnumType, "name" | "schema">>) {
      this.members = params?.members?.slice() ?? [];
    }
    elementKind: "enum" = "enum";
    typeKind: "enum" = "enum";
    members: edm.IEdmEnumMember[];
  }

  export class EdmEnumMember implements edm.IEdmEnumMember {
    constructor(readonly name: string, readonly value: string | number | undefined) {}
  }

  export type EdmSchemaElement = EdmEntityType | EdmComplexType | EdmEnumType;

  export class EdmSchema implements edm.IEdmSchema {
    constructor(readonly namespace: string, readonly alias: string, params?: Partial<Exclude<edm.IEdmSchema, "namespace" | "alias">>) {
      this.elements = params?.elements?.slice() ?? [];
    }
    elements: edm.IEdmSchemaElement[];
  }

  export namespace CoreModel {
    export namespace PrimitiveTypes {
      export const Integer = new EdmPrimitiveType("Integer");
      export const String = new EdmPrimitiveType("String");
      export const Double = new EdmPrimitiveType("Double");
    }

    const primitives: { [key: string]: edm.IEdmPrimitiveType } = {
      "Edm.Integer": PrimitiveTypes.Integer,
      "Edm.String": PrimitiveTypes.String,
      "Edm.Double": PrimitiveTypes.Double,
    };

    export function findType(name: string): edm.IEdmType | undefined {
      return primitives[name];
    }
  }
}
