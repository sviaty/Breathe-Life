import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, getDoc, getDocs, doc } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

export const getPillListFireStore = async () => {
    const q = query(collection(db, "pills"));

    return await getDocs(q).then((pillList) => {
        //console.log(pillList.size);
        if(pillList.size > 0){
            //console.log(pillList)
            return pillList
        } else {
            //console.error("La liste des pastilles est vide")
            throw Error("La liste des pastilles est vide")
        }
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const getPillByIdPillFireStore = async (idPill:string) => {

    const docRef = doc(db, "pills", idPill);

    return await getDoc(docRef).then((pill) => {
        //console.log(patch)
        if (pill.exists()) {
            return pill
        } else {
            throw Error("pill pas trouvé")
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

const PillApi = () => {

}

export default PillApi

const styles = StyleSheet.create({})