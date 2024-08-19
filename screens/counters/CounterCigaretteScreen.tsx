// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Keyboard, Alert, ScrollView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Surface, Stack } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';
import LoginSigninStyle from '../../styles/LoginSigninStyle';

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
import { addCigaretteUserFireStore, getCigaretteUserListFireStore } from '../../api/CigaretteUserApi';
import { setUserFireStore } from '../../api/UserApi';
import { setUserCigarettesFireStore } from '../../api/UserCigarettesApi';
import CigaretteUser from '../../datas/CigaretteUserData';

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

    let [userCig, setUserCig] = useState<string>("Selectionner une marque de cigarette");
    let [userCigText, setUserCigText] = useState<string>( "Selectionner une marque de cigarette");

    const c = new Cigarette("","",0,0,0,0,0,0)
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
        
        await getCigaretteListFireStore().then((cigList) => {
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
                    cigData.cigaretteNbr,
                    cigData.cigarettePriceUnit,
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
            console.log("Error get cigarette in firestore database")
            console.error(error.message)
        }) 
    }

    /**
     * Function getCigist
     */
    const getCigUserList = async () => {

        await getCigaretteUserListFireStore(userSelector.userId).then((cigList) => {

            if(cigList.size > 0){
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
            } else {
                // Hide loader
                setIsLoaderGet(false)
            }

        }).catch((error) => {
            setIsLoaderGet(false)
            console.log("Error get cigarette user in firestore database")
            console.error(error.message)
        }) 
    }

    /**
     * Function changeCigSelectedFomUserIdCig
     */
    const changeCigSelectedFomUserIdCig = () => {
        //console.log("changeCigSelectedFomUserIdCig")
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
                setUserCigText("Selectionner une marque de cigarette")
            }
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
                0
            );
            setUserCigSelected(c)
            setUserCigText("Selectionner une marque de cigarette")

            //console.log('IS undefined')
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
            userSelector.userSmokeStartDate, 
            userSelector.userSmokeAvgNbr, 
            userSelector.idPatch, 
            userSelector.idPill, 
            idCig);
        
        setUserFireStore(user).then((value) => {
            //console.log(value)
            dispatch(setUser(user));

        }).catch((error) => {
            console.log("Error set user idCig in firestore database : ")
            console.error(error.message)
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
        //setErrorAddPill("")

        const userCigarettesDatas = {
            idUser: userSelector.userId,
            idCigarette: userCig,
            dateTime: serverTimestamp()
        }

        setUserCigarettesFireStore(userCigarettesDatas).then((value) => {
            //console.log(value)
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {

            setIsLoaderUserAdd(false)
            //setErrorAddPatch("addUserCigarettes error : " + error.message)
            console.log("Error addUserCigarettes")
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
        const priceUnit = parseFloat((parseInt(cigPaquetNbr) / price).toFixed(2))

        const cigUser = new CigaretteUser(
            "",
            cigName,
            nicotine,
            parseInt(cigGoudron),
            parseInt(cigCarbonne),
            price,
            parseInt(cigPaquetNbr),
            priceUnit,
            userSelector.userId
        )

        addCigaretteUserFireStore(cigUser).then((value) => {
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
    }

    const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
    const snapPointsAdd = useMemo(() => ['80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const bottomSheetRefAdd = useRef<BottomSheetModal>(null);
    const snapeToIndexAdd = (index: number) => bottomSheetRefAdd.current?.snapToIndex(index);

	//const handleClosePress = () => {bottomSheetRef.current?.close() };
	//const handleOpenPress = () => bottomSheetRef.current?.expand();
	//const handleCollapsePress = () => bottomSheetRef.current?.collapse();
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
                            
                            <Surface 
                                elevation={8}
                                category="medium"
                                style={AppStyle.pikerSelectCig}>

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
                                    <Text style={ AppStyle.textSelectIos } > {userCigText} </Text>
                                </Pressable>
                                : null }
                            </Surface>

                            <View  style={AppStyle.btnAddCigContainer}>
                                <TouchableOpacity
                                    onPress={() => snapeToIndexAdd(0)}
                                    activeOpacity={0.6}
                                    style={ AppStyle.btnAddCig2 }>
                                    <Text style={AppStyle.btnAddCigText2}> + </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
        
                        { userCigText != "Selectionner une marque de cigarette" ?
                        <View style={AppStyle.itemContainerView2}>

                            <Surface 
                                elevation={8}
                                category="medium"
                                style={ AppStyle.itemPatchContainer2 } >   

                                <Text style={ AppStyle.itemPatchText2 }>Marque : {userCigSelected.cigaretteName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine : {userCigSelected.cigaretteNicotine} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Goudron : {userCigSelected.cigaretteGoudron} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Monoxyde de carbone : {userCigSelected.cigaretteCarbone} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nombre de cigarette : {userCigSelected.cigarettePrice} / paquet </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Prix du paquet : {userCigSelected.cigarettePrice} (euros)</Text>
                            </Surface>
        
                            <Surface 
                                elevation={8}
                                category="medium" 
                                style={ AppStyle.btnAddPatch }>   

                                <TouchableOpacity
                                    onPress={() => handleAddUserCig()}
                                    activeOpacity={0.6}>
                                    
                                    <Text style={AppStyle.btnAddPatchText}>Fumer une cigarette</Text>
                                </TouchableOpacity>

                            </Surface>
        
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