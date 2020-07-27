const addPropertySymbol = Symbol("addProperty");
const addItemSymbol = Symbol("addItem");

export interface ISchemaElementPattern<T> {
  StructuredType: (structured: StructuredType) => T;
}

export interface ISchemaElement {
  readonly name: string;
  matchElement<T>(pattern: ISchemaElementPattern<T>): T;
}

export class Schema {
  constructor(readonly name: string) {}
  readonly elements: ISchemaElement[] = [];

  [addItemSymbol](item: ISchemaElement) {
    this.elements.push(item);
  }
}

export abstract class StructuredType implements ISchemaElement {
  constructor(readonly name: string, readonly schema: Schema) {
    schema[addItemSymbol](this);
  }

  matchElement<T>(pattern: ISchemaElementPattern<T>): T {
    return pattern.StructuredType(this);
  }

  private _properties: Property[] = [];

  get declaredProperties(): readonly Property[] {
    return this._properties;
  }

  abstract get properties(): readonly Property[];

  [addPropertySymbol](property: Property) {
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
    this.declaringType[addPropertySymbol](this);
  }
}

// function convertToXml(schema: Schema): JSDOM {
//   const [dom, document] = createRoot();

//   const schemaElement = document.createElementNS(edm, "Schema", {});
//   schemaElement.setAttribute("Name", schema.name);
//   document.documentElement.children[0].appendChild(schemaElement);

//   return dom;
// }

// function createRoot(): [JSDOM, Document] {
//   const dom = new JSDOM(
//     `<edmx:Edmx xmlns:edmx="${edmx}"><edmx:DataServices></edmx:DataServices></edmx:Edmx>`,
//     {
//       contentType: "text/xml",
//     }
//   );
//   const document = dom.window.document;

//   return [dom, document];
// }
