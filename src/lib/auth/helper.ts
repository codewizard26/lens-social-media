const STORAGE_KEY = 'LH_STORAGE_KEY'

export function isTokenExpired(exp: number){
    if (!exp) return true

    if (Date.now()>= exp*1000){
        return false
    }
    return true
}

// reading the access token from the storage
export function readAccessToken(){

    if (typeof window === undefined )return null

    const ls = localStorage || window.localStorage

    if (!ls){
        throw new Error ("Localstorage is not available")
    }
    const data = ls.getItem(STORAGE_KEY)

    if (!data) return null
 
    return JSON.parse(data) as {
        accessToken: string;
        refreshToken: string;
        exp: number;

    }
}

// setting the token in storage

export function setAccessToken(accessToken:string,refreshToken:string){
    console.log("setAccessToken")
    const {exp } = parseJwt(accessToken)

    const ls = localStorage || window.localStorage

    if (!ls){
        throw new Error("LocalStorage is not availble")
    }

    ls.setItem(STORAGE_KEY,JSON.stringify({accessToken,refreshToken,exp}))
    console.log("item set")
}

// pass the jwt token that comes back and extract the exp date field

export function parseJwt(token: string){

    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/");
    var jsonPayLoad = decodeURIComponent(
        window
        .atob(base64)
        .split("")
        .map(function(c){
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        }) 
        .join("")   
    )
    return JSON.parse(jsonPayLoad)
} 