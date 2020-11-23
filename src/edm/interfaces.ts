export namespace edm {
  export enum EdmTypeKind {
    Entity,
    Complex,
    Primitive,
    Collection,
    Enum,
  }

  export type IEdmType = IEdmPrimitiveType | IEdmEntityType | IEdmComplexType | IEdmCollectionType | IEdmEnumType;

  export enum EdmElementKind {
    Entity,
    Complex,
    Enum,
  }

  export type IEdmSchemaElement = IEdmEntityType | IEdmComplexType | IEdmEnumType;

  export type IEdmPrimitiveType = {
    readonly typeKind: EdmTypeKind.Primitive;
    readonly name: string;
  };

  export type IEdmCollectionType = {
    readonly typeKind: EdmTypeKind.Collection;
    readonly elementType: IEdmType;
  };

  export type IEdmStructuralProperty = {
    readonly name: string;
    readonly type: IEdmType;
  };

  export type IEdmEntityType = {
    readonly typeKind: EdmTypeKind.Entity;
    readonly elementKind: EdmElementKind.Entity;
    readonly schema: IEdmSchema;
    readonly name: string;
    readonly properties: readonly IEdmStructuralProperty[];
  };

  export type IEdmComplexType = {
    readonly typeKind: EdmTypeKind.Complex;
    readonly elementKind: EdmElementKind.Complex;
    readonly schema: IEdmSchema;
    readonly name: string;
    readonly properties: readonly IEdmStructuralProperty[];
  };

  export type IEdmEnumType = {
    readonly typeKind: EdmTypeKind.Enum;
    readonly elementKind: EdmElementKind.Enum;
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
