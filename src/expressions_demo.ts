#!/usr/bin/env node
import process from "process";
import { readFileSync } from "fs";
import { edm, writeCsdl, writeValue, readCsdl, constant } from "./edm";
import { DateTime } from "luxon";

const x: constant.IEdmBooleanValue = constant.booleanValue(true);
const y = constant.integerValue(5);
const z = constant.dateValue(DateTime.utc());
const u = constant.recordValue([
  { property: "A", value: x },
  { property: "B", value: y },
]);

const c = constant.collectionValue([x, y, z, u]);

writeValue(c, process.stdout);

// const xml = readFileSync('./src/sample.csdl.xml', 'utf-8');

// readCsdl(xml, (schema: edm.IEdmSchema) => {
//   writeCsdl(schema, process.stdout);

//   // for (const element of schema.elements) {
//   //   console.log(element.elementKind);
//   // }
// });
