import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorsConstant';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
    textInput: {
        width: screenWidth - 20,
        marginTop:15,
    },
    
    btnLogin: {
        width: screenWidth - 20,
        backgroundColor: Colors.colorOrange,
        marginTop:15,
        padding: 15,
        borderRadius: 5,
    },
      
    buttonText: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 20,
    },

    textError: {
        fontSize: 18,
        margin: 15,
        color: Colors.colorRed
    },

    textConditionContenair: {
        width: screenWidth - 20,
        marginTop:10,
        marginStart:5
    }
})