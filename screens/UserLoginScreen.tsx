import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Colors from '../constants/ColorsConstant';

import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

import SettingUserScreen from './users/UserUpdateInformationsScreen';
import SettingCounterComponent from '../screens/counters/CounterScreen';
import StatCounterComponent from '../screens/statistics/StatisticsScreen';
import AppStyle from '../styles/AppStyle';
import UserInformationsScreen from './users/UserInformationsScreen';
import UserSettingsScreen from './users/UserSettingsScreen';
//import AddCounterComponent from '../components/AddCounterComponent';

const UserLoginScreen = () => {

    return (

        <Tab.Navigator
            initialRouteName="SettingUser"
            activeColor={Colors.colorOrange}>
                
            <Tab.Screen
                name="UserSettingsScreen"
                component={UserSettingsScreen}
                options={{
                    tabBarLabel: 'Paramètres',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-cog" color={color} size={26} />
                    ),
                }}
            />
                
            <Tab.Screen
                name="SettingCounter"
                component={SettingCounterComponent}
                options={{
                    title: 'Awesome app',
                    tabBarLabel: 'Compteur',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="smoking" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="StatCounter"
                component={StatCounterComponent}
                options={{
                    title: 'Awesome app',
                    tabBarLabel: 'Statistiques',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="google-analytics" color={color} size={26} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}

export default UserLoginScreen

const styles = StyleSheet.create({})