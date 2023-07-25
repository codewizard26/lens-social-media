import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { EIP712Domain } from "@thirdweb-dev/sdk/dist/declarations/src/evm/common/sign";
import { Domain } from "domain";
import { ethers } from "ethers";
import omitDeep from "omit-deep";

// sign typed data with omitted __typename value using omit-deep
export function omitTypename(object:any){
    return omitDeep(object,["__typename"]);

}

export async function signTypedDataWithOmittedTypename(
    sdk: ThirdwebSDK,
    domain: EIP712Domain,
    types: Record<string,any>,
    value: Record<string,any>
){
    //perform the signature with sign typed data
    return await sdk.wallet.signTypedData(
        omitTypename(domain) as EIP712Domain,
        omitTypename(types) as Record<string,any>,
        omitTypename(value) as Record<string,any>
    )
}

// split the signature to extract the "v" . "r" , "s" value

export function splitSignature(signature:string){
    return ethers.utils.splitSignature(signature)
}