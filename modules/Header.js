import { View, Text } from 'react-native';
import styles, { color } from './Styles';

export default function Header({ start = "", center = "", end = "", styleHeader = ""}) {

  return (
    <View style={[styles.header, ...styleHeader]}>
      <View style={styles.start}>{start}</View>
      <View style={[styles.center, { marginLeft: -15 }]}>{center}</View>
      <View style={styles.end}>{end}</View>
    </View>
  );
}
