// Secure Store
import SecureStoreClass from '../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

/**
 * Function saveToken
 */
export const addSecureStore = async (idSecure: string, value: string) => {
    return await secureStoreClass.saveToken(idSecure, value).then((value) => {
        return value
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    })
}

/**
 * Function getToken
 */
export const getSecureStore = async (idSecure: string) => {
    return await secureStoreClass.getToken(idSecure).then((value) => {
        return value
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    })
}

/**
 * Function deleteToken
 */
export const deleteSecureStore = async (idSecure: string) => {
    return await secureStoreClass.deleteToken(idSecure).then((value) => {
        return value
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    })
}
