import { View, Modal } from 'react-native';
import styles from './Styles';

export default function Modals({ children, style = "", visible = false }) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        >
        <View style={styles.modalBody}>
          <View style={[styles.modalView, ...style]}>
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
};
