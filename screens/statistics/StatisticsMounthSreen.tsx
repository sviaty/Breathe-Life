import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Surface } from "@react-native-material/core";
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

import { getUserPatchsByIdUserFireStore } from '../../api/UserPatchsApi';
import { getPatchByIdPatchFireStore } from '../../api/PatchApi';
import { getPillByIdPillFireStore } from '../../api/PillApi';
import { getUserPillsByIdUserFireStore } from '../../api/UserPillsApi';
import { getUserCigarettesByIdUserFireStore } from '../../api/UserCigarettesApi';
import { getCigaretteByIdCigFireStore } from '../../api/CigaretteApi';
import { getCigaretteUserByIdCigFireStore } from '../../api/CigaretteUserApi';

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

        getUserPatchsByIdUserFireStore(userSelector.userId).then((userPatchList) => {
            
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
            
        }).catch((error) => {
            console.log("Error get user patchs in firestore database : ")
            console.error(error.message)
        })
    }

    /**
     * Function getStatPatchInDatabase
     */
    const getStatPatchInDatabase = async (idPatch: string) => {
        //console.log(idPatch);
        setIsLoadCountPatchDetails(true)

        getPatchByIdPatchFireStore(idPatch).then((patch) => {
            const dataPatch = patch.data()
            //console.log(dataPatch)

            countNicotine = countNicotine + parseInt(dataPatch.patchNicotine)
            setCountNicotine(countNicotine)
            //console.log(countNicotine)

            setIsLoadCountPatchDetails(false)

        }).catch((error) => {
            setIsLoadCountPatchDetails(false)
            console.log("Error get patch in firestore database : ")
            console.error(error.message)
        }) 
    }

    /**
     * Function getStatPillDayInDatabase
     */
    const getStatPillDayInDatabase = async () => {

        setCountPill(0)
        setIsLoadCountPill(true)

        getUserPillsByIdUserFireStore(userSelector.userId).then((userPillList) => {

            if(userPillList.size != 0){

                let i = 0
                userPillList.forEach((userPill) => {
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

        }).catch((error) => {
            console.log("Error get user pills in firestore database")
            console.error(error.message)
        })

    }

    /**
     * Function getStatPillInDatabase
     */
    const getStatPillInDatabase = async (idPill: string) => {
       //console.log(idPill);
       setIsLoadCountPillDetails(true)

       getPillByIdPillFireStore(idPill).then((pill) => {
           const dataPill = pill.data()
           //console.log(dataPatch)

           countNicotine = countNicotine + parseFloat(dataPill.pillNicotine)
           setCountNicotine(countNicotine)
           //console.log(countNicotine)

           setIsLoadCountPillDetails(false)

       }).catch((error) => {
           setIsLoadCountPillDetails(false)
           console.log("Error get pill in firestore database")
           console.error(error.message)
       }) 
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

     
        getUserCigarettesByIdUserFireStore(userSelector.userId).then((userCigaretteList) => {

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
                console.log('cigaretteList size = 0');
                setCountCigarette(0)
                setIsLoadCountCigarette(false)
                setIsLoadCountPriceEconomy(false)

                setIsLoadCountCigaretteDetails(false)
                
                dataCigaretteTab.length = 0
                setDataCigaretteTab([...dataCigaretteTab])
            }

        }).catch((error) => {
            console.log("Error get user pills in firestore database")
            console.error(error.message)
        })

    }

    /**
     * Function getStatCigaretteInDatabase
     */
    const getStatCigaretteInDatabase = async (idCigarette: string) => {
        //console.log(idCigarette);

        setIsLoadCountCigaretteDetails(true)

        getCigaretteByIdCigFireStore(idCigarette).then((cigarette) => {
            if (cigarette.exists()) {
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
                
                countNicotine = countNicotine + parseFloat(dataCigarette.cigaretteNicotine)
                setCountNicotine(countNicotine)
                //console.log(countNicotine)  

                countGoudron = countGoudron + parseFloat(dataCigarette.cigaretteGoudron)
                setCountGoudron(countGoudron)

                countCarbonne = countCarbonne + parseFloat(dataCigarette.cigaretteCarbone)
                setCountCarbonne(countCarbonne)

                setIsLoadCountCigaretteDetails(false)
            }
 
        }).catch((error) => {
            setIsLoadCountCigaretteDetails(false)
            console.log("Error get pill in firestore database : ")
            console.error(error.message)
        }) 
    }

    /**
     * Function getStatCigaretteInDatabase
     */
    const getStatCigaretteUserInDatabase = async (idCigarette: string) => {
       //console.log(idCigarette);
       setIsLoadCountCigaretteDetails(true)

       getCigaretteUserByIdCigFireStore(idCigarette).then((cigarette) => {
           if (cigarette.exists()) {
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
               
               countNicotine = countNicotine + parseFloat(dataCigarette.cigaretteNicotine)
               setCountNicotine(countNicotine)
               //console.log(countNicotine)  

               countGoudron = countGoudron + parseFloat(dataCigarette.cigaretteGoudron)
               setCountGoudron(countGoudron)

               countCarbonne = countCarbonne + parseFloat(dataCigarette.cigaretteCarbone)
               setCountCarbonne(countCarbonne)

               setIsLoadCountCigaretteDetails(false)
           }

       }).catch((error) => {
           setIsLoadCountCigaretteDetails(false)
           console.log("Error get pill in firestore database : ")
           console.error(error.message)
       }) 
    }


    return (
    <SafeAreaProvider style={AppStyle.container}>

        <View style={styles.statContainer}>

            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statDispositifNicotineItem}>
                        
                    <Text style={styles.statDispositifNicotineTitle}> Patchs </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPatch == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPatch} </Text>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statDepenseItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Cigarettes </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countCigarette} </Text>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statDispositifNicotineItem}>

                    <Text style={styles.statDispositifNicotineTitle}> Pastilles </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPill == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPill} </Text>
                        }
                    </View>
                </Surface>

            </View>

            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statCigaretteItem}>

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
                </Surface>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statCigaretteItem}>

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
                </Surface>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statCigaretteItem}>

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
                </Surface>
            </View>

            <View style={styles.statDispositifNicotine}>
                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statDepenseItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Dépense </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPriceDepense} € </Text>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={8}
                    category="medium"
                    style={styles.statEconomyItem}>
                    <Text style={styles.statDispositifNicotineTitle}> Economie </Text>
                    
                    <View style={styles.statDispositifNicotineContenair}>
                        {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.statDispositifNicotineCount}> {countPriceEconomy} € </Text>
                        }
                    </View>
                </Surface>

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
        fontWeight: 'bold',
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