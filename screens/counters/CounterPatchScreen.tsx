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
import { setUserPatchsFireStore } from '../../api/UserPatchsApi';

/**
 * SettingPatchComponent
 */
const SettingPatchComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)

    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [errorAddPatch, setErrorAddPatch] = useState<string>("")
    
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    let [userPatch, setUserPatch] = useState<string>("Selectionner un patch");
    let [userPatchText, setUserPatchText] = useState<string>("Selectionner un patch");

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

            const cItem = { label: "Selectionner un patch", value: "Selectionner un patch" }
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
            console.log("Error get patch in firestore database")
            console.error(error.message)
        }) 

        /*
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
        */
    }

    /**
     * Function changePatchSelectedFomUserIdPatch
     */
    const changePatchSelectedFomUserIdPatch = () => {
        //console.log("changePatchSelectedFomUserIdPatch")
        userPatch = "Selectionner un patch"
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

        if(idPatch != "Selectionner un patch"){
            //console.log('IS NOT undefined')
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
            setUserPatchText("Selectionner un patch")
            //console.log('IS undefined')

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
            userSelector.userSmokeStartDate, 
            userSelector.userSmokeAvgNbr, 
            idPatch, 
            userSelector.idPill, 
            userSelector.idCigarette);
        
        setUserFireStore(user).then((value) => {
            //console.log(value)
            dispatch(setUser(user));

        }).catch((error) => {
            console.log("Error set user idPatch in firestore database : ")
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
            dateTime: serverTimestamp()
        }

        setUserPatchsFireStore(userPAtchDatas).then((value) => {

            //console.log(value)
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {
            setIsLoaderUserAdd(false)
            //setErrorAddPatch("addUserPatch error : " + error.message)
            console.log("Error addUserPatchs")
            console.error(error)
        })
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        getPatchList()
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
                        <LoaderComponent text="Chargement des patchs" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={AppStyle.viewContenair}>
                        
                        <Surface 
                            elevation={4}
                            category="medium"
                            style={ AppStyle.pickerSelectOrange } >   

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
                                onPress={() => snapeToIndex(0)}>
                                <Text style={ AppStyle.textSelectIos } > {userPatchText} </Text>
                            </Pressable>
                            : null }
                        </Surface>

                        { userPatchText != "Selectionner un patch" ?
                        <View style={AppStyle.itemContainerView2}>

                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ AppStyle.itemPatchContainerGreen } >  

                                <Text style={ AppStyle.itemPatchText2 }>Nom du patch : {userPatchSelected.patchName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine :  {userPatchSelected.patchNicotine} (mg) </Text>

                            </Surface>

                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ AppStyle.btnAddPatch } > 

                                <TouchableOpacity
                                    onPress={() => addUserPatch()}
                                    activeOpacity={0.6}>
                                    <Text style={AppStyle.btnAddPatchText}>Appliquer un patch</Text>
                                </TouchableOpacity>

                            </Surface>

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