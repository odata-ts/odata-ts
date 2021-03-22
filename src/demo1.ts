import { CsdlWriter, XmlWriter, model } from ".";

let ns = "example.com";

let schema = new model.EdmSchema(ns, "self");

let node = new model.EdmEntityType("node", schema, {
  properties: [new model.EdmStructuralProperty("label", model.CoreModel.PrimitiveTypes.String)],
});

let coord = new model.EdmComplexType("coord", schema, {
  properties: [
    new model.EdmStructuralProperty("lat", model.CoreModel.PrimitiveTypes.Integer),
    new model.EdmStructuralProperty("lng", model.CoreModel.PrimitiveTypes.Integer),
  ],
});

schema.elements.push(node);
schema.elements.push(coord);

node.properties.push(
  new model.EdmStructuralProperty("weight", model.CoreModel.PrimitiveTypes.Integer),
  new model.EdmStructuralProperty("children", new model.EdmCollectionType(node)),
  new model.EdmStructuralProperty("location", coord)
);

let w = new CsdlWriter(new XmlWriter(process.stdout));

w.writeSchema(schema);
