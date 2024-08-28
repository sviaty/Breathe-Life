// React & React Native
import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native'
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
import { getUserPillMounthByIdUserFireStore, getUserPillsByIdUserFireStore } from '../../api/UserPillsApi';
import { getUserCigaretteMounthByIdUserFireStore, getUserCigarettesByIdUserFireStore } from '../../api/UserCigarettesApi';

import { LineChart } from "react-native-chart-kit";

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
    const [isLoadCountPriceEconomy, setIsLoadCountPriceEconomy] = useState<boolean>(true);

    const [isLoadCigChart, setIsLoadCigChart] = useState<boolean>(true);
    const [isLoadPillChart, setIsLoadPillChart] = useState<boolean>(true);

    const [dataCigaretteTab, setDataCigaretteTab] = useState<Cigarette[]>([]);

    const [dataCigaretteWeek, setDataCigaretteWeek] = useState<any>({
        m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0,
        m11: 0, m12: 0, m13: 0, m14: 0, m15: 0, m16: 0, m17: 0, m18: 0, m19: 0, m20: 0,
        m21: 0, m22: 0, m23: 0, m24: 0, m25: 0, m26: 0, m27: 0, m28: 0, m29: 0, m30: 0,
        m31: 0,
    });

    const [dataPillWeek, setDataPillWeek] = useState<any>({
        m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0,
        m11: 0, m12: 0, m13: 0, m14: 0, m15: 0, m16: 0, m17: 0, m18: 0, m19: 0, m20: 0,
        m21: 0, m22: 0, m23: 0, m24: 0, m25: 0, m26: 0, m27: 0, m28: 0, m29: 0, m30: 0,
        m31: 0,
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

        userSmokePrice = ((userSelector.userSmokeAvgNbr * 0.65) * 31) 
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

                    const patchDateMounth = patchData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const patchDateYear = patchData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(patchDateMounth == currentDateMount && patchDateYear == currentDateYear){

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

                    const pillDateMounth = pillData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const pillDateYear = pillData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(pillDateMounth == currentDateMount && pillDateYear == currentDateYear){

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

                    const cigaretteDateMounth = cigaretteData.dateTime.toDate().getMonth()
                    const currentDateMount = new Date().getMonth()

                    const cigaretteDateYear = cigaretteData.dateTime.toDate().getFullYear()
                    const currentDateYear = new Date().getFullYear()

                    if(cigaretteDateMounth == currentDateMount && cigaretteDateYear == currentDateYear){
                        
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
                        
                        i += 1
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

        getUserCigaretteMounthByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataCigaretteWeek({
                    m1: cigList.m1, m2: cigList.m2, m3: cigList.m3, m4: cigList.m4, m5: cigList.m5, m6: cigList.m6, m7: cigList.m7, m8: cigList.m8, m9: cigList.m9, m10: cigList.m10,
                    m11: cigList.m11, m12: cigList.m12, m13: cigList.m13, m14: cigList.m14, m15: cigList.m15, m16: cigList.m16, m17: cigList.m17, m18: cigList.m18, m19: cigList.m19, m20: cigList.m20,
                    m21: cigList.m21, m22: cigList.m22, m23: cigList.m23, m24: cigList.m24, m25: cigList.m25, m26: cigList.m26, m27: cigList.m27, m28: cigList.m28, m29: cigList.m29, m30: cigList.m30,
                    m31: cigList.m31,
                })

                setIsLoadCigChart(false)
            } else {
                setIsLoadCigChart(false)
            }
        }).catch((error) => {
            setIsLoadCigChart(false)
            //console.log("Error getUserCigaretteMounthByIdUserFireStore")
            console.error(error.message)
        })
    }

    /**
     * Function getStatCigarette Week
     */
    const getStatPillMounth = async () => {

        setIsLoadPillChart(true)

        getUserPillMounthByIdUserFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList)
            if(cigList != null){
                setDataPillWeek({
                    m1: cigList.m1, m2: cigList.m2, m3: cigList.m3, m4: cigList.m4, m5: cigList.m5, m6: cigList.m6, m7: cigList.m7, m8: cigList.m8, m9: cigList.m9, m10: cigList.m10,
                    m11: cigList.m11, m12: cigList.m12, m13: cigList.m13, m14: cigList.m14, m15: cigList.m15, m16: cigList.m16, m17: cigList.m17, m18: cigList.m18, m19: cigList.m19, m20: cigList.m20,
                    m21: cigList.m21, m22: cigList.m22, m23: cigList.m23, m24: cigList.m24, m25: cigList.m25, m26: cigList.m26, m27: cigList.m27, m28: cigList.m28, m29: cigList.m29, m30: cigList.m30,
                    m31: cigList.m31,
                })

                setIsLoadPillChart(false)
            } else {
                setIsLoadPillChart(false)
            }
        }).catch((error) => {
            setIsLoadPillChart(false)
            console.log("Error getUserPillMounthByIdUserFireStore")
            console.error(error.message)
        })
    }

    const tab30j = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    ]

    const tab31j = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31",
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
                                    <Text style={StatStyle.descContenairViewText}>{countCigarette}</Text>
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
                                        labels: tab31j,
                                        datasets: [
                                        {data: [
                                            dataCigaretteWeek.m1, dataCigaretteWeek.m2, dataCigaretteWeek.m3, dataCigaretteWeek.m4, dataCigaretteWeek.m5, dataCigaretteWeek.m6, dataCigaretteWeek.m7, dataCigaretteWeek.m8, dataCigaretteWeek.m9, dataCigaretteWeek.m10,
                                            dataCigaretteWeek.m11, dataCigaretteWeek.m12, dataCigaretteWeek.m13, dataCigaretteWeek.m14, dataCigaretteWeek.m15, dataCigaretteWeek.m16, dataCigaretteWeek.m17, dataCigaretteWeek.m18, dataCigaretteWeek.m19, dataCigaretteWeek.m20,
                                            dataCigaretteWeek.m21, dataCigaretteWeek.m22, dataCigaretteWeek.m23, dataCigaretteWeek.m24, dataCigaretteWeek.m25, dataCigaretteWeek.m26, dataCigaretteWeek.m27, dataCigaretteWeek.m28, dataCigaretteWeek.m29, dataCigaretteWeek.m30,
                                            dataCigaretteWeek.m31,
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
                                            fontSize: 7
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
                                    { isLoadCountCigarette == true ?
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
                                { isLoadCountCigarette == true ?
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                    : 
                                    <View>
                                        <Text style={ StatStyle.descContenairViewText2}> {countGoudron} </Text>
                                        <Text style={ StatStyle.statUnitCount}>{ textTranslate.t('cigaretteMgMesure') }</Text>
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
                                        <Text style={ StatStyle.descContenairViewText2}> {countCarbonne} </Text>
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
                                    <Text style={ StatStyle.titleText }>{ textTranslate.t('statPillsConsume') }</Text>
                                </View>

                                <View>

                                {isLoadPillChart == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                : 
                                <LineChart
                                    data={{
                                        labels: tab31j,
                                        datasets: [{data: [
                                            dataPillWeek.m1, dataPillWeek.m2, dataPillWeek.m3, dataPillWeek.m4, dataPillWeek.m5, dataPillWeek.m6, dataPillWeek.m7, dataPillWeek.m8, dataPillWeek.m9, dataPillWeek.m10,
                                            dataPillWeek.m11, dataPillWeek.m12, dataPillWeek.m13, dataPillWeek.m14, dataPillWeek.m15, dataPillWeek.m16, dataPillWeek.m17, dataPillWeek.m18, dataPillWeek.m19, dataPillWeek.m20,
                                            dataPillWeek.m21, dataPillWeek.m22, dataPillWeek.m23, dataPillWeek.m24, dataPillWeek.m25, dataPillWeek.m26, dataPillWeek.m27, dataPillWeek.m28, dataPillWeek.m29, dataPillWeek.m30,
                                            dataPillWeek.m31,
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
                                style={ StatStyle.statSurfaceGreen }>
                                    
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

export default StatisticsMounthSreen