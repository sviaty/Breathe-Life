import Moment from 'moment'
// https://momentjs.com/docs/

/**
 * Function getAgeUser
 * @param dateOfBirth 
 * @returns 
 */
export const getAgeUser = (dateOfBirth:any) => {
    if(dateOfBirth != ""){
        dateOfBirth = dateOfBirth.toDate()
        //console.log(dateOfBirth)
        if(dateOfBirth != null){
            const dateBirth = Moment(new Date(dateOfBirth))
            //console.log(dateBirth)
            const dateNow = Moment(new Date())
            //console.log(dateNow)
            const years = dateNow.diff(dateBirth, 'years')
            return years
        } else {
            return ""
        }
    }
}

/**
 * Function getDifference2DateSeconds
 * @param dateLast 
 * @returns 
 */
export const getDifference2DateSeconds = (dateLast:Date) => {
    //console.log(dateOfBirth)
    if(dateLast != null){
        const mDateLast = Moment(new Date(dateLast))
        //console.log(mDateLast)
        const mDateNow = Moment(new Date())
        //console.log(mDateNow)
        const seconde = mDateNow.diff(mDateLast, 'seconds')
        //console.log(seconde)
        
        return seconde
    } else {
        return 0
    }
}

/**
 * Function getDifference2Date
 * @param dateLast 
 * @returns 
 */
export const getDifference2Date = (dateLast:Date) => {
    //console.log(dateOfBirth)
    if(dateLast != null){
        const mDateLast = Moment(new Date(dateLast))
        //console.log(mDateLast)
        const mDateNow = Moment(new Date())
        //console.log(mDateNow)
        const seconde = mDateNow.diff(mDateLast, 'seconds')
        //console.log(seconde)

        const formatted = Moment.utc(seconde*1000).format('HH:mm:ss');
        //console.log(formatted)
        
        return formatted
    } else {
        return ""
    }
}

/**
 * Function isThisWeek 
 * @param dateLast 
 * @returns 
 */
export const isThisWeek = (dateLast:Date): boolean => {
    //console.log(dateOfBirth)
    return Moment(dateLast).isSame(new Date(), 'week');
}

/**
 * Function getDayDate
 * @param dateLast 
 * @returns 
 */
export const getDayDate = (dateLast:Date): number => {
    //console.log(moment(dateLast).weekday())
    return Moment(dateLast).weekday();
}

/**
 * Function getMounthDayDate
 * @param dateLast 
 * @returns 
 */
export const getMounthDayDate = (dateLast:Date): number => {
    //console.log("day "+ moment(dateLast).date())
    return Moment(dateLast).date();
}

/**
 * Function getMounthDate
 * @param dateLast 
 * @returns 
 */
export const getMounthDate = (dateLast:Date): number => {
    //console.log("mouth "+ moment(dateLast).month())
    return Moment(dateLast).month();
}

/**
 * Function isMoreRecent
 * @param dateA 
 * @param dateB 
 * @returns 
 */
export const isMoreRecent = (dateA:Date, dateB:Date): boolean => {
    //console.log("mouth "+ moment(dateLast).month())
    return (Moment(dateA) < Moment(dateB))
}