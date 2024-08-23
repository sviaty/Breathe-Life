import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from '../../constants/ColorConstant';

import SettingPatchComponent from './CounterPatchScreen';
import SettingPillComponent from './CounterPillScreen';
import CounterCigaretteScreen from './CounterCigaretteScreen'

import AppStyle from '../../styles/AppStyle';

const SettingCounterComponent = () => {
    return (
    <SafeAreaProvider style={AppStyle.container}>
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'black',
            tabBarIndicatorStyle: {
                height: '100%',
                backgroundColor: Colors.blueFb,
                borderBottomWidth: 1.5,
                borderBottomColor: 'gray',
            },
            tabBarStyle: {
                backgroundColor: Colors.white,
            },
            }}>

            <Tab.Screen name="Patchs" component={SettingPatchComponent} options={{lazy: true}}/>
            <Tab.Screen name="Pastilles" component={SettingPillComponent} options={{lazy: true}}/>
            <Tab.Screen name="Cigarettes" component={CounterCigaretteScreen} options={{lazy: true}}/>

        </Tab.Navigator>
    </SafeAreaProvider>
  )
}

export default SettingCounterComponent

const styles = StyleSheet.create({})