#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var edm_1 = require("./edm");
var luxon_1 = require("luxon");
var x = edm_1.constant.booleanValue(true);
var y = edm_1.constant.integerValue(5);
var z = edm_1.constant.dateValue(luxon_1.DateTime.utc());
var u = edm_1.constant.recordValue([
    { property: "A", value: x },
    { property: "B", value: y },
]);
var c = edm_1.constant.collectionValue([x, y, z, u]);
edm_1.writeValue(c, process_1.default.stdout);
