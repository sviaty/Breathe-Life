// React & React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform,  Text, View, TouchableOpacity, Keyboard, ScrollView, Dimensions } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Surface, Stack, TextInput } from "@react-native-material/core";

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';
import LoginSigninStyle from '../../styles/LoginSigninStyle';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// Api
import CigaretteUser from '../../datas/CigaretteUserData';
import { addCigaretteUserFireStore } from '../../api/CigaretteUserApi';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    CounterCigaretteAddScreen: any;
    CounterCigaretteListScreen: any;
    SettingCounter: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'CounterCigaretteAddScreen', 'CounterCigaretteListScreen'>;


/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

const CounterCigaretteAddScreen = ({ navigation }: Props) => {

    // UseState
    const [isLoaderCigAdd, setIsLoaderCigAdd] = useState<boolean>(false)
    const [errorAddCigUser, setErrorAddCigUser] = useState<string>("")
    
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [textSnackBar, setTextSnackBar] = useState<string>("")

    const c = new Cigarette("","",0,0,0,0,0,0,"")

    const [cigName, setCigName] = useState<string>("")
    const [errorCigName, setErrorCigName] = useState<string>("")

    const [cigNicotine, setCigNicotine] = useState<string>("")
    const [errorCigNicotine, setErrorCigNicotine] = useState<string>("")

    const [cigGoudron, setCigGoudron] = useState<string>("")
    const [errorCigGoudron, setErrorCigGoudron] = useState<string>("")

    const [cigCarbonne, setCigCarbonne] = useState<string>("")
    const [errorCigCarbonne, setErrorCigCarbonne] = useState<string>("")

    const [cigPaquetNbr, setCigPaquetNbr] = useState<string>("")
    const [errorCigPaquetNbr, setErrorCigPaquetNbr] = useState<string>("")

    const [cigPaquetPrice, setCigPaquetPrice] = useState<string>("")
    const [errorCigPaquetPrice, setErrorCigPrice] = useState<string>("")
    
    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {

    }, [])  

    const handleAddCig = () => {
        setIsLoaderCigAdd(true)

        setErrorCigName("")
        setErrorCigNicotine("")
        setErrorCigGoudron("")
        setErrorCigCarbonne("")
        setErrorCigPaquetNbr("")
        setErrorCigPrice("")
        
        if(isDataCorrect()){
            createNewCigUser()
        }
    }

    /**
     * Function isDataCorrect
     * @returns boolean
     */
    const isDataCorrect = (): boolean => {
        if(cigName.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigName("Le nom de la marque est vide")
            return false
        }

        if(cigNicotine.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigNicotine("Le taux de nicotine est obligatoire")
            return false
        }

        if(cigGoudron.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigGoudron("Le taux de goudron est obligatoire")
            return false
        }

        if(cigCarbonne.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigCarbonne("Le monoxyde de carbonne est obligatoire")
            return false
        }

        if(cigPaquetNbr.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPaquetNbr("Le nombre de cigarette par paquet est obligatoire")
            return false
        }

        if(cigPaquetPrice.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPrice("Le prix du paquet est obligatoire")
            return false
        }

        return true 
    }

    /**
     * Function createNewCigUser
     */
    const createNewCigUser = async () => {

        const nicotine = parseFloat(parseFloat(cigNicotine.replace(",", ".")).toFixed(1))
        const price = parseFloat(parseFloat(cigPaquetPrice.replace(",", ".")).toFixed(2))
        const priceUnit = parseFloat((parseInt(cigPaquetNbr) / price).toFixed(2))

        const cigUser = new CigaretteUser(
            "",
            cigName,
            nicotine,
            parseInt(cigGoudron),
            parseInt(cigCarbonne),
            price,
            parseInt(cigPaquetNbr),
            priceUnit,
            userSelector.userId
        )

        addCigaretteUserFireStore(cigUser).then((value) => {
            setIsLoaderCigAdd(false)
            setTextSnackBar('Ajout de la marque de cigarette : '+ cigName)
            setIsSnackBar(true)

            //handleOpenCloseBackdrop()
            //bottomSheetRefAdd.current?.close()

            setCigName("")
            setCigNicotine("")
            setCigGoudron("")
            setCigCarbonne("")
            setCigPaquetNbr("")
            setCigPaquetPrice("")

            //getCigList()

            navigation.navigate('CounterCigaretteListScreen')

        }).catch((error) => {
            setIsLoaderCigAdd(false)
            setErrorAddCigUser("Error add cigarette : "+ error)
            console.error("Error add cig : "+ error);
        })
    };

    const handleKeyboardHide = () => {
        Keyboard.dismiss()
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
    }

    // View JSX
    return (
        <SafeAreaProvider style={AppStyle.container}>
            
            <View style={styles.contentContainer2}>
                
                <View>

                <ScrollView
                    persistentScrollbar={true}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    automaticallyAdjustKeyboardInsets={true}>

                <Stack spacing={0} style={AppStyle.stackLogin2}>

                    <TextInput
                        variant="outlined"
                        label="Entrer le nom de la marque"
                        helperText={errorCigName}
                        color={Colors.colorOrange}
                        placeholder="Malboro"
                        keyboardType="default"
                        style={LoginSigninStyle.textInput}
                        value={cigName}
                        onChangeText={setCigName} />

                    <TextInput
                        variant="outlined"
                        label="Entrer le taux de nicotine (mg)"
                        helperText={errorCigNicotine}
                        color={Colors.colorOrange}
                        placeholder="0.8"
                        keyboardType="decimal-pad"
                        style={LoginSigninStyle.textInput}
                        value={cigNicotine}
                        onChangeText={setCigNicotine} />

                    <TextInput
                        variant="outlined"
                        label="Entrer le taux de goudron (mg)"
                        helperText={errorCigGoudron}
                        color={Colors.colorOrange}
                        placeholder="9"
                        keyboardType="decimal-pad"
                        style={LoginSigninStyle.textInput}
                        value={cigGoudron}
                        onChangeText={setCigGoudron} />

                    <TextInput
                        variant="outlined"
                        label="Entrer le taux de monoxyde de carbonne (mg)"
                        helperText={errorCigCarbonne}
                        color={Colors.colorOrange}
                        placeholder="10"
                        keyboardType="decimal-pad"
                        style={LoginSigninStyle.textInput}
                        value={cigCarbonne}
                        onChangeText={setCigCarbonne} />

                    <TextInput
                        variant="outlined"
                        label="Entrer le nombre de cigarette par paquet"
                        helperText={errorCigPaquetNbr}
                        color={Colors.colorOrange}
                        placeholder="20"
                        keyboardType="number-pad"
                        style={LoginSigninStyle.textInput}
                        value={cigPaquetNbr}
                        onChangeText={setCigPaquetNbr} />

                    <TextInput
                        variant="outlined"
                        label="Entrer le prix du paquet (euros)"
                        helperText={errorCigPaquetNbr}
                        color={Colors.colorOrange}
                        placeholder="14"
                        keyboardType="decimal-pad"
                        style={LoginSigninStyle.textInput}
                        value={cigPaquetPrice}
                        onChangeText={setCigPaquetPrice} />

                    { isLoaderCigAdd == true ?
                    <View>
                        <LoaderComponent text="Ajout de la marque de cigarette en cours ..." step="" color={Colors.blueFb} size="large"/>
                    </View>
                    :
                    <View>
                        <Surface 
                            elevation={4}
                            category="medium"
                            style={styles.btnAdd}
                            > 
                            <TouchableOpacity
                                onPress={() => handleAddCig()}
                                activeOpacity={0.6}>
                                <Text style={LoginSigninStyle.buttonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </Surface>

                        <Text style={AppStyle.textError}>{errorAddCigUser}</Text>
                    </View>
                    }
                    
                </Stack>
                </ScrollView>

                </View>
            </View>
            
            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={5000} message={textSnackBar}/>
            
        </SafeAreaProvider>
    )
}

export default CounterCigaretteAddScreen


const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
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
		padding: 15,
		color: Colors.colorOrange
	},

    btnAdd: {
        width: screenWidth - 20,
        backgroundColor: Colors.blueFb,
        marginTop:15,
        padding: 15,
        borderRadius: 5,
    },
})