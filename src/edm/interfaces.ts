export namespace edm {
  export type IEdmType = IEdmPrimitiveType | IEdmEntityType | IEdmComplexType | IEdmCollectionType | IEdmEnumType;

  export type EdmTypeKind = "entity" | "complex" | "primitive" | "collection" | "enum";

  export type IEdmSchemaElement = IEdmEntityType | IEdmComplexType | IEdmEnumType;

  export type EdmElementKind = "entity" | "complex" | "enum";

  export type IEdmPrimitiveType = {
    readonly typeKind: "primitive";
    readonly name: string;
  };

  export type IEdmCollectionType = {
    readonly typeKind: "collection";
    readonly elementType: IEdmType;
  };

  export type IEdmStructuralProperty = {
    readonly name: string;
    readonly type: IEdmType;
  };

  export type IEdmEntityType = {
    readonly typeKind: "entity";
    readonly elementKind: "entity";
    readonly schema: IEdmSchema;
    readonly name: string;
    readonly properties: readonly IEdmStructuralProperty[];
  };

  export type IEdmComplexType = {
    readonly typeKind: "complex";
    readonly elementKind: "complex";
    readonly schema: IEdmSchema;
    readonly name: string;
    readonly properties: readonly IEdmStructuralProperty[];
  };

  export type IEdmEnumType = {
    readonly typeKind: "enum";
    readonly elementKind: "enum";
    readonly schema: IEdmSchema;
    readonly name: string;
    readonly members: readonly IEdmEnumMember[];
  };

  export type IEdmEnumMember = {
    readonly name: string;
    readonly value: number | string | undefined;
  };

  export type IEdmSchema = {
    readonly alias: string;
    readonly namespace: string;
    readonly elements: readonly IEdmSchemaElement[];
  };
}
