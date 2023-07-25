import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { readAccessToken } from "./helper";
import { useDefaultProfileQuery } from "@/src/graphql/generated";


export default function useLensUser(){

    // make a react query for the local storage address

    const address = useAddress()

    const localStorageQuery = useQuery(["lens-user",address],
        //writing the actual function to check the local storage

        () =>{
            const token = readAccessToken();
            return token
        }

    )

    //if there is connected wallet then we can ask for default profile query

    const profileQuery = useDefaultProfileQuery({
        request:{
            ethereumAddress: address,
        },
    }
    ,{
        enabled: !!address // address !== undefined
    })

    console.log(profileQuery.data?.defaultProfile);

    return {
        //contains information about the local storage

        isSignedInQuery: localStorageQuery,
        profileQuery:profileQuery
    }
 }