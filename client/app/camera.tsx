import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';
import BarcodeMask from 'react-native-barcode-mask';

export default function Camera() {
    const [camPermission, requestCamPermission] = useCameraPermissions(); // 카메라 권한
    const [isScanning, setIsScanning] = useState(false); // 스캔 상태
    const [waiting, setWaiting] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setIsScanning(false);
        }, [])
    );

    // 권한 요청
    useEffect(() => {
        (async () => {
            const { status } = await requestCamPermission();
            if (status == 'denied') {
                Toast.show({
                    type: 'error',
                    text1: '권한 필요',
                    text2: '카메라 권한이 필요합니다. 설정에서 권한을 허용해 주세요.',
                });
            }
        })();
    }, [requestCamPermission]);

    // URL 검사
    function checkURL(url: string) {
        if (url.startsWith('class-manager://')) {
            return true;
        }
        else {
            return false;
        }
    }

    // QR 데이터 처리
    const scan = async (qr: BarcodeScanningResult) => {
        if (waiting || isScanning || !qr.data) {
            return;
        }
        setIsScanning(true);
        setWaiting(true);
        const match = qr.data.match(/class-manager:\/\/entry\/(.+)/);
        if (!checkURL(qr.data) || !match) {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '유효하지 않은 QR 코드입니다.',
            });
            setIsScanning(false);
            // 불필요한 호출을 방지하기 위해 일정 시간 대기
            await new Promise(resolve => setTimeout(resolve, 2000));
            setWaiting(false);
            return;
        }
        const courseId = match[1];

        return router.replace(`/(tabs)/entry/${courseId}`);
    }

    return (
        <View style={styles.container}>
            {camPermission?.granted ? (
                <CameraView
                    style={styles.camera}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={scan}>
                    <BarcodeMask
                        showAnimatedLine={false}
                        width={boxSize}
                        height={boxSize}
                        edgeWidth={30}
                        edgeHeight={30}
                        edgeBorderWidth={6}
                        edgeRadius={2}
                        outerMaskOpacity={0.5}
                    />
                    <View style={styles.qrContainer}>
                        <Text style={styles.qrText}>QR코드를 중앙에 위치시켜주세요</Text>
                    </View>
                    {isScanning && (
                        <View style={styles.qrContainer}>
                            <ActivityIndicator size="large" />
                            <Text>불러오는 중...</Text>
                        </View>
                    )}
                </CameraView>
            ) : (
                <Card style={styles.permissionCard}>
                    <Card.Title title="카메라 권한 필요" />
                    <Card.Content>
                        <Text>QR 코드를 스캔하려면 카메라 권한이 필요합니다.</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button mode="contained" onPress={requestCamPermission}>
                            권한 허용
                        </Button>
                    </Card.Actions>
                </Card>
            )}
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const boxSize = width * 0.6;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
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
    qrText: {
        color: 'white',
        top: boxSize / 2 + 30,
        padding: 8,
        borderRadius: 8,
        fontSize: 16,
        zIndex: 50,
    },
    qrPermission: {
        top: boxSize / 2 + 60,
        padding: 8,
        borderRadius: 8,
    },
    qrPermissionButton: {
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 20,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
    },
    permissionCard: {
        position: 'absolute',
        bottom: 80,
        width: '90%',
        alignSelf: 'center',
    },
});
