// React & React Native
import React, { useState , useEffect} from 'react'
import { Text, View, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

// Material
import { Surface } from "@react-native-material/core";

// Navigation
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';

// Styles
import AppStyle from '../../styles/AppStyle';

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    ID_NAVIGATE_USER_SETTINGS_UPDATE_INFO_SCREEN } from '../../constants/IdConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION } from '../../constants/AppConstant';

// Helpers
import { getAgeUser } from '../../helpers/DateHelper';
import textTranslate from '../../helpers/TranslateHelper';

// Datas
import Cigarette from '../../datas/CigaretteData';
import Patch from '../../datas/PatchData';
import Pill from '../../datas/PillData';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import ButtonComponent from '../../components/ButtonComponent';
import ButtonBottomComponent from '../../components/ButtonBottomComponent';

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLogin } from '../../redux/slices/IsLoginSlice';

// Api
import { delCigaretteByIdUserFireStore, getCigaretteByIdCigFireStore } from '../../api/CigaretteApi';
import { getPatchByIdPatchFireStore } from '../../api/PatchApi';
import { getPillByIdPillFireStore } from '../../api/PillApi';
import { delUserFireStore } from '../../api/UserApi';
import { delUserPatchByIdUserFireStore } from '../../api/UserPatchsApi';
import { delUserCigByIdUserFireStore } from '../../api/UserCigarettesApi';
import { delUserPillByIdUserFireStore } from '../../api/UserPillsApi';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getAuth, deleteUser } from "firebase/auth";
const auth = getAuth(firebaseConfig);

type RootStackParamList = {
    UserInformationsScreen: any;
    UserUpdateInformationsScreen: any;
    UserCounterScreen: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'UserInformationsScreen', 'UserUpdateInformationsScreen'>;

/**
 * Screen UserInformationsScreen
 * @param param0 
 * @returns 
 */
const UserInformationsScreen = ({ navigation }: Props) => {

    // UseState
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
                //console.log("Error getPatchByIdPatchFireStore")
                console.error(error.message)
            }) 
        } else {
            setIsLoadPatch(false)
            setNoPatchSelected( textTranslate.t('patchNoSelected') )
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
                //console.log("Error getPillByIdPillFireStore")
                console.error(error.message)
            }) 
        } else {
            setIsLoadPill(false)
            setNoPillSelected( textTranslate.t('pillNoSelected') )
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
                //console.log("Error getCigaretteByIdCigFireStore")
                console.error(error.message)
            }) 
        } else {
            setIsLoadCigarette(false)
            setNoCigaretteSelected( textTranslate.t('cigaretteNoSelected') )
        }
    }

    /**
     * Function handleDeleteAccount
     */
    const handleDeleteAccount = () => {
        
        showAlertDeleteAccount()
    }

    const showAlertDeleteAccount = () => {
        Alert.alert(
            textTranslate.t('userSettingDeleteAlertTitle'), 
            textTranslate.t('userSettingDeleteAlertText'), 
            [
                {
                    text: textTranslate.t('counterCigListAlertCancel'),
                    onPress: () => {
                        //console.log('Cancel Pressed')
                    },
                    style: 'cancel',
                },
                {
                    text: textTranslate.t('counterCigListAlertConfirm'),
                    onPress: () => {
                        //console.log('OK Pressed')
                        userDeleteAccount()
                    },
                }
            ]
        );
    }

    const userDeleteAccount = () => {
        setIsLoadDelUser(true)
        
        setDelUserState( textTranslate.t('userSettingDeleteFireBaseAuth') )
        
        const user = auth.currentUser;
        //console.log(user)
        
        if(user != null) {
            deleteUser(user).then(() => {
                //console.log("User is delete")
                deleteUserPatchFireStore()
            }).catch((error) => {
                setIsLoadDelUser(false)
                console.error(error.message)
            });
        } else {
            //console.log("User is null")
            setIsLoadDelUser(false)
        }
    }

    /**
     * Function deleteUserPatchFireStore
     */
    const deleteUserPatchFireStore = () => {

        setDelUserState( textTranslate.t('patchDeleted')  )

        delUserPatchByIdUserFireStore(userSelector.userId).then(() => {
            
            console.log("Patch is delete")
            deleteUserPillFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    /**
     * Function deleteUserPillFireStore
     */
    const deleteUserPillFireStore = () => {
        setDelUserState( textTranslate.t('pillDeleted') )

        delUserPillByIdUserFireStore(userSelector.userId).then((isDelete) => {
                
            console.log("Pastilles is delete")
            deleteUserCigFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    /**
     * Function deleteUserCigFireStore
     */
    const deleteUserCigFireStore = () => {
        setDelUserState( textTranslate.t('cigaretteDeleted') )

        delUserCigByIdUserFireStore(userSelector.userId).then((isDelete) => {

            console.log("Cigarette is delete")
            deleteCigaretteFireStore()
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    /**
     * Function deleteCigaretteFireStore
     */
    const deleteCigaretteFireStore = () => {

        setDelUserState( textTranslate.t('cigaretteDeleted') )

        delCigaretteByIdUserFireStore(userSelector.userId).then((isDelete) => {

            console.log("Marques de cigarette is delete")
            deleteUserFireStore()

        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    /**
     * Function deleteUserFireStore
     */
    const deleteUserFireStore = () => {
        setDelUserState( textTranslate.t('cigaretteDeleted') )

        delUserFireStore(userSelector.userId).then((isDelete) => {

            setIsLoadDelUser(false)
            console.log("Data is delete")
            dispatch(setIsLogin(false));
        }).catch((error) => {

            setIsLoadDelUser(false)
            console.error(error.message)
        })
    }

    /**
     * View JSX
     */
    return (
        <SafeAreaProvider>
            <ScrollView>
                <View style={AppStyle.mainContainerStack}>

                    <View style={AppStyle.rowView}>
                        <Surface 
                            elevation={ SURFACE_ELEVATION }
                            category={ SURFACE_CATEGORY }
                            style={AppStyle.surfaceStatBlueView}>

                            <View style={ AppStyle.titleContainerBlue }>
                                <Text style={ AppStyle.titleText }>{userSelector.userName}</Text>
                            </View>

                            { userSelector.userBirthDate == "" ? 
                            <View style={ AppStyle.descContainer }>
                                <Text style={AppStyle.descText}>{ textTranslate.t('userSettingNoAgeInformation') }</Text>
                            </View>
                            : 
                            <View style={ AppStyle.descContainer }>
                                <Text style={AppStyle.descText}>{ getAgeUser(userSelector.userBirthDate )} { textTranslate.t('userSettingAgeInformation') } </Text>
                            </View>
                            }
                        
                        </Surface>

                        <Surface 
                            elevation={ SURFACE_ELEVATION }
                            category={ SURFACE_CATEGORY }
                            style={AppStyle.surfaceStatBlueView}>

                            <View style={ AppStyle.titleContainerBlue }>
                                <Text style={ AppStyle.titleText }>{ textTranslate.t('userSettingTitleCigarette') } </Text>
                            </View>

                            { userSelector.userSmokeAvgNbr != 0 ? 
                            <View style={ AppStyle.descContainer }>
                                <Text style={AppStyle.descText}>{userSelector.userSmokeAvgNbr} { textTranslate.t('userSettingCigaretteNbrInfo') } </Text>
                            </View>
                            : 
                            <View style={ AppStyle.descContainer }>
                                <Text style={AppStyle.descText}>{ textTranslate.t('userSettingCigaretteNbrNoInfo') } </Text>
                            </View>
                            }
                        </Surface>
                    </View>
                    
                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                            <ButtonComponent 
                                btnText={ textTranslate.t('userSettingsBtnUpdateInfo') }
                                textColor={Colors.white}
                                activeOpacity={0.6}
                                backgroundColor={Colors.blueFb}
                                handleFunction={ () => { navigation.navigate( ID_NAVIGATE_USER_SETTINGS_UPDATE_INFO_SCREEN ) } } />
                        </View>
                    </View>

                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={AppStyle.surfaceBtnStat}>
                                { isLoadDelUser == true ? 
                                <View style={AppStyle.btnDeleteAcount}>
                                    <LoaderComponent text={delUserState} step="" color={Colors.white} size="small"/>
                                </View>
                                : 
                                <TouchableOpacity
                                    onPress={ () => handleDeleteAccount()}
                                    activeOpacity={0.6}
                                    style={AppStyle.btnDeleteAcount}>
                                    <Text style={AppStyle.btnGoUpdateTxt}>{ textTranslate.t('userSettingsBtnDeleteAcount') }</Text>
                                </TouchableOpacity>
                                }
                            </Surface>
                        </View>
                    </View>

                   
                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={AppStyle.surfaceStatRedView}>

                                { isLoadCigarette == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                                : 
                                    noCigaretteSelected == "" ? 
                                    <View>
                                        <View style={ AppStyle.titleContainerRed }>
                                            <Text style={ AppStyle.titleText }>{ textTranslate.t('cigaretteType') }</Text>
                                        </View>

                                        <View style={ AppStyle.descContainer }>
                                            <Text style={ AppStyle.descText }>{ dataCigaretteSelected?.cigaretteName }</Text>
                                            <Text style={ AppStyle.descText }>{ textTranslate.t('cigaretteNicotine') } {dataCigaretteSelected?.cigaretteNicotine} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ AppStyle.descText }>{ textTranslate.t('cigaretteGoudron') } {dataCigaretteSelected?.cigaretteGoudron} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ AppStyle.descText }>{ textTranslate.t('cigaretteCarbonne') } {dataCigaretteSelected?.cigaretteCarbone} { textTranslate.t('cigaretteMgMesure') }</Text>
                                            <Text style={ AppStyle.descText }>{ textTranslate.t('cigarettePrice') } {dataCigaretteSelected?.cigarettePrice} { textTranslate.t('cigarettePriceEuros') }</Text>
                                        </View>

                                        
                                    </View>
                                    : 
                                    <View>
                                        <View style={ AppStyle.titleContainerRed }>
                                            <Text style={ AppStyle.titleText }>{ textTranslate.t('cigaretteType') }</Text>
                                        </View>

                                        <View style={ AppStyle.descContainer }>
                                            <Text style={ AppStyle.descText }>{noCigaretteSelected}</Text>
                                        </View>
                                    </View> 
                                }
                            </Surface>

                            { noCigaretteSelected == "" ? 
                            <ButtonBottomComponent 
                                btnText={ textTranslate.t('userSettingsBtnUpdateCig') }
                                textColor={Colors.white}
                                activeOpacity={0.6}
                                backgroundColor={Colors.blueFb}
                                handleFunction={ () => { navigation.navigate( 'UserCounterScreen', { screen: textTranslate.t('navUserCountCigarettes'), initial: false }) } } />
                            :
                            <ButtonBottomComponent 
                                btnText={ textTranslate.t('userSettingsBtnChoiceCig') }
                                textColor={Colors.white}
                                activeOpacity={0.6}
                                backgroundColor={Colors.blueFb}
                                handleFunction={ () => { navigation.navigate( 'UserCounterScreen', { screen: textTranslate.t('navUserCountCigarettes'), initial: false }) } } />
                            }
                        </View>
                    </View>

                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={ AppStyle.surfaceOrangeStat }>

                                { isLoadPatch == true ? 
                                    <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                                : 
                                    noPatchSelected == "" ? 
                                    <View>
                                        <View style={ AppStyle.titleContainerOrange }>
                                            <Text style={ AppStyle.titleText }>{ textTranslate.t('patchType') }</Text>
                                        </View>

                                        <View style={ AppStyle.descContainer }>
                                            <Text style={ AppStyle.descText }>{ dataPatchSelected?.patchName }</Text>
                                            <Text style={ AppStyle.descText }>{ textTranslate.t('patchNicotine') } {dataPatchSelected?.patchNicotine} { textTranslate.t('patchNicotineMg24') }</Text>
                                        </View>
                                    </View>  
                                    :
                                    <View>
                                        <View style={ AppStyle.titleContainerOrange }>
                                            <Text style={ AppStyle.titleText }>{ textTranslate.t('patchType') }</Text>
                                        </View>

                                        <View style={ AppStyle.descContainer }>
                                            <Text style={AppStyle.descText}>{noPatchSelected}</Text>
                                        </View>
                                    </View> 
                                }
                            </Surface>

                            { noPatchSelected == "" ? 
                            <ButtonBottomComponent 
                                btnText={ textTranslate.t('userSettingsBtnUpdatePatch') }
                                textColor={Colors.white}
                                activeOpacity={0.6}
                                backgroundColor={Colors.blueFb}
                                handleFunction={ () => { navigation.navigate('UserCounterScreen', { screen: textTranslate.t('navUserCountPatchs'), initial: false }) } } />
                            :
                            <ButtonBottomComponent 
                                btnText={ textTranslate.t('userSettingsBtnChoicePatch') }
                                textColor={Colors.white}
                                activeOpacity={0.6}
                                backgroundColor={Colors.blueFb}
                                handleFunction={ () => { navigation.navigate('UserCounterScreen', { screen: textTranslate.t('navUserCountPatchs'), initial: false }) } } />
                            }
                        </View>
                    </View>

                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                        <Surface 
                            elevation={ SURFACE_ELEVATION }
                            category={ SURFACE_CATEGORY }
                            style={AppStyle.surfaceOrangeStat}>

                            { isLoadPill == true ? 
                            <LoaderComponent text="" step="" color={Colors.white} size="small"/>
                            : 
                                noPillSelected == "" ? 
                                <View>
                                    <View style={ AppStyle.titleContainerOrange }>
                                        <Text style={ AppStyle.titleText }>{ textTranslate.t('pillType') }</Text>
                                    </View>

                                    <View style={ AppStyle.descContainer }>
                                        <Text style={ AppStyle.descText }>{ dataPillSelected?.pillName }</Text>
                                        <Text style={ AppStyle.descText }>{ textTranslate.t('pillNicotine') } {dataPillSelected?.pillNicotine} { textTranslate.t('cigaretteMgMesure') }</Text>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={ AppStyle.titleContainerOrange }>
                                        <Text style={ AppStyle.titleText }>{ textTranslate.t('pillType') }</Text>
                                    </View>

                                    <View style={ AppStyle.descContainer }>
                                        <Text style={ AppStyle.descText }>{ noPillSelected }</Text>
                                    </View>
                                </View> 
                            }
                        </Surface>

                        { noPillSelected == "" ? 
                        <ButtonBottomComponent 
                            btnText={ textTranslate.t('userSettingsBtnUpdatePill') }
                            textColor={Colors.white}
                            activeOpacity={0.6}
                            backgroundColor={Colors.blueFb}
                            handleFunction={ () => { navigation.navigate('UserCounterScreen', { screen: textTranslate.t('navUserCountPills'), initial: false }) } } />
                        
                        :
                        <ButtonBottomComponent 
                            btnText={ textTranslate.t('userSettingsBtnChoicePill') }
                            textColor={Colors.white}
                            activeOpacity={0.6}
                            backgroundColor={Colors.blueFb}
                            handleFunction={ () => { navigation.navigate('UserCounterScreen', { screen: textTranslate.t('navUserCountPills'), initial: false }) } } />
                        }

                        </View>
                    </View>

                  
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

export default UserInformationsScreen