import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Colors from '../constants/ColorsConstant';

import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

import LoginScreen from './login/LoginScreen';
import SigninScreen from './signin/SigninScreen';

const UserNoLoginScreen = () => {
    
    return (
        <Tab.Navigator
        initialRouteName="UserNoLoginScreen"
        activeColor={Colors.colorOrange}>

        <Tab.Screen
            name="LogIn"
            component={LoginScreen}
            options={{
                tabBarLabel: 'LogIn',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account-arrow-right" color={color} size={26} />
                ),
            }}
        />

       <Tab.Screen
            name="SignIn"
            component={SigninScreen}
            options={{
                tabBarLabel: 'SignIn',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account-arrow-up" color={color} size={26} />
                ),
            }}
        />

        </Tab.Navigator>

  )
}

export default UserNoLoginScreen

const styles = StyleSheet.create({})