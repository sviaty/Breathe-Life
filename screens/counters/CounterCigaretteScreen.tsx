// React & React Native
import React from 'react'

// Navigation
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Style
import Colors from '../../constants/ColorConstant';

// Constants
import { 
    ID_NAVIGATE_USER_COUNTER_ADD_SCREEN, 
    ID_NAVIGATE_USER_COUNTER_LIST_SCREEN } from '../../constants/IdConstant';

// Helpers
import textTranslate from '../../helpers/TranslateHelper';

// Screens
import UserCounterCigaretteListScreen from './CounterCigaretteListScreen';
import UserCounterCigaretteAddScreen from './CounterCigaretteAddScreen';

/**
 * Screen CounterCigaretteScreen
 * @returns 
 */
const CounterCigaretteScreen = () => {

    return (
        <Stack.Navigator 
            initialRouteName={ ID_NAVIGATE_USER_COUNTER_LIST_SCREEN }>

            <Stack.Screen 
                name={ ID_NAVIGATE_USER_COUNTER_LIST_SCREEN }
                component={ UserCounterCigaretteListScreen }
                options={{ 
                    headerShown: false
                }}
                />

            <Stack.Screen 
                name={ ID_NAVIGATE_USER_COUNTER_ADD_SCREEN }
                component={ UserCounterCigaretteAddScreen }
                options={{ 
                    title: textTranslate.t('cigaretteType'), 
                    headerTintColor: Colors.white,
                    headerStyle: {
                        backgroundColor: Colors.blueFb,
                        height: 50
                    },
                    headerBackTitle: textTranslate.t('navBackButton')
                }} />

        </Stack.Navigator>
    )
}

export default CounterCigaretteScreen