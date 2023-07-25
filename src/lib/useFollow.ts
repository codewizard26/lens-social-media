import { useAddress, useSDK } from "@thirdweb-dev/react";
import { useCreateFollowTypedDataMutation } from "../graphql/generated";
import { signTypedDataWithOmittedTypename, splitSignature } from "./helpers";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import { useMutation } from "@tanstack/react-query";
import useLogin from "./auth/useLogin";

export function useFollow() {
  // use the auto generated mutation called useCreateFollowTypedData
  // to get the typed daata for the user to sign

  const { mutateAsync: requestTypedData } = useCreateFollowTypedDataMutation();
  const sdk = useSDK();
  const address = useAddress()
  const {mutateAsync:loginUser} = useLogin()

  async function follow(userId: string) {

    //login
    await loginUser()

    const typedData = await requestTypedData({
      request: {
        follow: [
          {
            profile: userId,
          },
        ],
      },
    });
    const { domain, types, value } = typedData.createFollowTypedData.typedData;

    if (!sdk) return;
    // ask that user to sign that typed data
    const signature = await signTypedDataWithOmittedTypename(
      sdk,
      domain,
      types,
      value
    );

    const {v,r,s} = splitSignature(signature.signature)

    // Send the typed data to the smart contract to perform the
    // write operation on the blockchain

    const lensHubContract = await sdk.getContractFromAbi(
        LENS_CONTRACT_ADDRESS,
        LENS_CONTRACT_ABI
    )


    // call the smart contract function called 'followwithsig"
   
    const result = await lensHubContract.call("followWithSig",[{
      follower:address,
      profileIds:[userId],
      datas:value.datas,
      sig:{
        v,
        r,
        s,
        deadline:value.deadline
      }
    }])

    console.log(result)
  }

  return useMutation(follow)
}
