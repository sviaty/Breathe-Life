import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';

import AppStyle from '../../styles/AppStyle';
import SigninStyle from '../../styles/LoginSigninStyle';
import Colors from '../../constants/ColorsConstant';
import LoaderComponent from '../../components/LoaderComponent';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { Props } from 'react-native-paper/lib/typescript/core/PaperProvider';
import SnackBarComponent from '../../components/SnackBarComponent';

const firebaseConfig = {
    apiKey: "AIzaSyDtDQYI2sJN-GT9jCfg4YYDrhaiMbalcMk",
    authDomain: "testing-firebase-ec361.firebaseapp.com",
    databaseURL: "https://testing-firebase-ec361-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "testing-firebase-ec361",
    storageBucket: "testing-firebase-ec361.appspot.com",
    messagingSenderId: "939968442007",
    appId: "1:939968442007:web:2114a3275d29bd3664c3d2",
    measurementId: "G-FEVR7B56CS"
};
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);
//const analytics = getAnalytics(app);


const SigninComponent = ({navigation}: {navigation: any}) => {
    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    const [name, setName] = useState<string>("");
    const [mail, setMail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");

    const [step, setStep] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSignIn = () => {
        setIsLoader(true)

        if(mail.length > 0){
            if(pwd.length > 0){
                setError('')
                createUser()
            } else {
                setIsLoader(false)
                setError('Password is empty')
                //console.error("Password is empty");
            }
        } else {
            setIsLoader(false)
            setError('Mail is empty')
            //console.error("Mail is empty");
        }
    }

    const createUser = () => {
        setStep('Auth user')
        createUserWithEmailAndPassword(auth, mail, pwd)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                
                addUserInDatabase()
            })
            .catch((error) => {
                setIsLoader(false)
                console.log(error)
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(error.message)
            }
        );
    };

    const addUserInDatabase = async () => {
        try {
            setStep('Add user data in database')
            const docRef = await addDoc(collection(db, "users"), {
                userName: name,
                userMail: mail
            });
        
            //console.log("User add with ID: "+ docRef.id);
            //console.log('User is signed');

            // display snack bar
            setIsSnackBar(true)

            navigation.navigate('LogIn')

        } catch (error) {
            setIsLoader(false)
            setError("Error add data : "+ error)
            console.error("Error add data : "+ error);
        }
    };

    return (
        <View style={AppStyle.container}>
        <LinearGradient
            colors={[Colors.colorOrange, Colors.colorOrange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

                <View>
                    <Text style={AppStyle.textSubTitle}>Signin Page</Text>
                </View>

                <TextInput 
                    style={SigninStyle.textInput}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName} />

                <TextInput 
                    style={SigninStyle.textInput}
                    placeholder="Enter your mail"
                    value={mail}
                    onChangeText={setMail} />

                <TextInput 
                    style={SigninStyle.textInput}
                    placeholder="Enter your password"
                    value={pwd}
                    onChangeText={setPwd}
                    secureTextEntry={true} />

                <TouchableOpacity
                    onPress={() => handleSignIn()}
                    activeOpacity={0.6}
                    style={SigninStyle.btnLogin}>
                    <Text style={SigninStyle.buttonText}>Sigin</Text>
                </TouchableOpacity>

                {isLoader == true ? 
                <View>
                <LoaderComponent text="Connection is in progress ..." step={step} color={Colors.white}/>
                </View>
                : 
                <Text style={SigninStyle.textError}>{error}</Text>
                }
            
        </LinearGradient>

        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={'User is signed'}/>

        </View>
    )
}

export default SigninComponent

const styles = StyleSheet.create({
   
})