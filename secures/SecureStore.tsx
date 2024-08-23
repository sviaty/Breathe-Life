import * as SecureStore from 'expo-secure-store';

export default class SecureStoreClass {    
    // Sauvegarder un token
    async saveToken(key: string, value: string) {
        await SecureStore.setItemAsync(key, value);
        //console.log('token is save') 
    }
  
    // Récupérer un token
    async getToken(key: string) {
        const result = await SecureStore.getItemAsync(key);
        return result;
    }
  
    // Supprimer un token
    async deleteToken(key: string) {
        await SecureStore.deleteItemAsync(key);
        //console.log('token is delete') 
    }
}