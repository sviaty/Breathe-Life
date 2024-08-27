// React & React Native
import React from 'react'
import { StyleSheet } from 'react-native'

// Navigation
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Constants
import Colors from '../../constants/ColorConstant';
import { 
    ID_NAVIGATE_USER_SETTINGS_INFO_SCREEN, 
    ID_NAVIGATE_USER_SETTINGS_UPDATE_INFO_SCREEN } from '../../constants/IdConstant';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';

// Screens
import UserInformationsScreen from './UserInformationsScreen';
import UserUpdateInformationsScreen from './UserUpdateInformationsScreen';

/**
 * Screen UserSettingsScreen
 * @returns 
 */
const UserSettingsScreen = () => {
  return (
    <Stack.Navigator 
        initialRouteName={ ID_NAVIGATE_USER_SETTINGS_INFO_SCREEN }>

        <Stack.Screen 
            name={ ID_NAVIGATE_USER_SETTINGS_INFO_SCREEN }
            component={ UserInformationsScreen } 
            options={{ 
                title: textTranslate.t('navUserSettingsInfo'), 
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.colorOrange,
                    height: 50
                }
            }}
            />

        <Stack.Screen 
            name={ ID_NAVIGATE_USER_SETTINGS_UPDATE_INFO_SCREEN } 
            component={ UserUpdateInformationsScreen } 
            options={{ 
                title: textTranslate.t('navUserSettingsUpdateInfo'), 
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.colorOrange,
                    height: 50
                },
                headerBackTitle: textTranslate.t('navBackButton')
            }}/>
    </Stack.Navigator>
  )
}

export default UserSettingsScreen

const styles = StyleSheet.create({})