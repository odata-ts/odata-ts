export declare namespace edm {
    type IEdmSchemaElement = IEdmEntityType | IEdmComplexType | IEdmEnumType;
    type EdmElementKind = "entity" | "complex" | "enum";
    type IEdmEntityType = {
        readonly typeKind: "entity";
        readonly elementKind: "entity";
        readonly schema: IEdmSchema;
        readonly name: string;
        readonly properties: readonly IEdmStructuralProperty[];
    };
    type IEdmComplexType = {
        readonly typeKind: "complex";
        readonly elementKind: "complex";
        readonly schema: IEdmSchema;
        readonly name: string;
        readonly properties: readonly IEdmStructuralProperty[];
    };
    type IEdmStructuralProperty = {
        readonly name: string;
        readonly type: IEdmType;
    };
    type IEdmEnumType = {
        readonly typeKind: "enum";
        readonly elementKind: "enum";
        readonly schema: IEdmSchema;
        readonly name: string;
        readonly members: readonly IEdmEnumMember[];
    };
    type IEdmEnumMember = {
        readonly name: string;
        readonly value: number | string | undefined;
    };
    type IEdmType = IEdmPrimitiveType | IEdmEntityType | IEdmComplexType | IEdmCollectionType | IEdmEnumType;
    type EdmTypeKind = "entity" | "complex" | "primitive" | "collection" | "enum";
    type IEdmPrimitiveType = {
        readonly typeKind: "primitive";
        readonly name: string;
    };
    type IEdmCollectionType = {
        readonly typeKind: "collection";
        readonly elementType: IEdmType;
    };
    type IEdmSchema = {
        readonly alias: string;
        readonly namespace: string;
        readonly elements: readonly IEdmSchemaElement[];
    };
}
