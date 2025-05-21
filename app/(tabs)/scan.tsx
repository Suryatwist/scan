import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { RefreshCw, Upload, Camera as CameraIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { analyzeFood } from '@/services/foodRecognitionService';
import { getBarcodeFood } from '@/services/barcodeService';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import CameraControls from '@/components/scan/CameraControls';

export default function ScanScreen() {
  const [type, setType] = useState<CameraType>('back');
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<Camera>(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      requestCameraPermission();
    }
  }, []);

  if (!permission?.granted && Platform.OS !== 'web') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setAnalyzing(true);
    
    try {
      const food = await getBarcodeFood(data);
      if (food) {
        router.push({
          pathname: '/food-details',
          params: { foodId: food.id }
        });
      } else {
        Alert.alert('Not Found', 'This barcode doesn\'t match any food in our database.');
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      Alert.alert('Error', 'Failed to scan barcode. Please try again.');
    } finally {
      setAnalyzing(false);
      setScanned(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setAnalyzing(true);
        const photo = await cameraRef.current.takePictureAsync();
        await processImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        setAnalyzing(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setAnalyzing(true);
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      const food = await analyzeFood(imageUri);
      router.push({
        pathname: '/food-details',
        params: { foodId: food.id }
      });
    } catch (error) {
      console.error('Error analyzing food:', error);
      Alert.alert('Error', 'Failed to analyze food. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webText}>Camera functionality is not available on web.</Text>
        <TouchableOpacity style={styles.webButton} onPress={pickImage}>
          <Upload size={24} color={Colors.white} />
          <Text style={styles.webButtonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [
            BarCodeScanner.Constants.BarCodeType.upc_a,
            BarCodeScanner.Constants.BarCodeType.upc_e,
            BarCodeScanner.Constants.BarCodeType.ean13,
            BarCodeScanner.Constants.BarCodeType.ean8,
          ],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          
          <Text style={styles.instructionText}>
            Point camera at food or scan barcode
          </Text>

          <CameraControls 
            onTakePicture={takePicture}
            onPickImage={pickImage}
            onFlipCamera={toggleCameraType}
            disabled={analyzing}
          />
        </View>
      </Camera>

      {analyzing && <LoadingOverlay message="Analyzing your food..." />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 20,
    marginTop: 60,
  },
  instructionText: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  webText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  webButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
});