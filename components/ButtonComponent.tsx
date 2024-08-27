import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Surface } from "@react-native-material/core";

// Constants
import Colors from '../constants/ColorConstant';
import {SURFACE_ELEVATION, SURFACE_CATEGORY} from '../constants/AppConstant';

const ButtonComponent = (props: any) => {
    return (
        <Surface 
            elevation={SURFACE_ELEVATION}
            category={SURFACE_CATEGORY}

            style={[styles.btnSurfaceView, { backgroundColor: props.backgroundColor} ]}>

            <TouchableOpacity
                onPress={ props.handleFunction }
                activeOpacity={ props.activeOpacity }>
                <Text style={ [styles.buttonText, { color: props.textColor} ] }>
                    { props.btnText }
                </Text>
            </TouchableOpacity>
        </Surface>
    )
}

export default ButtonComponent

const styles = StyleSheet.create({
    btnSurfaceView: {
        flex:1,
        borderRadius: 5,
        padding: 16,
        margin: 8
    },

    buttonText: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 20,
    },
})