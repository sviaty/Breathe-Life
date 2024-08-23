import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Style
import Colors from '../../constants/ColorConstant';

// Navigator
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// Screen
import CounterCigaretteListScreen from './CounterCigaretteListScreen';
import CounterCigaretteAddScreen from './CounterCigaretteAddScreen';


const CounterCigaretteScreen = () => {
  return (
    <Stack.Navigator 
        initialRouteName="CounterCigaretteListScreen">

        <Stack.Screen 
            name="CounterCigaretteListScreen" 
            component={CounterCigaretteListScreen}
            options={{ 
                headerShown: false
            }}
            />

        <Stack.Screen 
            name="CounterCigaretteAddScreen" 
            component={CounterCigaretteAddScreen}
            options={{ 
                title: 'Marque de cigarette', 
                headerTintColor: Colors.white,
                headerStyle: {
                    backgroundColor: Colors.colorOrange,
                    height: 50
                }
            }} />

    </Stack.Navigator>
  )
}

export default CounterCigaretteScreen

const styles = StyleSheet.create({})