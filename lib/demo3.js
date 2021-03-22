#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var fs_1 = require("fs");
var edm_1 = require("./edm");
var xml = fs_1.readFileSync("./src/sample.csdl.xml", "utf-8");
edm_1.readCsdl(xml, function (schema) {
    edm_1.writeCsdl(schema, process_1.default.stdout);
    console.log("");
    for (var _i = 0, _a = schema.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        console.log(element.elementKind, element.name);
    }
});
