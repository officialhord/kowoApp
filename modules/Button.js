import { TouchableOpacity, Text } from 'react-native';
import Modal from './Modal';
import Loader from './Loader';
import styles from './Styles';

export default function Button({ icon = "", onPress, children, style = "", styleText = "", processing = false }) {
  if(processing) {
    return (
      <Modal style={[styles.activity]} visible={processing}>
        <Loader />
      </Modal>
    );
  }

  return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={[...style]}
        onPress={onPress}
        disabled={processing}
        >
          {icon}
          <Text
            style={[styles.text_sm, ...styleText]}
            >
              {children}
          </Text>
      </TouchableOpacity>
  );
}