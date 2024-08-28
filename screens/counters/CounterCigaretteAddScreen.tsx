// React & React Native
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Material
import { Surface, Stack, TextInput } from "@react-native-material/core";

// Navigation 
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Styles 
import AppStyle from '../../styles/AppStyle';

// Constants 
import Colors from '../../constants/ColorConstant';
import { 
    SURFACE_CATEGORY, 
    SURFACE_ELEVATION, 
    TEXTINPUT_VARIANT } from '../../constants/AppConstant';

// Helper
import textTranslate from '../../helpers/TranslateHelper';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'
import CigaretteUser from '../../datas/CigaretteUserData';

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// Api
import { addCigaretteUserFireStore } from '../../api/CigaretteApi';


type RootStackParamList = {
    UserCounterCigaretteAddScreen: any;
    UserCounterCigaretteListScreen: any;
  };

type Props = NativeStackScreenProps<RootStackParamList, 'UserCounterCigaretteAddScreen', 'UserCounterCigaretteListScreen'>;

/**
 * http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
 */

/**
 * Screen CounterCigaretteAddScreen
 * @param param0 
 * @returns 
 */
const CounterCigaretteAddScreen = ({ navigation }: Props) => {

    // UseState
    const [isLoaderCigAdd, setIsLoaderCigAdd] = useState<boolean>(false)
    const [errorAddCigUser, setErrorAddCigUser] = useState<string>("")

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

    /**
     * Function handleAddCig
     */
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
            setErrorCigName( textTranslate.t('counterCigAddBrandRequired') )
            return false
        }

        if(cigNicotine.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigNicotine( textTranslate.t('counterCigAddNicotineRequired') )
            return false
        }

        if(cigGoudron.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigGoudron( textTranslate.t('counterCigAddGoudronRequired') )
            return false
        }

        if(cigCarbonne.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigCarbonne( textTranslate.t('counterCigAddGoudronRequired') )
            return false
        }

        if(cigPaquetNbr.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPaquetNbr( textTranslate.t('counterCigAddNbrRequired') )
            return false
        }

        if(cigPaquetPrice.length == 0){
            setIsLoaderCigAdd(false)
            setErrorCigPrice( textTranslate.t('counterCigAddPriceRequired') )
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

        addCigaretteUserFireStore(cigUser).then(() => {
            setIsLoaderCigAdd(false)

            setCigName("")
            setCigNicotine("")
            setCigGoudron("")
            setCigCarbonne("")
            setCigPaquetNbr("")
            setCigPaquetPrice("")

            navigation.navigate('UserCounterCigaretteListScreen')

        }).catch((error) => {
            setIsLoaderCigAdd(false)
            setErrorAddCigUser(error.message)
            console.error(error.message)
        })
    };

    // View JSX
    return (
        <SafeAreaProvider>
            
            <ScrollView
                persistentScrollbar={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                automaticallyAdjustKeyboardInsets={true}>

                <Stack 
                    spacing={0} 
                    style={AppStyle.mainContainerStack}>
                    
                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddBrand') }
                            placeholder={ textTranslate.t('counterCigAddBrandPlaceholder') } 
                            helperText={errorCigName}
                            color={Colors.blueFb}
                            keyboardType="default"
                            style={ AppStyle.textInputLogin }
                            value={cigName}
                            onChangeText={setCigName} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddNicotine') } 
                            placeholder={ textTranslate.t('counterCigAddNicotinePlaceholder') } 
                            helperText={errorCigNicotine}
                            color={Colors.blueFb}
                            keyboardType="decimal-pad"
                            style={ AppStyle.textInputLogin }
                            value={cigNicotine}
                            onChangeText={setCigNicotine} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddGoudron') } 
                            placeholder={ textTranslate.t('counterCigAddGoudronPlaceholder') } 
                            helperText={errorCigGoudron}
                            color={Colors.blueFb}
                            keyboardType="decimal-pad"
                            style={ AppStyle.textInputLogin }
                            value={cigGoudron}
                            onChangeText={setCigGoudron} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddCarbone') } 
                            placeholder={ textTranslate.t('counterCigAddCarbonePlaceholder') } 
                            helperText={errorCigCarbonne}
                            color={Colors.blueFb}
                            keyboardType="decimal-pad"
                            style={ AppStyle.textInputLogin }
                            value={cigCarbonne}
                            onChangeText={setCigCarbonne} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddNbr') }  
                            placeholder={ textTranslate.t('counterCigAddNbrPlaceholder') }  
                            helperText={errorCigPaquetNbr}
                            color={Colors.blueFb}
                            keyboardType="number-pad"
                            style={ AppStyle.textInputLogin }
                            value={cigPaquetNbr}
                            onChangeText={setCigPaquetNbr} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <TextInput
                            variant={ TEXTINPUT_VARIANT }
                            label={ textTranslate.t('counterCigAddPrice') } 
                            placeholder={ textTranslate.t('counterCigAddPricePlaceholder') }  
                            helperText={errorCigPaquetPrice}
                            color={Colors.blueFb}
                            keyboardType="decimal-pad"
                            style={ AppStyle.textInputLogin }
                            value={cigPaquetPrice}
                            onChangeText={setCigPaquetPrice} />
                    </View>

                    <View style={AppStyle.rowView}>
                        <View style={{flex: 1}}>
                            <Surface 
                                elevation={ SURFACE_ELEVATION }
                                category={ SURFACE_CATEGORY }
                                style={AppStyle.surfaceBtnStat}>
                                { isLoaderCigAdd == true ? 
                                <View style={AppStyle.btnGoUpdate}>
                                    <LoaderComponent text={ textTranslate.t('counterCigAddBtnLoader') } step="" color={Colors.white} size="small"/>
                                </View>
                                : 
                                <TouchableOpacity
                                    onPress={ () => handleAddCig()}
                                    activeOpacity={0.6}
                                    style={AppStyle.btnGoUpdate}>
                                    <Text style={AppStyle.btnGoUpdateTxt}>{ textTranslate.t('counterCigAddBtnText') }</Text>
                                </TouchableOpacity>
                                }
                            </Surface>
                        </View>
                    </View>
                    
                </Stack>

            </ScrollView>
            
        </SafeAreaProvider>
    )
}

export default CounterCigaretteAddScreen