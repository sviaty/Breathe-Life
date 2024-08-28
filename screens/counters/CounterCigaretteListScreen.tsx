// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Platform,  Text, View, TouchableOpacity, Pressable, Alert, ScrollView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Material 
import { Surface } from "@react-native-material/core";

// Navigation 
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Styles 
import AppStyle from '../../styles/AppStyle';
import CounterStyle from '../../styles/CounterStyle';

// Constants 
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION } from '../../constants/AppConstant';

// Helpers
import { getDifference2Date } from '../../helpers/DateHelper';
import textTranslate from '../../helpers/TranslateHelper';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import { serverTimestamp } from "firebase/firestore";

// Api
import { getCigaretteListFireStore } from '../../api/CigaretteApi';
import { setUserFireStore } from '../../api/UserApi';
import { getUserCigarettesByIdUserFireStore, getUserLastCigaretteByIdUserFireStore, setUserCigarettesFireStore } from '../../api/UserCigarettesApi';

/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

type RootStackParamList = {
    UserCounterCigaretteListScreen: any;
    UserCounterCigaretteAddScreen: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'UserCounterCigaretteListScreen', 'UserCounterCigaretteAddScreen'>;

/**
 * Screen CounterCigaretteListScreen
 * @param param0  
 * @returns 
 */
const CounterCigaretteListScreen = ({ navigation }: Props) => {

    // UseState

    let [countCigarette, setCountCigarette] = useState<number>(0);
    const [isLoadCountCigarette, setIsLoadCountCigarette] = useState<boolean>(true);

    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [textSnackBar, setTextSnackBar] = useState<string>("")

    let [userCig, setUserCig] = useState<string>( textTranslate.t('counterCigListBrandSelected') );
    let [userCigText, setUserCigText] = useState<string>( textTranslate.t('counterCigListBrandSelected') );

    const c = new Cigarette("","",0,0,0,0,0,0,"")
    let [userCigSelected, setUserCigSelected] = useState<Cigarette>(c);

    let [dataCigTab, setDataCigTab] = useState<Cigarette[]>([]);
    let [dataCigTabItem, setDataCigTabItem] = useState<any[]>([]);
    let [diff, setDiff] = useState<string>("")

    // UseRef
    const intervalRef:any = useRef();

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getCigList()
        getlastCig()
        getStatCigaretteDayInDatabase()
    }, [])  

    /**
     * Function getCigist
     */
    const getCigList = async () => {
        // Show loader
        setIsLoaderGet(true)

        dataCigTabItem = []
        setDataCigTabItem([...dataCigTabItem])

        dataCigTab = []
        setDataCigTab([...dataCigTab])
        //console.log(dataPatchTab)
        
        await getCigaretteListFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList.size);

            const cItem = { label: textTranslate.t('counterCigListBrandSelected'), value: textTranslate.t('counterCigListBrandSelected') }
            //console.log(pItem);

            dataCigTabItem.push(cItem)
            setDataCigTabItem([...dataCigTabItem])

            cigList.forEach((cig) => {
                const cigData = cig.data()
                //console.log(patchData);

                const c = new Cigarette(
                    cig.id, 
                    cigData.cigaretteName, 
                    cigData.cigaretteNicotine,
                    cigData.cigaretteGoudron,
                    cigData.cigaretteCarbone,
                    cigData.cigarettePrice,
                    cigData.cigaretteNbr,
                    cigData.cigarettePriceUnit,
                    cigData.idUser,
                );
                //console.log(p);

                const cItem = { label: cigData.cigaretteName, value: cig.id }
                //console.log(pItem);

                dataCigTabItem.push(cItem)
                setDataCigTabItem([...dataCigTabItem])

                dataCigTab.push(c)
                setDataCigTab([...dataCigTab])
            });

            changeCigSelectedFomUserIdCig()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            //console.log("Error getCigaretteListFireStore")
            console.error(error.message)
        }) 
    }

    /**
     * Function changeCigSelectedFomUserIdCig
     */
    const changeCigSelectedFomUserIdCig = () => {
        setUserCig("")
        if(userSelector.idCigarette != ""){
            setUserCig(userSelector.idCigarette)
            dataCigTab.forEach((cig) => {
                if(cig.idCigarette == userSelector.idCigarette){
                    setUserCigSelected(cig)
                    setUserCigText(cig.cigaretteName)
                    //console.log(cig)
                }
            })
        } else {
            if(Platform.OS === 'ios'){
                setUserCigText( textTranslate.t('counterCigListBrandSelected') )
            }
        }
    }

    /**
     * Function handlePickerSelect
     */
    const handlePickerSelect = (idCig: string) => {
        setUserCig(idCig)
        //console.log(idCig)

        if(idCig != textTranslate.t('counterCigListBrandSelected') ){
            dataCigTab.forEach((cig) => {
                if(cig.idCigarette == idCig){
                    setUserCigSelected(cig)
                    setUserCigText(cig.cigaretteName)
                    //console.log(patch)
                }
            })
    
            setUserIdCig(idCig)
        } else {

            const c = new Cigarette(
                "", 
                idCig, 
                0,
                0,
                0,
                0,
                0,
                0,
                ""
            );

            setUserCigSelected(c)
            setUserCigText( textTranslate.t('counterCigListBrandSelected') )

            setUserIdCig("")
        }
    }

    /**
     * Function setUserIdCig
     * @param idCig 
     */
     const setUserIdCig = async (idCig: string) => {

        const user = new User(
            userSelector.userId, 
            userSelector.userName, 
            userSelector.userMail, 
            userSelector.userToken, 
            userSelector.userBirthDate, 
            userSelector.userSmokeAvgNbr, 
            userSelector.idPatch, 
            userSelector.idPill, 
            idCig);
        
        setUserFireStore(user).then((value) => {
            //console.log(value)
            dispatch(setUser(user));

        }).catch((error) => {
            //console.log("Error setUserFireStore")
            console.error(error.message)
        }) 
    }

    /**
     * Function handleAddUserPill
     */
    const handleAddUserCig = () => {

        Alert.alert(
            textTranslate.t('counterCigListAlertText'), 
            '', 
            [
                {
                    text: textTranslate.t('counterCigListAlertCancel'),
                    onPress: () => {
                        //console.log('Cancel Pressed')
                    },
                    style: 'cancel',
                },
                {
                    text: textTranslate.t('counterCigListAlertConfirm'),
                    onPress: () => {
                        //console.log('OK Pressed')
                        addUserCig()
                    },
                }
            ]
        );
    }

    /**
     * Function addUserCig
     */
    const addUserCig = async () => {

        setIsLoaderUserAdd(true)
        //setErrorAddPill("")

        const userCigarettesDatas = {
            idUser: userSelector.userId,
            idCigarette: userCig,
            nicotine: userCigSelected.cigaretteNicotine,
            goudron: userCigSelected.cigaretteGoudron,
            carbone: userCigSelected.cigaretteCarbone,
            price: userCigSelected.cigarettePrice / userCigSelected.cigaretteNbr,
            dateTime: serverTimestamp()
        }

        setUserCigarettesFireStore(userCigarettesDatas).then((value) => {

            getlastCig()
            getStatCigaretteDayInDatabase()

            //console.log(value)
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)

        }).catch((error) => {

            setIsLoaderUserAdd(false)
            //console.log("Error addUserCigarettes")
            console.error(error)
        })
    }

    /**
     * Function startInterval
     * @param date 
     */
    const startInterval = (date: Date) => {
        //console.log("start interval")
        intervalRef.current = setInterval(() => {
            const diff = getDifference2Date(date)
            //console.log(diff)
            setDiff(diff)
        }, 1000);
    }

    /**
     * Function closeInterval
     */
    const closeInterval = () => {
        //console.log("close interval")
        diff = ""
        setDiff(diff)
        clearInterval(intervalRef.current)
        intervalRef.current = null
    }

    /**
     * Function getlastPill
     */
    const getlastCig = () => {

        closeInterval()

        getUserLastCigaretteByIdUserFireStore(userSelector.userId).then((cigList) => {

            if(cigList != null){
                const d = cigList.dateTime.toDate()
                startInterval(d)                
            } else {
                setDiff( textTranslate.t('counterCigListNoSmoke') )
            }
            
        }).catch((error) => {
            //console.log("Error getUserLastCigaretteByIdUserFireStore")
            console.error(error)
        })
    }

    /**
     * Function getCigaretteInDatabase
     */
    const getStatCigaretteDayInDatabase = async () => {

        setCountCigarette(0)
        setIsLoadCountCigarette(true)

        getUserCigarettesByIdUserFireStore(userSelector.userId).then((userCigaretteList) => {

            if(userCigaretteList.size != 0){

                let i = 0
                userCigaretteList.forEach((userCigarette) => {
                    //console.log(cigarette.id, " => ", cigarette.data());
                    const cigaretteData = userCigarette.data()
                    const cigaretteDate = cigaretteData.dateTime.toDate().toDateString()
                    const currentDate = new Date().toDateString()

                    if(cigaretteDate == currentDate){
                        i += 1
                    }
                });

                setCountCigarette(i)

                setIsLoadCountCigarette(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountCigarette(0)
                setIsLoadCountCigarette(false)
            }

        }).catch((error) => {
            //console.log("Error getUserCigarettesByIdUserFireStore")
            console.error(error.message)
        })
    }

    const snapPoints = useMemo(() => ['50%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

	//const handleClosePress = () => {bottomSheetRef.current?.close() };
	//const handleOpenPress = () => bottomSheetRef.current?.expand();
	//const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
	
    const renderBackdrop = useCallback( 
		(props: any) => 
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
		[]
	);

    // View JSX
    return (
        <SafeAreaProvider>

            <GestureHandlerRootView>

                <ScrollView>
                    <View style={CounterStyle.statContainer}>
                        { isLoaderGet == true ? 
                        <View style={CounterStyle.loadContainerView}>
                            <LoaderComponent text={ textTranslate.t('cigaretteViewLoading') } step="" color={Colors.blueFb} size="large"/>
                        </View>
                        : 
                        <View style={CounterStyle.mainContainerView}>
                            <View style={CounterStyle.statDispositifNicotine}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ CounterStyle.surfaceContainerBlue }>

                                { Platform.OS === 'android' ? 
                                <View>
                                    <View style={ CounterStyle.titleContainer2 }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('cigaretteViewLoading') }</Text>
                                    </View>
                                    <Picker
                                        selectedValue={userCig}
                                        onValueChange={(cig) => handlePickerSelect(cig) }
                                        placeholder={ textTranslate.t('counterCigListBrandSelected') }
                                        mode={'dialog'}
                                        style={{backgroundColor: Colors.white}}
                                    >   
                                    {
                                    dataCigTabItem.map(cigTabItem => <Picker.Item key={cigTabItem.value} label={cigTabItem.label} value={cigTabItem.value}/>)
                                    }          
                                    </Picker>
                                </View>
                                : null }

                                { Platform.OS === 'ios' ? 
                                <Pressable 
                                    onPress={() => snapeToIndex(0)}>

                                    <View style={ CounterStyle.titleContainer }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('cigaretteViewLoading') }</Text>
                                    </View>

                                    <View style={ CounterStyle.descContainerPicker }>
                                        <Text style={ CounterStyle.descTextPicker }>{userCigText}</Text>
                                    </View>

                                </Pressable>
                                : null }

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('UserCounterCigaretteAddScreen')}
                                    activeOpacity={0.6}
                                    style={CounterStyle.surfaceBtnBlue2}>
                                    <Text style={CounterStyle.surfaceBtnBlueText}>{ textTranslate.t('counterCigListAddBrand') }</Text>
                                </TouchableOpacity>
                            </Surface>     
                            </View>                       
            
                            { userCigText != textTranslate.t('counterCigListBrandSelected') ?
                            <View style={CounterStyle.mainC}>
                                <View style={CounterStyle.statDispositifNicotine}>

                                    <View style={{flex: 1}}>
                                    <Surface 
                                        elevation={ SURFACE_ELEVATION }
                                        category={ SURFACE_CATEGORY }
                                        style={ CounterStyle.surfaceContainerRed2 } >   

                                        <View style={ CounterStyle.titleContainerRed }>
                                            <Text style={ CounterStyle.titleText }>{userCigSelected.cigaretteName}</Text>
                                        </View>

                                        <View style={ CounterStyle.descContainerRed }>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('cigaretteNicotine') } {userCigSelected.cigaretteNicotine} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('cigaretteGoudron') } {userCigSelected.cigaretteGoudron} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('cigaretteCarbonne') } {userCigSelected.cigaretteCarbone} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('cigaretteNbr') } {userCigSelected.cigarettePrice} { textTranslate.t('cigaretteNbrPerPaquet') }</Text>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('cigarettePrice') } {userCigSelected.cigarettePrice} { textTranslate.t('cigarettePriceEuros') }</Text>
                                        </View>
                                    </Surface>

                                    <TouchableOpacity
                                        onPress={() => handleAddUserCig()}
                                        activeOpacity={0.6}
                                        style={CounterStyle.surfaceBtnBlue3}>

                                        { isLoaderUserAdd == true ?
                                        <LoaderComponent text={ textTranslate.t('counterCigListAddLoader') } step="" color={Colors.white} size="large"/>
                                        :
                                        <Text style={CounterStyle.surfaceBtnBlueText}>{ textTranslate.t('counterCigListSmoke') }</Text>
                                        }
                                    </TouchableOpacity>

                                </View>
                                </View>   

                                <View style={ CounterStyle.statDispositifNicotine }>
                                    <Surface 
                                        elevation={ SURFACE_ELEVATION }
                                        category={ SURFACE_CATEGORY }
                                        style={ CounterStyle.surfaceContainerGreen } > 

                                        <View style={ CounterStyle.titleContainer }>
                                            <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterCigListLastSmoke') }</Text>
                                        </View>  

                                        <View style={ CounterStyle.descContainer }>
                                            <Text style={ CounterStyle.descContenairViewText }>{diff}</Text>
                                        </View>
                                    
                                    </Surface>

                                
                                </View>

                                <View style={ CounterStyle.statDispositifNicotine }>
                                    <Surface 
                                        elevation={ SURFACE_ELEVATION }
                                        category={ SURFACE_CATEGORY }
                                        style={ CounterStyle.surfaceContainerRed }>
                                            
                                        <View style={ CounterStyle.titleContainerRed }>
                                            <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterCigListNbrSmoke') }</Text>
                                        </View>
                                        
                                        <View style={ CounterStyle.descContainerRed2 }>
                                            {isLoadCountCigarette == true ? 
                                            <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                            : 
                                            <Text style={ CounterStyle.descContenairViewText }> {countCigarette} </Text>
                                            }
                                        </View>
                                    </Surface>
                                </View>

                            </View>
                            : null }
                        </View> 
                        }
                    </View>
                </ScrollView>
           
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: Colors.blueFb }}
                    backgroundStyle={{ backgroundColor: Colors.background }}
                    backdropComponent={renderBackdrop}>

                    <View style={CounterStyle.contentContainer}>

                        <Text style={CounterStyle.containerHeadline}>{ textTranslate.t('counterCigListChoiceBrand') }</Text>
                        
                        <View style={AppStyle.pickerSelect}>
                            <Picker
                                selectedValue={userCig}
                                onValueChange={(cig) => handlePickerSelect(cig) }
                                placeholder={ textTranslate.t('counterCigListBrandSelected') }
                                mode={'dialog'}
                            >   
                            {
                            dataCigTabItem.map(cigTabItem => <Picker.Item key={cigTabItem.value} label={cigTabItem.label} value={cigTabItem.value}/>)
                            }          
                            </Picker>
                        </View>
                    </View>
                </BottomSheet>
            
            </GestureHandlerRootView>

            <SnackBarComponent 
                visible={isSnackBar} 
                setVisible={setIsSnackBar} 
                message={textSnackBar}
                duration={5000} />
            
        </SafeAreaProvider>
    )
}

export default CounterCigaretteListScreen