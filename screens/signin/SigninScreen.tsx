// React & React Native
import React, { useState } from 'react';
import { View, Text } from 'react-native'

// Material
import { Stack, TextInput, Surface} from "@react-native-material/core";

// Styles
import AppStyle from '../../styles/AppStyle';

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION, 
    TEXTINPUT_VARIANT } from '../../constants/AppConstant';
import { 
    ID_NAVIGATE_LOGIN } from '../../constants/IdConstant';

// Datas
import User from '../../datas/UserData';

// Components
import ButtonComponent from '../../components/ButtonComponent';
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';

// Api
import { addUserFireStore } from '../../api/UserApi';

// Fire Store
import firebaseConfig from '../../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(firebaseConfig);

/**
 * Screen SigninScreen
 * @param param0 
 * @returns 
 */
const SigninScreen = ({navigation}: {navigation: any}) => {

    // UseState
    const [name, setName] = useState<string>("");
    const [mail, setMail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [pwdCopy, setPwdCopy] = useState<string>("");

    const [errorName, setErrorName] = useState<string>('');
    const [errorMail, setErrorMail] = useState<string>('');
    const [errorPwd, setErrorPwd] = useState<string>('');
    const [errorPwdCopy, setErrorPwdCopy] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [step, setStep] = useState<string>('');
    
    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    /**
     * Function handleSignIn
     */
    const handleSignIn = () => {
        setIsLoader(true)

        setErrorName("")
        setErrorMail("")
        setErrorPwd("")
        setErrorPwdCopy("")
        setError("")
        
        if(isDataCorrect()){
            createUserAuth()
        }
    }

    /**
     * Function isDataCorrect
     * @returns boolean
     */
    const isDataCorrect = (): boolean => {
        setStep( textTranslate.t('dataVerificationText') )

        if(name.length == 0){
            setIsLoader(false)
            setErrorName( textTranslate.t('errorNameRequired') )
            return false
        }

        if(mail.length == 0){
            setIsLoader(false)
            setErrorMail( textTranslate.t('errorMailRequired') )
            return false
        }

        if(pwd.length == 0){
            setIsLoader(false)
            setErrorPwd( textTranslate.t('errorPwdRequired') )
            return false
        }

        if(pwdCopy.length == 0){
            setIsLoader(false)
            setErrorPwdCopy( textTranslate.t('errorPwdCopyRequired') )
            return false
        } else {
            if(pwd != pwdCopy){
                setIsLoader(false)
                setErrorPwdCopy( textTranslate.t('errorPwdCopyFalse') )
                return false
            }
        }

        return true 
    }

    /**
     * Function createUserAuth
     */
    const createUserAuth = () => {
        setStep( textTranslate.t('userIdCreate') )

        createUserWithEmailAndPassword(auth, mail, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                addUser()
            })
            .catch((error) => {
                setIsLoader(false)
                
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
            case "auth/email-already-in-use": {
                setError( textTranslate.t('userMailAlreadyUse') )
                setErrorMail( textTranslate.t('userMailAlreadyUse') )
                break;
            }
            case "auth/weak-password": {
                setError( textTranslate.t('userPwdWeak') )
                setErrorPwd( textTranslate.t('userPwdWeak') )
                break;
            }
            default: {
                setError(error.message)
                break;
            }
        }
    }

    /**
     * Function addUser
     */
    const addUser = async () => {

        setStep( textTranslate.t('userSaveData') )
        const user = new User("",name,mail,"","",0,"","","")

        await addUserFireStore(user).then(() => {

            setIsLoader(false)
            setIsSnackBar(true)

            navigation.navigate(ID_NAVIGATE_LOGIN)
            
        }).catch((error) => {
    
            setIsLoader(false)

            const mError = error.message
            setError(mError)
            //console.error(mError);
        }) 
    };

    /**
     * View JSX
     */
    return (
        <View>

            <View style={AppStyle.subTitleContainer}>
                <Text style={AppStyle.subTitleText}>{textTranslate.t('signinText')}</Text>
            </View>

            <Stack 
                spacing={0} 
                style={AppStyle.mainContainerStack}
                removeClippedSubviews={true}>
                
                <View style={AppStyle.rowView}>
                    <TextInput 
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('signinInputNameLabel') }
                        placeholder={ textTranslate.t('signinInputNamePlaceholder') }
                        helperText={ errorName }
                        color={ Colors.colorOrange }
                        keyboardType="default"
                        style={ AppStyle.textInputSigin }
                        value={ name }
                        onChangeText={ setName } />
                </View>
                
                <View style={AppStyle.rowView}>
                    <TextInput 
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('signinInputMailLabel') }
                        placeholder={ textTranslate.t('signinInputMailPlaceholder') }
                        helperText={ errorMail }
                        color={ Colors.colorOrange }
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        style={ AppStyle.textInputSigin }
                        value={ mail }
                        onChangeText={ setMail } />
                </View>

                <View style={AppStyle.rowView}>
                    <TextInput 
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('signinInputPwdLabel') }
                        placeholder={ textTranslate.t('signinInputPwdPlaceholder') }
                        helperText={errorPwd}
                        color={Colors.colorOrange}
                        autoCapitalize="none"
                        style={AppStyle.textInputSigin}
                        value={pwd}
                        onChangeText={setPwd}
                        secureTextEntry={true} />
                </View>
                
                <View style={AppStyle.rowView}>
                    <TextInput 
                        variant={ TEXTINPUT_VARIANT }
                        label={ textTranslate.t('signinInputPwCopyLabel') }
                        placeholder={ textTranslate.t('signinInputPwdCopyPlaceholder') }
                        helperText={errorPwdCopy}
                        color={Colors.colorOrange}
                        autoCapitalize="none"
                        style={AppStyle.textInputSigin}
                        value={pwdCopy}
                        onChangeText={setPwdCopy}
                        secureTextEntry={true}
                        contextMenuHidden={true} />
                </View>

                {isLoader == true ? 
                <View style={AppStyle.rowView}>
                    <Surface 
                        elevation={SURFACE_ELEVATION}
                        category={SURFACE_CATEGORY}
                        style={AppStyle.surfaceBtnBlueView }>

                        <LoaderComponent 
                            text={ textTranslate.t('signinLoaderText') } 
                            step={step} 
                            color={Colors.white} 
                            size="large"/>
                    </Surface>
                </View>
                : 
                <View style={AppStyle.rowView}>
                    <ButtonComponent 
                        btnText={ textTranslate.t('signinBtnText') }
                        textColor={Colors.white}
                        activeOpacity={0.6}
                        backgroundColor={Colors.blueFb}
                        handleFunction={() => handleSignIn()} />
                </View>
                }
                <Text style={AppStyle.textError}>{error}</Text>
                
            </Stack>
            
            <SnackBarComponent 
                visible={isSnackBar} 
                setVisible={setIsSnackBar} 
                message={ textTranslate.t('signinSnackText') }
                duration={3000} />

        </View>
    )
}

export default SigninScreen