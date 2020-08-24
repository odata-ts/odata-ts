import { Model, Schema, EntityType, ComplexType, Property, ModelReference, ModelInclude, EnumType } from "./model";
import { CsdlSerializer } from "./csdlSerializer";
import { XmlWriter } from "./xmlwriter"


var serializer = new CsdlSerializer(new XmlWriter("schema.csdl.xsml"))
serializer.write(createSample());


function createSample(): Model {
  let m = new Model();

  // m.references.push(new ModelReference("a", [new ModelInclude("foo.bar")]));

  let s = new Schema(m, "rapid", "rapid");
  let a = new ComplexType("a", s);
  let p1 = new Property("p1", a, { type: a, isOptional: true });

  let b = new ComplexType("b", s, a);
  let p2 = new Property("p2", b, { type: a });
  let p3 = new Property("p3", b, { type: a });

  let c = new EntityType("c", s);
  let p4 = new Property("p4", c, { type: a });
  let p5 = new Property("p5", c, { type: a, isCollection: true });

  let d = new EnumType("d", s, [{ name: "red" }, { name: "red" }]);


  return m;
}
