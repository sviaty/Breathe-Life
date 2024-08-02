import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';


import AppStyle from '../styles/AppStyle';
import Colors from '../constants/ColorsConstant';

import { RootState } from '../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

const AddCounterComponent = () => {

  const userSelector = useSelector((state: RootState) => state.userReducer.user);

  return (
    <View style={AppStyle.container}>
      <LinearGradient
        colors={[Colors.colorOrange, Colors.colorOrange2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={AppStyle.linearContenair}>

        <View>
          <Text style={AppStyle.textSubTitle}>Hello {userSelector.userName}</Text>
        </View>

        <View>
          <Text style={styles.textDesc}> Today is a great day to slow down or quit smoking. </Text>
        </View>

      </LinearGradient>
    </View>
  )
}

export default AddCounterComponent

const styles = StyleSheet.create({
  textDesc: {
    color: Colors.white,
    fontSize: 18
    
  }
})