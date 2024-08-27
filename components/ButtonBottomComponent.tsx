import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Surface } from "@react-native-material/core";

// Constants
import Colors from '../constants/ColorConstant';
import {SURFACE_ELEVATION, SURFACE_CATEGORY} from '../constants/AppConstant';

const ButtonBottomComponent = (props: any) => {
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

export default ButtonBottomComponent

const styles = StyleSheet.create({
    btnSurfaceView: {
        flex:1,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,

        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
        borderStartStartRadius: 0,
        borderStartEndRadius: 0,

        padding: 16,
        margin: 8,
        marginTop: 0
    },

    buttonText: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
    },
})