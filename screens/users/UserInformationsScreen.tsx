import React, { useState , useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Surface } from "@react-native-material/core";

import { useIsFocused } from '@react-navigation/native';


import Colors from '../../constants/ColorConstant';

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// Helper
import { getAgeUser } from '../../helpers/DateHelper';

// Data
import Cigarette from '../../datas/CigaretteData';
import Patch from '../../datas/PatchData';

// Api
import { delCigaretteByIdUserFireStore, getCigaretteByIdCigFireStore } from '../../api/CigaretteApi';
import { getPatchByIdPatchFireStore } from '../../api/PatchApi';
import { getPillByIdPillFireStore } from '../../api/PillApi';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getAuth, deleteUser, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(firebaseConfig);

import Pill from '../../datas/PillData';
import LoaderComponent from '../../components/LoaderComponent';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { delUserFireStore } from '../../api/UserApi';
import { delUserPatchByIdUserFireStore } from '../../api/UserPatchsApi';
import { delUserCigByIdUserFireStore } from '../../api/UserCigarettesApi';
import { delUserPillByIdUserFireStore } from '../../api/UserPillsApi';

import { setIsLogin } from '../../redux/slices/IsLoginSlice';

type RootStackParamList = {
    UserInformationsScreen: any;
    UserUpdateInformationsScreen: any;
    SettingCounter: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'UserInformationsScreen', 'UserUpdateInformationsScreen'>;

const UserInformationsScreen = ({ navigation }: Props) => {

    const isFocused = useIsFocused();

    const [isLoadPatch, setIsLoadPatch] = useState<boolean>(true);
    const [isLoadPill, setIsLoadPill] = useState<boolean>(true);
    const [isLoadCigarette, setIsLoadCigarette] = useState<boolean>(true);

    const [isLoadDelUser, setIsLoadDelUser] = useState<boolean>(false);
    const [delUserState, setDelUserState] = useState<string>("");

    const [noPatchSelected, setNoPatchSelected] = useState<string>("");
    const [noPillSelected, setNoPillSelected] = useState<string>("");
    const [noCigaretteSelected, setNoCigaretteSelected] = useState<string>("");

    const [dataPatchSelected, setDataPatchSelected] = useState<Patch>();
    const [dataPillSelected, setDataPillSelected] = useState<Pill>();
    const [dataCigaretteSelected, setDataCigaretteSelected] = useState<Cigarette>();

    // UseEffect 
    useEffect(() => {
        getPatchSelected()
        getPillSelected()
        getCigaretteSelected()
    }, [isFocused])  

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();



    /**
     * Function getPatchSelected
     */
    const getPatchSelected = () => {

        setIsLoadPatch(true)
        setNoPatchSelected("")

        if(userSelector.idPatch != ""){
            getPatchByIdPatchFireStore(userSelector.idPatch).then((patch) => {

                const patchData = patch.data()

                const p = new Patch(patch.id, patchData.patchName, patchData.patchNicotine);
                //console.log(p);

                setDataPatchSelected(p)
                setIsLoadPatch(false)

            }).catch((error) => {
                setIsLoadPatch(false)
                console.log("Error get patch in firestore database : ")
                console.error(error.message)
            }) 
        } else {
            setIsLoadPatch(false)
            setNoPatchSelected("Pas de patch selectionné")
        }
    }

    /**
     * Function getPillSelected
     */
    const getPillSelected = () => {

        setIsLoadPill(true)
        setNoPillSelected("")

        if(userSelector.idPill != ""){
            getPillByIdPillFireStore(userSelector.idPill).then((pill) => {

                const pillData = pill.data()

                const p = new Pill(pill.id, pillData.pillName, pillData.pillNicotine);

                setDataPillSelected(p)
                setIsLoadPill(false)

            }).catch((error) => {
                setIsLoadPill(false)
                console.log("Error get pill in firestore database : ")
                console.error(error.message)
            }) 
        } else {
            setIsLoadPill(false)
            setNoPillSelected("Pas de pastille selectionné")
        }
    }

    /**
     * Function getPillSelected
     */
    const getCigaretteSelected = () => {
        
        setIsLoadCigarette(true)
        setNoCigaretteSelected("")

        if(userSelector.idCigarette != ""){
            getCigaretteByIdCigFireStore(userSelector.idCigarette).then((cigarette) => {
                if (cigarette.exists()) {
                    const dataCigarette = cigarette.data()
                    //console.log(dataCigarette)
        
                    const c = new Cigarette(
                        cigarette.id, 
                        dataCigarette.cigaretteName,
                        dataCigarette.cigaretteNicotine,
                        dataCigarette.cigaretteGoudron,
                        dataCigarette.cigaretteCarbone,
                        dataCigarette.cigarettePrice,
                        dataCigarette.cigaretteNbr,
                        dataCigarette.cigarettePriceUnit,
                        dataCigarette.idUser
                    )

                    setDataCigaretteSelected(c)
                    setIsLoadCigarette(false)
                }
            }).catch((error) => {
                setIsLoadCigarette(false)
                console.log("Error get cigarette in firestore database : ")
                console.error(error.message)
            }) 
        } else {
            setIsLoadCigarette(false)
            setNoCigaretteSelected("Pas de cigarette selectionné")
        }
    }

    /**
     * Function handleDeleteAccount
     */
    const handleDeleteAccount = () => {
        console.log("handleDeleteAccount")
        setIsLoadDelUser(true)
        setDelUserState("Suppression du compte Auth Firebase")
        
        const user = auth.currentUser;
        //console.log(user)
        
        if(user != null) {
            deleteUser(user).then(() => {
                console.log("User is delete")
                deleteUserPatchFireStore()
            }).catch((error) => {
                setIsLoadDelUser(false)
                console.error(error.message)
            });
        } else {
            console.log("User is null")
            setIsLoadDelUser(false)
        }
        
    }

    const deleteUserPatchFireStore = () => {
        setDelUserState("Suppression des patchs")
        delUserPatchByIdUserFireStore(userSelector.userId).then(() => {
            
            console.log("Patch is delete")
            deleteUserPillFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    const deleteUserPillFireStore = () => {
        setDelUserState("Suppression des pastilles")
        delUserPillByIdUserFireStore(userSelector.userId).then((isDelete) => {
                
            console.log("Pastilles is delete")
            deleteUserCigFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    const deleteUserCigFireStore = () => {
        setDelUserState("Suppression des cigarettes")
        delUserCigByIdUserFireStore(userSelector.userId).then((isDelete) => {

            console.log("Cigarette is delete")
            deleteCigaretteFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    const deleteCigaretteFireStore = () => {
        setDelUserState("Suppression des marques de cigarette")
        delCigaretteByIdUserFireStore(userSelector.userId).then((isDelete) => {

            console.log("Marques de cigarette is delete")
            deleteUserFireStore()

        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    const deleteUserFireStore = () => {
        setDelUserState("Suppression de l'utilisateur")
        delUserFireStore(userSelector.userId).then((isDelete) => {

            setIsLoadDelUser(false)
            console.log("Data is delete")
            dispatch(setIsLogin(false));
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    return (
    <SafeAreaProvider style={styles.mainContainer}>
        <ScrollView>
            <View style={styles.statContainer}>

                <View style={styles.statDispositifNicotine}>
                    <Surface 
                        elevation={4}
                        category="medium"
                        style={styles.statDispositifNicotineItem5}>

                        <View style={ styles.titleContainerBlue }>
                            <Text style={ styles.titleText }>{userSelector.userName}</Text>
                        </View>

                        { userSelector.userBirthDate == "" ? 
                        <View style={ styles.descContainer }>
                            <Text style={styles.descText}>Aucune informations sur votre age </Text>
                        </View>
                        : 
                        <View style={ styles.descContainer }>
                            <Text style={styles.descText}>{getAgeUser(userSelector.userBirthDate)} ans </Text>
                        </View>
                        }
                    
                    </Surface>

                    <Surface 
                        elevation={4}
                        category="medium"
                        style={styles.statDispositifNicotineItem5}>

                        <View style={ styles.titleContainerBlue }>
                            <Text style={ styles.titleText }>Cigarettes</Text>
                        </View>

                        { userSelector.userSmokeAvgNbr != 0 ? 
                        <View style={ styles.descContainer }>
                            <Text style={styles.descText}>  {userSelector.userSmokeAvgNbr} / jours </Text>
                        </View>
                        : 
                        <View style={ styles.descContainer }>
                            <Text style={styles.descText}>Aucune informations sur le nombre de cigarette fumées par jours  </Text>
                        </View>
                        }
                    </Surface>
                </View>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem3}>
                        
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('UserUpdateInformationsScreen')}}
                        activeOpacity={0.6}
                        style={styles.btnGoUpdate}>
                        <Text style={styles.btnGoUpdateTxt}> Modifier vos informations</Text>
                    </TouchableOpacity>
                </Surface>

                <View style={styles.statDispositifNicotine}>
                <View style={{flex: 1}}>
                    <Surface 
                        elevation={4}
                        category="medium"
                        style={styles.statDispositifNicotineItem4}>

                        { isLoadCigarette == true ? 
                            <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                        : 
                            noCigaretteSelected == "" ? 
                            <View>
                                <View style={ styles.titleContainerRed }>
                                    <Text style={ styles.titleText }>Marque de cigarette</Text>
                                </View>

                                <View style={ styles.descContainer }>
                                    <Text style={styles.descText}> {dataCigaretteSelected?.cigaretteName} </Text>
                                    <Text style={styles.descText}> Nicotine : {dataCigaretteSelected?.cigaretteNicotine} mg </Text>
                                    <Text style={styles.descText}> Goudron : {dataCigaretteSelected?.cigaretteGoudron} mg </Text>
                                    <Text style={styles.descText}> Monoxyde de carbone : {dataCigaretteSelected?.cigaretteCarbone} mg </Text>
                                    <Text style={styles.descText}> Prix : {dataCigaretteSelected?.cigarettePrice} euros </Text>
                                </View>

                                
                            </View>
                            : 
                            <View>
                                <View style={ styles.titleContainerRed }>
                                    <Text style={ styles.titleText }>Marque de cigarette</Text>
                                </View>

                                <View style={ styles.descContainer }>
                                    <Text style={styles.descText}> {noCigaretteSelected} </Text>
                                </View>
                            </View> 
                        }
                    </Surface>

                    { noCigaretteSelected == "" ? 
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Cigarettes', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Changer la marque de cigarette </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Cigarettes', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Choisir une marque de cigarette </Text>
                    </TouchableOpacity>
                    }
                </View>
                </View>

                <View style={styles.statDispositifNicotine}>
                <View style={{flex: 1}}>
                    <Surface 
                        elevation={4}
                        category="medium"
                        style={styles.surfaceOrange2}>

                        { isLoadPatch == true ? 
                            <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                        : 
                            noPatchSelected == "" ? 
                            <View>
                                <View style={ styles.titleContainerOrange }>
                                    <Text style={ styles.titleText }>Patch</Text>
                                </View>

                                <View style={ styles.descContainer }>
                                    <Text style={styles.descText}> {dataPatchSelected?.patchName} </Text>
                                    <Text style={styles.descText}> Nicotine : {dataPatchSelected?.patchNicotine} mg/24h </Text>
                                </View>
                            </View>  
                            :
                            <View>
                                <View style={ styles.titleContainerOrange }>
                                    <Text style={ styles.titleText }>Patch</Text>
                                </View>

                                <View style={ styles.descContainer }>
                                    <Text style={styles.descText}> {noPatchSelected} </Text>
                                </View>
                            </View> 
                        }
                    </Surface>

                    { noPatchSelected == "" ? 
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Patchs', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Changer de patch </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Patchs', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Choisir un patch </Text>
                    </TouchableOpacity>
                    }
                </View>
                </View>

                <View style={styles.statDispositifNicotine}>
                <View style={{flex: 1}}>
                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.surfaceOrange2}>

                    { isLoadPill == true ? 
                    <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                    : 
                        noPillSelected == "" ? 
                        <View>
                            <View style={ styles.titleContainerOrange }>
                                <Text style={ styles.titleText }>Pastille</Text>
                            </View>

                            <View style={ styles.descContainer }>
                                <Text style={styles.descText}> {dataPillSelected?.pillName} </Text>
                                <Text style={styles.descText}> Nicotine : {dataPillSelected?.pillNicotine} mg </Text>
                            </View>
                        </View>
                        :
                        <View>
                            <View style={ styles.titleContainerOrange }>
                                <Text style={ styles.titleText }>Pastille</Text>
                            </View>

                            <View style={ styles.descContainer }>
                                <Text style={styles.descText}> {noPillSelected} </Text>
                            </View>
                        </View> 
                    }
                </Surface>

                { noPillSelected == "" ? 
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Pastilles', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Changer de pastilles</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Pastilles', initial: false }) }}
                        activeOpacity={0.6}
                        style={styles.surfaceBtnBlue3}>
                        <Text style={styles.btnGoChoiceTxt}> Choisir une pastilles</Text>
                    </TouchableOpacity>
                }

                </View>
                </View>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem3}>
                    { isLoadDelUser == true ? 
                    <View style={styles.btnDeleteAcount}>
                        <LoaderComponent text={delUserState} step="" color={Colors.white} size="small"/>
                    </View>
                    : 
                    <TouchableOpacity
                        onPress={ () => handleDeleteAccount()}
                        activeOpacity={0.6}
                        style={styles.btnDeleteAcount}>
                        <Text style={styles.btnGoUpdateTxt}> Supprimer votre compte </Text>
                    </TouchableOpacity>
                    }
                </Surface>

                
            </View>
        </ScrollView>
    </SafeAreaProvider>
    )
}

export default UserInformationsScreen

const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
    },

    titleContainerOrange: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.red,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleContainerBlue: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleContainerGreen: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.green,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    descContainer: {
        padding: 16,
    },

    descText: {
        color: Colors.white,
        fontSize: 18,
    },



    statContainer: {
        margin:5
    },

    statDispositifNicotine: {
        flexDirection: "row"
    },

    surfaceOrange: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        verticalAlign: 'auto',
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        margin:8
    },

    surfaceOrange2: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        verticalAlign: 'auto',
        marginTop: 8,
        marginStart: 8,
        marginEnd: 8,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },

    statDispositifNicotineItem2: {
        flex: 1,
        backgroundColor: Colors.green,
        verticalAlign: 'auto',
        borderRadius: 10,
        margin:8
    },

    statDispositifNicotineItem4: {
        flex: 1,
        backgroundColor: Colors.red,
        verticalAlign: 'auto',
        marginTop: 8,
        marginStart: 8,
        marginEnd: 8,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },

    statDispositifNicotineItem5: {
        flex: 1,
        backgroundColor: Colors.blueFb,
        verticalAlign: 'auto',
        borderRadius: 10,
        margin:8
    },

    statDispositifNicotineItem3: {
        verticalAlign: 'auto',
        borderRadius: 10,
        margin:8
    },


    statDispositifNicotineItemRed: {
        flex: 1,
        backgroundColor: Colors.red,
        verticalAlign: 'auto',
        borderRadius: 10,
        padding: 15,
        margin:8
    },


    statDispositifNicotineTitle: {
        color: Colors.white,
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 20,
        
    },

    statDispositifNicotineTitle2: {
        color: Colors.white,
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 20,
    },

    statDispositifNicotineText: {
        color: Colors.white,
        textAlign:'center',
        padding: 10,
        fontSize: 14,
    },

    statDispositifNicotineText2: {
        color: Colors.white,
        textAlign:'center',
        fontSize: 18,
    },

    statDispositifNicotineText3: {
        color: Colors.white,
        textAlign:'center',
        fontSize: 18,
    },

    btnGoUpdate: {
        backgroundColor: Colors.blueFb,
        padding: 15,
        borderRadius: 5,
    },

    btnDeleteAcount: {
        backgroundColor: Colors.red,
        padding: 15,
        borderRadius: 5,
    },

    btnGoUpdateTxt: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
    },

    btnGoChoice: {
        backgroundColor: Colors.blueFb,
        padding: 15,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
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

    btnGoChoiceTxt: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 16,
    },
})