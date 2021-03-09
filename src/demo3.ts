#!/usr/bin/env node
import process from "process";
import { readFileSync } from "fs";
import { edm, writeCsdl, writeValue, readCsdl, constant, model } from "./edm";

const xml = readFileSync("./src/sample.csdl.xml", "utf-8");

readCsdl(xml, (schema: model.EdmSchema) => {
  writeCsdl(schema, process.stdout);

  console.log("");
  for (const element of schema.elements) {
    console.log(element.elementKind, element.name);
  }
});
