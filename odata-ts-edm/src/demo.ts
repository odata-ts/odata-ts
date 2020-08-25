import { Model, Schema, EntityType, ComplexType, Property } from "./models";
import { CsdlSerializer } from "./csdlSerializer";
import { XmlWriter } from "./xmlwriter";
import fs from "fs";
import { parseString } from "xml2js";

readXml("schema.csdl.xml", function (err, model) {
  const schema = model["edmx:Edmx"]["edmx:DataServices"];

  console.log(schema);
});

// function parseModel(xml:any): Model
// {
//   if
// }

function readXml(
  path: string,
  callback: (err: NodeJS.ErrnoException | Error | null, data: any) => void,
) {
  fs.readFile(path, "utf-8", function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      parseString(data, function (err, result) {
        if (err) callback(err, null);
        // here we log the results of our xml string conversion
        callback(null, result);
      });
    }
  });
}
