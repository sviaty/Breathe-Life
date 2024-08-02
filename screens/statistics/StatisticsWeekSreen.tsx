import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

// Components
import LoaderComponent from '../../components/LoaderComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, getDocs, and, orderBy} from "firebase/firestore";
const db = getFirestore(firebaseConfig);

const StatisticsWeekSreen = () => {

    const isFocused = useIsFocused();

    // UseState
    let [countPatch, setCountPatch] = useState<number>(0);
    let [countPill, setCountPill] = useState<number>(0);
    let [countCigarette, setCountCigarette] = useState<number>(0);

    const [isLoadCountPatch, setIsLoadCountPatch] = useState<boolean>(true);
    const [isLoadCountPill, setIsLoadCountPill] = useState<boolean>(true);
    const [isLoadCountCigarette, setIsLoadCountCigarette] = useState<boolean>(true);

    const [dataCigaretteTab, setDataCigaretteTab] = useState<Cigarette[]>([]);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {
        getStatPatchDayInDatabase()
        getStatPillDayInDatabase()
        getStatCigaretteDayInDatabase()
    }, [isFocused])  

    /**
     * Function getPatchInDatabase
     */
     const getStatPatchDayInDatabase = async () => {

        setCountPatch(0)
        setIsLoadCountPatch(true)

        try {
            const q = query(
                collection(db, "userPatchs"), 
                where("idUser", "==", userSelector.userId),
            );

            const userPatchList = await getDocs(q);
            //console.log("patch size "+userPatchList.size);
    
            if(userPatchList.size != 0){

                let i = 0
                userPatchList.forEach((userPatch) => {
                    //console.log(userPatch.id, " => ", userPatch.data());
                    const patchData = userPatch.data()

                    const patchDate = getWeekNumber(patchData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())
                    
                    if(patchDate == currentDate) {

                        i+=1
                        
                        //const p = new Cigarette(cigarette.id, cigaretteData.cigaretteName, cigaretteData.cigaretteNicotine, cigaretteData.cigaretteGoudron, cigaretteData.cigaretteCarbone, cigaretteData.cigarettePrice, cigaretteData.isSelected);
                        //console.log(p);
    
                        //dataCigaretteTab.push(p)
                        //setDataCigaretteTab([...dataCigaretteTab])
                    }
                })

                setCountPatch(i)
                setIsLoadCountPatch(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountPatch(0)
                setIsLoadCountPatch(false)
            }

        } catch (error) {
            console.error("Error get user patchs in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function getStatPillDayInDatabase
     */
    const getStatPillDayInDatabase = async () => {

        setCountPill(0)
        setIsLoadCountPill(true)

        try {
            const q = query(
                collection(db, "userPills"), 
                where("idUser", "==", userSelector.userId),
            );

            const userPillList = await getDocs(q);
            //console.log(cigaretteList);
    
            if(userPillList.size != 0){

                let i = 0
                userPillList.forEach((userPill) => {
                    //console.log(userPill.id, " => ", userPill.data());
                    const pillData = userPill.data()

                    const pillDate = getWeekNumber(pillData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())

                    if(pillDate == currentDate) {

                        i+=1
                        
                        //const p = new Cigarette(cigarette.id, cigaretteData.cigaretteName, cigaretteData.cigaretteNicotine, cigaretteData.cigaretteGoudron, cigaretteData.cigaretteCarbone, cigaretteData.cigarettePrice, cigaretteData.isSelected);
                        //console.log(p);
    
                        //dataCigaretteTab.push(p)
                        //setDataCigaretteTab([...dataCigaretteTab])
                    }
                })

                setCountPill(i)
                setIsLoadCountPill(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountPill(0)
                setIsLoadCountPill(false)
            }

        } catch (error) {
            console.error("Error get user pills in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function getCigaretteInDatabase
     */
    const getStatCigaretteDayInDatabase = async () => {

        setCountCigarette(0)
        setIsLoadCountCigarette(true)

        dataCigaretteTab.length = 0
        setDataCigaretteTab([...dataCigaretteTab])

        try {
            const q = query(
                collection(db, "userCigarettes"), 
                where("idUser", "==", userSelector.userId),
            );

            const userCigaretteList = await getDocs(q);
            //console.log(cigaretteList);
    
            if(userCigaretteList.size != 0){

                let i = 0
                userCigaretteList.forEach((userCigarette) => {
                    //console.log(cigarette.id, " => ", cigarette.data());
                    const cigaretteData = userCigarette.data()

                    const cigaretteDate = getWeekNumber(cigaretteData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())

                    if(cigaretteDate == currentDate){
                        
                        i += 1
                        //const p = new Cigarette(cigarette.id, cigaretteData.cigaretteName, cigaretteData.cigaretteNicotine, cigaretteData.cigaretteGoudron, cigaretteData.cigaretteCarbone, cigaretteData.cigarettePrice, cigaretteData.isSelected);
                        //console.log(p);
    
                        //dataCigaretteTab.push(p)
                        //setDataCigaretteTab([...dataCigaretteTab])
                    }
                });

                setCountCigarette(i)
                setIsLoadCountCigarette(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountCigarette(0)
                setIsLoadCountCigarette(false)

                dataCigaretteTab.length = 0
                setDataCigaretteTab([...dataCigaretteTab])
            }

        } catch (error) {
            console.error("Error get user cigarettes in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function getWeekNumber
     * @param date 
     * @returns 
     */
    const getWeekNumber = (date: Date): number => {
        // Copying date so the original date won't be modified
        const tempDate = new Date(date.valueOf());
    
        // ISO week date weeks start on Monday, so correct the day number
        const dayNum = (date.getDay() + 6) % 7;
    
        // Set the target to the nearest Thursday (current date + 4 - current day number)
        tempDate.setDate(tempDate.getDate() - dayNum + 3);
    
        // ISO 8601 week number of the year for this date
        const firstThursday = tempDate.valueOf();
    
        // Set the target to the first day of the year
        // First set the target to January 1st
        tempDate.setMonth(0, 1);
    
        // If this is not a Thursday, set the target to the next Thursday
        if (tempDate.getDay() !== 4) {
            tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
        }
    
        // The weeknumber is the number of weeks between the first Thursday of the year
        // and the Thursday in the target week
        return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
    }

    return (
    <SafeAreaProvider>

        <View style={AppStyle.container}>
        <LinearGradient
            colors={[Colors.colorOrange, Colors.colorOrange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

            <View style={AppStyle.statsNumberContainer}>

                <View style={AppStyle.statsNumberItemContainer}>
                    <View style={AppStyle.statsNumberItem2Container}>
                        <Text style={AppStyle.statItemTitle}> Patchs </Text>
                        {isLoadCountPatch == true ? 
                        <LoaderComponent text="" step="" color={Colors.blueFb} size={'small'}/>
                        : 
                        <Text style={AppStyle.statItemNumber}> {countPatch} </Text>
                        }
                    </View>
                </View>

                <View style={AppStyle.statsNumberItemContainer}>
                    <View style={AppStyle.statsNumberItem2Container}>
                        <Text style={AppStyle.statItemTitle}> Pastilles </Text>
                        {isLoadCountPill == true ? 
                        <LoaderComponent text="" step="" color={Colors.blueFb} size={'small'}/>
                        : 
                        <Text style={AppStyle.statItemNumber}> {countPill} </Text>
                        }
                    </View>
                </View>

                <View style={AppStyle.statsNumberItemContainer}>
                    <View style={AppStyle.statsNumberItem2Container}>
                        <Text style={AppStyle.statItemTitle}> Cigarettes </Text>
                        {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.blueFb} size={'small'}/>
                        : 
                        <Text style={AppStyle.statItemNumber}> {countCigarette} </Text>
                        }
                    </View>
                </View>

            </View>

        </LinearGradient>
        </View>
    </SafeAreaProvider>
  )
}

export default StatisticsWeekSreen

const styles = StyleSheet.create({})