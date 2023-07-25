import { useAddress, useSDK } from "@thirdweb-dev/react";
import generateChallenge from "./generateChallenge";
import { useAuthenticateMutation } from "@/src/graphql/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "./helper";

export default function useLogin () {
    const address = useAddress()
    const sdk = useSDK()
    const {
    mutateAsync: sendSignedMessage
    } = useAuthenticateMutation()

    const client = useQueryClient()

    async function login(){
        if(!address) return

        // generate challenge which comes from lens api
        const {challenge} = await generateChallenge(address)

        // sign the challenge with the user wallet
        const signature = await sdk?.wallet.sign(challenge.text)

        //send the signed challenge to the lens api and get the access token back
        const {authenticate} = await sendSignedMessage(
            {
                request:{
                    address,
                    signature,
                }
            }
        )

        console.log("authenticated", authenticate)
        //store the access token in the local storage


        const {accessToken,refreshToken} = authenticate

        console.log("parsing set access token")

        setAccessToken(accessToken,refreshToken)

        //refetch the data and the cache key

        client.invalidateQueries(["lens-user",address])

    }
    return useMutation(login)
}