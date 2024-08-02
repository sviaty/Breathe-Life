import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable, TextInput, FlatList } from 'react-native'
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
import Pill from '../../datas/PillData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

/**
 * SettingPillComponent 
 */
type BottomSheetComponentProps = {};
const SettingPillComponent: React.FunctionComponent<BottomSheetComponentProps>  = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isLoaderAdd, setIsLoaderAdd] = useState<boolean>(false)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [pillName, setPillName] = useState<string>('');
    const [pillNicotine, setPillNicotine] = useState<string>('');

    const [dataPillTab, setDataPillTab] = useState<Pill[]>([]);

    const [pillAdd, setPillAdd] = useState<Pill>(new Pill('','','', false));

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {
        getPillInDatabase()
     }, [])  

    /**
     * Function getPillInDatabase
     */
    const getPillInDatabase = async () => {

        setIsLoaderGet(true)
        dataPillTab.length = 0
        setDataPillTab([...dataPillTab])
        //console.log(dataPillTab)
        
        try {
            //console.log(userSelector.userId);
            const q = query(collection(db, "pills"), where("idUser", "==", userSelector.userId));
    
            const pillList = await getDocs(q);
            //console.log(patchList);
    
            pillList.forEach((pill) => {
                //console.log(patch.id, " => ", patch.data());
                const pillData = pill.data()

                const p = new Pill(pill.id, pillData.pillName, pillData.pillNicotine, pillData.isSelected);
                //console.log(p);

                dataPillTab.push(p)
                setDataPillTab([...dataPillTab])
            });

            setIsFetching(false)
            setIsLoaderGet(false)

        } catch (error) {
            console.error("Error get pill in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function handleAddPill
     */
    const handleAddPill = () => {

        if(pillName.length > 0){
            if(pillNicotine.length > 0){
                addPillInDatabase()
            } else {

            }
        } else {

        }
    }

    /**
     * Function addPatchInDatabase
     */
    const addPillInDatabase = async () => {

        setIsLoaderAdd(true)

        try {
            const docRef = await addDoc(collection(db, "pills"), {
                idUser: userSelector.userId,
                pillName: pillName,
                pillNicotine: pillNicotine,
                isSelected: false
            });

            //console.log("Pill add with ID: "+ docRef.id);

            setPillName('')
            setPillNicotine('')
        
            setIsLoaderAdd(false)
            setIsVisible(false)

            getPillInDatabase()

        } catch (error) {
            console.error("Error add pill in firestore database : ");
            console.error(error)
        }
    }

    /**
     * handleAddUserPill
     */
    const handleAddUserPill = (pill: Pill) => {
        setPillAdd(pill)
        addUserPillInDatabase(pill)
    }

    /**
     * Function addPillInDatabase
     */
    const addUserPillInDatabase = async (pill: Pill) => {
        
        //setIsLoaderGet(true)
        setIsLoaderUserAdd(true)

        try {

            const dateTime = serverTimestamp()
            const docRef = await addDoc(collection(db, "userPills"), {
                idUser: userSelector.userId,
                idPill: pill.idPill,
                dateTime: dateTime
            });

            //console.log("Cigarette user add with ID: "+ docRef.id);

            setIsLoaderUserAdd(false)
            setIsSnackBar(true)

        } catch (error) {
            console.error("Error add user pill in firestore database : ");
            console.error(error)
        }
    }


    /**
     * Function handleShowAddPill
     */
    const handleShowAddPill = () => {
        setIsVisible(true)
    }

    /**
     * Function handleHideAddPill
     */
    const handleHideAddPill = () => {
        setIsVisible(false)
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        setIsFetching(true)
        getPillInDatabase()
    }

    // Item
    const Item = (item: Pill) => (

        <View style={AppStyle.itemContainerView}>
            
            <View style={ AppStyle.itemPatchContainer }   >
                <Text>Nom de la pastille : {item.pillName} </Text>
                <Text>Taux de nicotine : {item.pillNicotine} (mg)</Text>
            </View>
        
            <View style={ AppStyle.itemPatchBtnContainer } >
            {isLoaderUserAdd == true ? 
                    JSON.stringify(item) === JSON.stringify(pillAdd) ? 
                    <View style={AppStyle.viewLoaderContainer}>
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                    </View>
                    : 
                    <TouchableOpacity
                        onPress={() => handleAddUserPill(item)}
                        activeOpacity={0.6}
                        style={ AppStyle.btnAdd }>
                        <Text style={AppStyle.btnAddText}> + </Text>
                    </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => handleAddUserPill(item)}
                    activeOpacity={0.6}
                    style={ AppStyle.btnAdd }>
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
            colors={[Colors.colorOrange, Colors.colorOrange2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

            <TouchableOpacity
                onPress={() => handleShowAddPill()}
                activeOpacity={0.6}
                style={ AppStyle.btnAddPatch }>
                <Text style={AppStyle.btnAddPatchText}>Ajouter une pastille</Text>
            </TouchableOpacity>

            {isLoaderGet == true ? 
            <View>
              <LoaderComponent text="Chargement des pastilles" step={''} color={Colors.white} size={'large'}/>
            </View>
            : 
                dataPillTab.length != 0 ? 

                <FlatList
                    data={dataPillTab}
                    extraData={dataPillTab}
                    onRefresh={() => onRefresh()}
                    refreshing={isFetching}
                    renderItem={ ({item}) => <Item idPill={item.idPill} pillName={item.pillName} pillNicotine={item.pillNicotine} isSelected={item.isSelected} />}
                    keyExtractor={(item) => item.idPill } />

                : 

                <Text style={AppStyle.textNoData}> Vous n'avez pas encore ajouter de pastille </Text>

            }
        </LinearGradient>
        </View>

        <BottomSheet 
        modalProps={{}} 
        isVisible={isVisible}>
            <Pressable style={AppStyle.modalPressage}>
            <View style={AppStyle.modalContainer}>

            <View>
                <Text style={AppStyle.textSubTitleOrange}>Informations de la pastille</Text>
            </View>

            <TextInput 
                style={AppStyle.textInputAdd}
                placeholder="Entrer le nom de la marque de votre pastille"
                value={pillName}
                onChangeText={setPillName} />

            <TextInput 
                style={AppStyle.textInputAdd}
                placeholder="Enter le taux de nicotine (mg)"
                value={pillNicotine}
                onChangeText={setPillNicotine} />


            {isLoaderAdd == true ? 
            <View>
                <LoaderComponent text="Ajout de la pastille en cours ..." step="" color={Colors.colorOrange} size={'large'} />
            </View>
            : 
            <TouchableOpacity
                onPress={() => handleAddPill()}
                activeOpacity={0.6}
                style={ AppStyle.btnOrange }>
                <Text style={AppStyle.btnText}>Ajouter</Text>
            </TouchableOpacity>
            }

            <TouchableOpacity
                onPress={() => handleHideAddPill()}
                activeOpacity={0.6}
                style={ AppStyle.btn }>
                <Text style={AppStyle.btnText}>Fermer</Text>
            </TouchableOpacity>
            </View>
        </Pressable>
        </BottomSheet>

        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ 'Consommation de la pastille ' +pillAdd.pillName}/>

    </SafeAreaProvider>
  )
}

export default SettingPillComponent

const styles = StyleSheet.create({
   
})