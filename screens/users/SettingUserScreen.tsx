import React, { useState , useEffect} from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View, Keyboard, TouchableOpacity } from 'react-native'
import { Stack, TextInput, Backdrop, BackdropSubheader } from "@react-native-material/core";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PickerSelect from 'react-native-picker-select';

// Color
import Colors from '../../constants/ColorsConstant';

// Style
import AppStyle from '../../styles/AppStyle';
import UserSettingsStyle from '../../styles/UserSettingsStyle';

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

const SettingUserScreen = () => {

    // UseState
    let [userName, setUserName] = useState<string>('');
    let [userBirthDate, setUserBirthDate] = useState<Date>(new Date());
    const [userBirthDateVisible, setUserBirthDateVisible] = useState(false);
    let [userSomeAvgDay, setUserSomeAvgDay] = useState<string>('');

    let [userSmokeDate, setUserSmokeDate] = useState<Date>(new Date());
    const [userSmokeDateVisible, setUserSmokeDateVisible] = useState(false);

    let [userCigarette, setUserCigarette] = useState<string>('');
    let [userPatch, setUerPatch] = useState<string>('');
    let [userPastille, setUserPastille] = useState<string>('');

    const [revealed, setRevealed] = useState<boolean>(false);

    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(true);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {
        userName = userSelector.userName
        setUserName(userName)
        setUserCigarette('')
        setUerPatch('')
        setUserPastille('')
    }, [])  

    const showUserBirthDatePicker = () => {
        setUserBirthDateVisible(true)
    }
      
    const hideUserBirthDatePicker = () => {
        setUserBirthDateVisible(false)
        Keyboard.dismiss()
    }

    const handleConfirmUserBirthDate = (date: Date) => {
        userBirthDate = date
        setUserBirthDate(date)
        hideUserBirthDatePicker()
    }

    const showUserSmokeDatePicker = () => {
        setUserSmokeDateVisible(true)
    }
      
    const hideUserSmokeDatePicker = () => {
        setUserSmokeDateVisible(false)
        Keyboard.dismiss()
    }

    const handleConfirmUserSmokeDate = (date: Date) => {
        userSmokeDate = date
        setUserSmokeDate(date)
        hideUserSmokeDatePicker()
    }

    const handleUserSmokeCigaretteTypeList = () => {
        console.log(!revealed)
        setRevealed(!revealed)
    }

    return (
        <SafeAreaView style={AppStyle.container}>
            <ScrollView 
                style={UserSettingsStyle.userScrollView}
                automaticallyAdjustKeyboardInsets={true}
                >
                <View>
                    <View style={AppStyle.subTitleContainer}>
                        <Text style={AppStyle.subTitleText}>Vos informations</Text>
                    </View>

                    <View style={UserSettingsStyle.userInputContainer}>
                    
                        <TextInput 
                            variant="outlined"
                            label="Entrer votre nom"
                            placeholder="Nom"
                            helperText=""
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userName}
                            onChangeText={setUserName} />

                        <TextInput 
                            variant="outlined"
                            label="Entrer votre date de naissance"
                            placeholder="JJ/MM/AAAA"
                            helperText=""
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userBirthDate.toLocaleDateString()}
                            showSoftInputOnFocus={false}
                            onPress={ () => showUserBirthDatePicker()} />

                        <TextInput 
                            variant="outlined"
                            label="Entrer la date où vous avez commencé à fumer"
                            placeholder="JJ/MM/AAAA"
                            helperText=""
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userSmokeDate.toLocaleDateString()} 
                            showSoftInputOnFocus={false}
                            onPress={ () => showUserSmokeDatePicker()} />

                        <TextInput 
                            keyboardType='number-pad'
                            variant="outlined"
                            label="Entrer le nombre de cigarette fumer par jours"
                            placeholder="Nombre de cigarette fumer par jours"
                            helperText=""
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userSomeAvgDay}
                            onChangeText={setUserSomeAvgDay} />

                    </View>
                </View>  
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingUserScreen

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    },
    inputAndroid: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    }
});