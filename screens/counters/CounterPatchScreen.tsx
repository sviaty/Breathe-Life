// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Keyboard, Button } from 'react-native'
import { Stack, TextInput, Backdrop } from "@react-native-material/core";
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
import Patch from '../../datas/PatchData'
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import App from '../../App';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PatchBottomSheetScreen from './PatchBottomSheetScreen';

const db = getFirestore(firebaseConfig);

/**
 * SettingPatchComponent
 */
const SettingPatchComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isBackdropRevealed, setIsBackdropRevealed] = useState<boolean>(true)

    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [errorAddPatch, setErrorAddPatch] = useState<string>("")
    
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    let [userPatch, setUserPatch] = useState<string>("");

    const p = new Patch("","",0)
    let [userPatchSelected, setUserPatchSelected] = useState<Patch>(p);

    let [dataPatchTab, setDataPatchTab] = useState<Patch[]>([]);
    let [dataPatchTabItem, setDataPatchTabItem] = useState<any[]>([]);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        //console.log('useEffect')
        getPatchList()
        //bottomSheetRef.current?.close()
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
        
        const q = query(collection(db, "patchs"));

        const patchList = 
        await getDocs(q).then((patchList) => {
            //console.log(patchList.size);

            const cItem = { label: "Selectionner un patch", value: "Selectionner un patch" }
            //console.log(pItem);

            dataPatchTabItem.push(cItem)
            setDataPatchTabItem([...dataPatchTabItem])

            patchList.forEach((patch) => {
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
            console.error("Error get patch in firestore database : ")
            console.error(error)
        }) 
    }

    /**
     * Function changePatchSelectedFomUserIdPatch
     */
    const changePatchSelectedFomUserIdPatch = () => {
        //console.log("changePatchSelectedFomUserIdPatch")
        setUserPatch("")
        //console.log(userSelector.idPatch)

        if(userSelector.idPatch != "undefined"){
            setUserPatch(userSelector.idPatch)
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == userSelector.idPatch){
                    setUserPatchSelected(patch)
                    //console.log(patch)
                }
            })
        }
    }

    /**
     * Function handleHideAddPatch
     */
    const handlePickerSelect = (idPatch: string) => {
        setUserPatch(idPatch)
        //console.log(idPatch)

        if(idPatch != "Selectionner un patch"){
            //console.log('IS NOT undefined')
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == idPatch){
                    setUserPatchSelected(patch)
                    //console.log(patch)
                }
            })
    
            setUserIdPatch(idPatch)
        } else {
            const p = new Patch('', idPatch, 0)
            setUserPatchSelected(p)
            //console.log('IS undefined')
        }
        
    }

    /**
     * Function setUserIdPatch
     * @param idPatch 
     */
    const setUserIdPatch = async (idPatch: string) => {

        const userDoc = doc(db, "users", userSelector.userId)
        
        await setDoc(userDoc, {
            userName: userSelector.userName,
            userMail: userSelector.userMail,
            idPatch: idPatch,
            idPill: userSelector.idPill,
            idCigarette: userSelector.idCigarette,
        }).then((value) => {
            //console.log(value);

            const u = new User(userSelector.userId, userSelector.userName, userSelector.userMail, userSelector.userToken, idPatch, userSelector.idPill, userSelector.idCigarette);
            dispatch(setUser(u));

        }).catch((error) => {
            console.error("Error set user in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function handleAddUserPatch
     */
    const handleAddUserPatch = () => {
        addUserPatch()
    }

    /**
     * Function addUserPatch
     */
    const addUserPatch = async () => {
        setIsLoaderUserAdd(true)
        setErrorAddPatch("")

        const dateTime = serverTimestamp()
        const patchDoc = collection(db, "userPatchs")

        await addDoc(patchDoc, {
            idUser: userSelector.userId,
            idPatch: userPatch,
            dateTime: dateTime
        }).then((value) => {
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {
            setIsLoaderUserAdd(false)
            setErrorAddPatch("addUserPatch error : " + error.message)
            console.error(error)
        })
    }

    /**
     * <PickerSelect
        onValueChange={(patch) => handlePickerSelect(patch) }
        style={pickerSelectStyles}
        placeholder={{
            label: "Selectionner un patch",
            value: "",
            color: Colors.colorOrange
        }}
        value={userPatch}
        items={dataPatchTabItem}
    />
    */

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        getPatchList()
    }

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
                        <LoaderComponent text="Chargement des patchs" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={AppStyle.viewContenair}>
                        
                        <View style={AppStyle.pickerSelectOrange}>
                            { Platform.OS === 'android' ? 
                            <Picker
                                selectedValue={userPatch}
                                onValueChange={(patch) => handlePickerSelect(patch) }
                                placeholder="Selectionner un patch"
                                mode={'dialog'}
                            >   
                            {
                            dataPatchTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                            }          
                            </Picker>
                            : null }

                            { Platform.OS === 'ios' ? 
                            <Pressable 
                                onPress={() => snapeToIndex(1)}>
                                <Text style={ AppStyle.textSelectIos } > {userPatchSelected.patchName} </Text>
                            </Pressable>
                            : null }
                        </View>

                        { userPatch != "Selectionner un patch" ?
                        <View style={AppStyle.itemContainerView2}>
                                        
                            <View style={ AppStyle.itemPatchContainer2 } >
                                <Text style={ AppStyle.itemPatchText2 }>Nom du patch : {userPatchSelected.patchName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine :  {userPatchSelected.patchNicotine} (mg) </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleAddUserPatch()}
                                activeOpacity={0.6}
                                style={ AppStyle.btnAddPatch }>
                                <Text style={AppStyle.btnAddPatchText}>Appliquer un patch</Text>
                            </TouchableOpacity>

                            { isLoaderUserAdd == true ?
                            <View>
                                <LoaderComponent text="Ajout du patch en cours ..." step="" color={Colors.blueFb} size="large"/>
                            </View>
                            :
                            <Text style={AppStyle.textError}>{errorAddPatch}</Text>
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

                        <Text style={styles.containerHeadline}> Choisir un patch </Text>
                        
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

        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ 'Application du patch : '+userPatchSelected.patchName}/>
                
            
        </SafeAreaProvider>
    )

    /*
        <Backdrop
            revealed={isBackdropRevealed}
            backLayer={backLayerView()}
            backLayerContainerStyle={{flex:1, backgroundColor: Colors.background}}
            frontLayerContainerStyle={{flex:1, backgroundColor: Colors.transparent}} >

            <View style={AppStyle.containerCenter2}>
                <Pressable 
                    style={{flex: 1, alignSelf:'stretch', alignItems: 'center'}}
                    onPress={() => handleOpenCloseBackdrop()}>
                </Pressable>

                <View style={AppStyle.containerCenter3b}>
                    <View style={AppStyle.containerCenter4}>
                        <Text style={AppStyle.containerCenter4Text}>Choisir un patch</Text>
                    </View>
                   
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
            </View>
        
        </Backdrop>
    */
}

export default SettingPatchComponent

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