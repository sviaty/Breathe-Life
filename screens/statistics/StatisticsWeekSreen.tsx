// React & React Native
import React, { useState , useEffect} from 'react';
import { Text, View, Dimensions} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

// Material 
import { Surface } from "@react-native-material/core";

// Navigation
import { useIsFocused } from '@react-navigation/native';

// Styles 
import AppStyle from '../../styles/AppStyle';
import StatStyle from '../../styles/StatStyle';

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION } from '../../constants/AppConstant';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';

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

// Chart
import { LineChart } from "react-native-chart-kit";

/**
 * Screen StatisticsWeekSreen
 * @returns 
 */
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
                    }
                })

                setCountPatch(i)
                setIsLoadCountPatch(false)

            } else {
                setCountPatch(0)
                setIsLoadCountPatch(false)
            }
            
        }).catch((error) => {
            //console.log("Error getUserPatchsByIdUserFireStore")
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
                    }
                })

                setCountPill(i)
                setIsLoadCountPill(false)

            } else {
                setCountPill(0)
                setIsLoadCountPill(false)
            }

        }).catch((error) => {
            //console.log("Error getUserPillsByIdUserFireStore")
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
            //console.log("Error getUserCigarettesByIdUserFireStore")
            console.error(error.message)
        })
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
            //console.log("Error getUserCigaretteWeekByIdUserFireStore")
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
            //console.log("Error getUserCigaretteWeekByIdUserFireStore")
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

    const tab7d = [
        textTranslate.t('statChartMonday'),
        textTranslate.t('statChartTuesday'), 
        textTranslate.t('statChartWednesday'), 
        textTranslate.t('statChartThursday'), 
        textTranslate.t('statChartFriday'), 
        textTranslate.t('statChartSaturday'), 
        textTranslate.t('statChartSunday')
    ]

    /**
     * JSX View
     */
    return (
        <SafeAreaProvider style={ AppStyle.container }>

            <GestureHandlerRootView>

                <ScrollView>
                    <View style={ StatStyle.statContainer }>

                        <View style={ StatStyle.statDispositifNicotine }>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statCigarette') }</Text>
                                </View>
                                
                                <View>
                                    {isLoadCountCigarette == true ? 
                                    <LoaderComponent 
                                        text="" 
                                        step="" 
                                        color={Colors.white} 
                                        size={'small'}/>
                                    : 
                                    <Text style={ StatStyle.descContenairViewText }>{countCigarette}</Text>
                                    }
                                </View>
                            </Surface>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statSpent') }</Text>
                                </View>
                                
                                <View>
                                {isLoadCountPriceEconomy == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText }> {countPriceDepense.toFixed(2)} { textTranslate.t('cigarettePriceEuros') } </Text>
                                    </View>
                                    }
                                </View>
                            </Surface>

                            
                        </View>

                        <View style={ StatStyle.statDispositifNicotine }>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceBlue }>

            <                   View style={ StatStyle.titleContainerBlue }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statCigaretteSmoke') }</Text>
                                </View>

                                <View>
                                    {isLoadCigChart == true ? 
                                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <LineChart
                                        data={{
                                            labels: tab7d,

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

                        <View style={ StatStyle.statDispositifNicotine }>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statNicotine') }</Text>
                                </View>
                                
                                <View>
                                    { isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }> {countNicotine.toFixed(1)} </Text>
                                        <Text style={ StatStyle.statUnitCount }>{ textTranslate.t('cigaretteMgMesure') }</Text>
                                    </View>
                                    }
                                </View>
                            </Surface>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statTar') }</Text>
                                </View>
                                
                                <View>
                                { isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }> {countGoudron} </Text>
                                        <Text style={ StatStyle.statUnitCount }>{ textTranslate.t('cigaretteMgMesure') }</Text>
                                    </View>
                                    }
                                </View>
                            </Surface>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statCarbone') }</Text>
                                </View>
                                
                                <View>
                                { isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }> {countCarbonne} </Text>
                                        <Text style={ StatStyle.statUnitCount}>{ textTranslate.t('cigaretteMgMesure') }</Text>
                                    </View>
                                    }
                                </View>
                            </Surface>
                        </View>

                        <View style={ StatStyle.statDispositifNicotine }>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceOrange }>
                                    
                                <View style={ StatStyle.titleContainer }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statPatchs') }</Text>
                                </View>
                                
                                <View>
                                    {isLoadCountPatch == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <Text style={ StatStyle.descContenairViewText }> {countPatch} </Text>
                                    }
                                </View>
                            </Surface>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceOrange }>
                                    
                                <View style={ StatStyle.titleContainer }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statPills') }</Text>
                                </View>
                                
                                <View>
                                    {isLoadCountPill == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <Text style={ StatStyle.descContenairViewText }> {countPill} </Text>
                                    }
                                </View>
                            </Surface>
                        </View>

                        <View style={ StatStyle.statDispositifNicotine }>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceBlue }>

            <                   View style={ StatStyle.titleContainerBlue }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statPillsConsume') } </Text>
                                </View>

                                <View>
                                    {isLoadPillChart == true ? 
                                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <LineChart
                                        data={{
                                            labels: tab7d,

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

                        <View style={ StatStyle.statDispositifNicotine}>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceGreen}>
                                    
                                <View style={ StatStyle.titleContainerGreen }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statEconomy') }</Text>
                                </View>
                                
                                <View>
                                {isLoadCountPriceEconomy == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText }> {countPriceEconomy.toFixed(2)} { textTranslate.t('cigarettePriceEuros') } </Text>
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