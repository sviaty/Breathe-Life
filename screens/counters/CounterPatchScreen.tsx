// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { Platform,  Text, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Mateiral
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
import Patch from '../../datas/PatchData'
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import { serverTimestamp } from "firebase/firestore";

// Api
import { getPatchListFireStore } from '../../api/PatchApi';
import { setUserFireStore } from '../../api/UserApi';
import { getUserLastPatchByIdUserFireStore, setUserPatchsFireStore } from '../../api/UserPatchsApi';

/**
 * Screen CounterPatchScreen
 */
const CounterPatchScreen = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(true)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    let [userPatch, setUserPatch] = useState<string>( textTranslate.t('counterPatchSelected') );
    let [userPatchText, setUserPatchText] = useState<string>( textTranslate.t('counterPatchSelected') );

    const p = new Patch("","",0)
    let [userPatchSelected, setUserPatchSelected] = useState<Patch>(p);

    let [dataPatchTab, setDataPatchTab] = useState<Patch[]>([]);
    let [dataPatchTabItem, setDataPatchTabItem] = useState<any[]>([]);
    let [diff, setDiff] = useState<string>("")

    // UseRed
    const intervalRef:any = useRef();

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        //console.log('useEffect')
        getPatchList()
        getlastPatch()
    },[])

    /**
     * Function getPatchList
     */
    const getPatchList = async () => {
        // Show loader
        setIsLoaderGet(true)

        dataPatchTabItem = []
        setDataPatchTabItem([...dataPatchTabItem])

        dataPatchTab = []
        setDataPatchTab([...dataPatchTab])
        //console.log(dataPatchTab)

        getPatchListFireStore().then((patchList) => {
            //console.log(patchList.size);

            const cItem = { label: textTranslate.t('counterPatchSelected'), value: textTranslate.t('counterPatchSelected') }
            //console.log(pItem);

            dataPatchTabItem.push(cItem)
            setDataPatchTabItem([...dataPatchTabItem])

            patchList.forEach((patch:any) => {
                const patchData = patch.data()
                //console.log(patchData);

                const p = new Patch(patch.id, patchData.patchName, patchData.patchNicotine);
                //console.log(p);

                const pItem = { label: patchData.patchName, value: patch.id }
                //console.log(pItem);

                dataPatchTabItem.push(pItem)
                setDataPatchTabItem([...dataPatchTabItem])

                dataPatchTab.push(p)
                setDataPatchTab([...dataPatchTab])
            });

            // Call after load patch list
            changePatchSelectedFomUserIdPatch()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            //console.log("Error getPatchListFireStore")
            console.error(error.message)
        }) 
    }

    /**
     * Function changePatchSelectedFomUserIdPatch
     */
    const changePatchSelectedFomUserIdPatch = () => {
        userPatch = textTranslate.t('counterPatchSelected')
        setUserPatch(userPatch)

        if(userSelector.idPatch != ""){
            setUserPatch(userSelector.idPatch)
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == userSelector.idPatch){
                    setUserPatchSelected(patch)
                    setUserPatchText(patch.patchName)
                    //console.log(patch)
                }
            })
        } else {
            if(Platform.OS === 'ios'){
                setUserPatchText(userPatch)
            }
        }
    }

    /**
     * Function handleHideAddPatch
     */
    const handlePickerSelect = (idPatch: string) => {
        setUserPatch(idPatch)
        //console.log(idPatch)

        if(idPatch != textTranslate.t('counterPatchSelected') ){
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == idPatch){
                    setUserPatchSelected(patch)
                    setUserPatchText(patch.patchName)
                    //console.log(patch)
                }
            })
    
            setUserIdPatch(idPatch)
        } else {
            const p = new Patch('', idPatch, 0)
            setUserPatchSelected(p)
            setUserPatchText( textTranslate.t('counterPatchSelected') )
            setUserIdPatch('')
        }
    }

    /**
     * Function setUserIdPatch
     * @param idPatch 
     */
    const setUserIdPatch = async (idPatch: string) => {

        const user = new User(
            userSelector.userId, 
            userSelector.userName, 
            userSelector.userMail, 
            userSelector.userToken, 
            userSelector.userBirthDate, 
            userSelector.userSmokeAvgNbr, 
            idPatch, 
            userSelector.idPill, 
            userSelector.idCigarette);
        
        setUserFireStore(user).then((value) => {
            //console.log(value)
            dispatch(setUser(user));

        }).catch((error) => {
            //console.log("Error setUserIdPatch")
            console.error(error.message)
        }) 
    }

    /**
     * Function addUserPatch
     */
    const addUserPatch = async () => {
        setIsLoaderUserAdd(true)
        //setErrorAddPatch("")

        const userPAtchDatas = {
            idUser: userSelector.userId,
            idPatch: userPatch,
            nicotine: userPatchSelected.patchNicotine,
            dateTime: serverTimestamp()
        }

        setUserPatchsFireStore(userPAtchDatas).then((value) => {

            getlastPatch()

            //console.log(value)
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)

        }).catch((error) => {
            setIsLoaderUserAdd(false)
            //console.log("Error addUserPatchs")
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
     * Function getlastPatch
     */
    const getlastPatch = () => {

        closeInterval()

        getUserLastPatchByIdUserFireStore(userSelector.userId).then((patchList) => {

            if(patchList != null){
                //console.log(patchList.dateTime.toDate())
                const d = patchList.dateTime.toDate()
                startInterval(d)                
            } else {
                setDiff( textTranslate.t('counterPatchNoPatchApply') )
            }
            
        }).catch((error) => {
            //console.log("Error getUserLastPatchByIdUserFireStore")
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
                                text={ textTranslate.t('patchViewLoading') } 
                                step="" 
                                color={Colors.blueFb} 
                                size="large"/>
                        </View>
                        : 
                        <View style={CounterStyle.mainContainerView}>

                            <View style={CounterStyle.statDispositifNicotine}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ CounterStyle.surfaceContainerBlue } >   

                                { Platform.OS === 'android' ? 
                                <View>
                                    <View style={ CounterStyle.titleContainer2 }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPatchChoice') }</Text>
                                    </View>
                                    <Picker
                                        selectedValue={userPatch}
                                        onValueChange={(patch) => handlePickerSelect(patch) }
                                        placeholder={ textTranslate.t('counterPatchSelected') }
                                        mode={'dialog'}
                                        style={{backgroundColor: Colors.white, borderBottomStartRadius: 5, borderBottomEndRadius: 5}}>   
                                        {dataPatchTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)}          
                                    </Picker>
                                </View>
                                : null }

                                { Platform.OS === 'ios' ? 
                                <Pressable 
                                    onPress={() => snapeToIndex(0)}>

                                    <View style={ CounterStyle.titleContainer }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPatchSelected') }</Text>
                                    </View>

                                    <View style={ CounterStyle.descContainerPicker }>
                                        <Text style={ CounterStyle.descTextPicker }>{userPatchText}</Text>
                                    </View>
                                </Pressable>
                                : null }
                            </Surface>
                            </View>

                            { userPatchText != textTranslate.t('counterPatchSelected') ?
                            <View style={CounterStyle.mainC}>

                                <View style={CounterStyle.statDispositifNicotine}>
                                    <View style={{flex: 1}}>
                                    <Surface 
                                        elevation={ SURFACE_ELEVATION }
                                        category={ SURFACE_CATEGORY }
                                        style={ CounterStyle.surfaceContainerOrange2 } >  

                                        <View style={ CounterStyle.titleContainerOrange }>
                                            <Text style={ CounterStyle.titleText }>{userPatchSelected.patchName}</Text>
                                        </View>

                                        <View style={ CounterStyle.descContainerOrange }>
                                            <Text style={ CounterStyle.descText }>{ textTranslate.t('patchNicotine') } {userPatchSelected.patchNicotine} { textTranslate.t('patchNicotineMg24') }</Text>
                                        </View>

                                    </Surface>

                                    <TouchableOpacity
                                        onPress={() => addUserPatch()}
                                        activeOpacity={0.6}
                                        style={CounterStyle.surfaceBtnBlue3}>

                                        { isLoaderUserAdd == true ?
                                        <LoaderComponent 
                                            text={ textTranslate.t('counterPatchAddLoader') } 
                                            step="" 
                                            color={Colors.white} 
                                            size="large"/>
                                        :
                                        <Text style={CounterStyle.surfaceBtnBlueText}>{ textTranslate.t('counterPatchAdd') }</Text>
                                        }
                                    </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={CounterStyle.statDispositifNicotine}>
                                <Surface 
                                    elevation={ SURFACE_ELEVATION }
                                    category={ SURFACE_CATEGORY }
                                    style={ CounterStyle.surfaceContainerGreen } >   

                                    <View style={ CounterStyle.titleContainer }>
                                        <Text style={ CounterStyle.titleText }>{ textTranslate.t('counterPatchLast') }</Text>
                                    </View>

                                    <View style={ CounterStyle.descContainer }>
                                        <Text style={ CounterStyle.descContenairViewText }>{diff}</Text>
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

                        <Text style={CounterStyle.containerHeadline}>{ textTranslate.t('counterPatchChoice') }</Text>
                        
                        <View style={AppStyle.pickerSelect}>
                            <Picker
                                selectedValue={userPatch}
                                onValueChange={(patch) => handlePickerSelect(patch) }
                                mode={'dialog'}
                            >   
                            {
                            dataPatchTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                            }          
                            </Picker>
                        </View>
                    </View>
                </BottomSheet>
  
            </GestureHandlerRootView>

            <SnackBarComponent 
                visible={isSnackBar} 
                setVisible={setIsSnackBar} 
                message={ textTranslate.t('counterPatchAfterAdd') + userPatchSelected.patchName}
                duration={3000} />
                
        </SafeAreaProvider>
    )
}

export default CounterPatchScreen