import { StyleSheet } from "react-native";
import Colors from '../constants/ColorConstant';

export default StyleSheet.create({
    statContainer: {
        margin: 5
    },

    statSurfaceOrange: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        borderRadius: 5,
        margin:8
    },

    statSurfaceRed: {
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 5,
        margin:8
    },

    statSurfaceGreen: {
        flex: 1,
        backgroundColor: Colors.green,
        borderRadius: 5,
        margin:8
    },

    statSurfaceBlue: {
        flex: 1,
        backgroundColor: Colors.blueFb,
        borderRadius: 5,
        margin:8
    },

    titleContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.colorOrange,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainerRed: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.red,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainerGreen: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.green,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleContainerBlue: {
        backgroundColor: Colors.white,
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.blueFb,
        borderStartStartRadius: 5,
        borderStartEndRadius: 5,
        borderTopStartRadius: 5,
        borderTopEndRadius: 5
    },

    titleText: {
        textAlign: 'center',
        color: Colors.black,
        fontSize: 16,
        fontWeight: 'bold'
    },

    descContenairViewText: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
        padding: 16
    },

    descContenairViewText2: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 30,
        paddingTop: 16
    },

    descContenairViewText3: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 20,
        padding: 16,
    },

    statUnitCount: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 14,
        paddingBottom: 16
    },

    statDispositifNicotine: {
        flexDirection: "row"
    },

    statCigaretteItem: {
        flex: 1,
        backgroundColor: Colors.colorOrange,
        height: 120,
        borderRadius: 5,
        margin:8
    },

    statDispositifNicotineItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.blueFb,
    
        borderRadius: 5,
        margin:8
    },

    statDepenseItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.red,
    
        borderRadius: 5,
        margin:8
    },

    statEconomyItem: {
        flex: 1,
        height: 120,
        backgroundColor: Colors.green,
    
        borderRadius: 5,
        margin:8
    },

    statDispositifNicotineTitle: {
        color: Colors.white,
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10,
    },

    statDispositifNicotineContenair: {
        flex:1,
        justifyContent: 'center',
    },

    statDispositifNicotineCount: {
        color: Colors.white,
        textAlign:'center',
        verticalAlign: 'auto',
        fontSize: 35
    }
})