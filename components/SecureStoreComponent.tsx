import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import React from 'react'

import AppStyle from '../styles/AppStyle';
import LoginStyle from '../styles/LoginSigninStyle';

import SecureStoreClass from '../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

const SecureStoreComponent = () => {

    const handleSaveToken = async () => {
        try {
            await secureStoreClass.saveToken('tokenId', 'test')
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleGetToken = async () => {
        try {
            const token = await secureStoreClass.getToken('tokenId')
            //console.log(token) 
            if(token == null){
            console.log('Le token est null')
            } else {
            console.log('Le token : '+ token)
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleDeleteToken = async () => {
        try {
            const token = await secureStoreClass.deleteToken('tokenId')
        } catch (error) {
            console.error(error);
        }
    }
    
    const tokenA = handleGetToken()
    return (
        <View style={AppStyle.container}>
        <TouchableOpacity
            onPress={() => handleSaveToken()}
            activeOpacity={0.6}
            style={LoginStyle.btnLogin}>
            <Text style={LoginStyle.buttonText}>Save Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => handleGetToken()}
            activeOpacity={0.6}
            style={LoginStyle.btnLogin}>
            <Text style={LoginStyle.buttonText}>Get Token</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => handleDeleteToken()}
            activeOpacity={0.6}
            style={LoginStyle.btnLogin}>
            <Text style={LoginStyle.buttonText}>Delete Token</Text>
        </TouchableOpacity>
        </View>
    )
}

export default SecureStoreComponent

const styles = StyleSheet.create({})