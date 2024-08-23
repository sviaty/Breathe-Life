// React & React Native
import React, { useState, useMemo, useCallback, useEffect, useRef} from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Pressable, Alert, Dimensions, ScrollView} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Surface, Stack } from "@react-native-material/core";
import { Picker } from '@react-native-picker/picker';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

// Styles & Colors
import Colors from '../../constants/ColorConstant';
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
import { getUserCigarettesByIdUserFireStore, getUserLastCigaretteByIdUserFireStore, setUserCigarettesFireStore } from '../../api/UserCigarettesApi';

/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getDifference2Date } from '../../helpers/DateHelper';

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

    let [countCigarette, setCountCigarette] = useState<number>(0);
    const [isLoadCountCigarette, setIsLoadCountCigarette] = useState<boolean>(true);

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
    
    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getCigList()
        getlastCig()
        getStatCigaretteDayInDatabase()
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
            nicotine: userCigSelected.cigaretteNicotine,
            goudron: userCigSelected.cigaretteGoudron,
            carbone: userCigSelected.cigaretteCarbone,
            price: userCigSelected.cigarettePrice / userCigSelected.cigaretteNbr,
            dateTime: serverTimestamp()
        }

        setUserCigarettesFireStore(userCigarettesDatas).then((value) => {

            getlastCig()
            getStatCigaretteDayInDatabase()

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
     * Function getlastPill
     */
    const getlastCig = () => {

        closeInterval()

        getUserLastCigaretteByIdUserFireStore(userSelector.userId).then((cigList) => {

            if(cigList != null){
                const d = cigList.dateTime.toDate()
                startInterval(d)                
            } else {
                setDiff("Vous n'avez pas encore consommer de cigarette")
            }
            
        }).catch((error) => {
            console.log("Error getUserLastCigaretteByIdUserFireStore")
            console.error(error)
        })
    }

    /**
     * Function getCigaretteInDatabase
     */
    const getStatCigaretteDayInDatabase = async () => {

        setCountCigarette(0)
        setIsLoadCountCigarette(true)

        getUserCigarettesByIdUserFireStore(userSelector.userId).then((userCigaretteList) => {

            if(userCigaretteList.size != 0){

                let i = 0
                userCigaretteList.forEach((userCigarette) => {
                    //console.log(cigarette.id, " => ", cigarette.data());
                    const cigaretteData = userCigarette.data()
                    const cigaretteDate = cigaretteData.dateTime.toDate().toDateString()
                    const currentDate = new Date().toDateString()

                    if(cigaretteDate == currentDate){
                        i += 1
                    }
                });

                setCountCigarette(i)

                setIsLoadCountCigarette(false)

            } else {
                //console.log('cigaretteList size = 0');
                setCountCigarette(0)
                setIsLoadCountCigarette(false)
            }

        }).catch((error) => {
            console.log("Error get user pills in firestore database")
            console.error(error.message)
        })
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
    }

    const snapPoints = useMemo(() => ['50%'], []);
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
        <SafeAreaProvider style={styles.mainContainer}>
            <GestureHandlerRootView>
            <ScrollView>
                <View style={styles.statContainer}>
                    { isLoaderGet == true ? 
                    <View style={styles.loadContainerView}>
                        <LoaderComponent text="Chargement des cigarettes" step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={styles.mainContainerView}>
                        <View style={styles.statDispositifNicotine}>
                        <Surface 
                            elevation={4}
                            category="medium"
                            style={ styles.surfaceContainerBlue }>

                            { Platform.OS === 'android' ? 
                            <View>
                            <View style={ styles.titleContainer2 }>
                                <Text style={ styles.titleText }>Choisir une marque de cigarette</Text>
                            </View>
                            <Picker
                                selectedValue={userCig}
                                onValueChange={(cig) => handlePickerSelect(cig) }
                                placeholder="Selectionner une marque de cigarette"
                                mode={'dialog'}
                                style={{backgroundColor: Colors.white}}
                            >   
                            {
                            dataCigTabItem.map(cigTabItem => <Picker.Item key={cigTabItem.value} label={cigTabItem.label} value={cigTabItem.value}/>)
                            }          
                            </Picker>
                            </View>
                            : null }

                            { Platform.OS === 'ios' ? 
                            <Pressable 
                                onPress={() => snapeToIndex(0)}>

                                <View style={ styles.titleContainer }>
                                    <Text style={ styles.titleText }>Choisir une marque de cigarette</Text>
                                </View>

                                <View style={ styles.descContainerPicker }>
                                    <Text style={ styles.descTextPicker }>{userCigText}</Text>
                                </View>

                            </Pressable>
                            : null }

                            <TouchableOpacity
                                onPress={() => navigation.navigate('CounterCigaretteAddScreen')}
                                activeOpacity={0.6}
                                style={styles.surfaceBtnBlue2}>
                                <Text style={styles.surfaceBtnBlueText}> Ajouter une marque </Text>
                            </TouchableOpacity>
                        </Surface>     
                        </View>                       
        
                        { userCigText != "Selectionner une marque de cigarette" ?
                        <View style={styles.mainC}>
                            <View style={styles.statDispositifNicotine}>

                                <View style={{flex: 1}}>
                                <Surface 
                                    elevation={4}
                                    category="medium"
                                    style={ styles.surfaceContainerRed2 } >   

                                    <View style={ styles.titleContainerRed }>
                                        <Text style={ styles.titleText }>{userCigSelected.cigaretteName}</Text>
                                    </View>

                                    <View style={ styles.descContainerRed }>
                                        <Text style={ styles.descText }>Nicotine : {userCigSelected.cigaretteNicotine} (mg)</Text>
                                        <Text style={ styles.descText }>Goudron : {userCigSelected.cigaretteGoudron} (mg)</Text>
                                        <Text style={ styles.descText }>Monoxyde de carbone : {userCigSelected.cigaretteCarbone} (mg)</Text>
                                        <Text style={ styles.descText }>Nombre de cigarette : {userCigSelected.cigarettePrice} / paquet </Text>
                                        <Text style={ styles.descText }>Prix du paquet : {userCigSelected.cigarettePrice} (euros)</Text>
                                    </View>
                                </Surface>

                                <TouchableOpacity
                                    onPress={() => handleAddUserCig()}
                                    activeOpacity={0.6}
                                    style={styles.surfaceBtnBlue3}>

                                    { isLoaderUserAdd == true ?
                                    <LoaderComponent text="Ajout de la cigarette ..." step="" color={Colors.white} size="large"/>
                                    :
                                    <Text style={styles.surfaceBtnBlueText}>Fumer une cigarette</Text>
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
                                        <Text style={ styles.titleText }>Dernière cigarette fumée</Text>
                                    </View>  

                                    <View style={ styles.descContainer }>
                                        <Text style={ styles.descContenairViewText }>{diff}</Text>
                                    </View>
                                
                                </Surface>

                            
                            </View>

                            <View style={styles.statDispositifNicotine}>
                                <Surface 
                                    elevation={4}
                                    category="medium"
                                    style={styles.surfaceContainerRed}>
                                        
                                    <View style={ styles.titleContainerRed }>
                                        <Text style={ styles.titleText }>Nombre cigarettes </Text>
                                    </View>
                                    
                                    <View style={ styles.descContainerRed2 }>
                                        {isLoadCountCigarette == true ? 
                                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                                        : 
                                        <Text style={styles.descContenairViewText}> {countCigarette} </Text>
                                        }
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
        marginTop: 8
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

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        borderWidth: 2,
        borderColor: Colors.red,
    },

    titleText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    descContainer: {
        padding: 8,
    },

    descContainerRed: {
        padding: 16,
        backgroundColor: Colors.red
    },

    descContainerRed2: {
        padding: 8,
        backgroundColor: Colors.red,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
    },

    descText: {
        color: Colors.white,
        fontSize: 18,
    },

    descContainerPicker: {
        backgroundColor: Colors.white,
        padding: 16,
        paddingTop: 0
    },

    descTextPicker: {
        color: Colors.blueFb,
        fontSize: 18,
    },

    surfaceContainerOrange : {
        width: screenWidth - 32,
        backgroundColor: Colors.colorOrange,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        marginTop: 16,
    },

    surfaceContainerGreen: {
        flex: 1,
        backgroundColor: Colors.green,
        borderWidth: 2,
        borderColor: Colors.green,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerRed: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerRed2: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 5,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8
    },

    surfaceContainerBlue: {
        width: screenWidth - 32,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        marginTop: 8,
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

    descContenairViewText: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
    },


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