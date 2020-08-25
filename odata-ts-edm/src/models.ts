// https://issues.oasis-open.org/browse/ODATA-126
// https://tools.oasis-open.org/version-control/browse/wsvn/odata/trunk/spec/schemas/MetadataService.edmx

// -------------
// symbols for  events to wire up bi-directional references
const addElementToSchema = Symbol("addElementToSchema");
const addSchemaToModel = Symbol("addSchemaToModel");
const addReferenceToModel = Symbol("addReferenceToModel");
const addPropertyToType = Symbol("addPropertyToType");
const setSchemaOfContainer = Symbol("setSchemaOfContainer");
const addElementToContainer = Symbol("setContainerOfElement");

// -------------
// top level EDMX  model 

export class Model {
  constructor() { }

  readonly schemas: Schema[] = [];

  readonly references: ModelReference[] = [];

  [addSchemaToModel](schema: Schema) {
    this.schemas.push(schema);
  }

  [addReferenceToModel](reference: ModelReference) {
    this.references.push(reference);
  }
}

export class ModelReference {
  constructor(readonly uri: string, readonly includes: ModelInclude[]) { }
}

export class ModelInclude {
  constructor(readonly schema: string) { }
}

// ---------------------------
// schema

export class Schema {
  constructor(readonly model: Model, readonly namespace: string,
    readonly alias: string | null = null
  ) {
    model[addSchemaToModel](this);
  }
  readonly elements: ISchemaElement[] = [];

  private _container: EntityContainer = new EntityContainer(this, "default");

  public get container() { return this._container; }
  public set container(c: EntityContainer) { this._container = c; c[setSchemaOfContainer](this); }

  [addElementToSchema](item: ISchemaElement) {
    this.elements.push(item);
  }
}

export interface ISchemaElement {
  readonly name: string;
  matchElement<T>(pattern: ISchemaElementPattern<T>): T;
}

// Schema elements are a structured types (entity of complex), an enumType or functions (not yet implemented)
export interface ISchemaElementPattern<T> {
  StructuredType: (structured: StructuredType) => T;
  EnumType: (enumType: EnumType) => T;
}

export abstract class StructuredType implements ISchemaElement {
  constructor(readonly name: string, readonly schema: Schema) {
    schema[addElementToSchema](this);
  }

  matchElement<T>(pattern: ISchemaElementPattern<T>): T {
    return pattern.StructuredType(this);
  }

  private _properties: Property[] = [];

  get declaredProperties(): readonly Property[] {
    return this._properties;
  }

  abstract get properties(): readonly Property[];

  [addPropertyToType](property: Property) {
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
    this.declaringType[addPropertyToType](this);
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
    schema[addElementToSchema](this);
  }

  matchElement<T>(pattern: ISchemaElementPattern<T>): T {
    return pattern.EnumType(this);
  }
}

export interface EnumMember {
  readonly name: string;
  readonly value?: number | null;
}

// ---------------------------
// container


export interface IContainerElement {
  readonly fullName: string;
  matchElement<T>(pattern: IContainerElementPattern<T>): T;
}

export interface IContainerElementPattern<T> {
  Singleton(singleton: Singleton): T;
  EntitySet(entitySet: EntitySet): T;
}

export class EntityContainer {
  constructor(schema: Schema, readonly name: string) {
    this._schema = schema;
  }

  readonly elements: IContainerElement[] = [];

  private _schema: Schema;

  private get schema(): Schema { return this._schema; }

  public get qualifiedName(): string { return `${this.schema.namespace}.${this.name}`; }

  [setSchemaOfContainer](schema: Schema) {
    this._schema = schema;
  }

  [addElementToContainer](item: IContainerElement) {
    this.elements.push(item);
  }
}

export class EntitySet implements IContainerElement {
  constructor(readonly container: EntityContainer, readonly name: string, readonly entityType: EntityType) {
    container[addElementToContainer](this);
  }

  public get fullName(): string { return `${this.container.qualifiedName}.${this.name}`; }

  public matchElement<T>(pattern: IContainerElementPattern<T>): T {
    return pattern.EntitySet(this);
  }

  // TODO: <NavigationProperty Name="NavigationPropertyBindings" Type="Collection(Meta.NavigationPropertyBinding)" Partner="Source"/>
}

export class Singleton implements IContainerElement {
  constructor(readonly container: EntityContainer, readonly name: string, readonly entityType: EntityType) {
    container[addElementToContainer](this);
  }

  public get fullName(): string { return `${this.container.qualifiedName}.${this.name}`; }

  public matchElement<T>(pattern: IContainerElementPattern<T>): T {
    return pattern.Singleton(this);
  }
}
