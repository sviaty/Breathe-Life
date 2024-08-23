import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { Stack, TextInput, Backdrop, BackdropSubheader } from "@react-native-material/core";
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebaseConfig);


// Style
import AppStyle from '../../styles/AppStyle';
import SigninStyle from '../../styles/LoginSigninStyle';
import Colors from '../../constants/ColorConstant';

// Api
import { addUserFireStore } from '../../api/UserApi';


/**
 * SigninScreen
 * @param param0 
 * @returns 
 */
const SigninScreen = ({navigation}: {navigation: any}) => {

    // UseState
    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    const [name, setName] = useState<string>("");
    const [mail, setMail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [pwdCopy, setPwdCopy] = useState<string>("");

    const [step, setStep] = useState<string>('');
    const [error, setError] = useState<string>('');

    const [errorName, setErrorName] = useState<string>('');
    const [errorMail, setErrorMail] = useState<string>('');
    const [errorPwd, setErrorPwd] = useState<string>('');
    const [errorPwdCopy, setErrorPwdCopy] = useState<string>('');

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
        setStep("Vérification des données")

        if(name.length == 0){
            setIsLoader(false)
            setErrorName("Le nom est vide")
            return false
        }

        if(mail.length == 0){
            setIsLoader(false)
            setErrorMail("L'e-mail est vide")
            return false
        }

        if(pwd.length == 0){
            setIsLoader(false)
            setErrorPwd("Le mot de passe est vide")
            return false
        }

        if(pwdCopy.length == 0){
            setIsLoader(false)
            setErrorPwdCopy("Le mot de passe re-copié est vide")
            return false
        } else {
            if(pwd != pwdCopy){
                setIsLoader(false)
                setErrorPwdCopy("Le mot de passe est mal recopié")
                return false
            }
        }

        return true 
    }

    /**
     * Function createUserAuth
     */
    const createUserAuth = () => {
        setStep("Création des identifiants de l'utilisateur")

        createUserWithEmailAndPassword(auth, mail, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                //console.log(user)
                
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
                setError("L' e-mail est déjà utilisé par un utilisateur.")
                setErrorMail("L' e-mail est déjà utilisé par un utilisateur.")
                break;
            }
            case "auth/weak-password": {
                setError("Le mot de passe doit contenir au minimum 6 charactères.")
                setErrorPwd("Le mot de passe doit contenir au minimum 6 charactères.")
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
        setStep('Ajout des données utilisateur')

        const userData = {
            userName: name,
            userMail: mail,
            userBirthDate: "",
            userSmokeAvgNbr: "",
            idPatch: "",
            idPill: "",
            idCigarette: ""
        }

        await addUserFireStore(userData).then(() => {

            setIsLoader(false)

            // display snack bar
            setIsSnackBar(true)

            navigation.navigate('LogIn')
            
        }).catch((error) => {
    
            setIsLoader(false)

            setError("Error add data : "+ error)
            console.error("Error add data : "+ error);
        }) 
    };

    /**
     * View JSX
     */
    return (
        <View style={AppStyle.container}>
  
            <View style={AppStyle.subTitleContainer}>
                <Text style={AppStyle.subTitleText}>Inscription</Text>
            </View>

            <Stack spacing={0} style={AppStyle.stackLogin} removeClippedSubviews={true}>

                <TextInput 
                    variant="outlined"
                    label="Entrer votre nom"
                    placeholder="John"
                    helperText={errorName}
                    color={Colors.colorOrange}
                    keyboardType="default"
                    style={SigninStyle.textInput}
                    value={name}
                    onChangeText={setName} />

                <TextInput 
                    variant="outlined"
                    label="Entrer votre mail"
                    placeholder="e-mail@gmail.com"
                    helperText={errorMail}
                    color={Colors.colorOrange}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    style={SigninStyle.textInput}
                    value={mail}
                    onChangeText={setMail} />

                <TextInput 
                    variant="outlined"
                    label="Entrer votre mot de passe"
                    placeholder="Mot de passe"
                    helperText={errorPwd}
                    color={Colors.colorOrange}
                    autoCapitalize="none"
                    style={SigninStyle.textInput}
                    value={pwd}
                    onChangeText={setPwd}
                    secureTextEntry={true} />

                <TextInput 
                    variant="outlined"
                    label="Re-copier votre mot de passe"
                    placeholder="Mot de passe"
                    helperText={errorPwdCopy}
                    color={Colors.colorOrange}
                    autoCapitalize="none"
                    style={SigninStyle.textInput}
                    value={pwdCopy}
                    onChangeText={setPwdCopy}
                    secureTextEntry={true}
                    contextMenuHidden={true} />

                <TouchableOpacity
                    onPress={() => handleSignIn()}
                    activeOpacity={0.6}
                    style={SigninStyle.btnLogin}>
                    <Text style={SigninStyle.buttonText}>Inscription</Text>
                </TouchableOpacity>

            </Stack>

            {isLoader == true ? 
            <View>
                <LoaderComponent text="Inscription en cours ..." step={step} color={Colors.blueFb} size={'large'}/>
            </View>
            : 
            <Text style={SigninStyle.textError}>{error}</Text>
            }
            
            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={'User is signed'}/>

        </View>
    )
}

export default SigninScreen

const styles = StyleSheet.create({
   
})