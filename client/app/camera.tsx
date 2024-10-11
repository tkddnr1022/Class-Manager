import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function Camera() {
    const [camPermission, requestCamPermission] = useCameraPermissions(); // 카메라 권한
    const [isScanning, setIsScanning] = useState(false); // 스캔 상태

    // state 초기화
    useFocusEffect(
        useCallback(() => {
            setIsScanning(false);
        }, [])
    );

    // 최초 권한 요청
    useEffect(() => {
        requestCamPermission();
    }, []);

    // URL 검사
    function checkURL(url: string) {
        console.log("check");
        return true;
        if (url != "test") {
            return false;
        }
    }

    // QR 데이터 처리
    async function scan(qr: BarcodeScanningResult) {
        if (isScanning) {
            return;
        }
        if (!checkURL(qr.data)) {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '유효하지 않은 QR 코드입니다.',
            });
            return router.back();
        }
        setIsScanning(true);
        const courseId = qr.data;
        
        return router.replace(`/(tabs)/entry/${courseId}`);
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scan}>
                <View style={styles.qrContainer}>
                    <View style={styles.qrBox} />
                </View>
                <View style={styles.qrContainer}>
                    {camPermission?.granted ?
                        (<Text style={styles.qrText}>QR코드를 중앙에 위치시켜주세요</Text>) :
                        (<View style={styles.qrPermission}>
                            <Text style={styles.qrPermissionText}>카메라 권한이 필요합니다.</Text>
                            <Pressable onPress={requestCamPermission}>
                                <Text style={styles.qrPermissionButton}>권한 허용</Text>
                            </Pressable>
                        </View>)
                    }
                </View>
                {isScanning && (
                    <View style={styles.qrContainer}>
                        <View style={styles.qrBlock} />
                        <Text style={styles.qrScanningText}>불러오는 중..</Text>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const boxSize = width * 0.6;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    qrContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrBox: {
        width: boxSize,
        height: boxSize,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
        borderRadius: 10,
    },
    qrBlock: {
        ...StyleSheet.absoluteFillObject,
        width: width,
        height: height,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 2,
        borderRadius: 10,
    },
    qrText: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white',
        top: boxSize / 2 + 30,
        padding: 8,
        borderRadius: 8,
    },
    qrPermission: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        top: boxSize / 2 + 60,
        padding: 8,
        borderRadius: 8,
    },
    qrPermissionText: {
        color: 'white',
    },
    qrPermissionButton: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#242424',
        lineHeight: 20,
        backgroundColor: '#ABABAB',
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
    },
    qrScanningText: {
        fontSize: 20,
        color: 'white',
    }
});
