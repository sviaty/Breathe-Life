// React & React Native
import React from 'react'

// Navigation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

// Constants
import Colors from '../constants/ColorConstant';
import { 
    ID_NAVIGATE_USER_COUNTER_SCREEN, 
    ID_NAVIGATE_USER_SETTINGS_SCREEN, 
    ID_NAVIGATE_USER_STATS_SCREEN } from '../constants/IdConstant';

// Helpers
import textTranslate from '../helpers/TranslateHelper';

// Screens
import UserSettingsScreen from './users/UserSettingsScreen';
import UserCounterScreen from '../screens/counters/CounterScreen';
import UserStatsScreen from '../screens/statistics/StatisticsScreen';

/**
 * Screen UserLoginScreen
 * @returns 
 */
const UserLoginScreen = () => {

    return (

        <Tab.Navigator
            initialRouteName={ ID_NAVIGATE_USER_SETTINGS_SCREEN }
            activeColor={Colors.colorOrange}>
                
            <Tab.Screen
                name={ ID_NAVIGATE_USER_SETTINGS_SCREEN }
                component={ UserSettingsScreen }
                options={{
                    tabBarLabel: textTranslate.t('navUserSettings'),
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account-cog" color={color} size={26} />
                    ),
                }}
            />
                
            <Tab.Screen
                name={ ID_NAVIGATE_USER_COUNTER_SCREEN }
                component={ UserCounterScreen }
                options={{
                    tabBarLabel: textTranslate.t('navUserCounter'), 
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="smoking" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name={ ID_NAVIGATE_USER_STATS_SCREEN }
                component={ UserStatsScreen }
                options={{
                    tabBarLabel: textTranslate.t('navUserStats'),
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="google-analytics" color={color} size={26} />
                    ),
                }}
            />

        </Tab.Navigator>
    )
}

export default UserLoginScreen
