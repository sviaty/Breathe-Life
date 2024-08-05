import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/ColorsConstant';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import UserNoLoginScreen from '../screens/UserNoLoginScreen';
import UserLoginScreen from '../screens/UserLoginScreen';
import User from '../datas/UserData';

import SecureStoreClass from '../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

// Components
import LoaderComponent from '../components/LoaderComponent';

import { RootState } from '../redux/Store';
import { setIsLogin } from '../redux/slices/IsLoginSlice';
import { setUser } from '../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import AppStyle from '../styles/AppStyle';
import App from '../App';

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

const MainScreen = () => {

    const [loggin, setLoggin] = useState<boolean>(false)

    const [isLoader, setIsLoader] = useState<boolean>(true)

    const isLogin = useSelector((state: RootState) => state.isLoginReducer.isLogin);

    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Slice
    useEffect(() => {
        setLoggin(isLogin)
    }, [isLogin])  

    // Dispatch
    const dispatch = useDispatch();
    // dispatch(setIsLogin(true));
    // console.log('isLogin ' + isLogin)

    useEffect(() => {
      const fetchDataTokenId = async () => {
        const token = await secureStoreClass.getToken('tokenId')
        if(token == null){
          //console.log('Le token est null')
          setLoggin(false)
          setIsLoader(false)
          dispatch(setIsLogin(false));
        } else {
          getUserInDatabase()
        }
      }
      fetchDataTokenId();
    },[])

    const getUserInDatabase = async () => {

      const userIdStoreSecure = await secureStoreClass.getToken('userId')

        if(userIdStoreSecure != null){
          //console.log(userIdStoreSecure)

          try {
            const docRef = doc(db, "users", userIdStoreSecure);
    
            const docSnap = await getDoc(docRef);
    
            const dataUser = docSnap.data()
            //console.log(dataUser);
            
            if(dataUser != null){
              const u = new User(docSnap.id, dataUser.userName, dataUser.userMail, '');
              dispatch(setUser(u));
              setLoggin(true)
              setIsLoader(false)
              dispatch(setIsLogin(true));
            }
          } catch (error) {
            console.error("Error get data : "+ error);
          }
        }
    }

    const handleLogout = async () => {
        await secureStoreClass.deleteToken('tokenId')
        setLoggin(false)
        dispatch(setIsLogin(false));
    }

    if(isLoader == true){
      return (
        <View style={AppStyle.containerCenter}>
          <LinearGradient
            colors={[Colors.colorOrange, Colors.colorOrange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenairMain}>

            <LoaderComponent text="Chargement de l'application" step="" color={Colors.white} size={'large'}/>
          </LinearGradient>
        </View>              
      )
    } else {
      return (
        <NavigationContainer> 
          <Stack.Navigator>
          { loggin == true ? 
            <Stack.Screen 
              name="UserLoginScreen" 
              component={UserLoginScreen}
              options={({ navigation }) => ({
                title: 'Breathe Life',
                headerRight: () => (
                  <Pressable
                    onPress={() => handleLogout()}
                  >
                  <Text style={{color: Colors.blueFb}}>Déconnexion</Text>
                  </Pressable>
                ),
              })} />
          : 
            <Stack.Screen 
              name="UserNoLoginScreen" 
              component={UserNoLoginScreen} 
              options={({ navigation }) => ({
                title: 'Breathe Life',
              })} />
          }
          </Stack.Navigator>    
        </NavigationContainer>
      )
    }
    
    

}

export default MainScreen

const styles = StyleSheet.create({})