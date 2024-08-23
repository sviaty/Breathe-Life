import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { useSelector } from 'react-redux';

// API
import { getUserPatchsByIdUserFireStore } from '../../api/UserPatchsApi';
import { getUserPillsByIdUserFireStore, getUserPillWeekByIdUserFireStore } from '../../api/UserPillsApi';
import { getUserCigarettesByIdUserFireStore, getUserCigaretteWeekByIdUserFireStore } from '../../api/UserCigarettesApi';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';


const StatisticsWeekSreen = () => {

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

    const [dataCigaretteWeek, setDataCigaretteWeek] = useState<any>({
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
    });

    const [dataPillWeek, setDataPillWeek] = useState<any>({
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
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

        userSmokePrice = (userSelector.userSmokeAvgNbr * 0.65) * 7
        setUserSmokePrice(userSmokePrice)
        setCountPriceEconomy(userSmokePrice)
        //console.log(userSmokePrice)

        getStatPatchDayInDatabase()
        getStatPillDayInDatabase()
        getStatCigaretteDayInDatabase()

        getStatCigaretteWeek()
        getStatPillWeek()
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

                    const patchDate = getWeekNumber(patchData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())

                    if(patchDate == currentDate) {
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

                    const pillDate = getWeekNumber(pillData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())

                    if(pillDate == currentDate) {

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

                    const cigaretteDate = getWeekNumber(cigaretteData.dateTime.toDate())
                    const currentDate = getWeekNumber(new Date())

                    if(cigaretteDate == currentDate){
                        
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
                //console.log('cigaretteList size = 0');
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

    /**
     * Function getStatCigarette Week
     */
    const getStatCigaretteWeek = async () => {

        setIsLoadCigChart(true)

        getUserCigaretteWeekByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataCigaretteWeek({
                    monday : cigList.monday,
                    tuesday: cigList.tuesday,
                    wednesday: cigList.wednesday,
                    thursday: cigList.thursday,
                    friday: cigList.friday,
                    saturday: cigList.saturday,
                    sunday: cigList.sunday,
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
     const getStatPillWeek = async () => {

        setIsLoadPillChart(true)

        getUserPillWeekByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataPillWeek({
                    monday : cigList.monday,
                    tuesday: cigList.tuesday,
                    wednesday: cigList.wednesday,
                    thursday: cigList.thursday,
                    friday: cigList.friday,
                    saturday: cigList.saturday,
                    sunday: cigList.sunday,
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
                            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                            datasets: [{data: [
                                dataCigaretteWeek.monday,
                                dataCigaretteWeek.tuesday,
                                dataCigaretteWeek.wednesday,
                                dataCigaretteWeek.thursday,
                                dataCigaretteWeek.friday,
                                dataCigaretteWeek.saturday,
                                dataCigaretteWeek.sunday,
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
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
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
                        { isLoadCountCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                        : 
                        <View>
                            <Text style={styles.descContenairViewText2}> {countNicotine.toFixed(1)} </Text>
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
                    { isLoadCountCigarette == true ? 
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
                    { isLoadCountCigarette == true ? 
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
                            labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
                            datasets: [{data: [
                                dataPillWeek.monday,
                                dataPillWeek.tuesday,
                                dataPillWeek.wednesday,
                                dataPillWeek.thursday,
                                dataPillWeek.friday,
                                dataPillWeek.saturday,
                                dataPillWeek.sunday,
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
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
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
                            <Text style={styles.descContenairViewText}> {countPriceEconomy.toFixed(2)} € </Text>
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

export default StatisticsWeekSreen

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
        fontSize: 35
    }
})