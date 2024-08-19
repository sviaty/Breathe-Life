import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

export const setUserCigarettesFireStore = async (dataUserPatchs:any) => {

    const patchDoc = collection(db, "userCigarettes")

    await addDoc(patchDoc, dataUserPatchs).then((value) => {

        return "userCigarettes is add"
    }).catch((error) => {
        
        throw Error(error.message)
    })
}

export const getUserCigarettesByIdUserFireStore = async (idUser:string) => {

    const q = query(
        collection(db, "userCigarettes"), 
        where("idUser", "==", idUser),
    );

    return await getDocs(q).then((userCigaretteList) => {
        //console.log(userCigaretteList)
        return userCigaretteList
    }).catch((error) => {
        throw Error(error.message)
    })
}

const UserCigarettesApi = () => {

}

export default UserCigarettesApi

const styles = StyleSheet.create({})