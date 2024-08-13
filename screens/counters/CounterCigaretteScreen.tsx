// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform, Text, View, TouchableOpacity, Alert, Pressable, Keyboard } from 'react-native'
import { Stack, TextInput, Backdrop } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import PickerSelect from 'react-native-picker-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

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
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import UserSettingsStyle from '../../styles/UserSettingsStyle';
import LoginSigninStyle from '../../styles/LoginSigninStyle';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
const db = getFirestore(firebaseConfig);

/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

const SettingCigaretteComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isBackdropRevealed, setIsBackdropRevealed] = useState<boolean>(true)

    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [errorAddPill, setErrorAddPill] = useState<string>("")

    const [isLoaderCigAdd, setIsLoaderCigAdd] = useState<boolean>(false)
    const [errorAddCigUser, setErrorAddCigUser] = useState<string>("")
    
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [textSnackBar, setTextSnackBar] = useState<string>("")

    let [userCig, setUserCig] = useState<string>("7CqNNUDGFhDV5hFgLVx1");

    const c = new Cigarette("","",0,0,0,0)
    let [userCigSelected, setUserCigSelected] = useState<Cigarette>(c);

    let [dataCigTab, setDataCigTab] = useState<Cigarette[]>([]);
    let [dataCigTabItem, setDataCigTabItem] = useState<any[]>([]);

    const [cigName, setCigName] = useState<string>("")
    const [errorCigName, setErrorCigName] = useState<string>("")

    const [cigNicotine, setCigNicotine] = useState<string>("")
    const [errorCigNicotine, setErrorCigNicotine] = useState<string>("")

    const [cigGoudron, setCigGoudron] = useState<string>("")
    const [errorCigGoudron, setErrorCigGoudron] = useState<string>("")

    const [cigCarbonne, setCigCarbonne] = useState<string>("")
    const [errorCigCarbonne, setErrorCigCarbonne] = useState<string>("")

    const [cigPaquetNbr, setCigPaquetNbr] = useState<string>("")
    const [errorCigPaquetNbr, setErrorCigPaquetNbr] = useState<string>("")

    const [cigPaquetPrice, setCigPaquetPrice] = useState<string>("")
    const [errorCigPaquetPrice, setErrorCigPrice] = useState<string>("")
    
    

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getCigList()
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
        
        const q = query(collection(db, "cigarettes"));
        
        await getDocs(q).then((cigList) => {
            //console.log(pillList.size);

            const cItem = { label: "Selectionner une marque de cigarette", value: "Selectionner une marque de cigarette" }
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
                );
                //console.log(p);

                const cItem = { label: cigData.cigaretteName, value: cig.id }
                //console.log(pItem);

                dataCigTabItem.push(cItem)
                setDataCigTabItem([...dataCigTabItem])

                dataCigTab.push(c)
                setDataCigTab([...dataCigTab])
            });

            getCigUserList()

        }).catch((error) => {
            setIsLoaderGet(false)
            console.error("Error get cigarette in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function getCigist
     */
    const getCigUserList = async () => {
        const q = query(collection(db, "cigarettesUser"), where("idUser", "==", userSelector.userId));
        
        await getDocs(q).then((cigList) => {
            //console.log(pillList.size);
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
                );
                //console.log(p);

                const cItem = { label: cigData.cigaretteName, value: cig.id }
                //console.log(pItem);

                dataCigTabItem.push(cItem)
                setDataCigTabItem([...dataCigTabItem])

                dataCigTab.push(c)
                setDataCigTab([...dataCigTab])
            });

            // Call after load cig list
            changeCigSelectedFomUserIdCig()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            console.error("Error get cigarette user in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function changeCigSelectedFomUserIdCig
     */
    const changeCigSelectedFomUserIdCig = () => {
        //console.log("changeCigSelectedFomUserIdCig")
        setUserCig("")
        if(userSelector.idCigarette != "undefined"){
            setUserCig(userSelector.idCigarette)
            dataCigTab.forEach((cig) => {
                if(cig.idCigarette == userSelector.idCigarette){
                    setUserCigSelected(cig)
                    //console.log(cig)
                }
            })
        }
    }

    /**
     * Function handlePickerSelect
     */
    const handlePickerSelect = (idCig: string) => {
        setUserCig(idCig)
        //console.log(idCig)

        if(idCig != "Selectionner une marque de cigarette"){
            //console.log('IS NOT undefined')
            dataCigTab.forEach((cig) => {
                if(cig.idCigarette == idCig){
                    setUserCigSelected(cig)
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
            );
            setUserCigSelected(c)

            //console.log('IS undefined')
        }
    }

    /**
     * Function setUserIdCig
     * @param idCig 
     */
     const setUserIdCig = async (idCig: string) => {

        const userDoc = doc(db, "users", userSelector.userId)
        
        await setDoc(userDoc, {
            userName: userSelector.userName,
            userMail: userSelector.userMail,
            idPatch: userSelector.idPatch,
            idPill: userSelector.idPill,
            idCigarette: idCig,
        }).then((value) => {
            //console.log(value);

            const u = new User(userSelector.userId, userSelector.userName, userSelector.userMail, userSelector.userToken, userSelector.idPatch, userSelector.idPill, idCig);
            dispatch(setUser(u));
        }).catch((error) => {
            console.error("Error set user in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function handleAddUserPill
     */
    const handleAddUserCig = () => {

        Alert.alert(
            'Etes vous sure de vouloir fumer cette cigarette ?', 
            '', 
            [
            {
                text: 'Cancel',
                onPress: () => {
                    //console.log('Cancel Pressed')
                },
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    //console.log('OK Pressed')
                    addUserCig()
                },
            }
            ]);
        
    }

    /**
     * Function addUserCig
     */
    const addUserCig = async () => {
        setIsLoaderUserAdd(true)
        setErrorAddPill("")

        const dateTime = serverTimestamp()
        const pillDoc = collection(db, "userCigarettes")

        await addDoc(pillDoc, {
            idUser: userSelector.userId,
            idCigarette: userCig,
            dateTime: dateTime
        }).then((value) => {
            setIsLoaderUserAdd(false)
            setTextSnackBar('Consomation de la cigarette : '+userCigSelected.cigaretteName)
            setIsSnackBar(true)
        }).catch((error) => {
            setIsLoaderUserAdd(false)
            setErrorAddPill("addUserPill error : " + error.message)
            console.error(error)
        })
    }

    const handleAddCig = () => {
        setIsLoaderCigAdd(true)

        setErrorCigName("")
        setErrorCigNicotine("")
        setErrorCigGoudron("")
        setErrorCigCarbonne("")
        setErrorCigPaquetNbr("")
        setErrorCigPrice("")
        
        if(isDataCorrect()){
            createNewCigUser()
        }
    }

    /**
     * Function isDataCorrect
     * @returns boolean
     */
    const isDataCorrect = (): boolean => {
        if(cigName.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigName("Le nom de la marque est vide")
            return false
        }

        if(cigNicotine.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigNicotine("Le taux de nicotine est obligatoire")
            return false
        }

        if(cigGoudron.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigGoudron("Le taux de goudron est obligatoire")
            return false
        }

        if(cigCarbonne.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigCarbonne("Le monoxyde de carbonne est obligatoire")
            return false
        }

        if(cigPaquetNbr.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPaquetNbr("Le nombre de cigarette par paquet est obligatoire")
            return false
        }

        if(cigPaquetPrice.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPrice("Le prix du paquet est obligatoire")
            return false
        }

        return true 
    }

    /**
     * Function createNewCigUser
     */
    const createNewCigUser = async () => {

        const nicotine = parseFloat(parseFloat(cigNicotine.replace(",", ".")).toFixed(1))
        const price = parseFloat(parseFloat(cigPaquetPrice.replace(",", ".")).toFixed(2))

        await addDoc(collection(db, "cigarettesUser"), {
            cigaretteName: cigName,
            cigaretteNicotine: nicotine,
            cigaretteGoudron: parseInt(cigGoudron),
            cigaretteCarbone: parseInt(cigCarbonne),
            cigaretteNbr: parseInt(cigPaquetNbr),
            cigarettePrice: price,
            idUser: userSelector.userId
        }).then((value) => {
            setIsLoaderCigAdd(false)
            setTextSnackBar('Ajout de la marque de cigarette : '+ cigName)
            setIsSnackBar(true)

            //handleOpenCloseBackdrop()
            bottomSheetRefAdd.current?.close()

            setCigName("")
            setCigNicotine("")
            setCigGoudron("")
            setCigCarbonne("")
            setCigPaquetNbr("")
            setCigPaquetPrice("")

            getCigList()

        }).catch((error) => {
            setIsLoaderCigAdd(false)
            setErrorAddCigUser("Error add cigarette : "+ error)
            console.error("Error add cig : "+ error);
        })
    };

    const handleOpenCloseBackdrop = () => {
        handleKeyboardHide()
        //console.log(isBackdropRevealed)
        setIsBackdropRevealed(isBackdropRevealed => !isBackdropRevealed)
    }

    const handleKeyboardHide = () => {
        Keyboard.dismiss()
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        getCigList()
    }

    /*
    <PickerSelect
        onValueChange={(cig) => handlePickerSelect(cig) }
        style={pickerSelectStyles}
        placeholder={{
            label: "Selectionner une marque de cigarette",
            value: "",
            color: Colors.colorOrange
        }}
        value={userCig}
        items={dataCigTabItem}

        https://github.com/maxs15/react-native-modalbox
    />
    */

    const backLayerView = () => {

    }

    const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
    const snapPointsAdd = useMemo(() => ['80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const bottomSheetRefAdd = useRef<BottomSheetModal>(null);
    const snapeToIndexAdd = (index: number) => bottomSheetRefAdd.current?.snapToIndex(index);

	const handleClosePress = () => {
        bottomSheetRef.current?.close()
    };

	const handleOpenPress = () => bottomSheetRef.current?.expand();
	const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
	
    const renderBackdrop = useCallback( 
		(props: any) => 
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
		[]
	);

    const renderBackdropAdd = useCallback( 
		(props: any) => 
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} onPress={ () => handleKeyboardHide()} {...props} />,
		[]
	);

    // View JSX
    return (
        <SafeAreaProvider style={AppStyle.container}>
            <GestureHandlerRootView>
                <View>
                    { isLoaderGet == true ? 
                    <View>
                        <LoaderComponent text="Chargement des cigarettes" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={AppStyle.viewContenair}>
                        
                        <View style={AppStyle.selectAddCig}>
                            <View style={AppStyle.pikerSelectCig}>

                                { Platform.OS === 'android' ? 
                                <Picker
                                    selectedValue={userCig}
                                    onValueChange={(cig) => handlePickerSelect(cig) }
                                    placeholder="Selectionner une marque de cigarette"
                                    mode={'dialog'}
                                >   
                                {
                                dataCigTabItem.map(cigTabItem => <Picker.Item key={cigTabItem.value} label={cigTabItem.label} value={cigTabItem.value}/>)
                                }          
                                </Picker>
                                : null }

                                { Platform.OS === 'ios' ? 
                                <Pressable 
                                    onPress={() => snapeToIndex(1)}>
                                    <Text style={ AppStyle.textSelectIos } > {userCigSelected.cigaretteName} </Text>
                                </Pressable>
                                : null }
                            </View>

                            <View  style={AppStyle.btnAddCigContainer}>
                                <TouchableOpacity
                                    onPress={() => snapeToIndexAdd(0)}
                                    activeOpacity={0.6}
                                    style={ AppStyle.btnAddCig2 }>
                                    <Text style={AppStyle.btnAddCigText2}> + </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
        
                        { userCig != "Selectionner une marque de cigarette" ?
                        <View style={AppStyle.itemContainerView2}>
                                        
                            <View style={ AppStyle.itemPatchContainer2 } >
                                <Text style={ AppStyle.itemPatchText2 }>Marque : {userCigSelected.cigaretteName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine : {userCigSelected.cigaretteNicotine} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Goudron : {userCigSelected.cigaretteGoudron} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Monoxyde de carbone : {userCigSelected.cigaretteCarbone} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nombre de cigarette : {userCigSelected.cigarettePrice} / paquet </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Prix du paquet : {userCigSelected.cigarettePrice} (euros)</Text>
                            </View>
        
                            <TouchableOpacity
                                onPress={() => handleAddUserCig()}
                                activeOpacity={0.6}
                                style={ AppStyle.btnAddPatch }>
                                <Text style={AppStyle.btnAddPatchText}>Fumer une cigarette</Text>
                            </TouchableOpacity>
        
                            { isLoaderUserAdd == true ?
                            <View>
                                <LoaderComponent text="Ajout de la cigarette en cours ..." step="" color={Colors.blueFb} size="large"/>
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
                    backgroundStyle={{ backgroundColor: Colors.background }}
                    backdropComponent={renderBackdrop}>

                    <View style={styles.contentContainer}>

                        <Text style={styles.containerHeadline}> Choisir une marque de cigarette </Text>
                        
                        <View style={AppStyle.pickerSelect}>
                            <Picker
                                selectedValue={userCig}
                                onValueChange={(cig) => handlePickerSelect(cig) }
                                placeholder="Selectionner une marque de cigarette"
                                mode={'dialog'}
                            >   
                            {
                            dataCigTabItem.map(cigTabItem => <Picker.Item key={cigTabItem.value} label={cigTabItem.label} value={cigTabItem.value}/>)
                            }          
                            </Picker>
                        </View>
                    </View>
                </BottomSheet>


                <BottomSheet
                    ref={bottomSheetRefAdd}
                    index={-1}
                    snapPoints={snapPointsAdd}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{ backgroundColor: Colors.blueFb }}
                    backgroundStyle={{ backgroundColor: Colors.background }}
                    backdropComponent={renderBackdropAdd}>

                    <View style={styles.contentContainer2}>

                        <Text style={styles.containerHeadline}> Ajouter une marque de cigarette </Text>
                        
                        <View>

                        <ScrollView
                            persistentScrollbar={true}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            automaticallyAdjustKeyboardInsets={true}>

                        <Stack spacing={0} style={AppStyle.stackLogin2}>

                            <BottomSheetTextInput
                                placeholder="Entrer le nom de la marque"
                                keyboardType="default"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigName}
                                onChangeText={setCigName} />

                            <BottomSheetTextInput
                                placeholder="Entrer le taux de nicotine (mg)"
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigNicotine}
                                onChangeText={setCigNicotine} />

                            <BottomSheetTextInput
                                placeholder="Entrer le taux de goudron (mg)"
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigGoudron}
                                onChangeText={setCigGoudron} />

                            <BottomSheetTextInput
                                placeholder="Entrer le taux de monoxyde de carbonne (mg)"
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigCarbonne}
                                onChangeText={setCigCarbonne} />

                            <BottomSheetTextInput
                                placeholder="Entrer le nombre de cigarette par paquet"
                                keyboardType="number-pad"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigPaquetNbr}
                                onChangeText={setCigPaquetNbr} />

                            <BottomSheetTextInput
                                placeholder="Entrer le prix du paquet (euros)"
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.bootomTextInput}
                                value={cigPaquetPrice}
                                onChangeText={setCigPaquetPrice} />

                            { isLoaderCigAdd == true ?
                            <View>
                                <LoaderComponent text="Ajout de la marque de cigarette en cours ..." step="" color={Colors.blueFb} size="large"/>
                            </View>
                            :
                            <View>
                                <TouchableOpacity
                                    onPress={() => handleAddCig()}
                                    activeOpacity={0.6}
                                    style={AppStyle.btnCigAdd}>
                                    <Text style={LoginSigninStyle.buttonText}>Ajouter</Text>
                                </TouchableOpacity>

                                <Text style={AppStyle.textError}>{errorAddCigUser}</Text>
                            </View>
                            }
                            
                        </Stack>
                        </ScrollView>

                        </View>
                    </View>
                </BottomSheet>


            </GestureHandlerRootView>
            
            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={5000} message={textSnackBar}/>
            
        </SafeAreaProvider>
    )

   
    /*
    return (
        
       <Backdrop
            revealed={isBackdropRevealed}
            backLayer={backLayerView()}
            backLayerContainerStyle={{flex:1, backgroundColor: Colors.background}}
            frontLayerContainerStyle={{flex:1, backgroundColor: Colors.transparent}} >

            <View style={AppStyle.containerCenter2}>
                <Pressable 
                    style={{flex:0.10, alignSelf:'stretch', alignItems: 'center'}}
                    onPress={() => handleOpenCloseBackdrop()}>
                </Pressable>

                <View style={AppStyle.containerCenter3}>
                    <View style={AppStyle.containerCenter4}>
                        <Text style={AppStyle.containerCenter4Text}>Ajout d'une marque de cigarette</Text>
                    </View>

                    <View>
                        <GestureHandlerRootView>
                        <ScrollView
                            persistentScrollbar={true}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                            automaticallyAdjustKeyboardInsets={true}>

                        <Stack spacing={0} style={AppStyle.stackLogin2}>

                            <TextInput
                                variant="outlined"
                                label="Entrer le nom de la marque"
                                placeholder="Camel Filter"
                                helperText={errorCigName}
                                color={Colors.colorOrange}
                                keyboardType="default"
                                style={LoginSigninStyle.textInput}
                                value={cigName}
                                onChangeText={setCigName} />

                            <TextInput
                                variant="outlined"
                                label="Entrer le taux de nicotine (mg)"
                                placeholder="0.8"
                                helperText={errorCigNicotine}
                                color={Colors.colorOrange}
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.textInput}
                                value={cigNicotine}
                                onChangeText={setCigNicotine} />

                            <TextInput
                                variant="outlined"
                                label="Entrer le taux de goudron (mg)"
                                placeholder="7"
                                helperText={errorCigGoudron}
                                color={Colors.colorOrange}
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.textInput}
                                value={cigGoudron}
                                onChangeText={setCigGoudron} />

                            <TextInput
                                variant="outlined"
                                label="Entrer le taux de monoxyde de carbonne (mg)"
                                placeholder="9"
                                helperText={errorCigCarbonne}
                                color={Colors.colorOrange}
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.textInput}
                                value={cigCarbonne}
                                onChangeText={setCigCarbonne} />

                            <TextInput
                                variant="outlined"
                                label="Entrer le nombre de cigarette par paquet"
                                placeholder="20"
                                helperText={errorCigPaquetNbr}
                                color={Colors.colorOrange}
                                keyboardType="number-pad"
                                style={LoginSigninStyle.textInput}
                                value={cigPaquetNbr}
                                onChangeText={setCigPaquetNbr} />

                            <TextInput
                                variant="outlined"
                                label="Entrer le prix du paquet (euros)"
                                placeholder="13"
                                helperText={errorCigPaquetPrice}
                                color={Colors.colorOrange}
                                keyboardType="decimal-pad"
                                style={LoginSigninStyle.textInput}
                                value={cigPaquetPrice}
                                onChangeText={setCigPaquetPrice} />

                            

                            { isLoaderCigAdd == true ?
                            <View>
                                <LoaderComponent text="Ajout de la marque de cigarette en cours ..." step="" color={Colors.blueFb} size="large"/>
                            </View>
                            :
                            <View>
                                <TouchableOpacity
                                    onPress={() => handleAddCig()}
                                    activeOpacity={0.6}
                                    style={AppStyle.btnCigAdd}>
                                    <Text style={LoginSigninStyle.buttonText}>Ajouter</Text>
                                </TouchableOpacity>

                                <Text style={AppStyle.textError}>{errorAddCigUser}</Text>
                            </View>
                            }
                            
                        </Stack>
                        </ScrollView>
                        </GestureHandlerRootView>
                    </View>
                </View>
            </View>
        
        </Backdrop> 
        
    )
    */
}

export default SettingCigaretteComponent

const styles = StyleSheet.create({
    container: {
		flex: 1,
		alignItems: 'center'
	},
    contentContainer: {
		alignItems: 'center'
	},

    contentContainer2: {
        flex:1,
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
        borderRadius: 10,
        color: 'black',
        padding: 15 
    },
    inputAndroid: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 10,
        color: 'black',
        padding: 15 
    }
});