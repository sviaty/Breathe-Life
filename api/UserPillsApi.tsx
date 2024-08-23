// FireStore
import firebaseConfig from '../firebaseConfig';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { getDayDate, getMounthDate, getMounthDayDate, isMoreRecent, isThisWeek } from '../helpers/DateHelper';

const db = getFirestore(firebaseConfig);

/**
 * Function setUserPillsFireStore
 * @param dataUserPills 
 */
export const setUserPillsFireStore = async (dataUserPills:any) => {

    const patchDoc = collection(db, "userPills")

    await addDoc(patchDoc, dataUserPills).then((value) => {

        return "userPills is add"
    }).catch((error) => {
        
        throw Error(error.message)
    })
}

/**
 * Function getUserPillsByIdUserFireStore
 * @param idUser 
 * @returns 
 */
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

/**
 * Function getUserLastPillByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const getUserLastPillByIdUserFireStore = async (idUser:string) => {

    //console.log(idUser)

    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((pillList) => {
        //console.log(pillList)

        //console.log(pillList.size);

        if(pillList.size > 0){
            const pillTab:any[] = []
            pillList.forEach((pill) => {
                pillTab.push(pill.data()) 
                //console.log(pill.data().dateTime.toDate())
            })
    
            let pillLast = pillTab[0]
            let dateLast = pillTab[0].dateTime
            pillTab.forEach((pill) => {
                if(isMoreRecent(dateLast.toDate(), pill.dateTime.toDate())){
                    //console.log("is ok")
                    pillLast = pill
                    dateLast = pill.dateTime
                }
            })
    
            //console.log(dateLast.toDate())
    
            return pillLast
        } else {
            return null
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function getUserPillWeekByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const getUserPillWeekByIdUserFireStore = async (idUser:string) => {
   
    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((cigList) => {
        if(cigList.size > 0){

            const cigTab:any[] = []
            cigList.forEach((cig) => {
                cigTab.push(cig.data()) 
            })

            const cigTabWeek:any[] = []

            const cigWeek = {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
            }
            
            cigTab.forEach((cig) => {
                if(isThisWeek(cig.dateTime.toDate())){
                    //console.log(cig.dateTime.toDate())
                    cigTabWeek.push(cig)

                    switch( getDayDate(cig.dateTime.toDate()) ) { 
                        case 1: { 
                            //console.log("Lundi")
                            cigWeek.monday += 1
                            break; 
                        } 
                        case 2: { 
                            //console.log("Mardi")
                            cigWeek.tuesday += 1
                            break; 
                        } 
                        case 3: { 
                            //console.log("Mercredi")
                            cigWeek.wednesday += 1
                            break; 
                        } 
                        case 4: { 
                            //console.log("Jeudi")
                            cigWeek.thursday += 1
                            break; 
                        } 
                        case 5: { 
                            //console.log("Vendredi")
                            cigWeek.friday += 1
                            break; 
                        } 
                        case 6: { 
                            //console.log("Samedi")
                            cigWeek.saturday += 1
                            break; 
                        } 
                        case 7: { 
                            //console.log("Dimanche")
                            cigWeek.sunday += 1
                            break; 
                        } 
                    } 

                }
            })

            //console.log("size "+cigTabWeek.length)
            
            return cigWeek
        } else {
            return null
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function getUserPillMounthByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const getUserPillMounthByIdUserFireStore = async (idUser:string) => {
   
    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((cigList) => {
        if(cigList.size > 0){

            const cigTab:any[] = []
            cigList.forEach((cig) => {
                cigTab.push(cig.data()) 
            })

            const cigTabWeek:any[] = []
            const cigMounth = {
                m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0,
                m11: 0, m12: 0, m13: 0, m14: 0, m15: 0, m16: 0, m17: 0, m18: 0, m19: 0, m20: 0,
                m21: 0, m22: 0, m23: 0, m24: 0, m25: 0, m26: 0, m27: 0, m28: 0, m29: 0, m30: 0,
                m31: 0,
            }
            
            cigTab.forEach((cig) => {
                if(isThisWeek(cig.dateTime.toDate())){
                    //console.log(cig.dateTime.toDate())
                    cigTabWeek.push(cig)

                    switch( getMounthDayDate(cig.dateTime.toDate()) ) { 
                        case 1: { cigMounth.m1 += 1; break; } 
                        case 2: { cigMounth.m2 += 1; break; } 
                        case 3: { cigMounth.m3 += 1; break; } 
                        case 4: { cigMounth.m4 += 1; break; } 
                        case 5: { cigMounth.m5 += 1; break; } 
                        case 6: { cigMounth.m6 += 1; break; } 
                        case 7: { cigMounth.m7 += 1; break; } 
                        case 8: { cigMounth.m8 += 1; break; } 
                        case 9: { cigMounth.m9 += 1; break; } 
                        case 10: { cigMounth.m10 += 1; break; }

                        case 11: { cigMounth.m11 += 1; break; } 
                        case 12: { cigMounth.m12 += 1; break; } 
                        case 13: { cigMounth.m13 += 1; break; } 
                        case 14: { cigMounth.m14 += 1; break; } 
                        case 15: { cigMounth.m15 += 1; break; } 
                        case 16: { cigMounth.m16 += 1; break; } 
                        case 17: { cigMounth.m17 += 1; break; } 
                        case 18: { cigMounth.m18 += 1; break; } 
                        case 19: { cigMounth.m19 += 1; break; } 
                        case 20: { cigMounth.m20 += 1; break; } 

                        case 21: { cigMounth.m21 += 1; break; } 
                        case 22: { cigMounth.m22 += 1; break; } 
                        case 23: { cigMounth.m23 += 1; break; } 
                        case 24: { cigMounth.m24 += 1; break; } 
                        case 25: { cigMounth.m25 += 1; break; } 
                        case 26: { cigMounth.m26 += 1; break; } 
                        case 27: { cigMounth.m27 += 1; break; } 
                        case 28: { cigMounth.m28 += 1; break; } 
                        case 29: { cigMounth.m29 += 1; break; } 
                        case 30: { cigMounth.m30 += 1; break; } 

                        case 31: { cigMounth.m31 += 1; break; } 
                    } 

                }
            })

            //console.log("size "+cigTabWeek.length)
            
            return cigMounth
        } else {
            return null
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function getUserPillYearsByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const getUserPillYearsByIdUserFireStore = async (idUser:string) => {
   
    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((cigList) => {
        if(cigList.size > 0){

            const cigTab:any[] = []
            cigList.forEach((cig) => {
                cigTab.push(cig.data()) 
            })

            const cigTabWeek:any[] = []
            const cigMounth = {
                m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0
            }
            
            cigTab.forEach((cig) => {
                if(isThisWeek(cig.dateTime.toDate())){
                    //console.log(cig.dateTime.toDate())
                    cigTabWeek.push(cig)

                    switch( getMounthDate(cig.dateTime.toDate()) ) { 
                        case 0: { cigMounth.m1 += 1; break; } 
                        case 1: { cigMounth.m2 += 1; break; } 
                        case 2: { cigMounth.m3 += 1; break; } 
                        case 3: { cigMounth.m4 += 1; break; } 
                        case 4: { cigMounth.m5 += 1; break; } 
                        case 5: { cigMounth.m6 += 1; break; } 
                        case 6: { cigMounth.m7 += 1; break; } 
                        case 7: { cigMounth.m8 += 1; break; } 
                        case 8: { cigMounth.m9 += 1; break; } 
                        case 9: { cigMounth.m10 += 1; break; }

                        case 10: { cigMounth.m11 += 1; break; } 
                        case 11: { cigMounth.m12 += 1; break; } 
                    } 

                }
            })

            //console.log("size "+cigTabWeek.length)
            
            return cigMounth
        } else {
            return null
        }
    }).catch((error) => {
        throw Error(error.message)
    })
}

/**
 * Function delUserPillByIdUserFireStore
 * @param idUser 
 * @returns 
 */
export const delUserPillByIdUserFireStore = async (idUser: string): Promise<boolean> => {

    //console.log(idUser)
    const q = query(
        collection(db, "userPills"), 
        where("idUser", "==", idUser)
    );

    return await getDocs(q).then((userPillList) => {

        userPillList.forEach((userPill) => {
            delUserPillByIdFireStore(userPill.id)
        })

        return true
        
    }).catch((error: any) => {
        throw Error(error.message)
    })
}

/**
 * Function delUserPillByIdFireStore
 * @param id 
 * @returns 
 */
export const delUserPillByIdFireStore = async (id: string): Promise<boolean> => {

    const userDoc = doc(db, "userPills", id)

    return await deleteDoc(userDoc).then(() => {
        return true
    }).catch((error) => {
        //console.error(error.message)
        throw Error(error.message)
    }) 
}