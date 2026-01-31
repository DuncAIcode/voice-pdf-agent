import * as z from "zod/v3";
import { ClosedEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { Forbidden, Forbidden$Outbound } from "./forbidden.js";
import { NotAuthorizedForScope, NotAuthorizedForScope$Outbound } from "./notauthorizedforscope.js";
import { SDKValidationError } from "./sdkvalidationerror.js";
export type GetOrderRequest = {
    orderId: string;
    teamId?: string | undefined;
};
/**
 * NotAuthorizedForScope
 */
export type GetOrderDomainsRegistrarResponseBody = (NotAuthorizedForScope & {
    code: "not_authorized_for_scope";
}) | Forbidden;
export declare const GetOrderDomainsDomainsRegistrarStatus: {
    readonly Pending: "pending";
    readonly Completed: "completed";
    readonly Failed: "failed";
    readonly Refunded: "refunded";
    readonly RefundFailed: "refund-failed";
};
export type GetOrderDomainsDomainsRegistrarStatus = ClosedEnum<typeof GetOrderDomainsDomainsRegistrarStatus>;
export type GetOrderErrorDomainsRegistrar2 = {
    code: string;
    details?: any | undefined;
};
export type GetOrder1DomainsRegistrar5 = {
    code: "price-change";
};
export type GetOrder1DomainsRegistrarResponse200Details = {
    numDaysUntilTransferrable: number;
};
export type GetOrder1DomainsRegistrar4 = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200Details;
};
export type GetOrder1DomainsRegistrar3 = {
    code: "claims-notice-required";
};
export type GetOrder1DomainsRegistrar2 = {
    code: "client-transfer-prohibited";
};
export type GetOrder1DomainsRegistrarResponseDetails = {
    detectedLanguageCode: string;
};
export type GetOrder1DomainsRegistrar1 = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponseDetails;
};
export type GetOrderErrorDomainsRegistrar1 = GetOrder1DomainsRegistrar1 | GetOrder1DomainsRegistrar2 | GetOrder1DomainsRegistrar3 | GetOrder1DomainsRegistrar4 | GetOrder1DomainsRegistrar5;
export type GetOrderDomainsDomainsRegistrarError = GetOrderErrorDomainsRegistrar2 | GetOrder1DomainsRegistrar1 | GetOrder1DomainsRegistrar2 | GetOrder1DomainsRegistrar3 | GetOrder1DomainsRegistrar4 | GetOrder1DomainsRegistrar5;
export type Domains3 = {
    purchaseType: "transfer";
    autoRenew: boolean;
    /**
     * The number of years the domain is being transferred for.
     */
    years: number;
    /**
     * A valid domain name
     */
    domainName: string;
    status: GetOrderDomainsDomainsRegistrarStatus;
    price: number;
    error?: GetOrderErrorDomainsRegistrar2 | GetOrder1DomainsRegistrar1 | GetOrder1DomainsRegistrar2 | GetOrder1DomainsRegistrar3 | GetOrder1DomainsRegistrar4 | GetOrder1DomainsRegistrar5 | undefined;
};
export declare const GetOrderDomainsStatus: {
    readonly Pending: "pending";
    readonly Completed: "completed";
    readonly Failed: "failed";
    readonly Refunded: "refunded";
    readonly RefundFailed: "refund-failed";
};
export type GetOrderDomainsStatus = ClosedEnum<typeof GetOrderDomainsStatus>;
export type GetOrderError2 = {
    code: string;
    details?: any | undefined;
};
export type GetOrder15 = {
    code: "price-change";
};
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details = {
    numDaysUntilTransferrable: number;
};
export type GetOrder14 = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details;
};
export type GetOrder1DomainsRegistrarResponse2003 = {
    code: "claims-notice-required";
};
export type GetOrder1DomainsRegistrarResponse2002 = {
    code: "client-transfer-prohibited";
};
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails = {
    detectedLanguageCode: string;
};
export type GetOrder1DomainsRegistrarResponse2001 = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails;
};
export type GetOrderError1 = GetOrder1DomainsRegistrarResponse2001 | GetOrder1DomainsRegistrarResponse2002 | GetOrder1DomainsRegistrarResponse2003 | GetOrder14 | GetOrder15;
export type GetOrderDomainsError = GetOrderError2 | GetOrder1DomainsRegistrarResponse2001 | GetOrder1DomainsRegistrarResponse2002 | GetOrder1DomainsRegistrarResponse2003 | GetOrder14 | GetOrder15;
export type Domains2 = {
    purchaseType: "renewal";
    /**
     * The number of years the domain is being renewed for.
     */
    years: number;
    /**
     * A valid domain name
     */
    domainName: string;
    status: GetOrderDomainsStatus;
    price: number;
    error?: GetOrderError2 | GetOrder1DomainsRegistrarResponse2001 | GetOrder1DomainsRegistrarResponse2002 | GetOrder1DomainsRegistrarResponse2003 | GetOrder14 | GetOrder15 | undefined;
};
export declare const DomainsStatus: {
    readonly Pending: "pending";
    readonly Completed: "completed";
    readonly Failed: "failed";
    readonly Refunded: "refunded";
    readonly RefundFailed: "refund-failed";
};
export type DomainsStatus = ClosedEnum<typeof DomainsStatus>;
export type GetOrderErrorDomainsRegistrarResponse2 = {
    code: string;
    details?: any | undefined;
};
export type GetOrder1DomainsRegistrarResponse5 = {
    code: "price-change";
};
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails = {
    numDaysUntilTransferrable: number;
};
export type GetOrder1DomainsRegistrarResponse4 = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails;
};
export type GetOrder1DomainsRegistrarResponse3 = {
    code: "claims-notice-required";
};
export type GetOrder1DomainsRegistrarResponse2 = {
    code: "client-transfer-prohibited";
};
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails = {
    detectedLanguageCode: string;
};
export type GetOrder1DomainsRegistrarResponse1 = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails;
};
export type GetOrderErrorDomainsRegistrarResponse1 = GetOrder1DomainsRegistrarResponse1 | GetOrder1DomainsRegistrarResponse2 | GetOrder1DomainsRegistrarResponse3 | GetOrder1DomainsRegistrarResponse4 | GetOrder1DomainsRegistrarResponse5;
export type DomainsError = GetOrderErrorDomainsRegistrarResponse2 | GetOrder1DomainsRegistrarResponse1 | GetOrder1DomainsRegistrarResponse2 | GetOrder1DomainsRegistrarResponse3 | GetOrder1DomainsRegistrarResponse4 | GetOrder1DomainsRegistrarResponse5;
export type Domains1 = {
    purchaseType: "purchase";
    autoRenew: boolean;
    /**
     * The number of years the domain is being purchased for.
     */
    years: number;
    /**
     * A valid domain name
     */
    domainName: string;
    status: DomainsStatus;
    price: number;
    error?: GetOrderErrorDomainsRegistrarResponse2 | GetOrder1DomainsRegistrarResponse1 | GetOrder1DomainsRegistrarResponse2 | GetOrder1DomainsRegistrarResponse3 | GetOrder1DomainsRegistrarResponse4 | GetOrder1DomainsRegistrarResponse5 | undefined;
};
export type GetOrderDomains = Domains1 | Domains2 | Domains3;
export declare const GetOrderStatus: {
    readonly Draft: "draft";
    readonly Purchasing: "purchasing";
    readonly Completed: "completed";
    readonly Failed: "failed";
};
export type GetOrderStatus = ClosedEnum<typeof GetOrderStatus>;
export type Error2 = {
    code: string;
    details?: any | undefined;
};
export type One6 = {
    code: "domain-mismatch";
};
export type GetOrder1Details = {
    message: string;
    domainNames: Array<string>;
};
export type One5 = {
    code: "claims-required";
    details: GetOrder1Details;
};
export type One4 = {
    code: "unexpected-error";
};
export type OneDetails = {
    expectedPrice: number;
    actualPrice?: number | undefined;
};
export type GetOrder13 = {
    code: "price-mismatch";
    details: OneDetails;
};
export type Tlds = {
    tldName: string;
    endsAt: string;
};
export type GetOrder1DomainsRegistrarDetails = {
    tlds: Array<Tlds>;
};
export type GetOrder12 = {
    code: "tld-outage";
    details: GetOrder1DomainsRegistrarDetails;
};
export type GetOrder11 = {
    code: "payment-failed";
};
export type Error1 = GetOrder11 | GetOrder12 | GetOrder13 | One4 | One5 | One6;
export type ErrorT = Error2 | GetOrder11 | GetOrder12 | GetOrder13 | One4 | One5 | One6;
/**
 * Success
 */
export type GetOrderResponseBody = {
    /**
     * A valid order ID
     */
    orderId: string;
    domains: Array<Domains1 | Domains2 | Domains3>;
    status: GetOrderStatus;
    error?: Error2 | GetOrder11 | GetOrder12 | GetOrder13 | One4 | One5 | One6 | undefined;
};
/** @internal */
export declare const GetOrderRequest$inboundSchema: z.ZodType<GetOrderRequest, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderRequest$Outbound = {
    orderId: string;
    teamId?: string | undefined;
};
/** @internal */
export declare const GetOrderRequest$outboundSchema: z.ZodType<GetOrderRequest$Outbound, z.ZodTypeDef, GetOrderRequest>;
export declare function getOrderRequestToJSON(getOrderRequest: GetOrderRequest): string;
export declare function getOrderRequestFromJSON(jsonString: string): SafeParseResult<GetOrderRequest, SDKValidationError>;
/** @internal */
export declare const GetOrderDomainsRegistrarResponseBody$inboundSchema: z.ZodType<GetOrderDomainsRegistrarResponseBody, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderDomainsRegistrarResponseBody$Outbound = (NotAuthorizedForScope$Outbound & {
    code: "not_authorized_for_scope";
}) | Forbidden$Outbound;
/** @internal */
export declare const GetOrderDomainsRegistrarResponseBody$outboundSchema: z.ZodType<GetOrderDomainsRegistrarResponseBody$Outbound, z.ZodTypeDef, unknown>;
export declare function getOrderDomainsRegistrarResponseBodyToJSON(getOrderDomainsRegistrarResponseBody: GetOrderDomainsRegistrarResponseBody): string;
export declare function getOrderDomainsRegistrarResponseBodyFromJSON(jsonString: string): SafeParseResult<GetOrderDomainsRegistrarResponseBody, SDKValidationError>;
/** @internal */
export declare const GetOrderDomainsDomainsRegistrarStatus$inboundSchema: z.ZodNativeEnum<typeof GetOrderDomainsDomainsRegistrarStatus>;
/** @internal */
export declare const GetOrderDomainsDomainsRegistrarStatus$outboundSchema: z.ZodNativeEnum<typeof GetOrderDomainsDomainsRegistrarStatus>;
/** @internal */
export declare const GetOrderErrorDomainsRegistrar2$inboundSchema: z.ZodType<GetOrderErrorDomainsRegistrar2, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderErrorDomainsRegistrar2$Outbound = {
    code: string;
    details?: any | undefined;
};
/** @internal */
export declare const GetOrderErrorDomainsRegistrar2$outboundSchema: z.ZodType<GetOrderErrorDomainsRegistrar2$Outbound, z.ZodTypeDef, GetOrderErrorDomainsRegistrar2>;
export declare function getOrderErrorDomainsRegistrar2ToJSON(getOrderErrorDomainsRegistrar2: GetOrderErrorDomainsRegistrar2): string;
export declare function getOrderErrorDomainsRegistrar2FromJSON(jsonString: string): SafeParseResult<GetOrderErrorDomainsRegistrar2, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrar5$inboundSchema: z.ZodType<GetOrder1DomainsRegistrar5, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrar5$Outbound = {
    code: "price-change";
};
/** @internal */
export declare const GetOrder1DomainsRegistrar5$outboundSchema: z.ZodType<GetOrder1DomainsRegistrar5$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrar5>;
export declare function getOrder1DomainsRegistrar5ToJSON(getOrder1DomainsRegistrar5: GetOrder1DomainsRegistrar5): string;
export declare function getOrder1DomainsRegistrar5FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrar5, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200Details$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200Details, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse200Details$Outbound = {
    numDaysUntilTransferrable: number;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200Details$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200Details$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse200Details>;
export declare function getOrder1DomainsRegistrarResponse200DetailsToJSON(getOrder1DomainsRegistrarResponse200Details: GetOrder1DomainsRegistrarResponse200Details): string;
export declare function getOrder1DomainsRegistrarResponse200DetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse200Details, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrar4$inboundSchema: z.ZodType<GetOrder1DomainsRegistrar4, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrar4$Outbound = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200Details$Outbound;
};
/** @internal */
export declare const GetOrder1DomainsRegistrar4$outboundSchema: z.ZodType<GetOrder1DomainsRegistrar4$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrar4>;
export declare function getOrder1DomainsRegistrar4ToJSON(getOrder1DomainsRegistrar4: GetOrder1DomainsRegistrar4): string;
export declare function getOrder1DomainsRegistrar4FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrar4, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrar3$inboundSchema: z.ZodType<GetOrder1DomainsRegistrar3, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrar3$Outbound = {
    code: "claims-notice-required";
};
/** @internal */
export declare const GetOrder1DomainsRegistrar3$outboundSchema: z.ZodType<GetOrder1DomainsRegistrar3$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrar3>;
export declare function getOrder1DomainsRegistrar3ToJSON(getOrder1DomainsRegistrar3: GetOrder1DomainsRegistrar3): string;
export declare function getOrder1DomainsRegistrar3FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrar3, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrar2$inboundSchema: z.ZodType<GetOrder1DomainsRegistrar2, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrar2$Outbound = {
    code: "client-transfer-prohibited";
};
/** @internal */
export declare const GetOrder1DomainsRegistrar2$outboundSchema: z.ZodType<GetOrder1DomainsRegistrar2$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrar2>;
export declare function getOrder1DomainsRegistrar2ToJSON(getOrder1DomainsRegistrar2: GetOrder1DomainsRegistrar2): string;
export declare function getOrder1DomainsRegistrar2FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrar2, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponseDetails$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponseDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponseDetails$Outbound = {
    detectedLanguageCode: string;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponseDetails$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponseDetails$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponseDetails>;
export declare function getOrder1DomainsRegistrarResponseDetailsToJSON(getOrder1DomainsRegistrarResponseDetails: GetOrder1DomainsRegistrarResponseDetails): string;
export declare function getOrder1DomainsRegistrarResponseDetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponseDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrar1$inboundSchema: z.ZodType<GetOrder1DomainsRegistrar1, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrar1$Outbound = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponseDetails$Outbound;
};
/** @internal */
export declare const GetOrder1DomainsRegistrar1$outboundSchema: z.ZodType<GetOrder1DomainsRegistrar1$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrar1>;
export declare function getOrder1DomainsRegistrar1ToJSON(getOrder1DomainsRegistrar1: GetOrder1DomainsRegistrar1): string;
export declare function getOrder1DomainsRegistrar1FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrar1, SDKValidationError>;
/** @internal */
export declare const GetOrderErrorDomainsRegistrar1$inboundSchema: z.ZodType<GetOrderErrorDomainsRegistrar1, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderErrorDomainsRegistrar1$Outbound = GetOrder1DomainsRegistrar1$Outbound | GetOrder1DomainsRegistrar2$Outbound | GetOrder1DomainsRegistrar3$Outbound | GetOrder1DomainsRegistrar4$Outbound | GetOrder1DomainsRegistrar5$Outbound;
/** @internal */
export declare const GetOrderErrorDomainsRegistrar1$outboundSchema: z.ZodType<GetOrderErrorDomainsRegistrar1$Outbound, z.ZodTypeDef, GetOrderErrorDomainsRegistrar1>;
export declare function getOrderErrorDomainsRegistrar1ToJSON(getOrderErrorDomainsRegistrar1: GetOrderErrorDomainsRegistrar1): string;
export declare function getOrderErrorDomainsRegistrar1FromJSON(jsonString: string): SafeParseResult<GetOrderErrorDomainsRegistrar1, SDKValidationError>;
/** @internal */
export declare const GetOrderDomainsDomainsRegistrarError$inboundSchema: z.ZodType<GetOrderDomainsDomainsRegistrarError, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderDomainsDomainsRegistrarError$Outbound = GetOrderErrorDomainsRegistrar2$Outbound | GetOrder1DomainsRegistrar1$Outbound | GetOrder1DomainsRegistrar2$Outbound | GetOrder1DomainsRegistrar3$Outbound | GetOrder1DomainsRegistrar4$Outbound | GetOrder1DomainsRegistrar5$Outbound;
/** @internal */
export declare const GetOrderDomainsDomainsRegistrarError$outboundSchema: z.ZodType<GetOrderDomainsDomainsRegistrarError$Outbound, z.ZodTypeDef, GetOrderDomainsDomainsRegistrarError>;
export declare function getOrderDomainsDomainsRegistrarErrorToJSON(getOrderDomainsDomainsRegistrarError: GetOrderDomainsDomainsRegistrarError): string;
export declare function getOrderDomainsDomainsRegistrarErrorFromJSON(jsonString: string): SafeParseResult<GetOrderDomainsDomainsRegistrarError, SDKValidationError>;
/** @internal */
export declare const Domains3$inboundSchema: z.ZodType<Domains3, z.ZodTypeDef, unknown>;
/** @internal */
export type Domains3$Outbound = {
    purchaseType: "transfer";
    autoRenew: boolean;
    years: number;
    domainName: string;
    status: string;
    price: number;
    error?: GetOrderErrorDomainsRegistrar2$Outbound | GetOrder1DomainsRegistrar1$Outbound | GetOrder1DomainsRegistrar2$Outbound | GetOrder1DomainsRegistrar3$Outbound | GetOrder1DomainsRegistrar4$Outbound | GetOrder1DomainsRegistrar5$Outbound | undefined;
};
/** @internal */
export declare const Domains3$outboundSchema: z.ZodType<Domains3$Outbound, z.ZodTypeDef, Domains3>;
export declare function domains3ToJSON(domains3: Domains3): string;
export declare function domains3FromJSON(jsonString: string): SafeParseResult<Domains3, SDKValidationError>;
/** @internal */
export declare const GetOrderDomainsStatus$inboundSchema: z.ZodNativeEnum<typeof GetOrderDomainsStatus>;
/** @internal */
export declare const GetOrderDomainsStatus$outboundSchema: z.ZodNativeEnum<typeof GetOrderDomainsStatus>;
/** @internal */
export declare const GetOrderError2$inboundSchema: z.ZodType<GetOrderError2, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderError2$Outbound = {
    code: string;
    details?: any | undefined;
};
/** @internal */
export declare const GetOrderError2$outboundSchema: z.ZodType<GetOrderError2$Outbound, z.ZodTypeDef, GetOrderError2>;
export declare function getOrderError2ToJSON(getOrderError2: GetOrderError2): string;
export declare function getOrderError2FromJSON(jsonString: string): SafeParseResult<GetOrderError2, SDKValidationError>;
/** @internal */
export declare const GetOrder15$inboundSchema: z.ZodType<GetOrder15, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder15$Outbound = {
    code: "price-change";
};
/** @internal */
export declare const GetOrder15$outboundSchema: z.ZodType<GetOrder15$Outbound, z.ZodTypeDef, GetOrder15>;
export declare function getOrder15ToJSON(getOrder15: GetOrder15): string;
export declare function getOrder15FromJSON(jsonString: string): SafeParseResult<GetOrder15, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details$Outbound = {
    numDaysUntilTransferrable: number;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details>;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2DetailsToJSON(getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details): string;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2DetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details, SDKValidationError>;
/** @internal */
export declare const GetOrder14$inboundSchema: z.ZodType<GetOrder14, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder14$Outbound = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomains2Details$Outbound;
};
/** @internal */
export declare const GetOrder14$outboundSchema: z.ZodType<GetOrder14$Outbound, z.ZodTypeDef, GetOrder14>;
export declare function getOrder14ToJSON(getOrder14: GetOrder14): string;
export declare function getOrder14FromJSON(jsonString: string): SafeParseResult<GetOrder14, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2003$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2003, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse2003$Outbound = {
    code: "claims-notice-required";
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2003$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2003$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse2003>;
export declare function getOrder1DomainsRegistrarResponse2003ToJSON(getOrder1DomainsRegistrarResponse2003: GetOrder1DomainsRegistrarResponse2003): string;
export declare function getOrder1DomainsRegistrarResponse2003FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse2003, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2002$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2002, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse2002$Outbound = {
    code: "client-transfer-prohibited";
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2002$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2002$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse2002>;
export declare function getOrder1DomainsRegistrarResponse2002ToJSON(getOrder1DomainsRegistrarResponse2002: GetOrder1DomainsRegistrarResponse2002): string;
export declare function getOrder1DomainsRegistrarResponse2002FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse2002, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails$Outbound = {
    detectedLanguageCode: string;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails>;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetailsToJSON(getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails): string;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2001$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2001, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse2001$Outbound = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDomainsDetails$Outbound;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2001$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2001$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse2001>;
export declare function getOrder1DomainsRegistrarResponse2001ToJSON(getOrder1DomainsRegistrarResponse2001: GetOrder1DomainsRegistrarResponse2001): string;
export declare function getOrder1DomainsRegistrarResponse2001FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse2001, SDKValidationError>;
/** @internal */
export declare const GetOrderError1$inboundSchema: z.ZodType<GetOrderError1, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderError1$Outbound = GetOrder1DomainsRegistrarResponse2001$Outbound | GetOrder1DomainsRegistrarResponse2002$Outbound | GetOrder1DomainsRegistrarResponse2003$Outbound | GetOrder14$Outbound | GetOrder15$Outbound;
/** @internal */
export declare const GetOrderError1$outboundSchema: z.ZodType<GetOrderError1$Outbound, z.ZodTypeDef, GetOrderError1>;
export declare function getOrderError1ToJSON(getOrderError1: GetOrderError1): string;
export declare function getOrderError1FromJSON(jsonString: string): SafeParseResult<GetOrderError1, SDKValidationError>;
/** @internal */
export declare const GetOrderDomainsError$inboundSchema: z.ZodType<GetOrderDomainsError, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderDomainsError$Outbound = GetOrderError2$Outbound | GetOrder1DomainsRegistrarResponse2001$Outbound | GetOrder1DomainsRegistrarResponse2002$Outbound | GetOrder1DomainsRegistrarResponse2003$Outbound | GetOrder14$Outbound | GetOrder15$Outbound;
/** @internal */
export declare const GetOrderDomainsError$outboundSchema: z.ZodType<GetOrderDomainsError$Outbound, z.ZodTypeDef, GetOrderDomainsError>;
export declare function getOrderDomainsErrorToJSON(getOrderDomainsError: GetOrderDomainsError): string;
export declare function getOrderDomainsErrorFromJSON(jsonString: string): SafeParseResult<GetOrderDomainsError, SDKValidationError>;
/** @internal */
export declare const Domains2$inboundSchema: z.ZodType<Domains2, z.ZodTypeDef, unknown>;
/** @internal */
export type Domains2$Outbound = {
    purchaseType: "renewal";
    years: number;
    domainName: string;
    status: string;
    price: number;
    error?: GetOrderError2$Outbound | GetOrder1DomainsRegistrarResponse2001$Outbound | GetOrder1DomainsRegistrarResponse2002$Outbound | GetOrder1DomainsRegistrarResponse2003$Outbound | GetOrder14$Outbound | GetOrder15$Outbound | undefined;
};
/** @internal */
export declare const Domains2$outboundSchema: z.ZodType<Domains2$Outbound, z.ZodTypeDef, Domains2>;
export declare function domains2ToJSON(domains2: Domains2): string;
export declare function domains2FromJSON(jsonString: string): SafeParseResult<Domains2, SDKValidationError>;
/** @internal */
export declare const DomainsStatus$inboundSchema: z.ZodNativeEnum<typeof DomainsStatus>;
/** @internal */
export declare const DomainsStatus$outboundSchema: z.ZodNativeEnum<typeof DomainsStatus>;
/** @internal */
export declare const GetOrderErrorDomainsRegistrarResponse2$inboundSchema: z.ZodType<GetOrderErrorDomainsRegistrarResponse2, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderErrorDomainsRegistrarResponse2$Outbound = {
    code: string;
    details?: any | undefined;
};
/** @internal */
export declare const GetOrderErrorDomainsRegistrarResponse2$outboundSchema: z.ZodType<GetOrderErrorDomainsRegistrarResponse2$Outbound, z.ZodTypeDef, GetOrderErrorDomainsRegistrarResponse2>;
export declare function getOrderErrorDomainsRegistrarResponse2ToJSON(getOrderErrorDomainsRegistrarResponse2: GetOrderErrorDomainsRegistrarResponse2): string;
export declare function getOrderErrorDomainsRegistrarResponse2FromJSON(jsonString: string): SafeParseResult<GetOrderErrorDomainsRegistrarResponse2, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse5$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse5, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse5$Outbound = {
    code: "price-change";
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse5$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse5$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse5>;
export declare function getOrder1DomainsRegistrarResponse5ToJSON(getOrder1DomainsRegistrarResponse5: GetOrder1DomainsRegistrarResponse5): string;
export declare function getOrder1DomainsRegistrarResponse5FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse5, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails$Outbound = {
    numDaysUntilTransferrable: number;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails>;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetailsToJSON(getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails): string;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse4$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse4, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse4$Outbound = {
    code: "cannot-transfer-in-until";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONResponseBodyDetails$Outbound;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse4$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse4$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse4>;
export declare function getOrder1DomainsRegistrarResponse4ToJSON(getOrder1DomainsRegistrarResponse4: GetOrder1DomainsRegistrarResponse4): string;
export declare function getOrder1DomainsRegistrarResponse4FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse4, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse3$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse3, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse3$Outbound = {
    code: "claims-notice-required";
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse3$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse3$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse3>;
export declare function getOrder1DomainsRegistrarResponse3ToJSON(getOrder1DomainsRegistrarResponse3: GetOrder1DomainsRegistrarResponse3): string;
export declare function getOrder1DomainsRegistrarResponse3FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse3, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse2$Outbound = {
    code: "client-transfer-prohibited";
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse2$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse2$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse2>;
export declare function getOrder1DomainsRegistrarResponse2ToJSON(getOrder1DomainsRegistrarResponse2: GetOrder1DomainsRegistrarResponse2): string;
export declare function getOrder1DomainsRegistrarResponse2FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse2, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails$Outbound = {
    detectedLanguageCode: string;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails>;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONDetailsToJSON(getOrder1DomainsRegistrarResponse200ApplicationJSONDetails: GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails): string;
export declare function getOrder1DomainsRegistrarResponse200ApplicationJSONDetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse1$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse1, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarResponse1$Outbound = {
    code: "unsupported-language-code";
    details: GetOrder1DomainsRegistrarResponse200ApplicationJSONDetails$Outbound;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarResponse1$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarResponse1$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarResponse1>;
export declare function getOrder1DomainsRegistrarResponse1ToJSON(getOrder1DomainsRegistrarResponse1: GetOrder1DomainsRegistrarResponse1): string;
export declare function getOrder1DomainsRegistrarResponse1FromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarResponse1, SDKValidationError>;
/** @internal */
export declare const GetOrderErrorDomainsRegistrarResponse1$inboundSchema: z.ZodType<GetOrderErrorDomainsRegistrarResponse1, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderErrorDomainsRegistrarResponse1$Outbound = GetOrder1DomainsRegistrarResponse1$Outbound | GetOrder1DomainsRegistrarResponse2$Outbound | GetOrder1DomainsRegistrarResponse3$Outbound | GetOrder1DomainsRegistrarResponse4$Outbound | GetOrder1DomainsRegistrarResponse5$Outbound;
/** @internal */
export declare const GetOrderErrorDomainsRegistrarResponse1$outboundSchema: z.ZodType<GetOrderErrorDomainsRegistrarResponse1$Outbound, z.ZodTypeDef, GetOrderErrorDomainsRegistrarResponse1>;
export declare function getOrderErrorDomainsRegistrarResponse1ToJSON(getOrderErrorDomainsRegistrarResponse1: GetOrderErrorDomainsRegistrarResponse1): string;
export declare function getOrderErrorDomainsRegistrarResponse1FromJSON(jsonString: string): SafeParseResult<GetOrderErrorDomainsRegistrarResponse1, SDKValidationError>;
/** @internal */
export declare const DomainsError$inboundSchema: z.ZodType<DomainsError, z.ZodTypeDef, unknown>;
/** @internal */
export type DomainsError$Outbound = GetOrderErrorDomainsRegistrarResponse2$Outbound | GetOrder1DomainsRegistrarResponse1$Outbound | GetOrder1DomainsRegistrarResponse2$Outbound | GetOrder1DomainsRegistrarResponse3$Outbound | GetOrder1DomainsRegistrarResponse4$Outbound | GetOrder1DomainsRegistrarResponse5$Outbound;
/** @internal */
export declare const DomainsError$outboundSchema: z.ZodType<DomainsError$Outbound, z.ZodTypeDef, DomainsError>;
export declare function domainsErrorToJSON(domainsError: DomainsError): string;
export declare function domainsErrorFromJSON(jsonString: string): SafeParseResult<DomainsError, SDKValidationError>;
/** @internal */
export declare const Domains1$inboundSchema: z.ZodType<Domains1, z.ZodTypeDef, unknown>;
/** @internal */
export type Domains1$Outbound = {
    purchaseType: "purchase";
    autoRenew: boolean;
    years: number;
    domainName: string;
    status: string;
    price: number;
    error?: GetOrderErrorDomainsRegistrarResponse2$Outbound | GetOrder1DomainsRegistrarResponse1$Outbound | GetOrder1DomainsRegistrarResponse2$Outbound | GetOrder1DomainsRegistrarResponse3$Outbound | GetOrder1DomainsRegistrarResponse4$Outbound | GetOrder1DomainsRegistrarResponse5$Outbound | undefined;
};
/** @internal */
export declare const Domains1$outboundSchema: z.ZodType<Domains1$Outbound, z.ZodTypeDef, Domains1>;
export declare function domains1ToJSON(domains1: Domains1): string;
export declare function domains1FromJSON(jsonString: string): SafeParseResult<Domains1, SDKValidationError>;
/** @internal */
export declare const GetOrderDomains$inboundSchema: z.ZodType<GetOrderDomains, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderDomains$Outbound = Domains1$Outbound | Domains2$Outbound | Domains3$Outbound;
/** @internal */
export declare const GetOrderDomains$outboundSchema: z.ZodType<GetOrderDomains$Outbound, z.ZodTypeDef, GetOrderDomains>;
export declare function getOrderDomainsToJSON(getOrderDomains: GetOrderDomains): string;
export declare function getOrderDomainsFromJSON(jsonString: string): SafeParseResult<GetOrderDomains, SDKValidationError>;
/** @internal */
export declare const GetOrderStatus$inboundSchema: z.ZodNativeEnum<typeof GetOrderStatus>;
/** @internal */
export declare const GetOrderStatus$outboundSchema: z.ZodNativeEnum<typeof GetOrderStatus>;
/** @internal */
export declare const Error2$inboundSchema: z.ZodType<Error2, z.ZodTypeDef, unknown>;
/** @internal */
export type Error2$Outbound = {
    code: string;
    details?: any | undefined;
};
/** @internal */
export declare const Error2$outboundSchema: z.ZodType<Error2$Outbound, z.ZodTypeDef, Error2>;
export declare function error2ToJSON(error2: Error2): string;
export declare function error2FromJSON(jsonString: string): SafeParseResult<Error2, SDKValidationError>;
/** @internal */
export declare const One6$inboundSchema: z.ZodType<One6, z.ZodTypeDef, unknown>;
/** @internal */
export type One6$Outbound = {
    code: "domain-mismatch";
};
/** @internal */
export declare const One6$outboundSchema: z.ZodType<One6$Outbound, z.ZodTypeDef, One6>;
export declare function one6ToJSON(one6: One6): string;
export declare function one6FromJSON(jsonString: string): SafeParseResult<One6, SDKValidationError>;
/** @internal */
export declare const GetOrder1Details$inboundSchema: z.ZodType<GetOrder1Details, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1Details$Outbound = {
    message: string;
    domainNames: Array<string>;
};
/** @internal */
export declare const GetOrder1Details$outboundSchema: z.ZodType<GetOrder1Details$Outbound, z.ZodTypeDef, GetOrder1Details>;
export declare function getOrder1DetailsToJSON(getOrder1Details: GetOrder1Details): string;
export declare function getOrder1DetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1Details, SDKValidationError>;
/** @internal */
export declare const One5$inboundSchema: z.ZodType<One5, z.ZodTypeDef, unknown>;
/** @internal */
export type One5$Outbound = {
    code: "claims-required";
    details: GetOrder1Details$Outbound;
};
/** @internal */
export declare const One5$outboundSchema: z.ZodType<One5$Outbound, z.ZodTypeDef, One5>;
export declare function one5ToJSON(one5: One5): string;
export declare function one5FromJSON(jsonString: string): SafeParseResult<One5, SDKValidationError>;
/** @internal */
export declare const One4$inboundSchema: z.ZodType<One4, z.ZodTypeDef, unknown>;
/** @internal */
export type One4$Outbound = {
    code: "unexpected-error";
};
/** @internal */
export declare const One4$outboundSchema: z.ZodType<One4$Outbound, z.ZodTypeDef, One4>;
export declare function one4ToJSON(one4: One4): string;
export declare function one4FromJSON(jsonString: string): SafeParseResult<One4, SDKValidationError>;
/** @internal */
export declare const OneDetails$inboundSchema: z.ZodType<OneDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type OneDetails$Outbound = {
    expectedPrice: number;
    actualPrice?: number | undefined;
};
/** @internal */
export declare const OneDetails$outboundSchema: z.ZodType<OneDetails$Outbound, z.ZodTypeDef, OneDetails>;
export declare function oneDetailsToJSON(oneDetails: OneDetails): string;
export declare function oneDetailsFromJSON(jsonString: string): SafeParseResult<OneDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder13$inboundSchema: z.ZodType<GetOrder13, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder13$Outbound = {
    code: "price-mismatch";
    details: OneDetails$Outbound;
};
/** @internal */
export declare const GetOrder13$outboundSchema: z.ZodType<GetOrder13$Outbound, z.ZodTypeDef, GetOrder13>;
export declare function getOrder13ToJSON(getOrder13: GetOrder13): string;
export declare function getOrder13FromJSON(jsonString: string): SafeParseResult<GetOrder13, SDKValidationError>;
/** @internal */
export declare const Tlds$inboundSchema: z.ZodType<Tlds, z.ZodTypeDef, unknown>;
/** @internal */
export type Tlds$Outbound = {
    tldName: string;
    endsAt: string;
};
/** @internal */
export declare const Tlds$outboundSchema: z.ZodType<Tlds$Outbound, z.ZodTypeDef, Tlds>;
export declare function tldsToJSON(tlds: Tlds): string;
export declare function tldsFromJSON(jsonString: string): SafeParseResult<Tlds, SDKValidationError>;
/** @internal */
export declare const GetOrder1DomainsRegistrarDetails$inboundSchema: z.ZodType<GetOrder1DomainsRegistrarDetails, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder1DomainsRegistrarDetails$Outbound = {
    tlds: Array<Tlds$Outbound>;
};
/** @internal */
export declare const GetOrder1DomainsRegistrarDetails$outboundSchema: z.ZodType<GetOrder1DomainsRegistrarDetails$Outbound, z.ZodTypeDef, GetOrder1DomainsRegistrarDetails>;
export declare function getOrder1DomainsRegistrarDetailsToJSON(getOrder1DomainsRegistrarDetails: GetOrder1DomainsRegistrarDetails): string;
export declare function getOrder1DomainsRegistrarDetailsFromJSON(jsonString: string): SafeParseResult<GetOrder1DomainsRegistrarDetails, SDKValidationError>;
/** @internal */
export declare const GetOrder12$inboundSchema: z.ZodType<GetOrder12, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder12$Outbound = {
    code: "tld-outage";
    details: GetOrder1DomainsRegistrarDetails$Outbound;
};
/** @internal */
export declare const GetOrder12$outboundSchema: z.ZodType<GetOrder12$Outbound, z.ZodTypeDef, GetOrder12>;
export declare function getOrder12ToJSON(getOrder12: GetOrder12): string;
export declare function getOrder12FromJSON(jsonString: string): SafeParseResult<GetOrder12, SDKValidationError>;
/** @internal */
export declare const GetOrder11$inboundSchema: z.ZodType<GetOrder11, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrder11$Outbound = {
    code: "payment-failed";
};
/** @internal */
export declare const GetOrder11$outboundSchema: z.ZodType<GetOrder11$Outbound, z.ZodTypeDef, GetOrder11>;
export declare function getOrder11ToJSON(getOrder11: GetOrder11): string;
export declare function getOrder11FromJSON(jsonString: string): SafeParseResult<GetOrder11, SDKValidationError>;
/** @internal */
export declare const Error1$inboundSchema: z.ZodType<Error1, z.ZodTypeDef, unknown>;
/** @internal */
export type Error1$Outbound = GetOrder11$Outbound | GetOrder12$Outbound | GetOrder13$Outbound | One4$Outbound | One5$Outbound | One6$Outbound;
/** @internal */
export declare const Error1$outboundSchema: z.ZodType<Error1$Outbound, z.ZodTypeDef, Error1>;
export declare function error1ToJSON(error1: Error1): string;
export declare function error1FromJSON(jsonString: string): SafeParseResult<Error1, SDKValidationError>;
/** @internal */
export declare const ErrorT$inboundSchema: z.ZodType<ErrorT, z.ZodTypeDef, unknown>;
/** @internal */
export type ErrorT$Outbound = Error2$Outbound | GetOrder11$Outbound | GetOrder12$Outbound | GetOrder13$Outbound | One4$Outbound | One5$Outbound | One6$Outbound;
/** @internal */
export declare const ErrorT$outboundSchema: z.ZodType<ErrorT$Outbound, z.ZodTypeDef, ErrorT>;
export declare function errorToJSON(errorT: ErrorT): string;
export declare function errorFromJSON(jsonString: string): SafeParseResult<ErrorT, SDKValidationError>;
/** @internal */
export declare const GetOrderResponseBody$inboundSchema: z.ZodType<GetOrderResponseBody, z.ZodTypeDef, unknown>;
/** @internal */
export type GetOrderResponseBody$Outbound = {
    orderId: string;
    domains: Array<Domains1$Outbound | Domains2$Outbound | Domains3$Outbound>;
    status: string;
    error?: Error2$Outbound | GetOrder11$Outbound | GetOrder12$Outbound | GetOrder13$Outbound | One4$Outbound | One5$Outbound | One6$Outbound | undefined;
};
/** @internal */
export declare const GetOrderResponseBody$outboundSchema: z.ZodType<GetOrderResponseBody$Outbound, z.ZodTypeDef, GetOrderResponseBody>;
export declare function getOrderResponseBodyToJSON(getOrderResponseBody: GetOrderResponseBody): string;
export declare function getOrderResponseBodyFromJSON(jsonString: string): SafeParseResult<GetOrderResponseBody, SDKValidationError>;
//# sourceMappingURL=getorderop.d.ts.map