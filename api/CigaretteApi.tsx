import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, getDoc, getDocs, doc, where, or } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

export const getCigaretteListFireStore = async (userId:string) => {
    const q = query(collection(db, "cigarettes"), or(
        where("idUser", "==", userId),
        where("idUser", "==", "")
    ));

    return await getDocs(q).then((cigList) => {
        //console.log(cigList.size);
        if(cigList.size > 0){
            //console.log(cigList)
            return cigList
        } else {
            //console.error("La liste des cigarettes est vide")
            throw Error("La liste des cigarettes est vide")
        }
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const getCigaretteByIdCigFireStore = async (idCigarette:string) => {

    const docRef = doc(db, "cigarettes", idCigarette);

    return await getDoc(docRef).then((cigarette) => {
        //console.log(cigarette)
        return cigarette
    
    }).catch((error) => {
        throw Error(error.message)
    })
}


const CigaretteApi = () => {

}

export default CigaretteApi

const styles = StyleSheet.create({})