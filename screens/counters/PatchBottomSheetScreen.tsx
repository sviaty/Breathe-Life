import { View, StyleSheet, Text, Button } from 'react-native';
import { useCallback, forwardRef, useMemo, useRef } from 'react';
import BottomSheet, { useBottomSheet, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import {Picker} from '@react-native-picker/picker';

// Styles & Colors
import Colors from '../../constants/ColorsConstant';
import AppStyle from '../../styles/AppStyle';

export type Ref = BottomSheet;

interface Props {
    title: string;
}

const CloseBtn = () => {
    const { close } = useBottomSheet();

    return <Button title="Close" onPress={() => close()} />;
};

const PatchBottomSheetScreen = forwardRef<Ref, Props>((props, ref) => {

    const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

    const renderBackdrop = useCallback(
		(props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
		[]
	);

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: Colors.blueFb }}
            backgroundStyle={{ backgroundColor: Colors.white }}
            backdropComponent={renderBackdrop}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.containerHeadline}>{props.title}</Text>
                <CloseBtn />

            </View>
        </BottomSheet>
    );
});

export default PatchBottomSheetScreen

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center'
    },
    containerHeadline: {
        fontSize: 24,
        fontWeight: '600',
        padding: 20,
        color: Colors.black
    }
})