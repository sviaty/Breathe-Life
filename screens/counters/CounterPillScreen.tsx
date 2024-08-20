// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Surface } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

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
import { setUserPillsFireStore } from '../../api/UserPillsApi';

/**
 * SettingPillComponent 
 */
const SettingPillComponent = () => {

     // UseState
     const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)

     const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
     const [errorAddPill, setErrorAddPill] = useState<string>("")
     
     const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
 
     let [userPill, setUserPill] = useState<string>("Selectionner une pastille");
     let [userPillText, setUserPillText] = useState<string>("Selectionner une pastille");

 
     const p = new Pill("","",0)
     let [userPillSelected, setUserPillSelected] = useState<Pill>(p);
 
     let [dataPillTab, setDataPillTab] = useState<Pill[]>([]);
     let [dataPillTabItem, setDataPillTabItem] = useState<any[]>([]);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getPillist()
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
            const cItem = { label: "Selectionner une pastille", value: "Selectionner une pastille" }
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
            console.log("Error get pill in firestore database")
            console.error(error.message)
        }) 
    }

    /**
     * Function changePillSelectedFomUserIdPill
     */
     const changePillSelectedFomUserIdPill = () => {
        //console.log("changePatchSelectedFomUserIdPatch")
        setUserPill("Selectionner une pastille")
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
                setUserPillText("Selectionner une pastille")
            }
        }
    }

    /**
     * Function handlePickerSelect
     */
    const handlePickerSelect = (idPill: string) => {
        setUserPill(idPill)
        //console.log(idPill)

        if(idPill != "Selectionner une pastille"){
            console.log('IS NOT undefined')
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
            setUserPillText("Selectionner une pastille")
            //console.log('IS undefined')

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
            userSelector.userSmokeStartDate, 
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
            dateTime: serverTimestamp()
        }

        setUserPillsFireStore(userPAtchDatas).then((value) => {

            //console.log(value)
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
     * Function onRefresh 
     */
    const onRefresh = () => {
        getPillist()
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
        <SafeAreaProvider style={AppStyle.container}>
            <GestureHandlerRootView>
                <View >
                    { isLoaderGet == true ? 
                    <View>
                        <LoaderComponent text="Chargement des pastilles" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={AppStyle.viewContenair}>
                        

                        <Surface 
                            elevation={4}
                            category="medium"
                            style={ AppStyle.pickerSelectOrange } >   

                            { Platform.OS === 'android' ? 
                            <Picker
                                selectedValue={userPill}
                                onValueChange={(pill) => handlePickerSelect(pill) }
                                placeholder="Selectionner une pastille"
                                mode={'dialog'}
                            >   
                            {
                            dataPillTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                            }          
                            </Picker>
                            : null }

                            { Platform.OS === 'ios' ? 
                            <Pressable 
                                onPress={() => snapeToIndex(0)}>
                                <Text style={ AppStyle.textSelectIos } > {userPillText} </Text>
                            </Pressable>
                            : null }
                        </Surface>
        
                        { userPillText != "Selectionner une pastille" ?
                        <View style={AppStyle.itemContainerView2}>

                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ AppStyle.itemPatchContainerGreen } >   

                                <Text style={ AppStyle.itemPatchText2 }>Nom de la pastille : {userPillSelected.pillName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine :  {userPillSelected.pillNicotine} (mg) </Text>
                            
                            </Surface>
        
                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ AppStyle.btnAddPatch } >   

                                <TouchableOpacity
                                    onPress={() => addUserPill()}
                                    activeOpacity={0.6}>
                                    <Text style={AppStyle.btnAddPatchText}>Consommer une pastille</Text>
                                </TouchableOpacity>
                            </Surface>
        
                            { isLoaderUserAdd == true ?
                            <View>
                                <LoaderComponent text="Ajout de la pastille en cours ..." step="" color={Colors.blueFb} size="large"/>
                            </View>
                            :
                            <Text style={AppStyle.textError}>{errorAddPill}</Text>
                            }
                        </View>
                        : null }
                    </View> 
                    }
                </View>
            
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: Colors.blueFb }}
                    backgroundStyle={{ backgroundColor: Colors.white }}
                    backdropComponent={renderBackdrop}>

                    <View style={styles.contentContainer}>

                        <Text style={styles.containerHeadline}> Choisir une pastille </Text>
                        
                        <View style={AppStyle.pickerSelect}>
                            <Picker
                                selectedValue={userPill}
                                onValueChange={(pill) => handlePickerSelect(pill) }
                                placeholder="Selectionner une pastille"
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

            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ 'Consomation de la pastille : '+userPillSelected.pillName}/>
            
        </SafeAreaProvider>
    )
  
}

export default SettingPillComponent

const styles = StyleSheet.create({
    container: {
		flex: 1,
		alignItems: 'center'
	},
    contentContainer: {
		alignItems: 'center'
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20,
		color: Colors.colorOrange
	}
})