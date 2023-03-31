import { Text, View } from 'react-native';
import Modal from './Modal';
import Button from './Button';
import styles from './Styles';

export default function ModalAlert({ icon = '', title = '', message, primary = '', secondary = '', onPressPrimary = null, onPressSecondary = null  }) {
  return (
    <Modal style={[]} visible={!!message}>
      {icon && <View style={[styles.center, styles.margin_sm.y]}>
        {icon}
      </View>}

      {title && <View style={[styles.center, styles.margin_sm.y]}>
        <Text style={[styles.text_lg, styles.fw_bold, styles.text_color_white]}>{title}</Text>
      </View>}

      <Text style={[styles.text_sm, styles.margin_md.y, styles.text_color_white]}>{message}</Text>
        
      {primary && <Button
        onPress = {onPressPrimary}
        style = {[
                styles.button_sm,
                styles.text_color_secondary,
                styles.bg_color_white,
                styles.button_stretch,
                styles.margin_sm.b,
                styles.radius_md,
            ]}
        styleText = {[
            styles.text_color_secondary,
        ]}
        >
          {primary}
      </Button>}
        
      {secondary && <Button
        onPress = {onPressSecondary}
        style = {[
                styles.button_sm,
                styles.text_color_secondary,
                styles.bg_color_white,
                styles.button_stretch,
                styles.margin_sm.b,
                styles.radius_md,
            ]}
        styleText = {[
            styles.text_color_secondary,
        ]}
        >
          {secondary}
      </Button>}
    </Modal>
  );
};
