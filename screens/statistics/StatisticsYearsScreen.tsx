import React, { useState , useEffect} from 'react';
import { Text, View, Dimensions} from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

// Material 
import { Surface } from "@react-native-material/core";

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
import { useSelector, useDispatch } from 'react-redux';

// API
import { getUserPatchsByIdUserFireStore } from '../../api/UserPatchsApi';
import { getUserPillsByIdUserFireStore, getUserPillYearsByIdUserFireStore } from '../../api/UserPillsApi';
import { getUserCigarettesByIdUserFireStore, getUserCigaretteYearsByIdUserFireStore } from '../../api/UserCigarettesApi';

// Chart
import { LineChart } from "react-native-chart-kit";

/**
 * Screen StatisticsYearsScreen
 * @returns 
 */
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
                    }
                })

                setCountPatch(i)
                setIsLoadCountPatch(false)

            } else {
                setCountPatch(0)
                setIsLoadCountPatch(false)
            }
            
        }).catch((error) => {
            //console.log("Error getStatPatchDayInDatabase")
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
            //console.log("Error getUserCigaretteWeekByIdUserFireStore")
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
            //console.log("Error getUserCigaretteWeekByIdUserFireStore")
            console.error(error.message)
        })
    }

    const tab12m = [
        textTranslate.t('statChartJanuary'), 
        textTranslate.t('statChartFebruary'), 
        textTranslate.t('statChartMarch'), 
        textTranslate.t('statChartApril'), 
        textTranslate.t('statChartMay'), 
        textTranslate.t('statChartJune'), 
        textTranslate.t('statChartJuly'), 
        textTranslate.t('statChartAugust'), 
        textTranslate.t('statChartSeptember'), 
        textTranslate.t('statChartOctober'), 
        textTranslate.t('statChartNovember'), 
        textTranslate.t('statChartDecember'),
    ]

    /**
     * JSX View
     */
    return (
        <SafeAreaProvider style={AppStyle.container}>

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
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <Text style={ StatStyle.descContenairViewText }>{ countCigarette }</Text>
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
                                        <Text style={ StatStyle.descContenairViewText }>{ countPriceDepense.toFixed(2) } { textTranslate.t('cigarettePriceEuros') } </Text>
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

                        <View style={ StatStyle.statDispositifNicotine }>

                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceRed }>
                                    
                                <View style={ StatStyle.titleContainerRed }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statNicotine') }</Text>
                                </View>
                                
                                <View>
                                    {isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }> { countNicotine.toFixed(1) } </Text>
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
                                {isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }>{ countGoudron }</Text>
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
                                {isLoadCountCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2 }> {countCarbonne} </Text>
                                        <Text style={ StatStyle.statUnitCount }>{ textTranslate.t('cigaretteMgMesure') }</Text>
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
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statPillsConsume') }</Text>
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

                        <View style={ StatStyle.statDispositifNicotine }>
                            
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ StatStyle.statSurfaceGreen }>
                                    
                                <View style={ StatStyle.titleContainerGreen }>
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statEconomy') }</Text>
                                </View>
                                
                                <View>
                                {isLoadCountPriceEconomy == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText }> {countPriceEconomy} { textTranslate.t('cigarettePriceEuros') } </Text>
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