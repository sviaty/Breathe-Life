// React & React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

// Styles
import AppStyle from '../styles/AppStyle';

// Constants
import Colors from '../constants/ColorConstant';
import { 
    ID_NAVIGATE_USER_LOGIN_SCREEN, 
    ID_NAVIGATE_USER_NO_LOGIN_SCREEN, 
    ID_TOKEN, 
    ID_USER 
} from '../constants/IdConstant';

// Datas
import User from '../datas/UserData';

// Components
import LoaderComponent from '../components/LoaderComponent';

// Screens
import UserNoLoginScreen from '../screens/UserNoLoginScreen';
import UserLoginScreen from '../screens/UserLoginScreen';

// Helpers
import { deleteSecureStore, getSecureStore } from '../helpers/SecureStoreHelper';
import textTranslate from '../helpers/TranslateHelper';

// Secure Store
import SecureStoreClass from '../secures/SecureStore';
const secureStoreClass = new SecureStoreClass()

// Redux
import { RootState } from '../redux/Store';
import { setIsLogin } from '../redux/slices/IsLoginSlice';
import { setUser } from '../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// Api
import { getUserByIdFireStore } from '../api/UserApi';

// Fire Store
import firebaseConfig from '../firebaseConfig';
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore(firebaseConfig); 

/**
 * 
 * @returns Screen MainScreen
 */
const MainScreen = () => {

    // UseState
    const [loggin, setLoggin] = useState<boolean>(false)
    const [isLoader, setIsLoader] = useState<boolean>(true)

    // Selector
    const isLogin = useSelector((state: RootState) => state.isLoginReducer.isLogin);
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // Slice
    useEffect(() => {
      setLoggin(isLogin)
    }, [isLogin])  

    useEffect(() => {
      setIsLoader(true)
      getIdUserSecureStore();
    }, [])

    /**
     * Function getIdUserSecureStore
     */
    const getIdUserSecureStore = async () => {
        await getSecureStore(ID_USER).then((userIdStoreSecure) => {
            //console.log(userIdStoreSecure)
            if(userIdStoreSecure != null){
                getUserInDatabase(userIdStoreSecure)
            } else {
                setLoggin(false)
                dispatch(setIsLogin(false));
                setIsLoader(false)
            }
        }).catch((error) => {
            //console.error(error.message)
            setLoggin(false)
            dispatch(setIsLogin(false));
            setIsLoader(false)
        }) 
    }

    /**
     * Function getUserInDatabase
     */
    const getUserInDatabase = async (userIdStoreSecure: string) => {

        getUserByIdFireStore(userIdStoreSecure).then((user) => {
                
            dispatch(setUser(user));

            setLoggin(true)
            dispatch(setIsLogin(true));
            setIsLoader(false)

        }).catch((error) => {
            setLoggin(false)
            dispatch(setIsLogin(false));
            setIsLoader(false)
            //console.error(error.message)
        }) 
    }

    /**
     * Function handleLogout
     */
    const handleLogout = async () => {
        deleteSecureStore(ID_TOKEN)
        deleteSecureStore(ID_USER)
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

            <LoaderComponent text={ textTranslate.t('appLoading') } step="" color={Colors.white} size={'large'}/>
          </LinearGradient>
        </View>
      )
    } else {
      if(loggin == true){
        return (

        <NavigationContainer> 
          <Stack.Navigator>
            <Stack.Screen 
              name={ ID_NAVIGATE_USER_LOGIN_SCREEN }
              component={ UserLoginScreen }
              options={({ navigation }) => ({
                title: textTranslate.t('appName'),
                headerTintColor: Colors.white,
                headerStyle: {
                  backgroundColor: Colors.blueFb,
                },
                headerRight: () => (
                    <Pressable onPress={() => handleLogout()} >
                        <Text style={{color: Colors.white}}> { textTranslate.t('logoutBtn') } </Text>
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
              name={ ID_NAVIGATE_USER_NO_LOGIN_SCREEN } 
              component={ UserNoLoginScreen } 
              options={({ navigation }) => ({
                title: textTranslate.t('appName'),
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.blueFb,
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