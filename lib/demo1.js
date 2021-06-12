"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var edm_1 = require("./edm");
var ns = "example.com";
var schema = new edm_1.model.EdmSchema(ns, "self");
var node = new edm_1.model.EdmEntityType("node", schema, {
    properties: [new edm_1.model.EdmStructuralProperty("label", edm_1.model.CoreModel.PrimitiveTypes.String)],
});
var coord = new edm_1.model.EdmComplexType("coord", schema, {
    properties: [
        new edm_1.model.EdmStructuralProperty("lat", edm_1.model.CoreModel.PrimitiveTypes.Integer),
        new edm_1.model.EdmStructuralProperty("lng", edm_1.model.CoreModel.PrimitiveTypes.Integer),
    ],
});
schema.elements.push(node);
schema.elements.push(coord);
node.properties.push(new edm_1.model.EdmStructuralProperty("weight", edm_1.model.CoreModel.PrimitiveTypes.Integer), new edm_1.model.EdmStructuralProperty("children", new edm_1.model.EdmCollectionType(node)), new edm_1.model.EdmStructuralProperty("location", coord));
var w = new edm_1.CsdlWriter(new edm_1.XmlWriter(process.stdout));
w.writeSchema(schema);
