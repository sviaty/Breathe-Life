import React, { useState , useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Surface } from "@react-native-material/core";

import { useIsFocused } from '@react-navigation/native';


import AppStyle from '../../styles/AppStyle';
import LoginStyle from '../../styles/LoginSigninStyle';
import Colors from '../../constants/ColorsConstant';

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// Helper
import { getAgeUser } from '../../helpers/DateHelper';

// Data
import Cigarette from '../../datas/CigaretteData';
import Patch from '../../datas/PatchData';

// Api
import { getCigaretteByIdCigFireStore } from '../../api/CigaretteApi';
import { getPatchByIdPatchFireStore } from '../../api/PatchApi';
import { getPillByIdPillFireStore } from '../../api/PillApi';
import Pill from '../../datas/PillData';
import LoaderComponent from '../../components/LoaderComponent';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

    return (
    <SafeAreaProvider style={AppStyle.container}>

        <View style={styles.statContainer}>

            
            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem}>
                        
                    <Text style={styles.statDispositifNicotineTitle2}> {userSelector.userName} </Text>
                    <Text style={styles.statDispositifNicotineText2}> {getAgeUser(userSelector.userBirthDate)} ans </Text>
                    
                </Surface>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem}>
                    
                    
                    { userSelector.userSmokeAvgNbr != 0 ? 
                    <View>
                        <Text style={styles.statDispositifNicotineTitle2}> Cigarettes  </Text>
                        <Text style={styles.statDispositifNicotineText2}> 
                            {userSelector.userSmokeAvgNbr} / jours 
                        </Text>
                    </View>
                    : 
                    <View>
                        <Text style={styles.statDispositifNicotineText2}> Aucune informations sur le nombre de cigarette fumées par jours  </Text>
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

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItemRed}>

                    { isLoadCigarette == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                    : 
                        noCigaretteSelected == "" ? 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle2}> {dataCigaretteSelected?.cigaretteName} </Text>
                            <Text style={styles.statDispositifNicotineText2}> Nicotine : {dataCigaretteSelected?.cigaretteNicotine} mg </Text>
                            <Text style={styles.statDispositifNicotineText2}> Goudron : {dataCigaretteSelected?.cigaretteGoudron} mg </Text>
                            <Text style={styles.statDispositifNicotineText2}> Monoxyde de carbone : {dataCigaretteSelected?.cigaretteCarbone} mg </Text>
                            <Text style={styles.statDispositifNicotineText2}> Prix : {dataCigaretteSelected?.cigarettePrice} euros </Text>
                        </View>
                        : 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle2}> {noCigaretteSelected} </Text>
                            <TouchableOpacity
                                onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Cigarettes', initial: false }) }}
                                activeOpacity={0.6}
                                style={styles.btnGoChoice}>
                                <Text style={styles.btnGoChoiceTxt}> Choisir </Text>
                            </TouchableOpacity>
                        </View> 
                    } 
                    
                        
                    
                </Surface>

            </View>

            <View style={styles.statDispositifNicotine}>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem2}>

                    { isLoadPatch == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                    : 
                        noPatchSelected == "" ? 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle}> {dataPatchSelected?.patchName} </Text>
                            <Text style={styles.statDispositifNicotineText}> Nicotine : {dataPatchSelected?.patchNicotine} mg/24h </Text>
                        </View>
                        : 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle2}> {noPatchSelected} </Text>
                            <TouchableOpacity
                                onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Patchs', initial: false }) }}
                                activeOpacity={0.6}
                                style={styles.btnGoChoice}>
                                <Text style={styles.btnGoChoiceTxt}> Choisir </Text>
                            </TouchableOpacity>
                        </View> 
                    }
                        
                </Surface>

                <Surface 
                    elevation={4}
                    category="medium"
                    style={styles.statDispositifNicotineItem2}>

                    { isLoadPill == true ? 
                        <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                    : 
                        noPillSelected == "" ? 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle}> {dataPillSelected?.pillName} </Text>
                            <Text style={styles.statDispositifNicotineText}> Nicotine : {dataPillSelected?.pillNicotine} mg </Text>
                        </View>
                        : 
                        <View>
                            <Text style={styles.statDispositifNicotineTitle2}> {noPillSelected} </Text>
                            <TouchableOpacity
                                onPress={ () => { navigation.navigate('SettingCounter', { screen: 'Pastilles', initial: false }) }}
                                activeOpacity={0.6}
                                style={styles.btnGoChoice}>
                                <Text style={styles.btnGoChoiceTxt}> Choisir </Text>
                            </TouchableOpacity>
                        </View> 
                    } 
                    
                </Surface>

            </View>
            
        </View>

    </SafeAreaProvider>
    )
}

export default UserInformationsScreen

const styles = StyleSheet.create({
    statContainer: {
        margin:5
    },

    statDispositifNicotine: {
        flexDirection: "row"
    },

    statDispositifNicotineItem: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        verticalAlign: 'auto',
        borderRadius: 10,
        padding: 15,
        margin:8
    },

    statDispositifNicotineItem2: {
        flex: 1,
        backgroundColor: Colors.green,
        verticalAlign: 'auto',
        borderRadius: 10,
        padding: 15,
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
        marginBottom:10
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

    btnGoUpdateTxt: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
    },

    btnGoChoice: {
        backgroundColor: Colors.blueFb,
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
    },

    btnGoChoiceTxt: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 16,
    },
})