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

const StatisticsMounthSreen = () => {

    const isFocused = useIsFocused();

    // UseState
    let [countPatch, setCountPatch] = useState<number>(0);
    let [countPill, setCountPill] = useState<number>(0);
    let [countCigarette, setCountCigarette] = useState<number>(0);

    let [countNicotine, setCountNicotine] = useState<number>(0);
    let [countGoudron, setCountGoudron] = useState<number>(0);
    let [countCarbonne, setCountCarbonne] = useState<number>(0);
    let [countPriceDepense, setCountPriceDepense] = useState<number>(0);
    let [countPriceEconomy, setCountPriceEconomy] = useState<number>(0);

    let [userSmokePrice, setUserSmokePrice] = useState<number>(0);

    const [isLoadCountPatch, setIsLoadCountPatch] = useState<boolean>(true);
    const [isLoadCountPill, setIsLoadCountPill] = useState<boolean>(true);
    const [isLoadCountCigarette, setIsLoadCountCigarette] = useState<boolean>(true);

    const [isLoadCountPatchDetails, setIsLoadCountPatchDetails] = useState<boolean>(true);
    const [isLoadCountPillDetails, setIsLoadCountPillDetails] = useState<boolean>(true);
    const [isLoadCountCigaretteDetails, setIsLoadCountCigaretteDetails] = useState<boolean>(true);
    const [isLoadCountPriceEconomy, setIsLoadCountPriceEconomy] = useState<boolean>(true);

    const [dataCigaretteTab, setDataCigaretteTab] = useState<Cigarette[]>([]);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {

        countNicotine = 0
        setCountNicotine(countNicotine)

        countGoudron = 0
        setCountGoudron(countGoudron)

        countCarbonne = 0
        setCountCarbonne(countCarbonne)

        countPriceDepense = 0
        setCountPriceDepense(countPriceDepense)

        userSmokePrice = ((userSelector.userSmokeAvgNbr * 0.65) * 31) 
        setUserSmokePrice(userSmokePrice)
        setCountPriceEconomy(userSmokePrice)
        //console.log(userSmokePrice)

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

                    const patchDateMounth = patchData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const patchDateYear = patchData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(patchDateMounth == currentDateMount && patchDateYear == currentDateYear){

                        i+=1
                        
                        getStatPatchInDatabase(patchData.idPatch)
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
     * Function getStatPatchInDatabase
     */
    const getStatPatchInDatabase = async (idPatch: string) => {
        //console.log(idPatch);
        setIsLoadCountPatchDetails(true)

        try {
            const q = query(
                collection(db, "patchs"), 
                //where("idUser", "==", userSelector.userId),
            );

            const patchList = await getDocs(q);
            //console.log(patchList.size);
    
            if(patchList.size != 0){
                patchList.forEach((patch) => {
                    if(idPatch == patch.id){
                        //console.log(patch.id);
                        const dataPatch = patch.data()
                        //console.log(dataPatch)

                        //console.log(countNicotine)
                        countNicotine = countNicotine + parseInt(dataPatch.patchNicotine)

                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)
                    }
                })
                setIsLoadCountPatchDetails(false)
            } else {
                setIsLoadCountPatchDetails(false)
            }
        } catch (error) {
            console.error("Error get patchs in firestore database : ")
            console.error(error)

            setIsLoadCountPatchDetails(false)
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

                    const pillDateMounth = pillData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const pillDateYear = pillData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(pillDateMounth == currentDateMount && pillDateYear == currentDateYear){

                        i+=1
                        
                        getStatPillInDatabase(pillData.idPill)
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
     * Function getStatPillInDatabase
     */
    const getStatPillInDatabase = async (idPill: string) => {
        //console.log(idPill);

        setIsLoadCountPillDetails(true)

        try {
            const q = query(
                collection(db, "pills"), 
            );

            const pillList = await getDocs(q);
            //console.log(patchList.size);
    
            if(pillList.size != 0){
                pillList.forEach((pill) => {
                    if(idPill == pill.id){
                        //console.log(patch.id);
                        const dataPill = pill.data()
                        //console.log(dataPill)

                        //console.log(countNicotine)
                        countNicotine = countNicotine + parseFloat(dataPill.pillNicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)
                    }
                })
                setIsLoadCountPillDetails(false)
            } else {
                setIsLoadCountPillDetails(false)
            }
        } catch (error) {
            console.error("Error get patchs in firestore database : ")
            console.error(error)

            setIsLoadCountPillDetails(false)
        }
    }

    /**
     * Function getCigaretteInDatabase
     */
    const getStatCigaretteDayInDatabase = async () => {

        setCountCigarette(0)
        setIsLoadCountCigarette(true)
        setIsLoadCountPriceEconomy(true)

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

                    const cigaretteDateMounth = cigaretteData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const cigaretteDateYear = cigaretteData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(cigaretteDateMounth == currentDateMount && cigaretteDateYear == currentDateYear){
                        
                        i += 1
                        
                        getStatCigaretteInDatabase(cigaretteData.idCigarette)
                        getStatCigaretteUserInDatabase(cigaretteData.idCigarette)

                    }
                });

                if(i == 0){
                    setIsLoadCountCigaretteDetails(false)
                }

                setIsLoadCountPriceEconomy(false)
                setCountCigarette(i)
                setIsLoadCountCigarette(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountCigarette(0)
                setIsLoadCountCigarette(false)
            }

        } catch (error) {
            console.error("Error get user cigarettes in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function getStatCigaretteInDatabase
     */
    const getStatCigaretteInDatabase = async (idCigarette: string) => {
        //console.log(idCigarette);

        setIsLoadCountCigaretteDetails(true)

        try {
            const q = query(
                collection(db, "cigarettes"), 
            );

            const cigaretteList = await getDocs(q);
            //console.log(patchList.size);
    
            if(cigaretteList.size != 0){
                cigaretteList.forEach((cigarette) => {
                    if(idCigarette == cigarette.id){
                        //console.log(patch.id);
                        const dataCigarette = cigarette.data()
                        //console.log(dataCigarette)

                        const c = new Cigarette(
                            cigarette.id, 
                            dataCigarette.cigaretteName,
                            dataCigarette.cigaretteNicotine,
                            dataCigarette.cigaretteGoudron,
                            dataCigarette.cigaretteCarbone,
                            dataCigarette.cigarettePrice,
                            dataCigarette.cigaretteNbr,
                            dataCigarette.cigarettePriceUnit
                        )
                        
                        dataCigaretteTab.push(c)
                        setDataCigaretteTab([...dataCigaretteTab])

                        countPriceDepense = parseFloat((countPriceDepense + dataCigarette.cigarettePriceUnit).toFixed(2))
                        setCountPriceDepense(countPriceDepense)

                        countPriceEconomy = parseFloat((userSmokePrice - countPriceDepense).toFixed(2))
                        if(countPriceEconomy < 0){
                            setCountPriceEconomy(0)
                        } else {
                            setCountPriceEconomy(countPriceEconomy)
                        }

                        //console.log(countNicotine)
                        countNicotine = countNicotine + parseFloat(dataCigarette.cigaretteNicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)  

                        countGoudron = countGoudron + parseFloat(dataCigarette.cigaretteGoudron)
                        setCountGoudron(countGoudron)

                        countCarbonne = countCarbonne + parseFloat(dataCigarette.cigaretteCarbone)
                        setCountCarbonne(countCarbonne)

                    }
                })

                setIsLoadCountCigaretteDetails(false)
            } else {
                setIsLoadCountCigaretteDetails(false)
            }
        } catch (error) {
            console.error("Error get patchs in firestore database : ")
            console.error(error)

            setIsLoadCountCigaretteDetails(false)
        }
    }

    /**
     * Function getStatCigaretteInDatabase
     */
    const getStatCigaretteUserInDatabase = async (idCigarette: string) => {
        //console.log(idCigarette);

        setIsLoadCountCigaretteDetails(true)

        try {
            const q = query(
                collection(db, "cigarettesUser"), 
            );

            const cigaretteList = await getDocs(q);
            //console.log(patchList.size);
    
            if(cigaretteList.size != 0){
                cigaretteList.forEach((cigarette) => {
                    if(idCigarette == cigarette.id){
                        //console.log(patch.id);
                        const dataCigarette = cigarette.data()
                        //console.log(dataCigarette)

                        const c = new Cigarette(
                            cigarette.id, 
                            dataCigarette.cigaretteName,
                            dataCigarette.cigaretteNicotine,
                            dataCigarette.cigaretteGoudron,
                            dataCigarette.cigaretteCarbone,
                            dataCigarette.cigarettePrice,
                            dataCigarette.cigaretteNbr,
                            dataCigarette.cigarettePriceUnit
                        )
                        
                        dataCigaretteTab.push(c)
                        setDataCigaretteTab([...dataCigaretteTab])

                        countPriceDepense = parseFloat((countPriceDepense + dataCigarette.cigarettePriceUnit).toFixed(2))
                        setCountPriceDepense(countPriceDepense)

                        countPriceEconomy = parseFloat((userSmokePrice - countPriceDepense).toFixed(2))
                        if(countPriceEconomy < 0){
                            setCountPriceEconomy(0)
                        } else {
                            setCountPriceEconomy(countPriceEconomy)
                        }

                        //console.log(countNicotine)
                        countNicotine = countNicotine + parseFloat(dataCigarette.cigaretteNicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)  

                        countGoudron = countGoudron + parseFloat(dataCigarette.cigaretteGoudron)
                        setCountGoudron(countGoudron)

                        countCarbonne = countCarbonne + parseFloat(dataCigarette.cigaretteCarbone)
                        setCountCarbonne(countCarbonne)

                    }
                })

                setIsLoadCountCigaretteDetails(false)
            } else {
                setIsLoadCountCigaretteDetails(false)
            }
        } catch (error) {
            console.error("Error get patchs in firestore database : ")
            console.error(error)

            setIsLoadCountCigaretteDetails(false)
        }
    }


    return (
    <SafeAreaProvider style={AppStyle.container}>

        <View style={styles.statContainer}>

            <View style={styles.statDispositifNicotine}>

                <View style={styles.statDispositifNicotineItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Patchs </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPatch == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPatch} </Text>
                        }
                    </View>
                </View>

                <View style={styles.statDepenseItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Cigarettes </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countCigarette} </Text>
                        }
                    </View>
                </View>

                <View style={styles.statDispositifNicotineItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Pastilles </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPill == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPill} </Text>
                        }
                    </View>
                </View>

            </View>

            <View style={styles.statDispositifNicotine}>
                <View style={styles.statCigaretteItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Nicotine </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                    { isLoadCountPatchDetails == true && isLoadCountPillDetails == true && isLoadCountCigaretteDetails == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.statDispositifNicotineCount}> {Math.round(countNicotine * 100) / 100} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        }
                    </View>
                </View>

                <View style={styles.statCigaretteItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Goudron </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                    { isLoadCountPatchDetails == true && isLoadCountPillDetails == true && isLoadCountCigaretteDetails == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                        <Text style={styles.statDispositifNicotineCount}> {countGoudron} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        }
                    </View>
                </View>

                <View style={styles.statCigaretteItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Carbone </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                    { isLoadCountPatchDetails == true && isLoadCountPillDetails == true && isLoadCountCigaretteDetails == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.statDispositifNicotineCount}> {countCarbonne} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        
                        }
                    </View>
                </View>
            </View>

            <View style={styles.statDispositifNicotine}>

                <View style={styles.statDepenseItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Dépense </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPriceDepense} € </Text>
                        }
                    </View>
                </View>

                <View style={styles.statEconomyItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Economie </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPriceEconomy} € </Text>
                        }
                    </View>
                </View>

            </View>

        </View>

    </SafeAreaProvider>
  )
}

export default StatisticsMounthSreen

const styles = StyleSheet.create({
    statContainer: {
        margin:5
    },

    statDispositifNicotine: {
        flexDirection: "row"
    },

    statCigaretteItem: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        height: 120,
        borderRadius: 10,
        margin:8
    },

    statDispositifNicotineItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.blueFb,
    
        borderRadius: 10,
        margin:8
    },

    statDepenseItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.red,
    
        borderRadius: 10,
        margin:8
    },

    statEconomyItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.green,
    
        borderRadius: 10,
        margin:8
    },

    statDispositifNicotineTitle: {
        color: Colors.white,
        textAlign:'center',
        fontSize: 20,
        paddingTop: 10,
    },

    statDispositifNicotineContenair: {
        flex:1,
        justifyContent: 'center',
    },

    statDispositifNicotineCount: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 35,
    },

    statUnitCount: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 12,
    }
})