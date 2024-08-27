// Data
import User from '../datas/UserData';

// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, query, where, addDoc, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebaseConfig);

/**
 * Function addUserFireStore
 * @param userData 
 */
export const addUserFireStore = async (user:User) => {

    const userData = {
        userName: user.userName,
        userMail: user.userMail,
        userBirthDate: "",
        userSmokeAvgNbr: "",
        idPatch: "",
        idPill: "",
        idCigarette: ""
    }
    
    await addDoc(collection(db, "users"), userData).then(() => {

        return "user is add"
    }).catch((error) => {

        //console.error(error.message)
        throw Error(error.message)
    }) 
}

/**
 * Function setUserFireStore
 * @param user 
 */
export const setUserFireStore = async (user:User) => {

    const userDoc = doc(db, "users", user.userId)

    await setDoc(userDoc, {
        userName: user.userName,
        userMail: user.userMail,
        userBirthDate: user.userBirthDate, 
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

/**
 * Function setUserFireStore
 * @param user 
 */
export const setUserByObjectFireStore = async (idUser: string, dataUser: Object) => {

    const userDoc = doc(db, "users", idUser)

    await setDoc(userDoc, dataUser).then(() => {
        return "user is setting"
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

/**
 * Function delUserFireStore
 * @param idUser 
 * @returns 
 */
export const delUserFireStore = async (idUser: string): Promise<boolean> => {

    const userDoc = doc(db, "users", idUser)

    return await deleteDoc(userDoc).then(() => {
        return true
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}

/**
 * Function getUserFireStore
 * @param userMail  
 * @returns 
 */
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

/**
 * Function getUserFireStore
 * @param userMail  
 * @returns 
 */
export const getUserByIdFireStore = async (idUser:string): Promise<User> => {
    
    const docRef = doc(db, "users", idUser);
    return await getDoc(docRef).then((user) => {
        const dataUser = user.data()
        if(dataUser != null){

            const u = new User(
                user.id, 
                dataUser.userName, 
                dataUser.userMail, 
                '', 
                dataUser.userBirthDate, 
                dataUser.userSmokeAvgNbr, 
                dataUser.idPatch, 
                dataUser.idPill, 
                dataUser.idCigarette);

            return u
        } else {
            throw Error("Pas d'utilisateur")
        }
    }).catch((error) => {
        
        //console.error(error.message)
        throw Error(error.message)
    }) 
}