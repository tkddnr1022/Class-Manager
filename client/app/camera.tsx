import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useForegroundPermissions, getCurrentPositionAsync } from 'expo-location';
import * as Application from 'expo-application';
import { createEntry } from '@/scripts/api/entry';
import Toast from 'react-native-toast-message';
import eventEmitter from '@/scripts/utils/eventEmitter';

export default function Camera() {
    const [camPermission, requestCamPermission] = useCameraPermissions(); // 카메라 권한
    const [locPermission, requestLocPermission] = useForegroundPermissions(); // 위치 권한
    const [isScanning, setIsScanning] = useState(false); // 스캔 상태

    // state 초기화
    useFocusEffect(
        useCallback(() => {
            setIsScanning(false);
        }, [])
    );

    // 최초 권한 요청
    useEffect(() => {
        requestPermission();
    }, []);

    // URL 검사
    function checkURL(url: string) {
        console.log("check");
        return true;
        if (url != "test") {
            return false;
        }
    }

    // 권한 요청
    async function requestPermission() {
        // Todo: 권한 거부 시 동작 구현
        await requestCamPermission();
        await requestLocPermission();
    }

    // QR 데이터 처리
    async function scan(qr: BarcodeScanningResult) {
        if (!locPermission?.granted || isScanning) {
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
        const { latitude, longitude } = (await getCurrentPositionAsync()).coords;
        const location = { lat: latitude, lon: longitude };
        let deviceId = null;

        if (Platform.OS === 'android') {
            deviceId = Application.getAndroidId();
        } else if (Platform.OS === 'ios') {
            deviceId = await Application.getIosIdForVendorAsync();
        }
        if (!deviceId) {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '디바이스 ID를 가져올 수 없습니다.',
            });
            return router.back();
        }

        console.log(`courseId: ${courseId}, latitude: ${latitude}, longitude: ${longitude}, deviceId: ${deviceId}`);

        const result = await createEntry({ courseId, location, deviceId });
        if (result == 'success') {
            Toast.show({
                type: 'success',
                text1: '출석 완료',
                text2: '출석이 정상적으로 완료되었습니다.',
            });
            eventEmitter.emit('refresh_entry');
            return router.replace('/(tabs)/entry');
        }
        else if (result == 'ERROR_USER_ID') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '이미 출석한 수업입니다.',
            });
        }
        else if (result == 'ERROR_DEVICE_ID') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '디바이스 ID 중복 오류',
            });
        }
        else if (result == 'ERROR_LOCATION_RANGE') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '출석 위치 범위 밖입니다.',
            });
        }
        else if (result == 'ERROR_START_TIME' || result == 'ERROR_END_TIME') {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: '출석 가능한 시간이 아닙니다.',
            });
        }
        else {
            Toast.show({
                type: 'error',
                text1: '출석 실패',
                text2: result,
            });
        }
        return router.back();
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
                    {camPermission?.granted && locPermission?.granted ?
                        (<Text style={styles.qrText}>QR코드를 중앙에 위치시켜주세요</Text>) :
                        (<View style={styles.qrPermission}>
                            <Text style={styles.qrPermissionText}>앱 권한이 필요합니다.</Text>
                            <Pressable onPress={requestPermission}>
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
