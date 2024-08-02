import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper';


const SnackBarComponent = (props:any) => {
  return (
    <View>
       <Snackbar
            visible={props.visible}
            onDismiss={() => props.setVisible(false)}
            duration={props.duration}>
                {props.message}
        </Snackbar>
    </View>
  )
}

export default SnackBarComponent

const styles = StyleSheet.create({})