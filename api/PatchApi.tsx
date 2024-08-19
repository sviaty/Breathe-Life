import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, getDoc, getDocs, doc } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

export const getPatchListFireStore = async () => {
    const q = query(collection(db, "patchs"));

    return await getDocs(q).then((patchList) => {
        //console.log(patchList.size);
        if(patchList.size > 0){
            //console.log(patchList)
            return patchList
        } else {
            //console.error("La liste des patchs est vide")
            throw Error("La liste des patchs est vide")
        }
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

export const getPatchByIdPatchFireStore = async (idPatch:string) => {

    const docRef = doc(db, "patchs", idPatch);

    return await getDoc(docRef).then((patch) => {
        //console.log(patch)
        if (patch.exists()) {
            return patch
        } else {
            throw Error("Patch pas trouvé")
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

const PatchApi = () => {
    const getPatchList = async () => {

    }
}

export default PatchApi

const styles = StyleSheet.create({})