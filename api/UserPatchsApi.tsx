// Helper
import { isMoreRecent } from '../helpers/DateHelper';

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

/**
 * Function setUserPatchsFireStore
 * @param dataUserPatchs 
 */
export const setUserPatchsFireStore = async (dataUserPatchs:any) => {

    const patchDoc = collection(db, "userPatchs")

    await addDoc(patchDoc, dataUserPatchs).then((value) => {

        return "userPatchs is add"
    }).catch((error) => {
        
        throw Error(error.message)
    })
}

/**
 * Function getUserPatchsByIdUserFireStore
 * @param idUser 
 * @returns 
 */
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

/**
 * Function getUserLastPatchByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const getUserLastPatchByIdUserFireStore = async (idUser:string) => {

    //console.log(idUser)

    const q = query(
        collection(db, "userPatchs"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((patchList) => {
        //console.log(pillList)

        //console.log(pillList.size);

        if(patchList.size > 0){
            const patchTab:any[] = []
            patchList.forEach((patch) => {
                patchTab.push(patch.data()) 
                //console.log(pill.data().dateTime.toDate())
            })

            //const sortedDates = patchTab.sort((a, b) => moment(a.dateTime).diff(moment(b)))
    
            let patchLast = patchTab[0]
            //console.log(patchLast)
            let dateLast = patchTab[0].dateTime
            
            patchTab.forEach((patch) => {

                if(isMoreRecent(dateLast.toDate(), patch.dateTime.toDate())){
                    //console.log("is ok")
                    patchLast = patch
                    dateLast = patch.dateTime
                }
            })
    
            //console.log("date "+ patchLast.dateTime.toDate())
    
            return patchLast
        } else {
            return null
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function delUserPatchByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const delUserPatchByIdUserFireStore = async (idUser: string) => {

    //console.log(idUser)
    const q = query(
        collection(db, "userPatchs"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((userPatchList) => {
        userPatchList.forEach((userPatch) => {
            delUserPatchByIdFireStore(userPatch.id)
        })

        //return true
        
    }).catch((error: any) => {
        throw Error(error.message)
    })
}

/**
 * Function delUserPatchByIdFireStore
 * @param id 
 * @returns 
 */
export const delUserPatchByIdFireStore = async (id: string): Promise<boolean> => {

    const userDoc = doc(db, "userPatchs", id)

    return await deleteDoc(userDoc).then(() => {
        return true
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}