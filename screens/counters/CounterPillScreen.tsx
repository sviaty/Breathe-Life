// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { Platform,  Text, View, TouchableOpacity, Pressable } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Material
import { Surface } from "@react-native-material/core";

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
import Pill from '../../datas/PillData';
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import { serverTimestamp } from "firebase/firestore";

// Api
import { getPillListFireStore } from '../../api/PillApi';
import { setUserFireStore } from '../../api/UserApi';
import { getUserLastPillByIdUserFireStore, setUserPillsFireStore } from '../../api/UserPillsApi';

/**
 * SettingPillComponent 
 */
const SettingPillComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [isloadGetLast, setIsloadGetLast] = useState<boolean>(true)
 
    let [userPill, setUserPill] = useState<string>( textTranslate.t('counterPillSelected') );
    let [userPillText, setUserPillText] = useState<string>( textTranslate.t('counterPillSelected') );
 
    const p = new Pill("","",0)
    let [userPillSelected, setUserPillSelected] = useState<Pill>(p);
 
    let [dataPillTab, setDataPillTab] = useState<Pill[]>([]);
    let [dataPillTabItem, setDataPillTabItem] = useState<any[]>([]);
    let [diff, setDiff] = useState<string>("")

    // UseRef
    const intervalRef:any = useRef();

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getPillist()
        getlastPill()
     }, [])  

    /**
     * Function getPatchList
     */
    const getPillist = async () => {
        // Show loader
        setIsLoaderGet(true)

        dataPillTabItem = []
        setDataPillTabItem([...dataPillTabItem])

        dataPillTab = []
        setDataPillTab([...dataPillTab])
        //console.log(dataPatchTab)
        
        await getPillListFireStore().then((pillList) => {
            const cItem = { label: textTranslate.t('counterPillSelected'), value: textTranslate.t('counterPillSelected') }
            //console.log(pItem);

            dataPillTabItem.push(cItem)
            setDataPillTabItem([...dataPillTabItem])

            pillList.forEach((pill) => {
                const pillData = pill.data()
                //console.log(patchData);

                const p = new Pill(pill.id, pillData.pillName, pillData.pillNicotine);
                //console.log(p);

                const pItem = { label: pillData.pillName, value: pill.id }
                //console.log(pItem);

                dataPillTabItem.push(pItem)
                setDataPillTabItem([...dataPillTabItem])

                dataPillTab.push(p)
                setDataPillTab([...dataPillTab])
            });

            // Call after load pill list
            changePillSelectedFomUserIdPill()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            //console.log("Error getPillListFireStore")
            console.error(error.message)
        }) 
    }

    /**
     * Function changePillSelectedFomUserIdPill
     */
     const changePillSelectedFomUserIdPill = () => {
        setUserPill( textTranslate.t('counterPillSelected') )
        if(userSelector.idPill != ""){
            setUserPill(userSelector.idPill)
            dataPillTab.forEach((pill) => {
                if(pill.idPill == userSelector.idPill){
                    setUserPillSelected(pill)
                    setUserPillText(pill.pillName)
                    //console.log(pill)
                }
            })
        } else {
            if(Platform.OS === 'ios'){
                setUserPillText( textTranslate.t('counterPillSelected') )
            }
        }
    }

    /**
     * Function handlePickerSelect
     */
    const handlePickerSelect = (idPill: string) => {
        setUserPill(idPill)
        //console.log(idPill)

        if(idPill != textTranslate.t('counterPillSelected') ){
            dataPillTab.forEach((pill) => {
                if(pill.idPill == idPill){
                    setUserPillSelected(pill)
                    setUserPillText(pill.pillName)
                    //console.log(pill)
                }
            })
    
            setUserIdPill(idPill)
        } else {
            const p = new Pill('', idPill, 0)
            setUserPillSelected(p)
            setUserPillText( textTranslate.t('counterPillSelected') )
            setUserIdPill("")
        }
    }

    /**
     * Function setUserIdPill
     * @param idPill 
     */
    const setUserIdPill = async (idPill: string) => {

        const user = new User(
            userSelector.userId, 
            userSelector.userName, 
            userSelector.userMail, 
            userSelector.userToken, 
            userSelector.userBirthDate, 
            userSelector.userSmokeAvgNbr, 
            userSelector.idPatch, 
            idPill, 
            userSelector.idCigarette);
        
        setUserFireStore(user).then((value) => {
            //console.log(value)
            dispatch(setUser(user));

        }).catch((error) => {
            console.log("Error set user idPill in firestore database : ")
            console.error(error.message)
        }) 
    }

    /**
     * Function addUserPill
     */
    const addUserPill = async () => {

        setIsLoaderUserAdd(true)
        //setErrorAddPill("")

        const userPAtchDatas = {
            idUser: userSelector.userId,
            idPill: userPill,
            nicotine: userPillSelected.pillNicotine,
            dateTime: serverTimestamp()
        }

        setUserPillsFireStore(userPAtchDatas).then((value) => {

            //console.log(value)
            getlastPill()

            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {

            setIsLoaderUserAdd(false)
            //setErrorAddPatch("addUserPatch error : " + error.message)
            console.log("Error addUserPills")
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
    const getlastPill = () => {

        setIsloadGetLast(true)
        closeInterval()

        getUserLastPillByIdUserFireStore(userSelector.userId).then((pillList) => {

            if(pillList != null){
                setIsloadGetLast(false)        
                const d = pillList.dateTime.toDate()
                startInterval(d)  
                      
            } else {
                setIsloadGetLast(false)           
                setDiff( textTranslate.t('counterPillNoPillApply') )
            }
            
        }).catch((error) => {
            setIsloadGetLast(false)   
            //console.log("Error getUserLastPillByIdUserFireStore")
            console.error(error)
        })
    }

    const snapPoints = useMemo(() => ['50%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

	//const handleClosePress = () => bottomSheetRef.current?.close();
	//const handleOpenPress = () => bottomSheetRef.current?.expand();
	//const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
	const renderBackdrop = useCallback(
		(props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
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
                            <LoaderComponent 
                                text={ textTranslate.t('pillViewLoading') } 
                                step="" 
                                color={Colors.blueFb} 
                                size="large"/>
                        </View>
                        : 
                        <View style={ CounterStyle.mainContainerView }>
                            <View style={ CounterStyle.statDispositifNicotine }>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ CounterStyle.surfaceContainerBlue } >   

                                { Platform.OS === 'android' ? 
                                <View>
                                    <View style={ CounterStyle.titleContainer2 }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPillChoice') }</Text>
                                    </View>

                                    <Picker
                                        selectedValue={userPill}
                                        onValueChange={(pill) => handlePickerSelect(pill) }
                                        placeholder={ textTranslate.t('counterPillSelected') }
                                        mode={'dialog'}
                                        style={{backgroundColor: Colors.white}}>   
                                
                                {
                                dataPillTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                                }          
                                </Picker>
                                </View>
                                : null }

                                { Platform.OS === 'ios' ? 
                                <Pressable 
                                    onPress={() => snapeToIndex(0)}>

                                    <View style={ CounterStyle.titleContainer }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPillChoice') }</Text>
                                    </View>

                                    <View style={ CounterStyle.descContainerPicker }>
                                        <Text style={ CounterStyle.descTextPicker }>{userPillText}</Text>
                                    </View>
                                </Pressable>
                                : null }
                            </Surface>
                            </View>        
            
                            { userPillText != textTranslate.t('counterPillSelected') ?
                            <View style={ CounterStyle.mainC }>
                                
                                <View style={ CounterStyle.statDispositifNicotine }>
                                <View style={{flex: 1}}>
                                    <Surface 
                                        elevation={ SURFACE_ELEVATION }
                                        category={ SURFACE_CATEGORY }
                                        style={ CounterStyle.surfaceContainerOrange2 } >   

                                        <View style={ CounterStyle.titleContainerOrange }>
                                            <Text style={ CounterStyle.titleText }>{userPillSelected.pillName}</Text>
                                        </View>

                                        <View style={ CounterStyle.descContainerOrange }>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('pillNicotine') } {userPillSelected.pillNicotine} { textTranslate.t('cigaretteMgMesure') }</Text>
                                        </View>
                                    </Surface>
                                    <TouchableOpacity
                                        onPress={() => addUserPill()}
                                        activeOpacity={0.6}
                                        style={ CounterStyle.surfaceBtnBlue3 }>

                                        { isLoaderUserAdd == true ?
                                        <LoaderComponent 
                                            text={ textTranslate.t('counterPillAddLoader') } 
                                            step="" 
                                            color={Colors.white} 
                                            size="large"/>
                                        :
                                        <Text style={ CounterStyle.surfaceBtnBlueText }>{ textTranslate.t('counterPillAdd') } </Text>
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
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPillLast') }</Text>
                                    </View>

                                    
                                    <View style={ CounterStyle.descContainer }>
                                    { isloadGetLast == true ?
                                        <LoaderComponent 
                                            text={ textTranslate.t('counterPillLastLoader') } 
                                            step="" 
                                            color={Colors.white} 
                                            size="large"/>
                                        :
                                        <View>
                                            { diff == textTranslate.t('counterPillNoPillApply') ?
                                            <Text style={ CounterStyle.descContenairViewText2 }>{diff}</Text>
                                            :
                                            <Text style={ CounterStyle.descContenairViewText }>{diff}</Text>
                                            }
                                        </View>
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

                        <Text style={CounterStyle.containerHeadline}> { textTranslate.t('counterPillChoice') } </Text>
                        
                        <View style={AppStyle.pickerSelect}>
                            <Picker
                                selectedValue={userPill}
                                onValueChange={(pill) => handlePickerSelect(pill) }
                                placeholder={ textTranslate.t('counterPillSelected') }
                                mode={'dialog'}
                            >   
                            {
                            dataPillTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                            }          
                            </Picker>
                        </View>
                    </View>
                </BottomSheet>

            </GestureHandlerRootView>

            <SnackBarComponent 
                visible={isSnackBar} 
                setVisible={setIsSnackBar} 
                message={ textTranslate.t('counterPillAfterAdd') + userPillSelected.pillName}
                duration={ 3000 } />
            
        </SafeAreaProvider>
    )
  
}

export default SettingPillComponent