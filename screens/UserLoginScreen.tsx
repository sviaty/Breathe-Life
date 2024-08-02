import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import Colors from '../constants/ColorsConstant';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

import SettingCounterComponent from '../screens/counters/CounterScreen';
import StatCounterComponent from '../screens/statistics/StatisticsScreen';
//import AddCounterComponent from '../components/AddCounterComponent';

const UserLoginScreen = () => {

    return (

    <Tab.Navigator
        initialRouteName="SettingCounter"
        activeColor={Colors.colorOrange}>
        { 
            /*
            <Tab.Screen
            name="AddCounter"
            component={AddCounterComponent}
            options={{
                tabBarLabel: 'Informations',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="information-variant" color={color} size={26} />
                ),
            }}/>
            */
        }

        <Tab.Screen
            name="SettingCounter"
            component={SettingCounterComponent}
            options={{
                tabBarLabel: 'Compteur',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="smoking" color={color} size={26} />
                ),
        }}/>

       <Tab.Screen
            name="StatCounter"
            component={StatCounterComponent}
            options={{
            tabBarLabel: 'Statistiques',
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="google-analytics" color={color} size={26} />
            ),
        }}/>

    </Tab.Navigator>
    )
}

export default UserLoginScreen

const styles = StyleSheet.create({})