import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';

import SecureStoreClass from '../../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

import User from '../../datas/UserData';

import AppStyle from '../../styles/AppStyle';
import LoginStyle from '../../styles/LoginSigninStyle';
import Colors from '../../constants/ColorsConstant';
import LoaderComponent from '../../components/LoaderComponent';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";

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

import { RootState } from '../../redux/Store';
import { setIsLogin } from '../../redux/slices/IsLoginSlice';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import SnackBarComponent from '../../components/SnackBarComponent';


const LoginComponent = () => {

    const [isLoader, setIsLoader] = useState<boolean>(false)
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    const [userState, setUserState] = useState<User>(new User('', '', '', ''))

    const isLogin = useSelector((state: RootState) => state.isLoginReducer.isLogin);
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    const [mail, setMail] = useState<string>('');
    const [pwd, setPwd] = useState<string>('');

    const [step, setStep] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleLogIn = () => {
      setIsLoader(true)

      if(mail.length > 0){
          if(pwd.length > 0){
            setError('')
            loginUser()
          } else {
            setIsLoader(false)
            setError("Password is empty")
            //console.error("Password is empty");
            dispatch(setIsLogin(false));
          }
      } else {
        setIsLoader(false)
        setError("Mail is empty")
        //console.error("Mail is empty");
        dispatch(setIsLogin(false));
      }
    }

    const loginUser = () => {
      setStep('Auth user')
      const auth = getAuth();
      signInWithEmailAndPassword(auth, mail, pwd)
        .then(async (userCredential) => {

          const userDataAuth = userCredential.user;

          //console.log(userDataAuth)

          userDataAuth.getIdToken().then(token => { 
            secureStoreClass.saveToken('tokenId', token)
            setStep('Token is save')
          })
    
          getUserInDatabase()
        })
        .catch((error) => {
          console.log(error)
          const errorCode = error.code;
          const errorMessage = error.message;
    
          setIsLoader(false)
          setError(error.message)
          //console.error(error.message);
          dispatch(setIsLogin(false));
        });
      };

    const getUserInDatabase = async () => {
      try {
        setStep('Get user data in database')

        //const q = doc(db, "users", mail);
        const q = query(collection(db, "users"), where("userMail", "==", mail));

        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
          //console.log(doc.id, " => ", doc.data());
          const dataUser = doc.data()
          
          secureStoreClass.saveToken('userId', doc.id)
          
          const u = new User(doc.id, dataUser.userName, dataUser.userMail, '');
          setUserState(u)
          dispatch(setUser(u));

          //setStep('Bonjour : '+ userSelector.userName)
        });

        //console.log('User is logged');
        setIsSnackBar(true)
        dispatch(setIsLogin(true));
  
      } catch (error) {
        setIsLoader(false)
        setError("Error add data : "+ error)
        //console.error("Error add data : "+ error);
        dispatch(setIsLogin(false));
      }
    }

    return (
        <View style={AppStyle.container}>
        <LinearGradient
            colors={[Colors.colorOrange, Colors.colorOrange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

            <View>
                <Text style={AppStyle.textSubTitle}>Login Page</Text>
            </View>

            <TextInput 
                style={LoginStyle.textInput}
                placeholder="Enter your mail"
                value={mail}
                onChangeText={setMail} />

            <TextInput 
                style={LoginStyle.textInput}
                placeholder="Enter your password"
                value={pwd}
                onChangeText={setPwd}
                secureTextEntry={true} />

            <TouchableOpacity
                onPress={handleLogIn}
                activeOpacity={0.6}
                style={LoginStyle.btnLogin}>
                <Text style={LoginStyle.buttonText}>Login</Text>
            </TouchableOpacity>

            {isLoader == true ? 
            <View>
              <LoaderComponent text="Connection is in progress ..." step={step} color={Colors.white}/>
            </View>
            : 
            <Text style={LoginStyle.textError}>{error}</Text>
            }


        </LinearGradient>
          
        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={'User is logged'}/>

        </View>
    ) 
}

export default LoginComponent

const styles = StyleSheet.create({
    
})