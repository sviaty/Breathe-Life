// React & React Native
import React from 'react'

// Navigation
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

// Constants
import Colors from '../constants/ColorConstant';
import { 
    ID_NAVIGATE_LOGIN, 
    ID_NAVIGATE_SIGNIN } from '../constants/IdConstant';

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Helpers
import textTranslate from '../helpers/TranslateHelper';

// Screens
import LoginScreen from './login/LoginScreen';
import SigninScreen from './signin/SigninScreen';

/**
 * Screen UserNoLoginScreen
 * @returns 
 */
const UserNoLoginScreen = () => {
    
    return (

        <Tab.Navigator
            initialRouteName={ID_NAVIGATE_LOGIN}
            activeColor={Colors.colorOrange}>

            <Tab.Screen
                name={ ID_NAVIGATE_LOGIN }
                component={ LoginScreen }
                options={{
                    tabBarLabel: textTranslate.t('navLogin'),
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-arrow-right" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name={ ID_NAVIGATE_SIGNIN }
                component={ SigninScreen }
                options={{
                    tabBarLabel: textTranslate.t('navSignin'),
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-arrow-up" color={color} size={26} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}

export default UserNoLoginScreen