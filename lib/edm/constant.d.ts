import { DateTime, Duration } from "luxon";
export declare namespace constant {
    type IEdmTypeReference = {};
    type IEdmEnumMemberValue = {};
    /**
     * 12 primitive type values  https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_ConstantExpression
       plus null, collection and record
     */
    export type IEdmValue = IEdmBinaryValue | IEdmBooleanValue | IEdmDateValue | IEdmDateTimeOffsetValue | IEdmDecimalValue | IEdmDurationValue | IEdmEnumValue | IEdmFloatingValue | IEdmGuidValue | IEdmIntegerValue | IEdmStringValue | IEdmTimeOfDayValue | IEdmNullValue | IEdmRecordValue | IEdmCollectionValue;
    export enum EdmValueKind {
        Binary = 0,
        Boolean = 1,
        Date = 2,
        DateTimeOffset = 3,
        Decimal = 4,
        Duration = 5,
        EnumMember = 6,
        Floating = 7,
        Guid = 8,
        Integer = 9,
        String = 10,
        TimeOfDay = 11,
        Null = 12,
        Collection = 13,
        Record = 14
    }
    export function binaryValue(value: ArrayBuffer): IEdmBinaryValue;
    export function booleanValue(value: boolean): IEdmBooleanValue;
    export function dateValue(value: DateTime): IEdmDateValue;
    export function dateTimeOffsetValue(value: DateTime): IEdmDateTimeOffsetValue;
    export function decimalValue(value: number): IEdmDecimalValue;
    export function durationValue(value: Duration): IEdmDurationValue;
    export function floatingValue(value: number): IEdmFloatingValue;
    export function guidValue(value: string): IEdmGuidValue;
    export function integerValue(value: number): IEdmIntegerValue;
    export function stringValue(value: string): IEdmStringValue;
    export function timeOfDayValue(value: DateTime): IEdmTimeOfDayValue;
    export const nullValue: IEdmNullValue;
    export function collectionValue(value: readonly IEdmValue[]): IEdmCollectionValue;
    export function recordValue(value: readonly IEdmRecordPropertyValue[]): IEdmRecordValue;
    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Binary
     */
    export type IEdmBinaryValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Binary;
        readonly value: ArrayBuffer;
    };
    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Boolean
     */
    export type IEdmBooleanValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Boolean;
        readonly value: boolean;
    };
    export type IEdmDateTimeOffsetValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.DateTimeOffset;
        readonly value: DateTime;
    };
    export type IEdmDateValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Date;
        readonly value: DateTime;
    };
    export type IEdmDecimalValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Decimal;
        readonly value: number;
    };
    export type IEdmDurationValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Duration;
        readonly value: Duration;
    };
    export type IEdmEnumValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.EnumMember;
        readonly Value: IEdmEnumMemberValue;
    };
    export type IEdmFloatingValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Floating;
        readonly value: number;
    };
    export type IEdmGuidValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Guid;
        readonly value: string;
    };
    export type IEdmIntegerValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Integer;
        readonly value: number;
    };
    export type IEdmStringValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.String;
        readonly value: string;
    };
    export type IEdmTimeOfDayValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.TimeOfDay;
        readonly value: DateTime;
    };
    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Null
     */
    export type IEdmNullValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Null;
    };
    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Record
     */
    export type IEdmRecordValue = {
        readonly kind: EdmValueKind.Record;
        readonly type: IEdmTypeReference;
        readonly properties: readonly IEdmRecordPropertyValue[];
    };
    export type IEdmRecordPropertyValue = {
        readonly property: string;
        readonly value: IEdmValue;
    };
    /**
     * https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/odata-csdl-xml-v4.01.html#sec_Collection
     */
    export type IEdmCollectionValue = {
        readonly type: IEdmTypeReference;
        readonly kind: EdmValueKind.Collection;
        readonly elements: readonly IEdmValue[];
    };
    export {};
}
