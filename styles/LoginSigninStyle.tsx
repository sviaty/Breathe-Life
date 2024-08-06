import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorsConstant';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
    textInput: {
        width: screenWidth - 20,
        height: 50,
        backgroundColor: Colors.white,
        borderColor: Colors.colorOrange,
        borderWidth: 2,
        borderRadius: 10,
        marginTop:10,
        paddingStart:5
    },
    
    btnLogin: {
        width: screenWidth - 20,
        backgroundColor: Colors.blueFb,
        marginTop:10,
        padding: 15,
        borderRadius: 10,
    },
      
    buttonText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 20,
    },

    textError: {
        fontSize: 18,
        margin: 10,
        color: Colors.colorOrange
    }
})