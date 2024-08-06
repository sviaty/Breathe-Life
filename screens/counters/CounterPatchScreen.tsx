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
import Patch from '../../datas/PatchData'

// Redux
import { RootState } from '../../redux/Store';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
const db = getFirestore(firebaseConfig);

/**
 * SettingPatchComponent
 */
type BottomSheetComponentProps = {};
const SettingPatchComponent: React.FunctionComponent<BottomSheetComponentProps> = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)
    const [isLoaderAdd, setIsLoaderAdd] = useState<boolean>(false)
    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [patchName, setPatchName] = useState<string>('');
    const [patchNicotine, setPatchNicotine] = useState<string>('');

    const [dataPatchTab, setDataPatchTab] = useState<Patch[]>([]);

    const [patchAdd, setPatchAdd] = useState<Patch>(new Patch('','','', false));

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // UseEffect 
    useEffect(() => {
        getPatchInDatabase()
    },[])

    /**
     * Function getPatchInDatabase
     */
    const getPatchInDatabase = async () => {

        setIsLoaderGet(true)
        dataPatchTab.length = 0
        setDataPatchTab([...dataPatchTab])
        //console.log(dataPatchTab)
        
        try {
            //console.log(userSelector.userId);
            const q = query(collection(db, "patchs"), where("idUser", "==", userSelector.userId));
    
            const patchList = await getDocs(q);
            //console.log(patchList);
    
            patchList.forEach((patch) => {
                //console.log(patch.id, " => ", patch.data());
                const patchData = patch.data()

                const p = new Patch(patch.id, patchData.patchName, patchData.patchNicotine, patchData.isSelected);
                //console.log(p);

                dataPatchTab.push(p)
                setDataPatchTab([...dataPatchTab])
            });

            setIsFetching(false)
            setIsLoaderGet(false)
            

        } catch (error) {
            console.error("Error get patch in firestore database : ")
            console.error(error)
        }
    }

    /**
     * Function handleAddPatch
     */
    const handleAddPatch = () => {
        if(patchName.length > 0){
            if(patchNicotine.length > 0){
                addPatchInDatabase()
            } else {

            }
        } else {

        }
    }

    /**
     * Function addPatchInDatabase
     */
    const addPatchInDatabase = async () => {
        
        setIsLoaderAdd(true)

        try {
            const docRef = await addDoc(collection(db, "patchs"), {
                idUser: userSelector.userId,
                patchName: patchName,
                patchNicotine: patchNicotine,
                isSelected: false
            });

            //console.log("Patch add with ID: "+ docRef.id);

            setPatchName('')
            setPatchNicotine('')

            setIsLoaderAdd(false)
            setIsVisible(false)

            getPatchInDatabase()

        } catch (error) {
            console.error("Error add patch in firestore database : ");
            console.error(error)
        }
    }

    /**
     * handleAddUserPatch
     */
    const handleAddUserPatch = (patch: Patch) => {
        setPatchAdd(patch)
        addUserPatchInDatabase(patch)
    }

    /**
     * Function addPatchInDatabase
     */
    const addUserPatchInDatabase = async (patch: Patch) => {
        
        //setIsLoaderGet(true)
        setIsLoaderUserAdd(true)

        try {

            const dateTime = serverTimestamp()
            const docRef = await addDoc(collection(db, "userPatchs"), {
                idUser: userSelector.userId,
                idPatch: patch.idPatch,
                dateTime: dateTime
            });

            //console.log("Pill user add with ID: "+ docRef.id);

            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
            //getPatchInDatabase()

        } catch (error) {
            console.error("Error add user patch in firestore database : ");
            console.error(error)
        }
    }

    /**
     * Function handleShowAddPatch
     */
     const handleShowAddPatch = () => {
        setIsVisible(true)
    }

     /**
     * Function handleHideAddPatch
     */
     const handleHideAddPatch = () => {
        setIsVisible(false)
    }


    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        setIsFetching(true)
        getPatchInDatabase()
    }


    // Item
    const Item = (item: Patch) => (
        
        <View style={AppStyle.itemContainerView}>
            
            <View style={ AppStyle.itemPatchContainer } >
                <Text style={ AppStyle.itemPatchText }>Nom du patch : {item.patchName} </Text>
                <Text style={ AppStyle.itemPatchText }>Taux de nicotine : {item.patchNicotine} (mg/24h)</Text>
            </View>
            
            <View style={ AppStyle.itemPatchBtnContainer } >
                {isLoaderUserAdd == true ? 
                    JSON.stringify(item) === JSON.stringify(patchAdd) ? 
                    <View style={AppStyle.viewLoaderContainer}>
                        <LoaderComponent text="" step="" color={Colors.white} size={'small'}/>
                    </View>
                    : 
                    <TouchableOpacity
                        onPress={() => handleAddUserPatch(item)}
                        activeOpacity={0.6}
                        style={ AppStyle.btnAdd }>
                        <Text style={AppStyle.btnAddText}> + </Text>
                    </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={() => handleAddUserPatch(item)}
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
            colors={[Colors.white, Colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={AppStyle.linearContenair}>

            <TouchableOpacity
                onPress={() => handleShowAddPatch()}
                activeOpacity={0.6}
                style={ AppStyle.btnAddPatch }>
                <Text style={AppStyle.btnAddPatchText}>Ajouter un patch</Text>
            </TouchableOpacity>

            {isLoaderGet == true ? 
            <View>
              <LoaderComponent text="Chargement des patchs" step={''} color={Colors.white} size={'large'}/>
            </View>
            : 
                dataPatchTab.length != 0 ? 

                <FlatList
                data={dataPatchTab}
                extraData={dataPatchTab}
                onRefresh={() => onRefresh()}
                refreshing={isFetching}
                renderItem={ ({item}) => <Item idPatch={item.idPatch} patchName={item.patchName} patchNicotine={item.patchNicotine} isSelected={item.isSelected} />}
                keyExtractor={(item) => item.idPatch } />

                : 

                <Text style={AppStyle.textNoData}> Vous n'avez pas encore ajouter de patch </Text>
            }

        </LinearGradient>

        </View>

        <BottomSheet 
        modalProps={{}} 
        isVisible={isVisible}>
            <Pressable style={AppStyle.modalPressage}>
            <View style={AppStyle.modalContainer}>

            <View>
                <Text style={AppStyle.textSubTitleOrange}>Informations du patch</Text>
            </View>

            <TextInput 
                style={AppStyle.textInputAdd}
                placeholder="Entrer le nom de la marque de votre patch"
                value={patchName}
                onChangeText={setPatchName} />

            <TextInput 
                style={AppStyle.textInputAdd}
                placeholder="Enter le taux de nicotine du patch (mg/24h)"
                value={patchNicotine}
                onChangeText={setPatchNicotine} />

            {isLoaderAdd == true ? 
            <View>
              <LoaderComponent text="Ajout du patch en cours ..." step={''} color={Colors.colorOrange} size={'large'}/>
            </View>
            : 
            <TouchableOpacity
                onPress={() => handleAddPatch()}
                activeOpacity={0.6}
                style={ AppStyle.btnOrange }>
                <Text style={AppStyle.btnText}>Ajouter</Text>
            </TouchableOpacity>
            }

            <TouchableOpacity
                onPress={() => handleHideAddPatch()}
                activeOpacity={0.6}
                style={ AppStyle.btn }>
                <Text style={AppStyle.btnText}>Fermer</Text>
            </TouchableOpacity>
            </View>
        </Pressable>
        </BottomSheet>

        <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ 'Application du patch : '+patchAdd.patchName}/>

    </SafeAreaProvider>
  )
}

export default SettingPatchComponent

const styles = StyleSheet.create({})