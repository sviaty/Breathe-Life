import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorConstant';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default StyleSheet.create({

    // Container View 
    mainContainer: {
        flex: 1,
    },

    mainContainerStack: {
        alignItems: 'center',
        margin: 8
    },

    rowView: {
        flexDirection: "row"
    },

    rowViewFlex: {
        flex: 1,
        flexDirection: "row"
    },

    columnView: {
        flexDirection: "column"
    },

    // Surface 
    surfaceBtnBlueView: {
        flex:1,
        backgroundColor: Colors.blueFb,
        borderRadius: 5,
        padding: 8,
        margin: 8
    },

    surfaceStatBlueView: {
        flex: 1,
        backgroundColor: Colors.blueFb,
        verticalAlign: 'auto',
        borderRadius: 5,
        margin:8
    },

    surfaceStatRedView: {
        flex: 1,
        backgroundColor: Colors.red,
        verticalAlign: 'auto',
        marginTop: 8,
        marginStart: 8,
        marginEnd: 8,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },

    surfaceBtnStat: {
        verticalAlign: 'auto',
        borderRadius: 5,
        margin:8
    },

    surfaceOrangeStat: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        verticalAlign: 'auto',
        marginTop: 8,
        marginStart: 8,
        marginEnd: 8,
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0
    },
    

    // Title 
    titleContainerBlue: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.red,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleContainerOrange: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
    },

    titleText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    descContainer: {
        padding: 16,
    },

    descText: {
        color: Colors.white,
        fontSize: 18,
    },

    // SubTitle 
    subTitleContainer : {
        width: screenWidth,
        backgroundColor: Colors.colorOrange,
    },

    // TextInput
    textInputSigin: {
        flex: 1,
        margin: 8
    },

    textInputLogin: {
        flex: 1,
        margin: 8
    },

    // Text 
    textUseConditionContenair: {
        flex: 1,
        margin:8,
        paddingStart: 5
    },

    // TextError
    textError: {
        fontSize: 18,
        margin: 8,
        color: Colors.colorRed
    },

    // Button 
    btnGoUpdate: {
        backgroundColor: Colors.blueFb,
        padding: 15,
        borderRadius: 5,
    },

    btnGoUpdateTxt: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
    },

    btnDeleteAcount: {
        backgroundColor: Colors.red,
        padding: 15,
        borderRadius: 5,
    },










    subTitleText : {
        color: Colors.white,
        fontWeight:'bold',
        fontSize: 20,
        padding: 16,
    },

   
    // Button 
    buttonTouchableOpacity: {
        width: screenWidth - 20,
        backgroundColor: Colors.colorOrange,
        marginTop:10,
        padding: 15,
        borderRadius: 5,
    },

    buttonTouchableOpacityText: {
        textAlign: 'center',
        color: Colors.white,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 20,
    },

    stackLogin: {
        alignItems: 'center',
    },

    stackLogin2: {
        alignItems: 'center',
    },

   
    // Header 
    headerContenair : {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blueFb,
    },

    headerTitle: {
        minWidth: 300,
        textAlign:'center',
        backgroundColor: Colors.blueFb,
        marginTop: 55,
        color: Colors.white,
        fontSize: 35,
        padding: 5,
    },

    container: {
        flex: 1,
    },

    containerCenter2: {
        flex:1,
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
    },

    containerCenter3 : {
        flex:1,
        alignItems: 'center',
        alignSelf: 'stretch',
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        backgroundColor: Colors.background,
    },

    containerCenter3b : {
        alignContent: 'stretch',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        backgroundColor: Colors.background,
    },

    containerCenter4: {
        alignSelf: 'stretch',
        backgroundColor: Colors.blueFb,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
    },

    btnCigAdd: {
        width: screenWidth - 20,
        backgroundColor: Colors.blueFb,
        marginTop:15,
        marginBottom:10,
        padding: 15,
        borderRadius: 5,
    },
      

    containerCenter4Text: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        padding:20,
    },

    containerCenter: {
        width: screenWidth,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        color: Colors.colorOrange,
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

    linearContenairMain: {
        width : screenWidth,
        height: screenHeight,
        alignItems: 'center',
        justifyContent: 'center',
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

    itemContainerView2: {
        alignItems: 'center',
    },

    itemPatchContainer2: {
        width: screenWidth - 20,
        backgroundColor: Colors.colorOrange,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        padding: 15,
        marginTop: 16,
    },

    itemPatchContainerRed: {
        width: screenWidth - 20,
        backgroundColor: Colors.red,
        borderWidth: 2,
        borderColor: Colors.red,
        borderRadius: 5,
        padding: 15,
        marginTop: 16,
    },

    itemPatchContainerGreen: {
        width: screenWidth - 20,
        backgroundColor: Colors.green,
        borderWidth: 2,
        borderColor: Colors.green,
        borderRadius: 5,
        padding: 15,
        marginTop: 16,
    },

    itemPatchContainerOrange : {
        width: screenWidth - 20,
        backgroundColor: Colors.colorOrange,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        padding: 15,
        marginTop: 16,
    },

    itemPatchContainer: {
        width: screenWidth - 20,
        alignItems:'flex-start',
        justifyContent:'center',
        
        backgroundColor: Colors.colorOrange,
        borderWidth: 3,
        borderColor: Colors.colorOrange,
        borderRadius: 10,
        paddingLeft: 10,
        marginTop: 10,
        marginLeft: 10
    },

    

    itemPatchText: {
        color: Colors.white,
    },

    itemPatchText2: {
        fontSize: 20,
        color: Colors.white,
    },

    itemCigContainer: {
        width: screenWidth - 90,
        height: 110,
        alignItems:'flex-start',
        justifyContent:'center',
        
        backgroundColor: Colors.colorOrange,
        borderWidth: 3,
        borderColor: Colors.colorOrange,
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
        borderRadius:5,
        marginTop: 18
    },

    btnAddPatchText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold'
    },

    textError: {
        fontSize: 18,
        margin: 15,
        color: Colors.colorRed
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
        flexDirection: 'row',
        marginTop: 10,
    },

    statsNicotineContainer: {
        width: screenWidth,
        flexDirection: 'row',
    },

    statsNicotineContainer2: {
        flexDirection: 'row',
    },

    statsNumberItemContainer: {
        flex: 1,
        width: (screenWidth / 3),
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
    },

    statsNicotineItemContainer: {
        width: (screenWidth - 20),
        height:  (screenWidth / 3),
        padding:10,
    },

    statsNicotineItemContainer2: {
        flex: 0.5,
        height:  (screenWidth / 3),
        padding:10,
    },

    statsNumberItem2Container: {
        alignItems: 'center',
        width: (screenWidth / 3) - 20,
        height:  (screenWidth / 3) - 20,
        backgroundColor: Colors.blueFb,
        borderWidth: 3,
        borderColor: Colors.blueFb,
        borderRadius: 10,
        margin:5
    },

    statsNicotineItem2Container: {
        alignItems: 'center',
        width: (screenWidth) - 20,
        height:  (screenWidth / 3) - 10,
        backgroundColor: Colors.colorOrange,
        borderWidth: 3,
        borderColor: Colors.colorOrange,
        borderRadius: 10,
    },

    statsNicotineItem3Container: {
        alignItems: 'center',
        height:  (screenWidth / 3) - 10,
        backgroundColor: Colors.colorOrange,
        borderWidth: 3,
        borderColor: Colors.colorOrange,
        borderRadius: 10,
    },

    statItemTitle: {
        width: (screenWidth / 3) - 20,
        color: Colors.white,
        textAlign:'center',
        padding: 5,
        paddingTop: 10,
        fontSize: 18,
    },

    statItemTitleNicotine: {
        width: (screenWidth - 20),
        color: Colors.white,
        textAlign:'center',
        padding: 10,
        fontSize: 18,
    },

    statItemNumber: {
        width: (screenWidth / 3) - 20,
        color: Colors.white,
        textAlign:'center',
        fontSize: 40,
    },

    statItemNicotine: {
        width: (screenWidth - 20),
        color: Colors.white,
        textAlign:'center',
        fontSize: 40,
    },

    pickerSelect: {
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: Colors.silver,
        borderRadius: 5,
        width: screenWidth - 20,
        marginTop:10,
    },

    pickerSelectOrange: {
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        width: screenWidth - 20,
        marginTop:16,
    },

    selectAddCig: {
        width: screenWidth - 20,
        flexDirection: 'row',
        marginTop: 15,
    },

    pikerSelectCig: {
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        flex: 0.8,
    },

    btnAddCigContainer: {
        flex: 0.2,
    },

    btnAddCig2: {
        height: 55,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        marginLeft: 10
    },

    btnAddCigText2: {
        textAlign: 'center',
        alignItems:'center',
        justifyContent:'center',
        color: Colors.white,
        fontSize: 25,
        fontWeight: 'bold'
    },


    viewContenair: {
        alignItems: 'center'
    },

    textSelectIos: {
        padding:15
    }
})
