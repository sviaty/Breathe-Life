import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import User from '../datas/UserData';

import firebaseConfig from '../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

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

const UserApi = () => {

}

export default UserApi

const styles = StyleSheet.create({})