import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

var moment = require('moment');

export const getAgeUser = (dateOfBirth:any) => {
    dateOfBirth = dateOfBirth.toDate()
    //console.log(dateOfBirth)
    if(dateOfBirth != null){
        const dateBirth = moment(new Date(dateOfBirth))
        //console.log(dateBirth)
        const dateNow = moment(new Date())
        //console.log(dateNow)
        const years = dateNow.diff(dateBirth, 'years')
        return years
    } else {
        return 0
    }
   
}

const DateHelper = () => {
  
}

export default DateHelper

const styles = StyleSheet.create({})