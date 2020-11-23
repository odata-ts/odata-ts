#!/usr/bin/env node
import process from "process";
import { edm, writeCsdl, parseCsdl as readCsdl } from "./edm";

let xml = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Schema Namespace="org.example.dummy" Alias="self" xmlns="http://docs.oasis-open.org/odata/ns/edm">
  <Entity Name="node">
    <Property Name="label" Type="Edm.String"/>
    <Property Name="weight" Type="Edm.Integer"/>
    <Property Name="children" Type="Collection(self.node)"/>
    <Property Name="location" Type="self.coord"/>
  </Entity>
  <Complex Name="coord">
    <Property Name="lat" Type="Edm.Integer"/>
    <Property Name="lng" Type="Edm.Integer"/>
    <Property Name="z" Type="Edm.Double"/>
  </Complex>
  <Complex Name="fileLocation">
    <Property Name="line" Type="Edm.Integer"/>
    <Property Name="column" Type="Edm.Integer"/>
    <Property Name="x" Type="org.example.dummy.coord"/>
  </Complex>
  <Enum Name="color">
    <Member Name="red" Value="0"/>
    <Member Name="green" />
    <Member Name="blue" Value="2"/>
  </Enum>
</Schema>`;

readCsdl(xml, (schema: edm.IEdmSchema) => {
  writeCsdl(schema, process.stdout);

  // for (const element of schema.elements) {
  //   console.log(element.elementKind);
  // }
});
