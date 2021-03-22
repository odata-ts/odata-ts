"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.edmx = exports.CsdlWriter = exports.writeValue = exports.writeCsdl = exports.edmNS = exports.edmxNS = void 0;
var _1 = require(".");
exports.edmxNS = "http://docs.oasis-open.org/odata/ns/edmx";
exports.edmNS = "http://docs.oasis-open.org/odata/ns/edm";
function writeCsdl(schema, stream) {
    var xml = new _1.XmlWriter(stream);
    var csdl = new CsdlWriter(xml);
    csdl.writeSchema(schema);
}
exports.writeCsdl = writeCsdl;
function writeValue(value, stream) {
    var xml = new _1.XmlWriter(stream);
    var csdl = new CsdlWriter(xml);
    csdl.writeValue(value);
}
exports.writeValue = writeValue;
var CsdlWriter = /** @class */ (function () {
    function CsdlWriter(writer) {
        this.writer = writer;
    }
    CsdlWriter.prototype.writeSchema = function (schema) {
        this.writer.writePreamble();
        this.writer.writeOpen("Schema", {
            Namespace: schema.namespace,
            Alias: schema.alias,
            xmlns: exports.edmNS,
        });
        for (var _i = 0, _a = schema.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            this.writeSchemaElement(element);
        }
        this.writer.writeClose("Schema");
    };
    CsdlWriter.prototype.writeSchemaElement = function (element) {
        switch (element.elementKind) {
            case "entity":
                var entity = element;
                this.writer.writeOpen("Entity", { Name: entity.name });
                for (var _i = 0, _a = entity.properties; _i < _a.length; _i++) {
                    var prop = _a[_i];
                    this.writer.writeElement("Property", {
                        Name: prop.name,
                        Type: makeTypeName(prop.type),
                    });
                }
                this.writer.writeClose("Entity");
                break;
            case "complex":
                var complex = element;
                this.writer.writeOpen("Complex", { Name: complex.name });
                for (var _b = 0, _c = complex.properties; _b < _c.length; _b++) {
                    var prop = _c[_b];
                    this.writer.writeElement("Property", {
                        Name: prop.name,
                        Type: makeTypeName(prop.type),
                    });
                }
                this.writer.writeClose("Complex");
                break;
            case "enum":
                var enumeration = element;
                this.writer.writeOpen("Enum", { Name: enumeration.name });
                for (var _d = 0, _e = enumeration.members; _d < _e.length; _d++) {
                    var member = _e[_d];
                    this.writer.writeElement("Member", {
                        Name: member.name,
                        Value: member.value,
                    });
                }
                this.writer.writeClose("Enum");
                break;
            default:
                return assertNever(element);
        }
    };
    CsdlWriter.prototype.writeValue = function (value) {
        switch (value.kind) {
            case _1.constant.EdmValueKind.Binary:
                this.writer.writeText("Binary", arrayBufferToBase64(value.value));
                break;
            case _1.constant.EdmValueKind.Boolean:
                this.writer.writeText("Boolean", value.value ? "true" : "false");
                break;
            case _1.constant.EdmValueKind.Date:
                this.writer.writeText("Date", value.value.toISODate());
                break;
            case _1.constant.EdmValueKind.DateTimeOffset:
                this.writer.writeText("DateTimeOffset", value.value.toISO());
                break;
            case _1.constant.EdmValueKind.Decimal:
                this.writer.writeText("Decimal", value.value.toString());
                break;
            case _1.constant.EdmValueKind.Duration:
                this.writer.writeText("DateTimeOffset", value.value.toISO());
                break;
            // case constant.EdmValueKind.EnumMember:
            //   this.writer.writeText("EnumMember", value.value);
            //   break;
            case _1.constant.EdmValueKind.Floating:
                this.writer.writeText("Floating", value.value.toString());
                break;
            case _1.constant.EdmValueKind.Guid:
                this.writer.writeText("Guid", value.value);
                break;
            case _1.constant.EdmValueKind.Integer:
                this.writer.writeText("Integer", value.value.toString());
                break;
            case _1.constant.EdmValueKind.String:
                this.writer.writeText("String", value.value);
                break;
            case _1.constant.EdmValueKind.TimeOfDay:
                this.writer.writeText("TimeOfDay", value.value.toISOTime());
                break;
            case _1.constant.EdmValueKind.Null:
                this.writer.writeElement("Null");
                break;
            case _1.constant.EdmValueKind.Collection:
                this.writer.writeOpen("Collection");
                for (var _i = 0, _a = value.elements; _i < _a.length; _i++) {
                    var element = _a[_i];
                    this.writeValue(element);
                }
                this.writer.writeClose("Collection");
                break;
            case _1.constant.EdmValueKind.Record:
                this.writer.writeOpen("Record");
                for (var _b = 0, _c = value.properties; _b < _c.length; _b++) {
                    var element = _c[_b];
                    // TODO: check if the property value can be written in attribute notation
                    this.writer.writeOpen("PropertyValue", { Property: element.property });
                    this.writeValue(element.value);
                    this.writer.writeClose("PropertyValue");
                }
                this.writer.writeClose("Record");
                break;
        }
    };
    return CsdlWriter;
}());
exports.CsdlWriter = CsdlWriter;
function makeTypeName(type) {
    switch (type.typeKind) {
        case "entity":
        case "complex":
        case "enum":
            var ns = type.schema.alias;
            return ns + "." + type.name;
        case "collection":
            return "Collection(" + makeTypeName(type.elementType) + ")";
        case "primitive":
            return "Edm" + "." + type.name;
        default:
            return assertNever(type);
    }
}
function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
function edmx() {
    var xml = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        xml[_i] = arguments[_i];
    }
    return {
        name: "edmx:Edmx",
        attributes: {
            "xmlns:edmx": exports.edmxNS,
            Version: "4.01",
        },
        elements: [
            {
                name: "edmx:DataServices",
                elements: xml ? __spreadArrays(xml) : undefined,
            },
        ],
    };
}
exports.edmx = edmx;
function schema() {
    var xml = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        xml[_i] = arguments[_i];
    }
    return {
        name: "Schema",
        attributes: { xmlns: exports.edmNS, Namespace: "org.example", Alias: undefined },
        elements: xml ? __spreadArrays(xml) : undefined,
    };
}
exports.schema = schema;
function arrayBufferToBase64(arrayBuffer) {
    var base64 = "";
    var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;
    var a, b, c, d;
    var chunk;
    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += encodings[a] + encodings[b] + "==";
    }
    else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
    }
    return base64;
}
