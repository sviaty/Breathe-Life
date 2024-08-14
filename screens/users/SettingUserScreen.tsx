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

// Datas
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import LoaderComponent from '../../components/LoaderComponent';
const db = getFirestore(firebaseConfig);

const SettingUserScreen = () => {

    // UseState
    let [userName, setUserName] = useState<string>('');
    const [errorUserName, setErrorUserName] = useState<string>("")

    let [userBirthDate, setUserBirthDate] = useState<Date>(new Date());
    const [userBirthDateVisible, setUserBirthDateVisible] = useState(false);
    const [errorUserBirthDate, setErrorUserBirthDate] = useState<string>("")

    let [userSmokeDate, setUserSmokeDate] = useState<Date>(new Date());
    const [userSmokeDateVisible, setUserSmokeDateVisible] = useState(false);
    const [errorUserSmokeDate, setErrorUserSmokeDate] = useState<string>("")

    let [userSomeAvgDay, setUserSomeAvgDay] = useState<string>('');
    const [errorUserSomeAvgDay, setErrorUserSomeAvgDay] = useState<string>("")

    let [userCigarette, setUserCigarette] = useState<string>('');
    let [userPatch, setUerPatch] = useState<string>('');
    let [userPastille, setUserPastille] = useState<string>('');

    const [revealed, setRevealed] = useState<boolean>(false);

    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(true);

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


    const getDataUser = async () => {
        setIsLoadGetUserData(true)

        const q = query(collection(db, "users"), where("userMail", "==", userSelector.userMail));
        await getDocs(q).then((userList) => {
            userList.forEach((doc) => {
                //console.log(doc.data());
                const dataUser = doc.data()

                const u = new User(
                    doc.id,
                    dataUser.userName, 
                    dataUser.userMail, 
                    "", 
                    dataUser.userBirthDate, 
                    dataUser.userSmokeStartDate, 
                    dataUser.userSmokeAvgNbr, 
                    
                    dataUser.idPatch, 
                    dataUser.idPill, 
                    dataUser.idCigarette);

                userName = dataUser.userName
                setUserName(userName)

                userBirthDate = dataUser.userBirthDate.toDate()
                setUserBirthDate(userBirthDate)

                userSmokeDate = dataUser.userSmokeStartDate.toDate()
                setUserSmokeDate(userSmokeDate)

                userSomeAvgDay = dataUser.userSmokeAvgNbr
                setUserSomeAvgDay(userSomeAvgDay)

                dispatch(setUser(u));

                setIsLoadGetUserData(false)
            });
        }).catch((error) => {
            setIsLoadGetUserData(false)
            console.error("Error add data : " + error);
        })
    }

    const handleSaveUserData = async () => {
        setIsLoadSaveUserData(true)

        setErrorUserName("")
        setErrorUserBirthDate("")
        setErrorUserSmokeDate("")
        setErrorUserSomeAvgDay("")
        
        //console.log(isDataCorrect())

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
            setErrorUserName("Le nom est obligatoire")
            return false
        }

        /*
        if (userBirthDate.toDateString.length == 0) {
            setIsLoadSaveUserData(false)
            setErrorUserBirthDate("La date de naissance est obligatoire")
            return false
        }

       
        if (userSmokeDate.toDateString.length == 0) {
            setIsLoadSaveUserData(false)
            setErrorUserSmokeDate("La date est obligatoire")
            return false
        }
        */

        if (userSomeAvgDay.length == 0) {
            setIsLoadSaveUserData(false)
            setErrorUserSomeAvgDay("Le nombre moyen de cigarette est obligatoire")
            return false
        }
       

        return true
    }

    /**
     * Function saveUserData
     */
    const saveUserData = async () => {
        
        const userDoc = doc(db, "users", userSelector.userId)
        
        await setDoc(userDoc, {
            userName: userName,
            userMail: userSelector.userMail,
            userBirthDate: userBirthDate,
            userSmokeStartDate: userSmokeDate,
            userSmokeAvgNbr: userSomeAvgDay,
            idPatch: userSelector.idPatch,
            idPill: userSelector.idPill,
            idCigarette: userSelector.idCigarette,
        }).then((value) => {
            //console.log(value);

            const u = new User(
                userSelector.userId, 
                userSelector.userName, 
                userSelector.userMail, 
                userSelector.userToken, 
                userSelector.userBirthDate, 
                userSelector.userSmokeStartDate, 
                userSelector.userSmokeAvgNbr, 
                userSelector.idPatch, 
                userSelector.idPill, 
                userSelector.idCigarette);

            dispatch(setUser(u));

            setIsLoadSaveUserData(false)

            getDataUser()

        }).catch((error) => {
            console.error("Error set user in firestore database : ")
            console.error(error)
            setErrorSaveUserData(error.message)
        })
    }

    return (
        <SafeAreaView style={AppStyle.container}>
            <ScrollView 
                style={UserSettingsStyle.userScrollView}
                automaticallyAdjustKeyboardInsets={true}>

                <View>
                    <View style={AppStyle.subTitleContainer}>
                        <Text style={AppStyle.subTitleText}>Vos informations</Text>
                    </View>

                    { isLoadGetUserData == true ? 
                    <View>
                        <LoaderComponent text="Chargement en cours ..." step="" color={Colors.blueFb} size="large"/>
                    </View>
                    : 
                    <View style={UserSettingsStyle.userInputContainer}>
                    
                        <TextInput 
                            variant="outlined"
                            label="Entrer votre nom"
                            placeholder="Nom"
                            helperText={errorUserName}
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userName}
                            onChangeText={setUserName} />

                        <TextInput 
                            variant="outlined"
                            label="Entrer votre date de naissance"
                            placeholder="JJ/MM/AAAA"
                            helperText={errorUserBirthDate}
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userBirthDate.toLocaleDateString()}
                            showSoftInputOnFocus={false}
                            onPress={ () => showUserBirthDatePicker()} />

                        <DateTimePickerModal
                            isVisible={userBirthDateVisible}
                            mode="date"
                            onConfirm={handleConfirmUserBirthDate}
                            onCancel={hideUserBirthDatePicker} />

                        <TextInput 
                            variant="outlined"
                            label="Entrer la date où vous avez commencé à fumer"
                            placeholder="JJ/MM/AAAA"
                            helperText={errorUserSmokeDate}
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userSmokeDate.toLocaleDateString()} 
                            showSoftInputOnFocus={false}
                            onPress={ () => showUserSmokeDatePicker()} />

                        <DateTimePickerModal
                            isVisible={userSmokeDateVisible}
                            mode="date"
                            onConfirm={handleConfirmUserSmokeDate}
                            onCancel={hideUserSmokeDatePicker} />

                        <TextInput 
                            keyboardType='number-pad'
                            variant="outlined"
                            label="Entrer le nombre de cigarette fumer par jours"
                            placeholder="Nombre de cigarette fumer par jours"
                            helperText={errorUserSomeAvgDay}
                            color={Colors.colorOrange}
                            style={UserSettingsStyle.inputText}
                            value={userSomeAvgDay}
                            onChangeText={setUserSomeAvgDay} />

                        <TouchableOpacity
                            onPress={() => handleSaveUserData()}
                            activeOpacity={0.6}
                            style={ AppStyle.btnAddPatch }>
                            <Text style={AppStyle.btnAddPatchText}>Enregister</Text>
                        </TouchableOpacity>

                        { isLoadSaveUserData == true ?
                        <View>
                            <LoaderComponent text="Enregistrement en cours ..." step="" color={Colors.blueFb} size="large"/>
                        </View>
                        :
                        <Text style={AppStyle.textError}>{errorSaveUserData}</Text>
                        }
                    </View>
                    }
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