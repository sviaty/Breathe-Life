import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Pressable } from 'react-native';

import store from './redux/Store';
import { Provider } from 'react-redux';
import MainScreen from './screens/MainScreen';

export default function App() {
  return (   
    <Provider store={store}>
      <MainScreen />
    </Provider>
  )
}

const styles = StyleSheet.create({});
