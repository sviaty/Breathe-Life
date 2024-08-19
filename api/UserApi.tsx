import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import User from '../datas/UserData';

import firebaseConfig from '../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

export const addUserFireStore = async (userData:any) => {

    await addDoc(collection(db, "users"), userData).then(() => {

        return "user is add"
    }).catch((error) => {

        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const setUserFireStore = async (user:User) => {

    const userDoc = doc(db, "users", user.userId)

    await setDoc(userDoc, {
        userName: user.userName,
        userMail: user.userMail,
        userBirthDate: user.userBirthDate, 
        userSmokeStartDate: user.userSmokeStartDate, 
        userSmokeAvgNbr: user.userSmokeAvgNbr, 
        idPatch: user.idPatch,
        idPill: user.idPill,
        idCigarette: user.idCigarette,
    }).then(() => {
        return "user idPatch is setting"
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const getUserFireStore = async (userMail:string) => {

    const q = query(collection(db, "users"), where("userMail", "==", userMail));
    return await getDocs(q).then((userList) => {
        if(userList.size == 1){
            return userList
        } else {
            throw Error("Pas d'utilisateur")
        }
    }).catch((error) => {
        
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

const UserApi = () => {

}

export default UserApi

const styles = StyleSheet.create({})