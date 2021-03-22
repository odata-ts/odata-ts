"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
var model;
(function (model) {
    var EdmPrimitiveType = /** @class */ (function () {
        function EdmPrimitiveType(name) {
            this.name = name;
            this.typeKind = "primitive";
        }
        return EdmPrimitiveType;
    }());
    model.EdmPrimitiveType = EdmPrimitiveType;
    var EdmCollectionType = /** @class */ (function () {
        function EdmCollectionType(elementType) {
            this.elementType = elementType;
            this.typeKind = "collection";
        }
        return EdmCollectionType;
    }());
    model.EdmCollectionType = EdmCollectionType;
    var EdmEntityType = /** @class */ (function () {
        function EdmEntityType(name, schema, params) {
            var _a, _b;
            this.name = name;
            this.schema = schema;
            this.elementKind = "entity";
            this.typeKind = "entity";
            this.properties = (_b = (_a = params === null || params === void 0 ? void 0 : params.properties) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
        }
        return EdmEntityType;
    }());
    model.EdmEntityType = EdmEntityType;
    var EdmComplexType = /** @class */ (function () {
        function EdmComplexType(name, schema, params) {
            var _a, _b;
            this.name = name;
            this.schema = schema;
            this.elementKind = "complex";
            this.typeKind = "complex";
            this.properties = (_b = (_a = params === null || params === void 0 ? void 0 : params.properties) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
        }
        return EdmComplexType;
    }());
    model.EdmComplexType = EdmComplexType;
    var EdmStructuralProperty = /** @class */ (function () {
        function EdmStructuralProperty(name, type) {
            this.name = name;
            this.type = type;
        }
        return EdmStructuralProperty;
    }());
    model.EdmStructuralProperty = EdmStructuralProperty;
    var EdmEnumType = /** @class */ (function () {
        function EdmEnumType(name, schema, params) {
            var _a, _b;
            this.name = name;
            this.schema = schema;
            this.elementKind = "enum";
            this.typeKind = "enum";
            this.members = (_b = (_a = params === null || params === void 0 ? void 0 : params.members) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
        }
        return EdmEnumType;
    }());
    model.EdmEnumType = EdmEnumType;
    var EdmEnumMember = /** @class */ (function () {
        function EdmEnumMember(name, value) {
            this.name = name;
            this.value = value;
        }
        return EdmEnumMember;
    }());
    model.EdmEnumMember = EdmEnumMember;
    var EdmSchema = /** @class */ (function () {
        function EdmSchema(namespace, alias, params) {
            var _a, _b;
            this.namespace = namespace;
            this.alias = alias;
            this.elements = (_b = (_a = params === null || params === void 0 ? void 0 : params.elements) === null || _a === void 0 ? void 0 : _a.slice()) !== null && _b !== void 0 ? _b : [];
        }
        return EdmSchema;
    }());
    model.EdmSchema = EdmSchema;
    var CoreModel;
    (function (CoreModel) {
        var PrimitiveTypes;
        (function (PrimitiveTypes) {
            PrimitiveTypes.Integer = new EdmPrimitiveType("Integer");
            PrimitiveTypes.String = new EdmPrimitiveType("String");
            PrimitiveTypes.Double = new EdmPrimitiveType("Double");
        })(PrimitiveTypes = CoreModel.PrimitiveTypes || (CoreModel.PrimitiveTypes = {}));
        var primitives = {
            "Edm.Integer": PrimitiveTypes.Integer,
            "Edm.String": PrimitiveTypes.String,
            "Edm.Double": PrimitiveTypes.Double,
        };
        function findType(name) {
            return primitives[name];
        }
        CoreModel.findType = findType;
    })(CoreModel = model.CoreModel || (model.CoreModel = {}));
})(model = exports.model || (exports.model = {}));
