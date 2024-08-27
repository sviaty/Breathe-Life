// React & React Native
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'

// Material
import { Stack, TextInput, Surface } from "@react-native-material/core";

// Styles
import AppStyle from '../../styles/AppStyle';

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION, 
    TEXTINPUT_VARIANT } from '../../constants/AppConstant';
import { 
    ID_TOKEN, 
    ID_USER } from '../../constants/IdConstant';

// Datas
import User from '../../datas/UserData';

// Components
import ButtonComponent from '../../components/ButtonComponent';
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';
import { addSecureStore } from '../../helpers/SecureStoreHelper';

// Redux
import { RootState } from '../../redux/Store';
import { setIsLogin } from '../../redux/slices/IsLoginSlice';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// Api
import { getUserFireStore } from '../../api/UserApi';

// Fire Store
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

/**
 * LoginScreen
 * @returns 
 */
const LoginScreen = () => {

    // UseState
    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
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
        setStep( textTranslate.t('dataVerificationText') )

        if (mail.length == 0) {
            setIsLoader(false)
            dispatch(setIsLogin(false));
            setErrorMail( textTranslate.t('errorMailRequired') )
            return false
        }

        if (pwd.length == 0) {
            setIsLoader(false)
            dispatch(setIsLogin(false));
            setErrorPwd( textTranslate.t('errorPwdRequired') )
            return false
        }

        return true
    }

    /**
     * Function loginUserAuth
     */
    const loginUserAuth = () => {
        setStep( textTranslate.t('userIdLogin') )

        const auth = getAuth();

        signInWithEmailAndPassword(auth, mail, pwd)
            .then(async (userCredential) => {

                const userDataAuth = userCredential.user;
                //console.log(userDataAuth)

                setStep( textTranslate.t('userSaveTokenLogin') )

                userDataAuth.getIdToken().then(token => {
                    addSecureStore(ID_TOKEN, token)
                })

                getUserInDatabase()
            })
            .catch((error) => {
                //console.log(error)
                setIsLoader(false)
                dispatch(setIsLogin(false));
                displayErrorUserAuth(error)
            });
    };

    /**
     * Function displayErrorUserAuth
     * @param error 
     */
    const displayErrorUserAuth = (error: any) => {
         //console.log(error.code)

        switch (error.code) {
            case "auth/invalid-credential": {
                setError( textTranslate.t('userMailPwdWrongLogin') )
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
        setStep( textTranslate.t('userGetDataUserLogin') )

        getUserFireStore(mail).then((userList) => {

            userList.forEach((doc) => {

                const dataUser = doc.data()

                addSecureStore(ID_USER, doc.id)

                const u = new User(
                    doc.id,
                    dataUser.userName, 
                    dataUser.userMail, 
                    "", 
                    dataUser.userBirthDate, 
                    dataUser.userSmokeAvgNbr, 
                    dataUser.idPatch, 
                    dataUser.idPill, 
                    dataUser.idCigarette);

                dispatch(setUser(u));
            });

            setIsSnackBar(true)
            dispatch(setIsLogin(true));

        }).catch((error) => {
            setIsLoader(false)
            dispatch(setIsLogin(false));

            const mError = error.message
            setError(mError)
            //console.error(mError);
        }) 
    }

    /**
     * View JSX
     */
    return (
        <View>

            <View style={AppStyle.subTitleContainer}>
                <Text style={AppStyle.subTitleText}>Connexion</Text>
            </View>

            <Stack 
                spacing={0} 
                style={AppStyle.mainContainerStack}>
                
                <View style={AppStyle.rowView}>
                    <TextInput
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('loginInputMailLabel') } 
                        placeholder={ textTranslate.t('loginInputMailPlaceholder') } 
                        helperText={errorMail}
                        color={Colors.colorOrange}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        style={ AppStyle.textInputLogin }
                        value={mail}
                        onChangeText={setMail} />
                </View>

                <View style={AppStyle.rowView}>
                    <TextInput
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('loginInputPwdLabel') } 
                        placeholder={ textTranslate.t('loginInputPwdPlaceholder') } 
                        helperText={errorPwd}
                        color={Colors.colorOrange}
                        autoCapitalize="none"
                        style={ AppStyle.textInputLogin }
                        value={pwd}
                        onChangeText={setPwd}
                        secureTextEntry={true} />
                </View>

                <View style={AppStyle.rowView}>
                    <View style={AppStyle.textUseConditionContenair}>
                        <Text>{ textTranslate.t('loginUseCondition') } </Text>
                    </View>
                </View>

                {isLoader == true ? 
                <View style={AppStyle.rowView}>
                    <Surface 
                        elevation={SURFACE_ELEVATION}
                        category={SURFACE_CATEGORY}
                        style={AppStyle.surfaceBtnBlueView }>

                        <LoaderComponent 
                            text={ textTranslate.t('loginLoaderText') } 
                            step={step} 
                            color={Colors.white} 
                            size="large"/>
                    </Surface>
                </View>
                : 
                <View style={AppStyle.rowView}>
                    <ButtonComponent 
                        btnText={ textTranslate.t('loginBtnText') }
                        textColor={Colors.white}
                        activeOpacity={0.6}
                        backgroundColor={Colors.blueFb}
                        handleFunction={() => handleLogIn()} />
                </View>
                }

                <Text style={AppStyle.textError}>{error}</Text>

            </Stack>

            <SnackBarComponent 
                visible={isSnackBar} 
                setVisible={setIsSnackBar}
                message={ textTranslate.t('loginSnackText') }
                duration={3000} />

        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({

})