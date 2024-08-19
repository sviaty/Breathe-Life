import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

export const setUserPillsFireStore = async (dataUserPills:any) => {

    const patchDoc = collection(db, "userPills")

    await addDoc(patchDoc, dataUserPills).then((value) => {

        return "userPills is add"
    }).catch((error) => {
        
        throw Error(error.message)
    })
}

export const getUserPillsByIdUserFireStore = async (idUser:string) => {

    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser),
    );

    return await getDocs(q).then((userPillList) => {
        //console.log(userPillList)
        return userPillList
    }).catch((error) => {
        throw Error(error.message)
    })
}

const UserPillsApi = () => {

}

export default UserPillsApi

const styles = StyleSheet.create({})