import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions(); // 카메라 권한
    const [isScanning, setIsScanning] = useState(false); // 스캔 상태

    // state 초기화
    useFocusEffect(
        useCallback(() => {
            setIsScanning(false);
        }, [])
    );

    // URL 검사
    function checkURL(url: string) {
        console.log("check");
        return true;
        if (url != "test") {
            return false;
        }
    }

    // QR 데이터 처리
    function scan(qr: BarcodeScanningResult) {
        if (isScanning || !checkURL(qr.data)) {
            return;
        }
        setIsScanning(true);
        console.log(qr.data);

        router.navigate({
            pathname: '/scan',
            params: {
                data: qr.data
            }
        });
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
                    {permission && permission.granted ?
                        (<Text style={styles.qrText}>QR코드를 중앙에 위치시켜주세요</Text>) :
                        (<View style={styles.qrPermission}>
                            <Text style={styles.qrPermissionText}>카메라 권한이 필요합니다.</Text>
                            <Pressable onPress={requestPermission}>
                                <Text style={styles.qrPermissionButton}>권한 허용</Text>
                            </Pressable>
                        </View>)
                    }
                </View>
                {isScanning && (
                    <View style={styles.qrContainer}>
                        <View style={styles.qrBlock} />
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const { width } = Dimensions.get('window');
const boxSize = width * 0.6;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
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
        width: boxSize,
        height: boxSize,
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
    }
});
