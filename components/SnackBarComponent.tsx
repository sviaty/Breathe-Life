import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Snackbar } from 'react-native-paper';

/**
 * Component SnackBarComponent
 * @param props 
 * @returns 
 */
const SnackBarComponent = (props:any) => {
    return (
        <Snackbar
            visible={props.visible}
            onDismiss={() => props.setVisible(false)}
            duration={props.duration}>
                {props.message}
        </Snackbar>
    );
}

export default SnackBarComponent

const styles = StyleSheet.create({})