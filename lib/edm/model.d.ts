import { edm } from "./interfaces";
export declare namespace model {
    class EdmPrimitiveType implements edm.IEdmPrimitiveType {
        readonly name: string;
        constructor(name: string);
        typeKind: "primitive";
    }
    class EdmCollectionType implements edm.IEdmCollectionType {
        readonly elementType: edm.IEdmType;
        constructor(elementType: edm.IEdmType);
        typeKind: "collection";
    }
    class EdmEntityType implements edm.IEdmEntityType {
        readonly name: string;
        readonly schema: edm.IEdmSchema;
        constructor(name: string, schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmEntityType, "name" | "schema">>);
        elementKind: "entity";
        typeKind: "entity";
        properties: edm.IEdmStructuralProperty[];
    }
    class EdmComplexType implements edm.IEdmComplexType {
        readonly name: string;
        readonly schema: edm.IEdmSchema;
        constructor(name: string, schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmComplexType, "name" | "schema">>);
        elementKind: "complex";
        typeKind: "complex";
        properties: edm.IEdmStructuralProperty[];
    }
    class EdmStructuralProperty implements edm.IEdmStructuralProperty {
        readonly name: string;
        readonly type: edm.IEdmType;
        constructor(name: string, type: edm.IEdmType);
    }
    class EdmEnumType implements edm.IEdmEnumType {
        readonly name: string;
        readonly schema: edm.IEdmSchema;
        constructor(name: string, schema: edm.IEdmSchema, params?: Partial<Exclude<edm.IEdmEnumType, "name" | "schema">>);
        elementKind: "enum";
        typeKind: "enum";
        members: edm.IEdmEnumMember[];
    }
    class EdmEnumMember implements edm.IEdmEnumMember {
        readonly name: string;
        readonly value: string | number | undefined;
        constructor(name: string, value: string | number | undefined);
    }
    type EdmSchemaElement = EdmEntityType | EdmComplexType | EdmEnumType;
    class EdmSchema implements edm.IEdmSchema {
        readonly namespace: string;
        readonly alias: string;
        constructor(namespace: string, alias: string, params?: Partial<Exclude<edm.IEdmSchema, "namespace" | "alias">>);
        elements: edm.IEdmSchemaElement[];
    }
    namespace CoreModel {
        namespace PrimitiveTypes {
            const Integer: EdmPrimitiveType;
            const String: EdmPrimitiveType;
            const Double: EdmPrimitiveType;
        }
        function findType(name: string): edm.IEdmType | undefined;
    }
}
