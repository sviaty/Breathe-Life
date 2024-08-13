import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from '../../constants/ColorsConstant';

import StatisticsDayScreen from './StatisticsDayScreen';
import StatisticsWeekSreen from './StatisticsWeekSreen';
import StatisticsMounthSreen from './StatisticsMounthSreen';
import StatisticsYearsScreen from './StatisticsYearsScreen';
import StatisticsGlobalScreen from './StatisticsGlobalScreen';
import AppStyle from '../../styles/AppStyle';

const StatCounterComponent = () => {
  return (
    <SafeAreaProvider style={AppStyle.container}>
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarAllowFontScaling: true,
        tabBarLabelStyle: { fontSize: 11 },
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
      <Tab.Screen 
        name="Jours" 
        component={StatisticsDayScreen} 
      />
      <Tab.Screen name="Semaine" component={StatisticsWeekSreen} />
      <Tab.Screen name="Mois" component={StatisticsMounthSreen} />
      <Tab.Screen name="Année" component={StatisticsYearsScreen} />
      <Tab.Screen name="Global" component={StatisticsGlobalScreen} />
    </Tab.Navigator>
    </SafeAreaProvider>
  )
}

export default StatCounterComponent

const styles = StyleSheet.create({})