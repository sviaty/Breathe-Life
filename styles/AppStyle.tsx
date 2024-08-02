import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorsConstant';
import { ColorProperties } from "react-native-reanimated/lib/typescript/Colors";

const screenWidth = Dimensions.get('screen').width;

export default StyleSheet.create({
   
    container: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
    },

    containerTitle: {
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },

    textTitle: {
        fontSize: 24,
        color: Colors.colorOrange,
        padding: 10
    },

    textSubTitle: {
        fontSize: 24,
        color: Colors.white,
        padding: 10,
        marginTop: 5
    },

    textSubTitleOrange: {
        
        width: screenWidth,
        textAlign: 'center',
        fontSize: 24,
        backgroundColor: Colors.blueFb,
        color: Colors.white,
        fontWeight: 'bold',
        padding: 15,
        marginBottom: 5
    },
      
    linearContenair: {
        flex: 1,
        alignItems: 'center',
    }, 
    
    btn: {
        width: screenWidth - 20,
        backgroundColor: Colors.blueFb,
        marginTop:10,
        padding: 15,
        borderRadius: 10,
    },

    btnOrange: {
        width: screenWidth - 20,
        backgroundColor: Colors.colorOrange,
        marginTop:10,
        padding: 15,
        borderRadius: 10,
    },
      
    btnText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 20,
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.white,
        paddingBottom: 40
    },

    modalPressage: {
        alignSelf: 'stretch',
        textAlign: 'center',
        backgroundColor: Colors.colorGreen,
    },

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

    textInputAdd: {
        width: screenWidth - 20,
        height: 50,
        backgroundColor: Colors.white,
        borderColor: Colors.colorOrange,
        borderWidth: 1,
        borderRadius: 10,
        marginTop:10,
        paddingStart:5
    },

    itemContainerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'flex-end',
        width: screenWidth,
    },

    itemPatchContainer: {
        width: screenWidth - 90,
        height: 60,
        alignItems:'flex-start',
        justifyContent:'center',
        
        backgroundColor: Colors.white,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10,
        marginLeft: 10
    },

    itemCigContainer: {
        width: screenWidth - 90,
        height: 110,
        alignItems:'flex-start',
        justifyContent:'center',
        
        backgroundColor: Colors.white,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10,
        marginLeft: 10
    },

    itemPatchBtnContainer: {
        marginRight: 10
    },

    viewLoaderContainer: {
        alignItems:'center',
        justifyContent:'center',
        width: 60,
        height: 60,
        backgroundColor: Colors.blueFb,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        marginTop: 10,
        marginLeft: 10,
        
    },

    viewLoaderContainerCig: {
        alignItems:'center',
        justifyContent:'center',
        width: 60,
        height: 110,
        backgroundColor: Colors.blueFb,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        marginTop: 10,
        marginLeft: 10,
        
    },

    btnAdd: {
        alignItems:'center',
        justifyContent:'center',
        width: 60,
        height: 60,
        backgroundColor: Colors.blueFb,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 10
    },

    btnAddCig: {
        alignItems:'center',
        justifyContent:'center',
        width: 60,
        height: 110,
        backgroundColor: Colors.blueFb,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 10
    },

    btnAddText: {
        color: Colors.white,
        fontSize: 30,
        fontWeight: 'bold'
    },

    btnAddPatch: {
        width: screenWidth - 20,
        backgroundColor: Colors.blueFb,
        padding: 15,
        borderRadius: 10,
        marginTop: 20
    },

    btnAddPatchText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },

   

    itemContainer: {
        minWidth: 300,
        height: 'auto',
        alignSelf: "stretch",
        backgroundColor: Colors.white,
        borderWidth: 3,
        borderColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },

    itemContainerSelected: {
        width: 300,
        height: 60,
        alignItems:'flex-start',
        justifyContent:'center',
        
        backgroundColor: Colors.white,
        
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,

        padding: 10,
        marginTop: 10,
        overflow: "hidden",
    },

    textNoData: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginTop:20
    },

    statsNumberContainer: {
        width: screenWidth,

        flex: 1,
        flexDirection: 'row',
    },

    statsNumberItemContainer: {
        width: (screenWidth / 3),
        height:  (screenWidth / 3),
        padding:10,
    },

    statsNumberItem2Container: {
        alignItems: 'center',
        width: (screenWidth / 3) - 20,
        height:  (screenWidth / 3) - 20,
        backgroundColor: Colors.white,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
    },

    statItemTitle: {
        width: (screenWidth / 3) - 20,
        color: Colors.blueFb,
        textAlign:'center',
        padding: 10,
        fontSize: 20,
    },

    statItemNumber: {
        width: (screenWidth / 3) - 20,
        color: Colors.blueFb,
        textAlign:'center',
        padding: 5,
        fontSize: 40,
    }
})
