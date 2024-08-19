import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

export const setUserPatchsFireStore = async (dataUserPatchs:any) => {

    const patchDoc = collection(db, "userPatchs")

    await addDoc(patchDoc, dataUserPatchs).then((value) => {

        return "userPatchs is add"
    }).catch((error) => {
        
        throw Error(error.message)
    })
}

export const getUserPatchsByIdUserFireStore = async (idUser:string) => {

    const q = query(
        collection(db, "userPatchs"), 
        where("idUser", "==", idUser),
    );

    return await getDocs(q).then((userPatchList) => {
        //console.log(userPatchList)
        return userPatchList
    }).catch((error) => {
        throw Error(error.message)
    })
}

const UserPatchsApi = () => {

}

export default UserPatchsApi

const styles = StyleSheet.create({})