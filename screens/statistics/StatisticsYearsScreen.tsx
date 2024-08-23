import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Surface } from "@react-native-material/core";
import { useIsFocused } from '@react-navigation/native';

// Styles & Colors
import Colors from '../../constants/ColorConstant';
import AppStyle from '../../styles/AppStyle';

// Components
import LoaderComponent from '../../components/LoaderComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// API
import { getUserPatchsByIdUserFireStore } from '../../api/UserPatchsApi';
import { getUserPillsByIdUserFireStore, getUserPillYearsByIdUserFireStore } from '../../api/UserPillsApi';
import { getUserCigarettesByIdUserFireStore, getUserCigaretteYearsByIdUserFireStore } from '../../api/UserCigarettesApi';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const StatisticsYearsScreen = () => {

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
    const [isLoadCountPriceEconomy, setIsLoadCountPriceEconomy] = useState<boolean>(true);

    const [isLoadCigChart, setIsLoadCigChart] = useState<boolean>(true);
    const [isLoadPillChart, setIsLoadPillChart] = useState<boolean>(true);

    const [dataCigaretteTab, setDataCigaretteTab] = useState<Cigarette[]>([]);

    const [dataCigaretteMounth, setDataCigaretteMounth] = useState<any>({
        m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0
    });

    const [dataPillMounth, setDataPillMounth] = useState<any>({
        m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0
    });

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

        userSmokePrice = (((userSelector.userSmokeAvgNbr * 0.65) * 31) * 12)
        setUserSmokePrice(userSmokePrice)
        setCountPriceEconomy(userSmokePrice)
        //console.log(userSmokePrice)

        getStatPatchDayInDatabase()
        getStatPillDayInDatabase()
        getStatCigaretteDayInDatabase()

        getStatCigaretteMounth()
        getStatPillMounth()

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

                    const patchDateYear = patchData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(patchDateYear == currentDateYear){
                        i+=1

                        countNicotine = countNicotine + parseInt(patchData.nicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)

                        //getStatPatchInDatabase(patchData.idPatch)
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

                    const pillDateYear = pillData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(pillDateYear == currentDateYear){

                        i+=1

                        countNicotine = countNicotine + parseFloat(pillData.nicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)

                        //getStatPillInDatabase(pillData.idPill)
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

                    const cigaretteDateYear = cigaretteData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(cigaretteDateYear == currentDateYear){
                        
                        i += 1

                        countNicotine = countNicotine + parseFloat(cigaretteData.nicotine)
                        setCountNicotine(countNicotine)
                        //console.log(countNicotine)  

                        countGoudron = countGoudron + parseFloat(cigaretteData.goudron)
                        setCountGoudron(countGoudron)

                        countCarbonne = countCarbonne + parseFloat(cigaretteData.carbone)
                        setCountCarbonne(countCarbonne)

                        countPriceDepense = countPriceDepense + (parseFloat(cigaretteData.price))
                        setCountPriceDepense(countPriceDepense)

                        countPriceEconomy = parseFloat((userSmokePrice - countPriceDepense).toFixed(2))
                        if(countPriceEconomy < 0){
                            setCountPriceEconomy(0)
                        } else {
                            setCountPriceEconomy(countPriceEconomy)
                        }

                        //getStatCigaretteInDatabase(cigaretteData.idCigarette)
                    }
                });

                setIsLoadCountPriceEconomy(false)

                setCountCigarette(i)

                setIsLoadCountCigarette(false)

            } else {
                setCountCigarette(0)
                setIsLoadCountCigarette(false)
                setIsLoadCountPriceEconomy(false)
                
                dataCigaretteTab.length = 0
                setDataCigaretteTab([...dataCigaretteTab])
            }

        }).catch((error) => {
            console.log("Error get user pills in firestore database")
            console.error(error.message)
        })

    }

    /**
     * Function getStatCigarette Week
     */
    const getStatCigaretteMounth = async () => {

        setIsLoadCigChart(true)

        getUserCigaretteYearsByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataCigaretteMounth({
                    m1: cigList.m1, m2: cigList.m2, m3: cigList.m3, m4: cigList.m4, m5: cigList.m5, m6: cigList.m6, m7: cigList.m7, m8: cigList.m8, m9: cigList.m9, m10: cigList.m10,m11: cigList.m11, m12: cigList.m12, 
                })

                setIsLoadCigChart(false)
            } else {
                setIsLoadCigChart(false)
            }
        }).catch((error) => {
            setIsLoadCigChart(false)
            console.log("Error getUserCigaretteWeekByIdUserFireStore")
            console.error(error.message)
        })
    }

    /**
     * Function getStatCigarette Week
     */
    const getStatPillMounth = async () => {

        setIsLoadPillChart(true)

        getUserPillYearsByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataPillMounth({
                    m1: cigList.m1, m2: cigList.m2, m3: cigList.m3, m4: cigList.m4, m5: cigList.m5, m6: cigList.m6, m7: cigList.m7, m8: cigList.m8, m9: cigList.m9, m10: cigList.m10,m11: cigList.m11, m12: cigList.m12, 
                })

                setIsLoadPillChart(false)
            } else {
                setIsLoadPillChart(false)
            }
        }).catch((error) => {
            setIsLoadPillChart(false)
            console.log("Error getUserCigaretteWeekByIdUserFireStore")
            console.error(error.message)
        })
    }

    const tab12m = [
        "Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Dec",
    ]

    return (
    <SafeAreaProvider style={AppStyle.container}>

        <GestureHandlerRootView>
        <ScrollView>
        <View style={styles.statContainer}>

            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceRed}>
                        
                    <View style={ styles.titleContainerRed }>
                        <Text style={ styles.titleText }>Cigarettes</Text>
                    </View>
                    
                    <View>
                        {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.descContenairViewText}> {countCigarette} </Text>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceRed}>
                        
                    <View style={ styles.titleContainerRed }>
                        <Text style={ styles.titleText }>Dépense</Text>
                    </View>
                    
                    <View>
                    {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText}> {countPriceDepense.toFixed(2)} € </Text>
                        </View>
                        }
                    </View>
                </Surface>

            </View>

            <View style={styles.statDispositifNicotine}>
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceBlue}>

<                   View style={ styles.titleContainerBlue }>
                        <Text style={ styles.titleText }> Cigarettes consommées </Text>
                    </View>

                    <View>

                    {isLoadCigChart == true ? 
                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                    : 
                    <LineChart
                        data={{
                            labels: tab12m,
                            datasets: [
                            {data: [
                                dataCigaretteMounth.m1, dataCigaretteMounth.m2, dataCigaretteMounth.m3, dataCigaretteMounth.m4, dataCigaretteMounth.m5, dataCigaretteMounth.m6, dataCigaretteMounth.m7, dataCigaretteMounth.m8, dataCigaretteMounth.m9, dataCigaretteMounth.m10, dataCigaretteMounth.m11, dataCigaretteMounth.m12
                            ]}]
                        }}

                        width={Dimensions.get("window").width -32} // from react-native
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix=""
                        fromZero={true}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: Colors.transparent,
                            backgroundGradientFrom: Colors.blueFb,
                            backgroundGradientTo: Colors.blueFb,
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                //borderRadius: 16
                            },
                            propsForDots: {
                                r: "2",
                                strokeWidth: "2",
                                stroke: 'silver'
                            },

                            propsForVerticalLabels: {
                                fontSize: 10
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginStart: 0
                        }}
                    />
                    }
                    
                    </View>

                </Surface>
            </View>

            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceRed}>
                        
                    <View style={ styles.titleContainerRed }>
                        <Text style={ styles.titleText }>Nicotine</Text>
                    </View>
                    
                    <View>
                        {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText2}> {Math.round(countNicotine * 100) / 100} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceRed}>
                        
                    <View style={ styles.titleContainerRed }>
                        <Text style={ styles.titleText }>Goudron</Text>
                    </View>
                    
                    <View>
                    {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText2}> {countGoudron} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        }
                    </View>
                </Surface>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceRed}>
                        
                    <View style={ styles.titleContainerRed }>
                        <Text style={ styles.titleText }>Carbone</Text>
                    </View>
                    
                    <View>
                    {isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText2}> {countCarbonne} </Text>
                            <Text style={styles.statUnitCount}> mg </Text>
                        </View>
                        }
                    </View>
                </Surface>
            </View>

            <View style={styles.statDispositifNicotine}>
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceOrange}>
                        
                    <View style={ styles.titleContainer }>
                        <Text style={ styles.titleText }>Patchs</Text>
                    </View>
                    
                    <View>
                        {isLoadCountPatch == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.descContenairViewText}> {countPatch} </Text>
                        }
                    </View>
                </Surface>
                
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceOrange}>
                        
                    <View style={ styles.titleContainer }>
                        <Text style={ styles.titleText }>Pastilles</Text>
                    </View>
                    
                    <View>
                        {isLoadCountPill == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <Text style={styles.descContenairViewText}> {countPill} </Text>
                        }
                    </View>
                </Surface>
            </View>

            <View style={styles.statDispositifNicotine}>
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceBlue}>

<                   View style={ styles.titleContainerBlue }>
                        <Text style={ styles.titleText }> Pastilles consommées </Text>
                    </View>

                    <View>

                    {isLoadPillChart == true ? 
                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                    : 
                    <LineChart
                        data={{
                            labels: tab12m,
                            datasets: [
                            {data: [
                                dataPillMounth.m1, dataPillMounth.m2, dataPillMounth.m3, dataPillMounth.m4, dataPillMounth.m5, dataPillMounth.m6, dataPillMounth.m7, dataPillMounth.m8, dataPillMounth.m9, dataPillMounth.m10, dataPillMounth.m11, dataPillMounth.m12
                            ]}]
                        }}

                        width={Dimensions.get("window").width -32} // from react-native
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix=""
                        fromZero={true}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: Colors.transparent,
                            backgroundGradientFrom: Colors.blueFb,
                            backgroundGradientTo: Colors.blueFb,
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                //borderRadius: 16
                            },
                            propsForDots: {
                                r: "2",
                                strokeWidth: "2",
                                stroke: 'silver'
                            },

                            propsForVerticalLabels: {
                                fontSize: 10
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginStart: 0
                        }}
                    />
                    }
                    
                    </View>

                </Surface>
            </View>

            <View style={styles.statDispositifNicotine}>
                
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statSurfaceGreen}>
                        
                    <View style={ styles.titleContainerGreen }>
                        <Text style={ styles.titleText }>Economie</Text>
                    </View>
                    
                    <View>
                    {isLoadCountPriceEconomy == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText}> {countPriceEconomy} € </Text>
                        </View>
                        }
                    </View>
                </Surface>

            </View>

        </View>
        </ScrollView>
        </GestureHandlerRootView>

    </SafeAreaProvider>
  )
}

export default StatisticsYearsScreen

const styles = StyleSheet.create({
    statContainer: {
        margin:5
    },

    statSurfaceOrange: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        borderRadius: 10,
        margin:8
    },

    statSurfaceRed: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 10,
        margin:8
    },

    statSurfaceGreen: {
        flex: 1,
        backgroundColor: Colors.green,
        borderRadius: 10,
        margin:8
    },

    statSurfaceBlue: {
        flex: 1,
        backgroundColor: Colors.blueFb,
        borderRadius: 10,
        margin:8
    },

    titleContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
    },

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.red,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
    },

    titleContainerGreen: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.green,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
    },

    titleContainerBlue: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
    },

    titleText: {
        textAlign: 'center',
        color: Colors.black,
        fontSize: 16,
        fontWeight: 'bold'
    },

    descContenairViewText: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
        padding: 16
    },

    descContenairViewText2: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
        paddingTop: 16
    },

    statUnitCount: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 14,
        paddingBottom: 16
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
    }
})