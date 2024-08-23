// Data
import CigaretteUser from '../datas/CigaretteUserData';

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, getDoc, getDocs, doc, where, or, deleteDoc, addDoc} from "firebase/firestore";

const db = getFirestore(firebaseConfig);

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

/**
 * Function getCigaretteListFireStore
 * @param userId 
 * @returns 
 */
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

/**
 * Function getCigaretteByIdCigFireStore
 * @param idCigarette 
 * @returns 
 */
export const getCigaretteByIdCigFireStore = async (idCigarette:string) => {

    const docRef = doc(db, "cigarettes", idCigarette);

    return await getDoc(docRef).then((cigarette) => {
        //console.log(cigarette)
        return cigarette
    
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function delCigaretteByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const delCigaretteByIdUserFireStore = async (idUser: string): Promise<boolean> => {

    //console.log(idUser)
    const q = query(
        collection(db, "cigarettes"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((cigList) => {

        cigList.forEach((cig) => {
            delCigaretteByIdFireStore(cig.id)
        })

        return true
        
    }).catch((error: any) => {
        throw Error(error.message)
    })
}

/**
 * Function delCigaretteByIdFireStore
 * @param id 
 * @returns 
 */
export const delCigaretteByIdFireStore = async (id: string): Promise<boolean> => {

    const cigDoc = doc(db, "cigarettes", id)

    return await deleteDoc(cigDoc).then(() => {
        return true
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}