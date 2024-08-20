// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Surface, Stack } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

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
import { serverTimestamp } from "firebase/firestore";

// Api
import { getCigaretteListFireStore } from '../../api/CigaretteApi';
import { setUserFireStore } from '../../api/UserApi';
import { setUserCigarettesFireStore } from '../../api/UserCigarettesApi';

/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    CounterCigaretteListScreen: any;
    CounterCigaretteAddScreen: any;
    SettingCounter: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'CounterCigaretteListScreen', 'CounterCigaretteAddScreen'>;

/**
 * Screen CounterCigaretteListScreen
 * @param param0  
 * @returns 
 */
const CounterCigaretteListScreen = ({ navigation }: Props) => {

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

    const c = new Cigarette("","",0,0,0,0,0,0,"")
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
        
        await getCigaretteListFireStore(userSelector.userId).then((cigList) => {
            //console.log(cigList.size);

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
                    cigData.idUser,
                );
                //console.log(p);

                const cItem = { label: cigData.cigaretteName, value: cig.id }
                //console.log(pItem);

                dataCigTabItem.push(cItem)
                setDataCigTabItem([...dataCigTabItem])

                dataCigTab.push(c)
                setDataCigTab([...dataCigTab])
            });

            changeCigSelectedFomUserIdCig()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            console.log("Error get cigarette in firestore database")
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
                0,
                ""
            );
            setUserCigSelected(c)
            setUserCigText("Selectionner une marque de cigarette")

            setUserIdCig("")

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

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
    }

    const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
    const snapPointsAdd = useMemo(() => ['80%'], []);
    const bottomSheetRef = useRef<BottomSheet>(null);

	//const handleClosePress = () => {bottomSheetRef.current?.close() };
	//const handleOpenPress = () => bottomSheetRef.current?.expand();
	//const handleCollapsePress = () => bottomSheetRef.current?.collapse();
    const snapeToIndex = (index: number) => bottomSheetRef.current?.snapToIndex(index);
	
    const renderBackdrop = useCallback( 
		(props: any) => 
            <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
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
                                elevation={4}
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
                                    onPress={() => navigation.navigate('CounterCigaretteAddScreen')}
                                    activeOpacity={0.6}
                                    style={ AppStyle.btnAddCig2 }>
                                    <Text style={AppStyle.btnAddCigText2}> + </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
        
                        { userCigText != "Selectionner une marque de cigarette" ?
                        <View style={AppStyle.itemContainerView2}>

                            <Surface 
                                elevation={4}
                                category="medium"
                                style={ AppStyle.itemPatchContainerRed } >   

                                <Text style={ AppStyle.itemPatchText2 }>Marque : {userCigSelected.cigaretteName} </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nicotine : {userCigSelected.cigaretteNicotine} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Goudron : {userCigSelected.cigaretteGoudron} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Monoxyde de carbone : {userCigSelected.cigaretteCarbone} (mg)</Text>
                                <Text style={ AppStyle.itemPatchText2 }>Nombre de cigarette : {userCigSelected.cigarettePrice} / paquet </Text>
                                <Text style={ AppStyle.itemPatchText2 }>Prix du paquet : {userCigSelected.cigarettePrice} (euros)</Text>
                            </Surface>
        
                            <Surface 
                                elevation={4}
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

            </GestureHandlerRootView>
            
            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={5000} message={textSnackBar}/>
            
        </SafeAreaProvider>
    )
}

export default CounterCigaretteListScreen

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