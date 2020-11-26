import { DateTime, Duration } from "luxon";

export namespace constant {


    type IEdmTypeReference = {}
    type IEdmEnumMemberValue = {}

    /**
     * 12 primitive type values  https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_ConstantExpression
       plus null, collection and record     
     */
    export type IEdmValue =
        IEdmBinaryValue | IEdmBooleanValue | IEdmDateValue | IEdmDateTimeOffsetValue | IEdmDecimalValue | IEdmDurationValue |
        IEdmEnumValue | IEdmFloatingValue | IEdmGuidValue | IEdmIntegerValue | IEdmStringValue | IEdmTimeOfDayValue |
        IEdmNullValue | IEdmRecordValue | IEdmCollectionValue;

    export enum EdmValueKind {
        Binary,
        Boolean,
        Date,
        DateTimeOffset,
        Decimal,
        Duration,
        EnumMember,
        Floating,
        Guid,
        Integer,
        String,
        TimeOfDay,
        Null,
        Collection,
        Record,
    }

    export function binaryValue(value: ArrayBuffer): IEdmBinaryValue { return { kind: EdmValueKind.Binary, type: {}, value: value }; }
    export function booleanValue(value: boolean): IEdmBooleanValue { return { kind: EdmValueKind.Boolean, type: {}, value: value }; }
    export function dateValue(value: DateTime): IEdmDateValue { return { kind: EdmValueKind.Date, type: {}, value: value }; }
    export function dateTimeOffsetValue(value: DateTime): IEdmDateTimeOffsetValue { return { kind: EdmValueKind.DateTimeOffset, type: {}, value: value }; }
    export function decimalValue(value: number): IEdmDecimalValue { return { kind: EdmValueKind.Decimal, type: {}, value: value }; }
    export function durationValue(value: Duration): IEdmDurationValue { return { kind: EdmValueKind.Duration, type: {}, value: value }; }
    // export function enumMemberValue(value: EnumMember) : IEdmEnumMemberValue { return { kind: EdmValueKind.EnumMember, type : {}, value: value} ; }
    export function floatingValue(value: number): IEdmFloatingValue { return { kind: EdmValueKind.Floating, type: {}, value: value }; }
    export function guidValue(value: string): IEdmGuidValue { return { kind: EdmValueKind.Guid, type: {}, value: value }; }
    export function integerValue(value: number): IEdmIntegerValue { return { kind: EdmValueKind.Integer, type: {}, value: value }; }
    export function stringValue(value: string): IEdmStringValue { return { kind: EdmValueKind.String, type: {}, value: value }; }
    export function timeOfDayValue(value: DateTime): IEdmTimeOfDayValue { return { kind: EdmValueKind.TimeOfDay, type: {}, value: value }; }

    export const nullValue: IEdmNullValue = { kind: EdmValueKind.Null, type: {} };
    export function collectionValue(value: readonly IEdmValue[]): IEdmCollectionValue { return { kind: EdmValueKind.Collection, type: {}, elements: value }; }
    export function recordValue(value: readonly IEdmRecordPropertyValue[]): IEdmRecordValue { return { kind: EdmValueKind.Record, type: {}, properties: value }; }


    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Binary
     */
    export type IEdmBinaryValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Binary;
        readonly value: ArrayBuffer
    }

    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Boolean
     */
    export type IEdmBooleanValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Boolean;
        readonly value: boolean;
    }

    export type IEdmDateTimeOffsetValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.DateTimeOffset;
        readonly value: DateTime;
    }

    export type IEdmDateValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Date;
        readonly value: DateTime;
    }

    export type IEdmDecimalValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Decimal;
        readonly value: number;
    }

    export type IEdmDurationValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Duration;
        readonly value: Duration;
    }

    export type IEdmEnumValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.EnumMember;
        readonly Value: IEdmEnumMemberValue;
    }

    export type IEdmFloatingValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Floating;
        readonly value: number;
    }

    export type IEdmGuidValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Guid;
        readonly value: string;
    }

    export type IEdmIntegerValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Integer;
        readonly value: number;
    }

    export type IEdmStringValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.String;
        readonly value: string;
    }

    export type IEdmTimeOfDayValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.TimeOfDay;
        readonly value: DateTime;
    }

    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Null
     */
    export type IEdmNullValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Null;
    }

    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Record
     */
    export type IEdmRecordValue = {
        readonly kind: EdmValueKind.Record;
        readonly type: IEdmTypeReference;
        readonly properties: readonly IEdmRecordPropertyValue[];
    }

    export type IEdmRecordPropertyValue = {
        readonly property: string;
        readonly value: IEdmValue;
    }

    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Collection
     */
    export type IEdmCollectionValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Collection;
        readonly elements: readonly IEdmValue[]
    }
}
