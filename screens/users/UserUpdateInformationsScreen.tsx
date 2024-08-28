// React & React Native
import React, { useState , useEffect} from 'react';
import { SafeAreaView, ScrollView, Text, View, Keyboard, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Material
import { TextInput, Surface, Stack } from "@react-native-material/core";

// Navigation
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Style
import AppStyle from '../../styles/AppStyle';

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION, 
    TEXTINPUT_VARIANT } from '../../constants/AppConstant';
import { 
    ID_NAVIGATE_USER_SETTINGS_INFO_SCREEN } from '../../constants/IdConstant';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';
import { parseDateToString, parseStringToDate } from '../../helpers/DateHelper';

// Datas
import User from '../../datas/UserData';

// Components
import LoaderComponent from '../../components/LoaderComponent';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// Api
import { getUserByIdFireStore, setUserByObjectFireStore } from '../../api/UserApi';

type RootStackParamList = {
    UserUpdateInformationsScreen: any;
    UserInformationsScreen: any;
    SettingCounter: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'UserUpdateInformationsScreen', 'UserInformationsScreen'>;

const UserUpdateInformationsScreen = ({ navigation }: Props) => {

    // UseState
    let [userName, setUserName] = useState<string>('');
    const [errorUserName, setErrorUserName] = useState<string>("")

    let [userBirthDate, setUserBirthDate] = useState<Date>(new Date());
    const [userBirthDateVisible, setUserBirthDateVisible] = useState(false);
    const [errorUserBirthDate, setErrorUserBirthDate] = useState<string>("")

    let [userSomeAvgDay, setUserSomeAvgDay] = useState<string>('');
    const [errorUserSomeAvgDay, setErrorUserSomeAvgDay] = useState<string>("")

    const [isLoadSaveUserData, setIsLoadSaveUserData] = useState<boolean>(false);
    const [isLoadGetUserData, setIsLoadGetUserData] = useState<boolean>(true);

    const [errorSaveUserData, setErrorSaveUserData] = useState<string>("")

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        getDataUser()
    }, [])  

    /**
     * Function getDataUser
     */
     const getDataUser = () => {
        setIsLoadGetUserData(true)

        getUserByIdFireStore(userSelector.userId).then((user) => {

                userName = user.userName
                setUserName(userName)

                if(user.userBirthDate != ""){
                    userBirthDate = parseStringToDate(user.userBirthDate)
                    setUserBirthDate(userBirthDate)
                }
                
                userSomeAvgDay = user.userSmokeAvgNbr.toString()
                setUserSomeAvgDay(userSomeAvgDay)

                dispatch(setUser(user));

                setIsLoadGetUserData(false)

        }).catch((error) => {
            setIsLoadGetUserData(false)
            //console.log("Error getUserByIdFireStore")
            console.error(error.message);
        }) 
    }

    /**
     * Function handleSaveUserData
     */
    const handleSaveUserData = async () => {
        setIsLoadSaveUserData(true)

        setErrorUserName("")
        setErrorUserBirthDate("")
        setErrorUserSomeAvgDay("")

        if(isDataCorrect()){
            saveUserData()
        }
    }

    /**
     * Function isDataCorrect
     * @returns boolean
     */
    const isDataCorrect = (): boolean => {

        if (userName.length == 0) {
            setIsLoadSaveUserData(false)
            setErrorUserName( textTranslate.t('userUpdateNameRequired') )
            return false
        }

        if (userSomeAvgDay.length == 0) {
            setIsLoadSaveUserData(false)
            setErrorUserSomeAvgDay(textTranslate.t('userUpdateCigNbrRequired') )
            return false
        }

        return true
    }

    /**
     * Function saveUserData
     */
    const saveUserData = async () => {

        const userData = {
            userName: userName,
            userMail: userSelector.userMail,
            userBirthDate: parseDateToString(userBirthDate),
            userSmokeAvgNbr: userSomeAvgDay,
            idPatch: userSelector.idPatch,
            idPill: userSelector.idPill,
            idCigarette: userSelector.idCigarette,
        }

        setUserByObjectFireStore(userSelector.userId, userData).then((value) => {

            const u = new User(
                userSelector.userId, 
                userSelector.userName, 
                userSelector.userMail, 
                userSelector.userToken, 
                parseDateToString(userBirthDate), 
                parseInt(userSomeAvgDay), 
                userSelector.idPatch, 
                userSelector.idPill, 
                userSelector.idCigarette);

            dispatch(setUser(u));

            setIsLoadSaveUserData(false)

            navigation.navigate( ID_NAVIGATE_USER_SETTINGS_INFO_SCREEN )

        }).catch((error) => {
            //console.log("Error setUserFireStore")
            console.error(error.message)
            setErrorSaveUserData(error.message)
        })
    }

    /**
     * Function showUserBirthDatePicker
     */
    const showUserBirthDatePicker = () => {
        setUserBirthDateVisible(true)
    }
    
    /**
     * Function hideUserBirthDatePicker
     */
    const hideUserBirthDatePicker = () => {
        setUserBirthDateVisible(false)
        Keyboard.dismiss()
    }

    /**
     * Function handleConfirmUserBirthDate
     * @param date 
     */
    const handleConfirmUserBirthDate = (date: Date) => {
        userBirthDate = date
        setUserBirthDate(date)
        hideUserBirthDatePicker()
    }

    /**
     * View JSX
     */
    return (
        <SafeAreaView>
            <ScrollView 
                automaticallyAdjustKeyboardInsets={true}>

                <View>
                    { isLoadGetUserData == true ? 
                    <View>
                        <LoaderComponent text={ textTranslate.t('viewLoading') } step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <Stack 
                        spacing={0} 
                        style={AppStyle.mainContainerStack}>
                    
                        <View style={AppStyle.rowView}>
                            <TextInput 
                                variant={ TEXTINPUT_VARIANT }
                                label={ textTranslate.t('signinInputNameLabel') }
                                placeholder={ textTranslate.t('signinInputNamePlaceholder') }
                                helperText={errorUserName}
                                color={Colors.colorOrange}
                                style={ AppStyle.textInputLogin }
                                value={userName}
                                onChangeText={setUserName} />
                        </View>

                        <View style={AppStyle.rowView}>
                            <TextInput 
                                variant={ TEXTINPUT_VARIANT }
                                label={ textTranslate.t('userUpdateBirthDate') } 
                                placeholder={ textTranslate.t('userUpdateBirthDatePlaceholder') } 
                                helperText={errorUserBirthDate}
                                color={Colors.colorOrange}
                                style={ AppStyle.textInputLogin }
                                value={userBirthDate.toLocaleDateString()}
                                showSoftInputOnFocus={false}
                                onPress={ () => showUserBirthDatePicker()} />
                        </View>

                        <DateTimePickerModal
                            isVisible={userBirthDateVisible}
                            mode="date"
                            onConfirm={handleConfirmUserBirthDate}
                            onCancel={hideUserBirthDatePicker} />

                        <View style={AppStyle.rowView}>
                            <TextInput 
                                variant={ TEXTINPUT_VARIANT }
                                label={ textTranslate.t('userUpdateCigAvg') } 
                                placeholder={ textTranslate.t('userUpdateCigAvgPlaceholder') }  
                                helperText={errorUserSomeAvgDay}
                                keyboardType='number-pad'
                                color={Colors.colorOrange}
                                style={ AppStyle.textInputLogin }
                                value={userSomeAvgDay}
                                onChangeText={setUserSomeAvgDay} />
                        </View>

                        <View style={AppStyle.rowView}>
                            <View style={{flex: 1}}>
                                <Surface 
                                    elevation={ SURFACE_ELEVATION }
                                    category={ SURFACE_CATEGORY }
                                    style={AppStyle.surfaceBtnStat}>
                                    { isLoadSaveUserData == true ? 
                                    <View style={AppStyle.btnGoUpdate}>
                                        <LoaderComponent text={ textTranslate.t('userUpdateBtnLoader') } step="" color={Colors.white} size="small"/>
                                    </View>
                                    : 
                                    <TouchableOpacity
                                        onPress={ () => handleSaveUserData()}
                                        activeOpacity={0.6}
                                        style={AppStyle.btnGoUpdate}>
                                        <Text style={AppStyle.btnGoUpdateTxt}>{ textTranslate.t('userUpdateBtnSave') }</Text>
                                    </TouchableOpacity>
                                    }
                                </Surface>
                            </View>
                        </View>

                        <Text style={AppStyle.textError}>{errorSaveUserData}</Text>

                    </Stack>
                    }
                </View>  
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserUpdateInformationsScreen