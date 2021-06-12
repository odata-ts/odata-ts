"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSchema = exports.readCsdl = void 0;
var xml2js_1 = require("xml2js");
var model_1 = require("./model");
function readCsdl(xml, cb) {
    var parser = new xml2js_1.Parser();
    parser.parseString(xml, function (err, result) {
        var schema = makeSchema(result.Schema);
        cb(schema);
    });
}
exports.readCsdl = readCsdl;
function makeSchema(xml) {
    var _a, _b, _c;
    var attr = xml.$;
    var schema = new model_1.model.EdmSchema(attr.Namespace, attr.Alias);
    var queue = [];
    for (var _i = 0, _d = (_a = xml.Entity) !== null && _a !== void 0 ? _a : []; _i < _d.length; _i++) {
        var entity = _d[_i];
        var item = makeEntity(schema, entity);
        schema.elements.push(item);
        queue.push([item, entity]);
    }
    for (var _e = 0, _f = (_b = xml.Complex) !== null && _b !== void 0 ? _b : []; _e < _f.length; _e++) {
        var entity = _f[_e];
        var item = makeComplex(schema, entity);
        schema.elements.push(item);
        queue.push([item, entity]);
    }
    for (var _g = 0, _h = (_c = xml.Enum) !== null && _c !== void 0 ? _c : []; _g < _h.length; _g++) {
        var enumType = _h[_g];
        var item = makeEnum(schema, enumType);
        schema.elements.push(item);
        queue.push([item, enumType]);
    }
    for (var _j = 0, queue_1 = queue; _j < queue_1.length; _j++) {
        var _k = queue_1[_j], item = _k[0], xml_1 = _k[1];
        buildElement(schema, item, xml_1);
    }
    return schema;
}
exports.makeSchema = makeSchema;
function makeEntity(schema, xml) {
    var attr = xml.$;
    return new model_1.model.EdmEntityType(attr.Name, schema);
}
function makeComplex(schema, xml) {
    var attr = xml.$;
    return new model_1.model.EdmComplexType(attr.Name, schema);
}
function makeEnum(schema, xml) {
    var attr = xml.$;
    return new model_1.model.EdmEnumType(attr.Name, schema);
}
function buildElement(schema, element, xml) {
    switch (element.elementKind) {
        case "entity":
        case "complex":
            for (var _i = 0, _a = xml.Property; _i < _a.length; _i++) {
                var prop = _a[_i];
                element.properties.push(makeProperty(schema, prop));
            }
            break;
        case "enum":
            for (var _b = 0, _c = xml.Member; _b < _c.length; _b++) {
                var member = _c[_b];
                element.members.push(makeMember(schema, member));
            }
            break;
    }
}
function makeProperty(schema, xml) {
    var attr = xml.$;
    var type = findType(schema, attr.Type);
    if (type === undefined) {
        throw new Error("can't find type " + attr.Type);
    }
    return new model_1.model.EdmStructuralProperty(attr.Name, type);
}
function makeMember(schema, xml) {
    var attr = xml.$;
    return new model_1.model.EdmEnumMember(attr.Name, attr.Value);
}
function findType(schema, name) {
    // console.log(`searching: ${name}`);
    // builtin
    var builtIn = model_1.model.CoreModel.findType(name);
    if (builtIn !== undefined) {
        return builtIn;
    }
    // collection
    var elementTypeName = matchesCollection(name);
    if (elementTypeName) {
        var elementType = findType(schema, elementTypeName);
        if (elementType !== undefined) {
            return new model_1.model.EdmCollectionType(elementType);
        }
        return undefined;
    }
    // search in schema
    for (var _i = 0, _a = schema.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        switch (element.elementKind) {
            case "entity":
            case "complex":
                if (schema.namespace + "." + element.name === name) {
                    return element;
                }
                if (schema.alias + "." + element.name === name) {
                    return element;
                }
        }
    }
}
function matchesCollection(typeName) {
    var regex = /^\s*Collection\s*\(\s*(?<element>[a-z][a-z0-9_\.]*)\s*\)\s*$/i;
    var match = typeName.match(regex);
    //   console.log(`match: ${match}`);
    if (match !== null && match.groups !== undefined) {
        var grp = __assign({}, match.groups);
        // console.log(`match: ${grp}`);
        return grp["element"];
    }
    return undefined;
}
