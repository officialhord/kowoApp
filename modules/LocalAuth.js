import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import Modal from './Modal';
import Loader from './Loader';
import styles from './Styles';

export default function LocalAuth({ login, show, processing = false }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const compatible = (hasHardware && isEnrolled);
      setIsBiometricSupported(compatible);
    })();
  });

  const handleBiometricAuth = async () => {
    const authenticate = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Login with Biometrics',
        });
    login(authenticate.success);
  }

  if(processing) {
    return (
      <Modal style={[styles.activity]} visible={processing}>
        <Loader />
      </Modal>
    );
  }

  return (
    (show && isBiometricSupported) &&
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => handleBiometricAuth()}
        disabled={processing}
        >
          <Image
            style={[styles.center, styles.margin_lg.b, {width: 50, height: 50}]}
            source={require('../assets/illustrations/biometric.png')}
            resizeMode="contain"
          />
      </TouchableOpacity>
  );
}