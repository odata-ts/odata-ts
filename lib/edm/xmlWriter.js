"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlWriter = void 0;
var XmlWriter = /** @class */ (function () {
    function XmlWriter(stream, options) {
        this.stack = [];
        this.stream = stream;
        this.lf = options == undefined || options.indented ? "\n" : "";
        this.indent = options == undefined || options.indented ? "  " : "";
    }
    XmlWriter.prototype.writePreamble = function () {
        if (this.stack.length != 0) {
            throw new Error("preamble must be first element written");
        }
        this.stream.write("<?xml version=\"1.0\"?>" + this.lf); // encoding="UTF-8" standalone="yes"
    };
    XmlWriter.prototype.writeOpen = function (name, attributes) {
        var attr = attributes ? this.formatAttributes(attributes) : undefined;
        this.writeIndented("<" + name + (attr ? " " + attr : "") + ">");
        this.stack.push(name);
    };
    XmlWriter.prototype.writeElement = function (name, attributes) {
        var attr = attributes ? this.formatAttributes(attributes) : undefined;
        this.writeIndented("<" + name + (attr ? " " + attr : "") + "/>");
    };
    XmlWriter.prototype.writeText = function (name, value) {
        this.writeIndented("<" + name + ">" + value + "</" + name + ">");
    };
    XmlWriter.prototype.writeClose = function (name) {
        var top = this.stack.pop();
        if (top !== name) {
            throw new Error("unbalanced XML tags acutal " + name + " expected " + top);
        }
        this.writeIndented("</" + name + ">");
    };
    XmlWriter.prototype.writeNode = function (node) {
        var _a;
        this.writeOpen(node.name, node.attributes);
        for (var _i = 0, _b = (_a = node.elements) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
            var item = _b[_i];
            this.writeNode(item);
        }
        this.writeClose(node.name);
    };
    // ---------------
    XmlWriter.prototype.writeIndented = function (text) {
        var indentation = this.indent.repeat(this.stack.length);
        this.stream.write("" + indentation + text + this.lf);
    };
    XmlWriter.prototype.formatAttributes = function (attributes) {
        var _this = this;
        return Object.keys(attributes)
            .filter(function (key) { return attributes[key] !== undefined; })
            .map(function (key) {
            var val = attributes[key];
            return val === undefined ? undefined : key + "=\"" + _this.formatValue(val) + "\"";
        })
            .join(" ");
    };
    XmlWriter.prototype.formatValue = function (value) {
        if (typeof value == "boolean")
            return value ? "True" : "False";
        if (typeof value == "number")
            return value.toString();
        return value;
    };
    return XmlWriter;
}());
exports.XmlWriter = XmlWriter;
