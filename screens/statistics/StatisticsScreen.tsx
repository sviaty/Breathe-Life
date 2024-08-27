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
import StatisticsWeekSreen from './StatisticsWeekSreen';
import StatisticsMounthSreen from './StatisticsMounthSreen';
import StatisticsYearsScreen from './StatisticsYearsScreen';

/**
 * Screen Statistics
 * @returns 
 */
const StatisticsScreen = () => {
    return (
        <SafeAreaProvider style={AppStyle.container}>
            <Tab.Navigator 
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'black',
                tabBarAllowFontScaling: true,
                tabBarIndicatorStyle: {
                    height: '100%',
                    backgroundColor: Colors.colorOrange,
                    borderBottomWidth: 1,
                    borderBottomColor: 'silver',
                },
                tabBarStyle: {
                    backgroundColor: Colors.white,
                }
            }}>

            <Tab.Screen 
                name={ textTranslate.t('navUserStatWeek') } 
                component={ StatisticsWeekSreen } 
                options={{lazy: true}}/>

            <Tab.Screen 
                name={ textTranslate.t('navUserStatMounth') }
                component={ StatisticsMounthSreen } 
                options={{lazy: true}}/>

            <Tab.Screen 
                name={ textTranslate.t('navUserStatYears') }
                component={ StatisticsYearsScreen } 
                options={{lazy: true}}/>

            </Tab.Navigator>
        </SafeAreaProvider>
    )
}

export default StatisticsScreen
