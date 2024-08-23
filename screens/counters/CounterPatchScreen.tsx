// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Dimensions, ScrollView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Surface } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Styles & Colors
import Colors from '../../constants/ColorConstant';
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
import { getUserLastPatchByIdUserFireStore, setUserPatchsFireStore } from '../../api/UserPatchsApi';
import { getDifference2Date } from '../../helpers/DateHelper';

/**
 * SettingPatchComponent
 */
const SettingPatchComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(true)

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
            //setErrorAddPatch("addUserPatch error : " + error.message)
            console.log("Error addUserPatchs")
            console.error(error)
        })
    }

    let [diff, setDiff] = useState<string>("")
    const intervalRef:any = useRef();

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
                setDiff("Vous n'avez pas encore appliquer de patch")
            }
            
        }).catch((error) => {
            console.log("Error getUserLastPatchByIdUserFireStore")
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
        <SafeAreaProvider style={styles.mainContainer}>
            <GestureHandlerRootView>
                <ScrollView>
                <View style={styles.statContainer}>
                    { isLoaderGet == true ? 
                    <View style={styles.loadContainerView}>
                        <LoaderComponent text="Chargement des patchs" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={styles.mainContainerView}>

                        <View style={styles.statDispositifNicotine}>
                        <Surface 
                            elevation={4}
                            category="medium"
                            style={ styles.surfaceContainerBlue } >   

                            { Platform.OS === 'android' ? 
                            <View>
                                <View style={ styles.titleContainer2 }>
                                    <Text style={ styles.titleText }>Choisir un patch</Text>
                                </View>
                                <Picker
                                    selectedValue={userPatch}
                                    onValueChange={(patch) => handlePickerSelect(patch) }
                                    placeholder="Selectionner un patch"
                                    mode={'dialog'}
                                    style={{backgroundColor: Colors.white, borderBottomStartRadius: 5, borderBottomEndRadius: 5}}>   
                                    {dataPatchTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)}          
                                </Picker>
                            </View>
                            : null }

                            { Platform.OS === 'ios' ? 
                            <Pressable 
                                onPress={() => snapeToIndex(0)}>

                                <View style={ styles.titleContainer }>
                                    <Text style={ styles.titleText }>Choisir un patch</Text>
                                </View>

                                <View style={ styles.descContainerPicker }>
                                    <Text style={ styles.descTextPicker }>{userPatchText}</Text>
                                </View>
                            </Pressable>
                            : null }
                        </Surface>
                        </View>

                        { userPatchText != "Selectionner un patch" ?
                        <View style={styles.mainC}>

                            <View style={styles.statDispositifNicotine}>
                                <View style={{flex: 1}}>
                                <Surface 
                                    elevation={4}
                                    category="medium"
                                    style={ styles.surfaceContainerOrange2 } >  

                                    <View style={ styles.titleContainerOrange }>
                                        <Text style={ styles.titleText }>{userPatchSelected.patchName}</Text>
                                    </View>

                                    <View style={ styles.descContainerOrange }>
                                        <Text style={ styles.descText }>Nicotine : {userPatchSelected.patchNicotine} mg/24h</Text>
                                    </View>

                                </Surface>

                                <TouchableOpacity
                                    onPress={() => addUserPatch()}
                                    activeOpacity={0.6}
                                    style={styles.surfaceBtnBlue3}>

                                    { isLoaderUserAdd == true ?
                                    <LoaderComponent text="Ajout du patch en cours ..." step="" color={Colors.white} size="large"/>
                                    :
                                    <Text style={styles.surfaceBtnBlueText}>Appliquer un patch</Text>
                                    }
                                </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.statDispositifNicotine}>
                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ styles.surfaceContainerGreen } >   

                                <View style={ styles.titleContainer }>
                                    <Text style={ styles.titleText }>Dernier patch appliqué</Text>
                                </View>

                                <View style={ styles.descContainer }>
                                    <Text style={ styles.descContenairViewText }>{diff}</Text>
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

const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({

    statDispositifNicotine: {
        flexDirection: "row",
        alignItems: 'center',
    },

    statContainer: {
        margin:8
    },

    mainContainer: {
        flex: 1,
    },

    mainC: {
        alignItems: 'center',
    },

    mainContainerView: {
        alignItems: 'center',
        flexDirection: 'column',
    },

    loadContainerView : {
        alignItems: 'center',
        alignContent: 'center'
    },

    pickerSelectOrange: {
        width: screenWidth - 32,
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        marginTop:16,
    },

    patchInfoContainerView: {
        alignItems: 'center',
    },

    titleContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainer2: {
        backgroundColor: Colors.white,
        padding: 16,
        paddingBottom: 0,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainerOrange: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    descContainer: {
        padding: 16,
    },

    descContainerOrange: {
        backgroundColor: Colors.colorOrange,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
    },

    descContenairViewText: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
    },

    descText: {
        color: Colors.white,
        fontSize: 18,
    },

    descContainerPicker: {
        backgroundColor: Colors.white,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        padding: 16,
        paddingTop: 0
    },

    descTextPicker: {
        color: Colors.blueFb,
        fontSize: 18,
    },

    surfaceContainerOrange : {
        flex: 1,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerOrange2 : {
        backgroundColor: Colors.colorOrange,
        flex: 1,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 5,
    },

    surfaceContainerGreen: {
        flex: 1,
        backgroundColor: Colors.green,
        borderWidth: 2,
        borderColor: Colors.green,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerBlue: {
        flex: 1,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        margin: 8,
    },

    surfaceBtnBlue: {
        width: screenWidth - 32,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        padding: 16,
        marginTop: 16,
    },

    surfaceBtnBlue2: {
        backgroundColor: Colors.blueFb,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        padding: 16,
    },

    surfaceBtnBlue3: {
        backgroundColor: Colors.blueFb,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        padding: 16,
        marginStart: 8,
        marginEnd:8,
        marginBottom: 8,
    },

    surfaceBtnBlueText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },



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