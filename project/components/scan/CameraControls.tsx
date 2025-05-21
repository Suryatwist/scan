import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, Image, RefreshCw } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Props {
  onTakePicture: () => void;
  onPickImage: () => void;
  onFlipCamera: () => void;
  disabled: boolean;
}

export default function CameraControls({ onTakePicture, onPickImage, onFlipCamera, disabled }: Props) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity 
        style={styles.controlButton} 
        onPress={onPickImage}
        disabled={disabled}
      >
        <Image size={24} color={Colors.white} />
        <Text style={styles.controlText}>Gallery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.captureButton} 
        onPress={onTakePicture}
        disabled={disabled}
      >
        <View style={styles.captureInner} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.controlButton} 
        onPress={onFlipCamera}
        disabled={disabled}
      >
        <RefreshCw size={24} color={Colors.white} />
        <Text style={styles.controlText}>Flip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray[300],
  },
});