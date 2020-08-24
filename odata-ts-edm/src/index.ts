import { EntityType, Schema, ComplexType, Property } from "./model";
import { CsdlSerializer } from "./csdlSerializer";
import { XmlWriter } from "./xmlwriter"


var serializer = new CsdlSerializer(new XmlWriter("schema.csdl.xsml"))
serializer.write(createSample());


function createSample(): Schema {
  let s = new Schema("rapid");
  let a = new ComplexType("a", s);
  let p1 = new Property("p1", a, { type: a, isOptional: true });

  let b = new ComplexType("b", s, a);
  let p2 = new Property("p2", b, { type: a });
  let p3 = new Property("p3", b, { type: a });

  let c = new EntityType("c", s);
  let p4 = new Property("p4", c, { type: a });
  let p5 = new Property("p5", c, { type: a, isCollection: true });

  return s;
}
