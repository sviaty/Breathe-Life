import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, getDocs, getDoc, addDoc, where, doc, or} from "firebase/firestore";

import CigaretteUser from '../datas/CigaretteUserData';
const db = getFirestore(firebaseConfig);

/**
 * Function getCigaretteUserListFireStore
 * @param userId 
 * @returns 
 */
export const getCigaretteUserListFireStore = async (userId:string) => {
    const q = query(collection(db, "cigarettesUser"), or(
        where("idUser", "==", userId),
        where("idUser", "==", ""),
    ));

    return await getDocs(q).then((cigList) => {
        //console.log(cigList.size);

        return cigList
        /*
        if(cigList.size > 0){
            //console.log(cigList)
            
        } else {
            return []
            //console.error("La liste des cigarettes est vide")
            //throw Error("La liste des cigarettes pour l user : "+userId+" est vide")
        }
        */
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const getCigaretteUserByIdCigFireStore = async (idCigarette:string) => {

    const docRef = doc(db, "cigarettesUser", idCigarette);

    return await getDoc(docRef).then((cigarette) => {
        //console.log(cigarette)
        return cigarette
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function addCigaretteUserFireStore
 * @param cigaretteUser 
 */
export const addCigaretteUserFireStore = async (
    cigaretteUser: CigaretteUser) => {

    await addDoc(collection(db, "cigarettes"), {
        cigaretteName: cigaretteUser.cigaretteName,
        cigaretteNicotine: cigaretteUser.cigaretteNicotine,
        cigaretteGoudron: cigaretteUser.cigaretteGoudron,
        cigaretteCarbone: cigaretteUser.cigaretteCarbone,
        cigaretteNbr: cigaretteUser.cigaretteNbr,
        cigarettePrice: cigaretteUser.cigarettePrice,
        cigarettePriceUnit: cigaretteUser.cigarettePriceUnit,
        idUser: cigaretteUser.idUser,
    }).then((value) => {
        return "userCigarettesUser is add"
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    })
}

const CigaretteUserApi = () => {

}

export default CigaretteUserApi

const styles = StyleSheet.create({})