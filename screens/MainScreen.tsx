import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/ColorConstant';

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

import firebaseConfig from '../firebaseConfig';
import { deleteSecureStore } from '../helpers/SecureStoreHelper';

const db = getFirestore(firebaseConfig); 

const MainScreen = () => {

    const [loggin, setLoggin] = useState<boolean>(false)

    const [isLoader, setIsLoader] = useState<boolean>(true)

    const isLogin = useSelector((state: RootState) => state.isLoginReducer.isLogin);

    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Slice
    useEffect(() => {
      setLoggin(isLogin)
    }, [isLogin])  

    useEffect(() => {
      setIsLoader(true)

      fetchDataTokenId();
    }, [])

    // Dispatch
    const dispatch = useDispatch();
    // dispatch(setIsLogin(true));
    // console.log('isLogin ' + isLogin)

    const fetchDataTokenId = async () => {
      const token = await secureStoreClass.getToken('tokenId')
      if(token == null){
        //console.log('Le token est null')
        setLoggin(false)
        dispatch(setIsLogin(false));

        setIsLoader(false)
      } else {
        getUserInDatabase()
      }
    }

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
              const u = new User(
                docSnap.id, 
                dataUser.userName, 
                dataUser.userMail, 
                '', 
                dataUser.userBirthDate, 
                dataUser.userSmokeAvgNbr, 
                dataUser.idPatch, 
                dataUser.idPill, 
                dataUser.idCigarette);
              dispatch(setUser(u));

              setLoggin(true)
              dispatch(setIsLogin(true));
              setIsLoader(false)
            } else {
              setLoggin(false)
              setIsLoader(false)
            }
          } catch (error) {
            setLoggin(false)
            dispatch(setIsLogin(false));
            setIsLoader(false)
            console.error("Error get data : "+ error);
          }
        }
    }

    const handleLogout = async () => {
        deleteSecureStore('tokenId')

        setLoggin(false)
        //setIsLoader(false)
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

      if(loggin == true){
        return (

        <NavigationContainer> 
          <Stack.Navigator>
            <Stack.Screen 
              name="UserLoginScreen" 
              component={UserLoginScreen}
              options={({ navigation }) => ({
                title: 'Breathe Life',
                headerTintColor: Colors.white,
                headerStyle: {
                  backgroundColor: Colors.colorOrange,
                },
                headerRight: () => (
                  <Pressable
                    onPress={() => handleLogout()}
                  >
                  <Text style={{color: Colors.white}}>Déconnexion</Text>
                  </Pressable>
                ),
              })} />

          </Stack.Navigator>    
        </NavigationContainer>
         
        )
      } else {
        return (
        <NavigationContainer> 
          <Stack.Navigator>
            <Stack.Screen 
              name="UserNoLoginScreen" 
              component={UserNoLoginScreen} 
              options={({ navigation }) => ({
                title: 'Breathe Life',
                headerTintColor: Colors.white,
                headerStyle: {
                  backgroundColor: Colors.colorOrange,
                },
              })} />

          </Stack.Navigator>    
        </NavigationContainer>
        )
      }
    }

    
}

export default MainScreen

const styles = StyleSheet.create({})