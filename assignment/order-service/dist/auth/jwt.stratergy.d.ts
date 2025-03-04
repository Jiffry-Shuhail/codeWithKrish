import { Strategy } from 'passport-jwt';
declare const JwtStratergy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStratergy extends JwtStratergy_base {
    constructor();
    validate(payload: any): {
        userId: any;
        name: any;
        permissions: any;
    };
}
export {};
