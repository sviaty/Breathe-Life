// React & React Native
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

// Styles
import AppStyle from '../../styles/AppStyle';

// Constants
import Colors from '../../constants/ColorConstant';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';

// Screens
import CounterPatchScreen from './CounterPatchScreen';
import CounterPillScreen from './CounterPillScreen';
import CounterCigaretteScreen from './CounterCigaretteScreen'

/**
 * Screen CounterScreen
 * @returns 
 */
const CounterScreen = () => {
    return (
        <SafeAreaProvider style={AppStyle.container}>
            <Tab.Navigator screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'black',
                tabBarIndicatorStyle: {
                    height: '100%',
                    backgroundColor: Colors.colorOrange,
                    borderBottomWidth: 1,
                    borderBottomColor: 'silver',
                },
                tabBarStyle: {
                    backgroundColor: Colors.white,
                },
                }}>

                <Tab.Screen
                    name={ textTranslate.t('navUserCountPatchs') } 
                    component={ CounterPatchScreen } 
                    options={{lazy: true}} />

                <Tab.Screen 
                    name={ textTranslate.t('navUserCountPills') }  
                    component={ CounterPillScreen } 
                    options={{lazy: true}} />

                <Tab.Screen 
                    name={ textTranslate.t('navUserCountCigarettes') } 
                    component={ CounterCigaretteScreen } 
                    options={{lazy: true}} />

            </Tab.Navigator>
        </SafeAreaProvider>
  )
}

export default CounterScreen
