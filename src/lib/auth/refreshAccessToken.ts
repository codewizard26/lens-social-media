import { fetcher } from "@/src/graphql/auth-fetcher";
import { RefreshDocument, RefreshMutation, RefreshMutationVariables } from "@/src/graphql/generated";
import { readAccessToken, setAccessToken } from "./helper";

export default async function refreshAccessToken() {
    // read the access token from the local storage

    const currentRefreshToken = readAccessToken()?.refreshToken

    if (!currentRefreshToken) return null


    async function fetchData<TData, TVariables>(
        query: string, 
        variables?: TVariables,
        options?: RequestInit["headers"]
        
        ): Promise<TData>{                  
                const res = await fetch('https://api-mumbai.lens.dev', {
                  method: 'POST',
                  headers:{
                    "Content-Type":"application/json",
                  ...options,
                  "Access-Control-Allow-Origin": "*",
          
                  },
                  body: JSON.stringify({ query, variables }),
                });
            
                const json = await res.json();
            
                if (json.errors) {
                  const { message } = json.errors[0];
            
                  throw new Error(message);
                }
            
                return json.data;
              }
        
     // send it to lens to ask for new access token

     const result = await fetchData<
     RefreshMutation,
     RefreshMutationVariables
     >(RefreshDocument,{
        request: {
            refreshToken: currentRefreshToken
        }
     })

     const {
        refresh:{accessToken, refreshToken: newRefreshToken}
    } = result

     setAccessToken(accessToken,newRefreshToken);
     return accessToken as string

    }
// set the value
