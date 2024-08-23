// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Dimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
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
import { getDifference2Date } from '../../helpers/DateHelper';

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

    let [diff, setDiff] = useState<string>("")
    const intervalRef:any = useRef();

    const startInterval = (date: Date) => {
        //console.log("start interval")
        intervalRef.current = setInterval(() => {
            const diff = getDifference2Date(date)
            //console.log(diff)
            setDiff(diff)
        }, 1000);
    }

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

        closeInterval()

        getUserLastPillByIdUserFireStore(userSelector.userId).then((pillList) => {

            if(pillList != null){
                const d = pillList.dateTime.toDate()
                startInterval(d)                
            } else {
                setDiff("Vous n'avez pas encore consommer de pastille")
            }
            
        }).catch((error) => {
            console.log("Error getUserLastPillByIdUserFireStore")
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
        <SafeAreaProvider style={styles.mainContainer}>
            <GestureHandlerRootView>
                <ScrollView>
                <View style={styles.statContainer}>
                    { isLoaderGet == true ? 
                    <View style={styles.loadContainerView}>
                        <LoaderComponent text="Chargement des pastilles" step="" color={Colors.blueFb} size="large"/>
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
                                    <Text style={ styles.titleText }>Choisir une pastille</Text>
                                </View>

                                <Picker
                                    selectedValue={userPill}
                                    onValueChange={(pill) => handlePickerSelect(pill) }
                                    placeholder="Selectionner une pastille"
                                    mode={'dialog'}
                                    style={{backgroundColor: Colors.white}}
                                >   
                            
                            {
                            dataPillTabItem.map(item => <Picker.Item key={item.value} label={item.label} value={item.value}/>)
                            }          
                            </Picker>
                            </View>
                            : null }

                            { Platform.OS === 'ios' ? 
                            <Pressable 
                                onPress={() => snapeToIndex(0)}>

                                <View style={ styles.titleContainer }>
                                    <Text style={ styles.titleText }>Choisir une pastille</Text>
                                </View>

                                <View style={ styles.descContainerPicker }>
                                    <Text style={ styles.descTextPicker }>{userPillText}</Text>
                                </View>
                            </Pressable>
                            : null }
                        </Surface>
                        </View>        
        
                        { userPillText != "Selectionner une pastille" ?
                        <View style={styles.mainC}>
                             
                            <View style={styles.statDispositifNicotine}>
                            <View style={{flex: 1}}>
                                <Surface 
                                    elevation={4}
                                    category="medium"
                                    style={ styles.surfaceContainerOrange2 } >   

                                    <View style={ styles.titleContainerOrange }>
                                        <Text style={ styles.titleText }>{userPillSelected.pillName}</Text>
                                    </View>

                                    <View style={ styles.descContainerOrange }>
                                        <Text style={ styles.descText }>Nicotine : {userPillSelected.pillNicotine} mg</Text>
                                    </View>
                                </Surface>
                                <TouchableOpacity
                                    onPress={() => addUserPill()}
                                    activeOpacity={0.6}
                                    style={styles.surfaceBtnBlue3}>

                                    { isLoaderUserAdd == true ?
                                    <LoaderComponent text="Ajout de la pastille en cours ..." step="" color={Colors.white} size="large"/>
                                    :
                                    <Text style={styles.surfaceBtnBlueText}>Consommer une pastille</Text>
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
                                    <Text style={ styles.titleText }>Dernière pastille consommer</Text>
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
        margin: 8,
        borderRadius: 5,

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
        flex: 1,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        padding: 16,
        margin: 8
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