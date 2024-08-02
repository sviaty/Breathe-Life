import { StyleSheet } from "react-native";
import Colors from '../constants/ColorsConstant';

export default StyleSheet.create({
    textInput: {
        width: 300,
        height: 50,
        backgroundColor: Colors.white,
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 10,
        marginTop:15,
        paddingStart:5
    },
    
    btnLogin: {
        width: 300,
        backgroundColor: Colors.blueFb,
        marginTop:15,
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
        margin: 15,
        color: Colors.white
    }
})