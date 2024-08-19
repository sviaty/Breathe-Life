import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Stack, TextInput, Backdrop, BackdropSubheader } from "@react-native-material/core";
import SnackBarComponent from '../../components/SnackBarComponent';

// Secure Store
import SecureStoreClass from '../../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

// Data 
import User from '../../datas/UserData';

// Style
import AppStyle from '../../styles/AppStyle';
import LoginStyle from '../../styles/LoginSigninStyle';
import Colors from '../../constants/ColorsConstant';
import LoaderComponent from '../../components/LoaderComponent';

// FireStore
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Redux
import { RootState } from '../../redux/Store';
import { setIsLogin } from '../../redux/slices/IsLoginSlice';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// Api
import { getUserFireStore } from '../../api/UserApi';

/**
 * LoginScreen
 * @returns 
 */
const LoginScreen = () => {

    // UseState
    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    const [userState, setUserState] = useState<User>(new User("", "", "", "", "", "", 0,"", "", ""))

    const [mail, setMail] = useState<string>('');
    const [pwd, setPwd] = useState<string>('');
    const [step, setStep] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [errorMail, setErrorMail] = useState<string>('');
    const [errorPwd, setErrorPwd] = useState<string>('');

    // Selector
    const isLogin = useSelector((state: RootState) => state.isLoginReducer.isLogin);
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    /**
     * Function handleLogIn
     */
    const handleLogIn = () => {
        setIsLoader(true)

        setError("")
        setErrorMail("")
        setErrorPwd("")

        if (isDataCorrect()) {
            loginUserAuth()
        }
    }

    /**
     * Function isDataCorrect
     * @returns boolean
     */
    const isDataCorrect = (): boolean => {
        setStep("Vérification des données")

        if (mail.length == 0) {
            setIsLoader(false)
            dispatch(setIsLogin(false));
            setErrorMail("L'e-mail est vide")
            return false
        }

        if (pwd.length == 0) {
            setIsLoader(false)
            dispatch(setIsLogin(false));
            setErrorPwd("Le mot de passe est vide")
            return false
        }

        return true
    }

    /**
     * Function loginUserAuth
     */
    const loginUserAuth = () => {
        setStep("Identification de l'utilisateur")

        const auth = getAuth();

        signInWithEmailAndPassword(auth, mail, pwd)
            .then(async (userCredential) => {

                const userDataAuth = userCredential.user;
                //console.log(userDataAuth)

                setStep("Enregistrement du token")
                userDataAuth.getIdToken().then(token => {
                    secureStoreClass.saveToken('tokenId', token)
                })

                getUserInDatabase()
            })
            .catch((error) => {
                //console.log(error)

                setIsLoader(false)
                dispatch(setIsLogin(false));

                displayErrorUserAuth(error)
            }
            );
    };

    /**
     * Function displayErrorUserAuth
     * @param error 
     */
    const displayErrorUserAuth = (error: any) => {
         //console.log(error.code)

        switch (error.code) {
            case "auth/invalid-credential": {
                setError("L'e-mail ou le mot de passe n'est pas bon.")
                break;
            }
            default: {
                setError(error.message)
                break;
            }
        }
    }

    /**
     * Function getUserInDatabase
     */
    const getUserInDatabase = async () => {
        setStep('Récupération des données utilisateur')

        getUserFireStore(mail).then((userList) => {

            userList.forEach((doc) => {

                const dataUser = doc.data()

                secureStoreClass.saveToken('userId', doc.id)

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
                dispatch(setUser(u));
            });

            setStep("Vous êtes connecté")
            //console.log('User is logged');

            setIsSnackBar(true)
            dispatch(setIsLogin(true));

        }).catch((error) => {
            setIsLoader(false)
            dispatch(setIsLogin(false));

            setError("Error add data : " + error)
            console.error("Error add data : " + error);
        }) 
    }

    /**
     * View JSX
     */
    return (
        <View style={AppStyle.container}>

            <View style={AppStyle.subTitleContainer}>
                <Text style={AppStyle.subTitleText}>Connexion</Text>
            </View>

            <Stack spacing={0} style={AppStyle.stackLogin}>

                <TextInput
                    variant="outlined"
                    label="Entrer votre mail"
                    placeholder="e-mail@gmail.com"
                    helperText={errorMail}
                    color={Colors.colorOrange}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    autoFocus
                    style={LoginStyle.textInput}
                    value={mail}
                    onChangeText={setMail} />

                <TextInput
                    variant="outlined"
                    label="Entrer votre mot de passe"
                    placeholder="Mot de passe"
                    helperText={errorPwd}
                    color={Colors.colorOrange}
                    autoCapitalize="none"
                    style={LoginStyle.textInput}
                    value={pwd}
                    onChangeText={setPwd}
                    secureTextEntry={true} />

                <View style={LoginStyle.textConditionContenair}>
                    <Text>En cliquant sur connexion, vous acceptez notre condition générale d'utilisation.</Text>
                </View>

                <TouchableOpacity
                    onPress={handleLogIn}
                    activeOpacity={0.6}
                    style={LoginStyle.btnLogin}>
                    <Text style={LoginStyle.buttonText}>Connexion</Text>
                </TouchableOpacity>

            </Stack>

            {isLoader == true ?
                <View>
                    <LoaderComponent text="Connection en cours ..." step={step} color={Colors.blueFb} size={'large'} />
                </View>
                :
                <Text style={LoginStyle.textError}>{error}</Text>
            }

            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={'User is logged'} />

        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({

})