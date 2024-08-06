import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, TextInput, FlatList, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomSheet } from '@rneui/themed';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Datas
import Cigarette from '../../datas/CigaretteData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

//http://additifstabac.free.fr/index.php/cigarettes-pourcentages-additifs-taux-nicotine-goudrons-monoxyde-carbone-co/
type BottomSheetComponentProps = {};
const SettingCigaretteComponent: React.FunctionComponent<BottomSheetComponentProps>  = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isLoaderAdd, setIsLoaderAdd] = useState<boolean>(false)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [cigaretteName, setCigaretteName] = useState<string>('');
    const [cigaretteNicotine, setCigaretteNicotine] = useState<string>('');
    const [cigaretteGoudron, setCigaretteGoudron] = useState<string>('');
    const [cigaretteCarbone, setCigaretteCarbone] = useState<string>('');
    const [cigarettePrice, setCigarettePrice] = useState<string>('');

    const [dataCigaretteTab, setDataCigaretteTab] = useState<Cigarette[]>([]);

    const [cigaretteAdd, setCigaretteAdd] = useState<Cigarette>(new Cigarette('', '', '', '', '', 0, false));

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {
        getCigaretteInDatabase()
    }, [])  
    
    /**
     * Function getCigaretteInDatabase
     */
     const getCigaretteInDatabase = async () => {

        setIsLoaderGet(true)
        dataCigaretteTab.length = 0
        setDataCigaretteTab([...dataCigaretteTab])
        //console.log(dataCigaretteTab)
        
        try {
            //console.log(userSelector.userId);
            const q = query(collection(db, "cigarettes"), where("idUser", "==", userSelector.userId));
    
            const cigaretteList = await getDocs(q);
            //console.log(patchList);
    
            cigaretteList.forEach((cigarette) => {
                //console.log(patch.id, " => ", patch.data());
                const cigaretteData = cigarette.data()

                const p = new Cigarette(cigarette.id, cigaretteData.cigaretteName, cigaretteData.cigaretteNicotine, cigaretteData.cigaretteGoudron, cigaretteData.cigaretteCarbone, cigaretteData.cigarettePrice, cigaretteData.isSelected);
                //console.log(p);

                dataCigaretteTab.push(p)
                setDataCigaretteTab([...dataCigaretteTab])
            });

            setIsLoaderGet(false)
            setIsFetching(false)

        } catch (error) {
            console.error("Error get cigarette in firestore database : ")
            console.error(error)
        }
    }

    const handleAddCigarette = () => {
        if(cigaretteName.length > 0){
            if(cigaretteNicotine.length > 0){
                addCigaretteInDatabase()
            } else {

            }
        } else {

        }
    }

    /**
     * Function addCigaretteInDatabase
     */
    const addCigaretteInDatabase = async () => {

        setIsLoaderAdd(true)

        try {
            const docRef = await addDoc(collection(db, "cigarettes"), {
                idUser: userSelector.userId,
                cigaretteName: cigaretteName,
                cigaretteNicotine: cigaretteNicotine,
                cigaretteGoudron: cigaretteGoudron,
                cigaretteCarbone: cigaretteCarbone,
                cigarettePrice: cigarettePrice,
                isSelected: false
            });

            //console.log("Pill add with ID: "+ docRef.id);

            setCigaretteName('')
            setCigaretteNicotine('')
            setCigaretteGoudron('')
            setCigaretteCarbone('')
            setCigarettePrice('')
        
            setIsLoaderAdd(false)
            setIsVisible(false)

            getCigaretteInDatabase()

        } catch (error) {
            console.error("Error add cigarette in firestore database : ");
            console.error(error)
        }
    }

    /**
     * handleAddUserCigarette
     */
    const handleAddUserCigarette = (cigarette: Cigarette) => {
        Alert.alert(
            'Etes vous sure de vouloir fumer cette cigarette ?', 
            '', 
            [
            {
                text: 'Cancel',
                onPress: () => {
                    //console.log('Cancel Pressed')
                },
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    //console.log('OK Pressed')
                    setCigaretteAdd(cigarette)
                    addUserCigaretteInDatabase(cigarette)
                },
            }
            ]);
    }

    /**
     * Function addCigaretteInDatabase
     */
    const addUserCigaretteInDatabase = async (cigarette: Cigarette) => {
        
        //setIsLoaderGet(true)
        setIsLoaderUserAdd(true)

        try {

            const dateTime = serverTimestamp()
            const docRef = await addDoc(collection(db, "userCigarettes"), {
                idUser: userSelector.userId,
                idCigarette: cigarette.idCigarette,
                dateTime: dateTime
            });

            //console.log("Patch add with ID: "+ docRef.id);

            setIsLoaderUserAdd(false)
            setIsSnackBar(true)

        } catch (error) {
            console.error("Error add user cigarette in firestore database : ");
            console.error(error)
        }
    }

    /**
     * Function handleShowAddCigarette
     */
    const handleShowAddCigarette = () => {
        setIsVisible(true)
    }

    /**
     * Function handleHideAddCigarette
     */
    const handleHideAddCigarette = () => {
        setIsVisible(false)
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        setIsFetching(true)
        getCigaretteInDatabase()
    }

    // Item
    const Item = (item: Cigarette) => (
        <View style={AppStyle.itemContainerView}>
                    
            <View style={ AppStyle.itemCigContainer }   >
                <Text style={ AppStyle.itemPatchText }>Marque des cigarettes : {item.cigaretteName} </Text>
                <Text style={ AppStyle.itemPatchText }>Taux de nicotine : {item.cigaretteNicotine} (mg)</Text>
                <Text style={ AppStyle.itemPatchText }>Taux de goudron : {item.cigaretteGoudron} (mg)</Text>
                <Text style={ AppStyle.itemPatchText }>Taux de monoxyde de carbone : {item.cigaretteCarbone} (mg)</Text>
                <Text style={ AppStyle.itemPatchText }>Prix du paquet : {item.cigarettePrice} (euros)</Text>
            </View>

            <View style={ AppStyle.itemPatchBtnContainer } >
            {isLoaderUserAdd == true ? 
                    JSON.stringify(item) === JSON.stringify(cigaretteAdd) ? 
                    <View style={AppStyle.viewLoaderContainerCig}>
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                    </View>
                    : 
                    <TouchableOpacity
                        onPress={() => handleAddUserCigarette(item)}
                        activeOpacity={0.6}
                        style={ AppStyle.btnAddCig }>
                        <Text style={AppStyle.btnAddText}> + </Text>
                    </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => handleAddUserCigarette(item)}
                    activeOpacity={0.6}
                    style={ AppStyle.btnAddCig }>
                    <Text style={AppStyle.btnAddText}> + </Text>
                </TouchableOpacity>
                }
                
            </View>
        </View>

    );

    // View JSX
    return (
    <SafeAreaProvider>

        <View style={AppStyle.container}>
        <LinearGradient
            colors={[Colors.white, Colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

            <TouchableOpacity
                onPress={() => handleShowAddCigarette()}
                activeOpacity={0.6}
                style={ AppStyle.btnAddPatch }>
                <Text style={AppStyle.btnAddPatchText}>Ajouter une marque de cigarette</Text>
            </TouchableOpacity>

            {isLoaderGet == true ? 
            <View>
              <LoaderComponent text="Chargement des marques de cigarette" step="" color={Colors.white} size={'large'}/>
            </View>
            : 
                dataCigaretteTab.length != 0 ? 

                <FlatList
                data={dataCigaretteTab}
                extraData={dataCigaretteTab}
                onRefresh={() => onRefresh()}
                refreshing={isFetching}
                renderItem={ ({item}) => <Item idCigarette={item.idCigarette} cigaretteName={item.cigaretteName} cigaretteNicotine={item.cigaretteNicotine} cigaretteGoudron={item.cigaretteGoudron} cigaretteCarbone={item.cigaretteCarbone} cigarettePrice={item.cigarettePrice} isSelected={item.isSelected} />}
                keyExtractor={(item) => item.idCigarette } />
                : 

                <Text style={AppStyle.textNoData}> Vous n'avez pas encore ajouter de marque de cigarette </Text>
            }
        </LinearGradient>
        </View>

        <BottomSheet 
            modalProps={{}} 
            isVisible={isVisible}>
            
            <Pressable style={AppStyle.modalPressage}>
                <View style={AppStyle.modalContainer}>

                <View>
                    <Text style={AppStyle.textSubTitleOrange}>Informations des cigarettes</Text>
                </View>

                <TextInput 
                    style={AppStyle.textInputAdd}
                    placeholder="Entrer la marque des cigarettes"
                    value={cigaretteName}
                    onChangeText={setCigaretteName} />

                <TextInput 
                    style={AppStyle.textInputAdd}
                    placeholder="Enter le taux de nicotine (mg)"
                    value={cigaretteNicotine}
                    onChangeText={setCigaretteNicotine} />

                <TextInput 
                    style={AppStyle.textInputAdd}
                    placeholder="Enter le taux de goudron (mg)"
                    value={cigaretteGoudron}
                    onChangeText={setCigaretteGoudron} />

                <TextInput 
                    style={AppStyle.textInputAdd}
                    placeholder="Enter le taux de monoxyde de carbone (mg)"
                    value={cigaretteCarbone}
                    onChangeText={setCigaretteCarbone} />

                <TextInput 
                    style={AppStyle.textInputAdd}
                    placeholder="Enter le prix du paquet de 20 cigarettes (euros)"
                    value={cigarettePrice}
                    onChangeText={setCigarettePrice} />

                {isLoaderAdd == true ? 
                <View>
                    <LoaderComponent text="Ajout de la marque des cigarettes en cours ..." step={''} color={Colors.colorOrange} size={'large'}/>
                </View>
                :  
                <TouchableOpacity
                    onPress={() => handleAddCigarette()}
                    activeOpacity={0.6}
                    style={ AppStyle.btnOrange }>
                    <Text style={AppStyle.btnText}>Ajouter</Text>
                </TouchableOpacity>
                }

                <TouchableOpacity
                    onPress={() => handleHideAddCigarette()}
                    activeOpacity={0.6}
                    style={ AppStyle.btn }>
                    <Text style={AppStyle.btnText}>Fermer</Text>
                </TouchableOpacity>
                </View>
            </Pressable>

        </BottomSheet>

        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ "Consommation d'une cigarette "+ cigaretteAdd.cigaretteName}/>

    </SafeAreaProvider>
  )
}

export default SettingCigaretteComponent

const styles = StyleSheet.create({})