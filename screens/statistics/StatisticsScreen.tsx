import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from '../../constants/ColorConstant';

import StatisticsDayScreen from './StatisticsDayScreen';
import StatisticsWeekSreen from './StatisticsWeekSreen';
import StatisticsMounthSreen from './StatisticsMounthSreen';
import StatisticsYearsScreen from './StatisticsYearsScreen';
import StatisticsGlobalScreen from './StatisticsGlobalScreen';
import AppStyle from '../../styles/AppStyle';

//tabBarLabelStyle: { fontSize: 11 },

const StatCounterComponent = () => {
  return (
    <SafeAreaProvider style={AppStyle.container}>
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarAllowFontScaling: true,
        
        tabBarIndicatorStyle: {
            height: '100%',
            backgroundColor: Colors.blueFb,
            borderBottomWidth: 1.5,
            borderBottomColor: 'gray',
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
        },

      }
    }>
      <Tab.Screen name="Semaine" component={StatisticsWeekSreen} options={{lazy: true}}/>
      <Tab.Screen name="Mois" component={StatisticsMounthSreen} options={{lazy: true}}/>
      <Tab.Screen name="Année" component={StatisticsYearsScreen} options={{lazy: true}}/>

    </Tab.Navigator>
    </SafeAreaProvider>
  )
}

export default StatCounterComponent

const styles = StyleSheet.create({})