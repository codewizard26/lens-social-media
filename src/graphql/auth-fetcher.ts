 // what logic we want to run every time we send a request

import { type } from "os";
import { isTokenExpired, readAccessToken } from "../lib/auth/helper";
import refreshAccessToken from "../lib/auth/refreshAccessToken";

 
 
 export const fetcher = <TData, TVariables>(
    query: string, 
    variables?: TVariables,
    options?: RequestInit["headers"]
    
    ): (() => Promise<TData>) =>{

      async function  getAccessToken() {
        // check the localstorage for access Token

        const token = readAccessToken()

        // if there is not access token then return null

        if (!token) return null
    
        // if its there check its expiry

        let accessToken = token?.accessToken
        // if its expire, update it using the refresh token

        if (isTokenExpired(token.exp)){
          const newToken = await refreshAccessToken()

          if (!newToken) return null
          
          accessToken = newToken
        }

        // finally return the token

        return accessToken

      }

    return async () => {
      const token = typeof window !== "undefined" ? await getAccessToken() : null

      

      const res = await fetch('https://api-mumbai.lens.dev', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json",
        ...options,
        "x-access-token": token? token :"",
        "Access-Control-Allow-Origin": "*",

        },
        body: JSON.stringify({ query, variables }),
      });
  
      const json = await res.json();
  
      if (json.errors) {
        const { message } = json.errors[0] || {} ;
  
        throw new Error(message|| "Error...");
      }
  
      return json.data;
    }
  }