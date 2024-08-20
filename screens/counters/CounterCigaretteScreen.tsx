import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Style
import Colors from '../../constants/ColorsConstant';

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
                title: 'Ajouter une marque de cigarette', 
                headerTintColor: Colors.colorOrange,
                headerStyle: {
                    backgroundColor: Colors.white
                }
            }} />

    </Stack.Navigator>
  )
}

export default CounterCigaretteScreen

const styles = StyleSheet.create({})