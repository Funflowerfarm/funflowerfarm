import { marshallOptions, unmarshallOptions } from "@aws-sdk/util-dynamodb";
export declare type KeyNode = {
    key: string;
    children?: KeyNode[] | AllNodes;
};
export declare type AllNodes = {
    children?: KeyNode[] | AllNodes;
};
export declare const marshallInput: (obj: any, keyNodes: KeyNode[], options?: marshallOptions | undefined) => any;
export declare const unmarshallOutput: (obj: any, keyNodes: KeyNode[], options?: unmarshallOptions | undefined) => any;
