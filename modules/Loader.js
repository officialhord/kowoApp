import { Text, ActivityIndicator } from 'react-native';
import styles from './Styles';

export default function Loader() {
  return (
    <>
      <ActivityIndicator size="large" color="#FFF" />
      <Text style={[styles.text_xl, styles.text_color_white, {marginTop: 3}]}>   Loading...</Text>
    </>
  );
};
