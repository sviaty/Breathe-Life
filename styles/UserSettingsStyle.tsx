import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorConstant';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
    

    inputText: {
        width: screenWidth - 20,
        marginTop: 15,
    },

    userBackdrop: {
        marginStart: 20,
        marginEnd: 20,
        marginTop: 200,
        borderEndEndRadius: 0,
        borderStartStartRadius: 0,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor: Colors.background,
        flex: 1,
        alignItems: 'center',
    },

    userBackdropFrontLayer: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        borderRadius: 0
    },

    buttonTouchableOpacityBackdrop: {
        width: 50,
        height: 50,
        backgroundColor: Colors.colorOrange,
        marginTop:10,
        padding: 15,
        borderRadius: 5,
    },

    userInputContainer: {
        alignItems: 'center', // Alignement 
        marginTop: 10,
        marginBottom: 15,
    },

    pickerSelect: {
        width: screenWidth - 20,
        marginTop:10,
    }
})