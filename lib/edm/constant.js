"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constant = void 0;
var constant;
(function (constant) {
    var EdmValueKind;
    (function (EdmValueKind) {
        EdmValueKind[EdmValueKind["Binary"] = 0] = "Binary";
        EdmValueKind[EdmValueKind["Boolean"] = 1] = "Boolean";
        EdmValueKind[EdmValueKind["Date"] = 2] = "Date";
        EdmValueKind[EdmValueKind["DateTimeOffset"] = 3] = "DateTimeOffset";
        EdmValueKind[EdmValueKind["Decimal"] = 4] = "Decimal";
        EdmValueKind[EdmValueKind["Duration"] = 5] = "Duration";
        EdmValueKind[EdmValueKind["EnumMember"] = 6] = "EnumMember";
        EdmValueKind[EdmValueKind["Floating"] = 7] = "Floating";
        EdmValueKind[EdmValueKind["Guid"] = 8] = "Guid";
        EdmValueKind[EdmValueKind["Integer"] = 9] = "Integer";
        EdmValueKind[EdmValueKind["String"] = 10] = "String";
        EdmValueKind[EdmValueKind["TimeOfDay"] = 11] = "TimeOfDay";
        EdmValueKind[EdmValueKind["Null"] = 12] = "Null";
        EdmValueKind[EdmValueKind["Collection"] = 13] = "Collection";
        EdmValueKind[EdmValueKind["Record"] = 14] = "Record";
    })(EdmValueKind = constant.EdmValueKind || (constant.EdmValueKind = {}));
    function binaryValue(value) { return { kind: EdmValueKind.Binary, type: {}, value: value }; }
    constant.binaryValue = binaryValue;
    function booleanValue(value) { return { kind: EdmValueKind.Boolean, type: {}, value: value }; }
    constant.booleanValue = booleanValue;
    function dateValue(value) { return { kind: EdmValueKind.Date, type: {}, value: value }; }
    constant.dateValue = dateValue;
    function dateTimeOffsetValue(value) { return { kind: EdmValueKind.DateTimeOffset, type: {}, value: value }; }
    constant.dateTimeOffsetValue = dateTimeOffsetValue;
    function decimalValue(value) { return { kind: EdmValueKind.Decimal, type: {}, value: value }; }
    constant.decimalValue = decimalValue;
    function durationValue(value) { return { kind: EdmValueKind.Duration, type: {}, value: value }; }
    constant.durationValue = durationValue;
    // export function enumMemberValue(value: EnumMember) : IEdmEnumMemberValue { return { kind: EdmValueKind.EnumMember, type : {}, value: value} ; }
    function floatingValue(value) { return { kind: EdmValueKind.Floating, type: {}, value: value }; }
    constant.floatingValue = floatingValue;
    function guidValue(value) { return { kind: EdmValueKind.Guid, type: {}, value: value }; }
    constant.guidValue = guidValue;
    function integerValue(value) { return { kind: EdmValueKind.Integer, type: {}, value: value }; }
    constant.integerValue = integerValue;
    function stringValue(value) { return { kind: EdmValueKind.String, type: {}, value: value }; }
    constant.stringValue = stringValue;
    function timeOfDayValue(value) { return { kind: EdmValueKind.TimeOfDay, type: {}, value: value }; }
    constant.timeOfDayValue = timeOfDayValue;
    constant.nullValue = { kind: EdmValueKind.Null, type: {} };
    function collectionValue(value) { return { kind: EdmValueKind.Collection, type: {}, elements: value }; }
    constant.collectionValue = collectionValue;
    function recordValue(value) { return { kind: EdmValueKind.Record, type: {}, properties: value }; }
    constant.recordValue = recordValue;
})(constant = exports.constant || (exports.constant = {}));
