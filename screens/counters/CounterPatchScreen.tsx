// React & React Native
import React, { useState , useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import PickerSelect from 'react-native-picker-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

// Components
import LoaderComponent from '../../components/LoaderComponent';
import SnackBarComponent from '../../components/SnackBarComponent';

// Datas
import Patch from '../../datas/PatchData'
import User from '../../datas/UserData';

// Redux
import { RootState } from '../../redux/Store';
import { setUser } from '../../redux/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';

// FireStore
import firebaseConfig from '../../firebaseConfig';
import { getFirestore, serverTimestamp, collection, query, where, addDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import App from '../../App';
const db = getFirestore(firebaseConfig);

/**
 * SettingPatchComponent
 */
const SettingPatchComponent = () => {

    // UseState
    const [isLoaderGet, setIsLoaderGet] = useState<boolean>(false)

    const [isLoaderUserAdd, setIsLoaderUserAdd] = useState<boolean>(false)
    const [errorAddPatch, setErrorAddPatch] = useState<string>("")
    
    const [isSnackBar, setIsSnackBar] = useState<boolean>(false)

    let [userPatch, setUserPatch] = useState<string>("");

    const p = new Patch("","",0)
    let [userPatchSelected, setUserPatchSelected] = useState<Patch>(p);

    let [dataPatchTab, setDataPatchTab] = useState<Patch[]>([]);
    let [dataPatchTabItem, setDataPatchTabItem] = useState<any[]>([]);

    // UseSelector
    const userSelector = useSelector((state: RootState) => state.userReducer.user);

    // Dispatch
    const dispatch = useDispatch();

    // UseEffect 
    useEffect(() => {
        //console.log('useEffect')
        getPatchList()
    },[])

    /**
     * Function getPatchList
     */
    const getPatchList = async () => {
        // Show loader
        setIsLoaderGet(true)

        dataPatchTabItem = []
        setDataPatchTabItem([...dataPatchTabItem])

        dataPatchTab = []
        setDataPatchTab([...dataPatchTab])
        //console.log(dataPatchTab)
        
        const q = query(collection(db, "patchs"));

        const patchList = 
        await getDocs(q).then((patchList) => {
            //console.log(patchList.size);

            patchList.forEach((patch) => {
                const patchData = patch.data()
                //console.log(patchData);

                const p = new Patch(patch.id, patchData.patchName, patchData.patchNicotine);
                //console.log(p);

                const pItem = { label: patchData.patchName, value: patch.id }
                //console.log(pItem);

                dataPatchTabItem.push(pItem)
                setDataPatchTabItem([...dataPatchTabItem])

                dataPatchTab.push(p)
                setDataPatchTab([...dataPatchTab])
            });

            // Call after load patch list
            changePatchSelectedFomUserIdPatch()

            // Hide loader
            setIsLoaderGet(false)

        }).catch((error) => {
            setIsLoaderGet(false)
            console.error("Error get patch in firestore database : ")
            console.error(error)
        }) 
    }

    /**
     * Function changePatchSelectedFomUserIdPatch
     */
    const changePatchSelectedFomUserIdPatch = () => {
        //console.log("changePatchSelectedFomUserIdPatch")
        setUserPatch("")
        console.log(userSelector.idPatch)

        if(userSelector.idPatch != "undefined"){
            setUserPatch(userSelector.idPatch)
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == userSelector.idPatch){
                    setUserPatchSelected(patch)
                    //console.log(patch)
                }
            })
        }
    }

    /**
     * Function handleHideAddPatch
     */
    const handlePickerSelect = (idPatch: string) => {
        setUserPatch(idPatch)
        //console.log(idPatch)

        if(idPatch != ""){
            //console.log('IS NOT undefined')
            dataPatchTab.forEach((patch) => {
                if(patch.idPatch == idPatch){
                    setUserPatchSelected(patch)
                    //console.log(patch)
                }
            })
    
            setUserIdPatch(idPatch)
        } else {
            //console.log('IS undefined')
        }
        
    }

    /**
     * Function setUserIdPatch
     * @param idPatch 
     */
    const setUserIdPatch = async (idPatch: string) => {

        const userDoc = doc(db, "users", userSelector.userId)
        
        await setDoc(userDoc, {
            userName: userSelector.userName,
            userMail: userSelector.userMail,
            idPatch: idPatch,
            idPill: userSelector.idPill,
            idCigarette: userSelector.idCigarette,
        }).then((value) => {
            //console.log(value);

            const u = new User(userSelector.userId, userSelector.userName, userSelector.userMail, userSelector.userToken, idPatch, userSelector.idPill, userSelector.idCigarette);
            dispatch(setUser(u));

        }).catch((error) => {
            console.error("Error set user in firestore database : ")
            console.error(error)
        })
    }

    /**
     * Function handleAddUserPatch
     */
    const handleAddUserPatch = () => {
        addUserPatch()
    }

    /**
     * Function addUserPatch
     */
    const addUserPatch = async () => {
        setIsLoaderUserAdd(true)
        setErrorAddPatch("")

        const dateTime = serverTimestamp()
        const patchDoc = collection(db, "userPatchs")

        await addDoc(patchDoc, {
            idUser: userSelector.userId,
            idPatch: userPatch,
            dateTime: dateTime
        }).then((value) => {
            setIsLoaderUserAdd(false)
            setIsSnackBar(true)
        }).catch((error) => {
            setIsLoaderUserAdd(false)
            setErrorAddPatch("addUserPatch error : " + error.message)
            console.error(error)
        })
    }

    /**
     * Function onRefresh 
     */
    const onRefresh = () => {
        getPatchList()
    }

    // View JSX
    return (
        <SafeAreaProvider>
            <View style={AppStyle.container}>
                { isLoaderGet == true ? 
                <View>
                    <LoaderComponent text="Chargement des patchs" step="" color={Colors.blueFb} size="large"/>
                </View>
                : 
                <View style={AppStyle.viewContenair}>
                    
                    <View style={AppStyle.pickerSelect}>
                        <PickerSelect
                            onValueChange={(patch) => handlePickerSelect(patch) }
                            style={pickerSelectStyles}
                            placeholder={{
                                label: "Selectionner un patch",
                                value: "",
                                color: Colors.colorOrange
                            }}
                            value={userPatch}
                            items={dataPatchTabItem}
                        />
                    </View>

                    { userPatch != "" ?
                    <View style={AppStyle.itemContainerView2}>
                                    
                        <View style={ AppStyle.itemPatchContainer2 } >
                            <Text style={ AppStyle.itemPatchText2 }>Nom du patch : {userPatchSelected.patchName} </Text>
                            <Text style={ AppStyle.itemPatchText2 }>Taux de nicotine :  {userPatchSelected.patchNicotine} (mg) </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => handleAddUserPatch()}
                            activeOpacity={0.6}
                            style={ AppStyle.btnAddPatch }>
                            <Text style={AppStyle.btnAddPatchText}>Appliquer le patch</Text>
                        </TouchableOpacity>

                        { isLoaderUserAdd == true ?
                        <View>
                            <LoaderComponent text="Ajout du patch en cours ..." step="" color={Colors.blueFb} size="large"/>
                        </View>
                        :
                        <Text style={AppStyle.textError}>{errorAddPatch}</Text>
                        }
                    </View>
                    : null }
                </View> 
                }
            </View>
            
            <SnackBarComponent visible={isSnackBar} setVisible={setIsSnackBar} duration={3000} message={ 'Application du patch : '+userPatchSelected.patchName}/>
            
        </SafeAreaProvider>
    )
}

export default SettingPatchComponent

const styles = StyleSheet.create({
   
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    },
    inputAndroid: {
        backgroundColor: Colors.white,
        fontSize: 16,
        borderWidth: 2,
        borderColor: 'silver',
        borderRadius: 5,
        color: 'black',
        padding: 15 
    }
});