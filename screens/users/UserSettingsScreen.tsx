import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Style
import Colors from '../../constants/ColorsConstant';

// Navigator
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Screen
import UserInformationsScreen from './UserInformationsScreen';
import UserUpdateInformationsScreen from './UserUpdateInformationsScreen';

/**
 * Screen UserSettingsScreen
 * @returns 
 */
const UserSettingsScreen = () => {
  return (
    <Stack.Navigator 
        initialRouteName="UserInformationsScreen">

        <Stack.Screen 
            name="UserInformationsScreen" 
            component={UserInformationsScreen} 
            options={{ 
                title: 'Vos informations', 
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.blueFb
                }
            }}
            />

        <Stack.Screen 
            name="UserUpdateInformationsScreen" 
            component={UserUpdateInformationsScreen} 
            options={{ 
                title: 'Modifier vos informations', 
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.blueFb
                }
            }}/>
    </Stack.Navigator>
  )
}

export default UserSettingsScreen

const styles = StyleSheet.create({})