import Moment from 'moment'
// https://momentjs.com/docs/

/**
 * Function parseStringToDate
 */
export const parseStringToDate = (dateString: string): Date => {
    return Moment(dateString, "DD-MM-YYYY").toDate();
}

/**
 * Function parseDateToString
 * @param dateDate 
 * @returns 
 */
export const parseDateToString = (dateDate: Date): string => {
    return Moment(dateDate).format("DD-MM-YYYY");
}


/**
 * Function getAgeUser
 * @param dateOfBirth 
 * @returns 
 */
export const getAgeUser = (dateOfBirth:string) => {
    if(dateOfBirth != ""){
        //console.log(dateOfBirth)
        if(dateOfBirth != null){
            const dateBirth = Moment(parseStringToDate(dateOfBirth))
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
 * getDifference2DateHour
 * @param dateLast 
 * @returns 
 */
export const getDifference2DateHour = (dateLast:Date) => {
    //console.log(dateOfBirth)
    if(dateLast != null){
        const mDateLast = Moment(new Date(dateLast))
        //console.log(mDateLast)
        const mDateNow = Moment(new Date())
        //console.log(mDateNow)
        const hours = mDateNow.diff(mDateLast, 'hours')
        //console.log(seconde)
        
        return hours
    } else {
        return 0
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