import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'

import Colors from '../constants/ColorsConstant';

const LoaderComponent = (props:any) => {

return(
    <View style={styles.vertical}>  
        <ActivityIndicator 
            size={props.size} 
            color={props.color} />
        
        { props.text != '' ?
        <Text style={{ color: props.color, fontSize: 16, textAlign: 'center', marginTop:10}}> {props.text} </Text>
        : null }
        
        { props.step != '' ?
        <Text style={{ color: props.color, fontSize: 16, textAlign: 'center', marginTop:10}}> {props.step} </Text>
        : null }
    </View>
  )
}

export default LoaderComponent

const styles = StyleSheet.create({
    vertical: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 20,
    },

    textLoader: {
        fontSize: 16,
        textAlign: 'center',
        marginTop:10
    },
})
