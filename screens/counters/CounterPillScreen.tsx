// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform, Text, View, TouchableOpacity, Pressable } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import PickerSelect from 'react-native-picker-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const db = getFirestore(firebaseConfig);

/**
 * SettingPillComponent 
 */
const SettingPillComponent = () => {

     // UseState
     const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)

     const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
     const [errorAddPill, setErrorAddPill] = useState<string>("")
     
     const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
 
     let [userPill, setUserPill] = useState<string>("");
 
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
        
        const q = query(collection(db, "pills"));
        
        await getDocs(q).then((pillList) => {
            //console.log(pillList.size);

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
            console.error("Error get pill in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function changePillSelectedFomUserIdPill
     */
     const changePillSelectedFomUserIdPill = () => {
        //console.log("changePatchSelectedFomUserIdPatch")
        setUserPill("")
        if(userSelector.idPill != "undefined"){
            setUserPill(userSelector.idPill)
            dataPillTab.forEach((pill) => {
                if(pill.idPill == userSelector.idPill){
                    setUserPillSelected(pill)
                    //console.log(pill)
                }
            })
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
                    //console.log(pill)
                }
            })
    
            setUserIdPill(idPill)
        } else {
            const p = new Pill('', idPill, 0)
            setUserPillSelected(p)
            console.log('IS undefined')
        }
    }

    /**
     * Function setUserIdPill
     * @param idPill 
     */
    const setUserIdPill = async (idPill: string) => {

        const userDoc = doc(db, "users", userSelector.userId)
        
        await setDoc(userDoc, {
            userName: userSelector.userName,
            userMail: userSelector.userMail,
            userBirthDate: userSelector.userBirthDate, 
            userSmokeStartDate: userSelector.userSmokeStartDate, 
            userSmokeAvgNbr: userSelector.userSmokeAvgNbr, 
            idPatch: userSelector.idPatch,
            idPill: idPill,
            idCigarette: userSelector.idCigarette,
        }).then((value) => {
            console.log(value);
            const u = new User(
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
            dispatch(setUser(u));
        }).catch((error) => {
            console.error("Error set user in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function handleAddUserPill
     */
    const handleAddUserPill = () => {
        addUserPill()
    }

    /**
     * Function addUserPill
     */
     const addUserPill = async () => {
        setIsLoaderUserAdd(true)
        setErrorAddPill("")

        const dateTime = serverTimestamp()
        const pillDoc = collection(db, "userPills")

        await addDoc(pillDoc, {
            idUser: userSelector.userId,
            idPill: userPill,
            dateTime: dateTime
        }).then((value) => {
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {
            setIsLoaderUserAdd(false)
            setErrorAddPill("addUserPill error : " + error.message)
            console.error(error)
        })
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        getPillist()
    }

    /**
     * <PickerSelect
        onValueChange={(pill) => handlePickerSelect(pill) }
        style={pickerSelectStyles}
        placeholder={{
            label: "Selectionner une pastille",
            value: "",
            color: Colors.colorOrange
        }}
        value={userPill}
        items={dataPillTabItem}
    />
    */

    const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

	const handleClosePress = () => bottomSheetRef.current?.close();
	const handleOpenPress = () => bottomSheetRef.current?.expand();
	const handleCollapsePress = () => bottomSheetRef.current?.collapse();
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
                        
                        <View style={AppStyle.pickerSelectOrange}>

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
                                onPress={() => snapeToIndex(1)}>
                                <Text style={ AppStyle.textSelectIos } > {userPillSelected.pillName} </Text>
                            </Pressable>
                            : null }
                        </View>
        
                        { userPill != "Selectionner une pastille" ?
                        <View style={AppStyle.itemContainerView2}>
                                        
                            <View style={ AppStyle.itemPatchContainer2 } >
                                <Text style={ AppStyle.itemPatchText2 }>Nom de la pastille : {userPillSelected.pillName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine :  {userPillSelected.pillNicotine} (mg) </Text>
                            </View>
        
                            <TouchableOpacity
                                onPress={() => handleAddUserPill()}
                                activeOpacity={0.6}
                                style={ AppStyle.btnAddPatch }>
                                <Text style={AppStyle.btnAddPatchText}>Consommer une pastille</Text>
                            </TouchableOpacity>
        
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    },
    inputAndroid: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    }
});