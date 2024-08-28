import { StyleSheet, Dimensions } from "react-native";
import Colors from '../constants/ColorConstant';

const screenWidth = Dimensions.get('screen').width;
export default StyleSheet.create({
    statDispositifNicotine: {
        flexDirection: "row",
        alignItems: 'center',
    },

    statContainer: {
        margin:8
    },

    mainContainer: {
        flex: 1,
    },

    mainC: {
        alignItems: 'center',
        marginTop: 8
    },

    mainContainerView: {
        alignItems: 'center',
        flexDirection: 'column',
    },

    loadContainerView : {
        alignItems: 'center',
        alignContent: 'center'
    },

    pickerSelectOrange: {
        width: screenWidth - 32,
        backgroundColor:'white',
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        marginTop:16,
    },

    patchInfoContainerView: {
        alignItems: 'center',
    },

    titleContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainer2: {
        backgroundColor: Colors.white,
        padding: 16,
        paddingBottom: 0,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        borderWidth: 2,
        borderColor: Colors.red,
    },

    titleText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold'
    },

    descContainer: {
        padding: 8,
    },

    descContainerRed: {
        padding: 16,
        backgroundColor: Colors.red
    },

    descContainerRed2: {
        padding: 8,
        backgroundColor: Colors.red,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
    },

    descText: {
        color: Colors.white,
        fontSize: 18,
    },

    descContainerPicker: {
        backgroundColor: Colors.white,
        padding: 16,
        paddingTop: 0
    },

    descTextPicker: {
        color: Colors.blueFb,
        fontSize: 18,
    },

    surfaceContainerOrange : {
        width: screenWidth - 32,
        backgroundColor: Colors.colorOrange,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderRadius: 5,
        marginTop: 16,
    },

    surfaceContainerGreen: {
        flex: 1,
        backgroundColor: Colors.green,
        borderWidth: 2,
        borderColor: Colors.green,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerRed: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 5,
        margin: 8,
    },

    surfaceContainerRed2: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 5,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8
    },

    surfaceContainerBlue: {
        width: screenWidth - 32,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        marginTop: 8,
    },

    surfaceBtnBlue: {
        width: screenWidth - 32,
        backgroundColor: Colors.blueFb,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderRadius: 5,
        padding: 16,
        marginTop: 16,
    },

    surfaceBtnBlue2: {
        backgroundColor: Colors.blueFb,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        padding: 16,
    },

    surfaceBtnBlue3: {
        backgroundColor: Colors.blueFb,
        borderEndStartRadius: 5,
        borderEndEndRadius: 5,
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        padding: 16,
        marginStart: 8,
        marginEnd:8,
        marginBottom: 8,
    },

    surfaceBtnBlueText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

    descContenairViewText: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
    },


    container: {
		flex: 1,
		alignItems: 'center'
	},
    contentContainer: {
		alignItems: 'center'
	},

    contentContainer2: {
        flex:1,
		alignItems: 'center'
	},

	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20,
		color: Colors.colorOrange
	},

    descContainerOrange: {
        backgroundColor: Colors.colorOrange,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
    },

    titleContainerOrange: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    surfaceContainerOrange2 : {
        backgroundColor: Colors.colorOrange,
        flex: 1,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 5,
    },
})