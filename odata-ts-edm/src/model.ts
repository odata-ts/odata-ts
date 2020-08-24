import { Url } from "url";

const addContainedElementSymbol = Symbol("addContainedElement");
const addAssociatedElementSymbol = Symbol("addAssociatedElementSymbol");

// https://tools.oasis-open.org/version-control/browse/wsvn/odata/trunk/spec/schemas/MetadataService.edmx

export class Model {
  constructor() { }

  readonly schemas: Schema[] = [];

  readonly references: ModelReference[] = [];

  [addContainedElementSymbol](schema: Schema) {
    this.schemas.push(schema);
  }
}

export class ModelReference {
  constructor(readonly uri: string, readonly includes: ModelInclude[]) { }
}

export class ModelInclude {
  constructor(readonly schema: string) { }
}


export interface ISchemaElementPattern<T> {
  StructuredType: (structured: StructuredType) => T;
  EnumType: (enumType: EnumType) => T;
}

export interface ISchemaElement {
  readonly name: string;
  matchElement<T>(pattern: ISchemaElementPattern<T>): T;
}

export class Schema {
  constructor(readonly model: Model, readonly name: string,
    readonly alias: string | null = null,
    readonly namespace: string | null = null
  ) {
    model[addContainedElementSymbol](this);
  }
  readonly elements: ISchemaElement[] = [];

  [addContainedElementSymbol](item: ISchemaElement) {
    this.elements.push(item);
  }
}

export abstract class StructuredType implements ISchemaElement {
  constructor(readonly name: string, readonly schema: Schema) {
    schema[addContainedElementSymbol](this);
  }

  matchElement<T>(pattern: ISchemaElementPattern<T>): T {
    return pattern.StructuredType(this);
  }

  private _properties: Property[] = [];

  get declaredProperties(): readonly Property[] {
    return this._properties;
  }

  abstract get properties(): readonly Property[];

  [addContainedElementSymbol](property: Property) {
    this._properties.push(property);
  }

  abstract match<T>(pattern: StructuredTypePattern<T>): T;
}

export interface StructuredTypePattern<T> {
  EntityType: (entity: EntityType) => T;
  ComplexType: (complex: ComplexType) => T;
}

export class EntityType extends StructuredType {
  constructor(
    readonly name: string,
    readonly schema: Schema,
    readonly baseType: EntityType | null = null
  ) {
    super(name, schema);
    if (baseType) {
      this._derivedTypes.push(this);
    }
  }

  private _derivedTypes: EntityType[] = [];

  match<T>(pattern: StructuredTypePattern<T>): T {
    return pattern.EntityType(this);
  }

  get properties(): readonly Property[] {
    if (this.baseType) {
      return [...this.declaredProperties, ...this.baseType.properties];
    } else {
      return this.declaredProperties;
    }
  }
}

export class ComplexType extends StructuredType {
  constructor(
    readonly name: string,
    readonly schema: Schema,
    readonly baseType: ComplexType | null = null
  ) {
    super(name, schema);
    if (baseType) {
      this._derivedTypes.push(this);
    }
  }

  private _derivedTypes: ComplexType[] = [];

  get properties(): readonly Property[] {
    if (this.baseType) {
      return [...this.declaredProperties, ...this.baseType.properties];
    } else {
      return this.declaredProperties;
    }
  }

  match<T>(pattern: StructuredTypePattern<T>): T {
    return pattern.ComplexType(this);
  }
}

export interface TypeReference {
  type: StructuredType;
  isOptional?: boolean;
  isCollection?: boolean;
}

export class Property {
  constructor(
    readonly name: string,
    readonly declaringType: StructuredType,
    readonly type: TypeReference
  ) {
    this.declaringType[addContainedElementSymbol](this);
  }
}

export type EnumUnderlyingType = "Edm.Byte" | "Edm.SByte" | "Edm.Int16" | "Edm.Int32" | "Edm.Int64" | null

export class EnumType implements ISchemaElement {
  constructor(
    readonly name: string,
    readonly schema: Schema,
    readonly members: EnumMember[],
    readonly underlyingType: EnumUnderlyingType = null
  ) {
    schema[addContainedElementSymbol](this);
  }

  matchElement<T>(pattern: ISchemaElementPattern<T>): T {
    return pattern.EnumType(this);
  }
}

export interface EnumMember {
  readonly name: string;
  readonly value?: number | null;
}

