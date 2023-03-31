import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles';
import SVG from './SVG';

export default function BackButton({ icon = "arrow-left", onPress = null, style = "", fill = "#000", navigation = {navigation} }) {
  if(icon === "arrow-left") {
    var back = <SVG style={[styles.margin_lg.y]} fill={fill} width={20} height={20} d="M6.7 11.275C6.9 11.075 6.996 10.8334 6.988 10.55C6.97933 10.2667 6.875 10.025 6.675 9.82505L3.85 7.00005H15C15.2833 7.00005 15.521 6.90405 15.713 6.71205C15.9043 6.52072 16 6.28338 16 6.00005C16 5.71672 15.9043 5.47905 15.713 5.28705C15.521 5.09572 15.2833 5.00005 15 5.00005H3.85L6.7 2.15005C6.9 1.95005 7 1.71238 7 1.43705C7 1.16238 6.9 0.925049 6.7 0.725049C6.5 0.525049 6.26233 0.425049 5.987 0.425049C5.71233 0.425049 5.475 0.525049 5.275 0.725049L0.700001 5.30005C0.6 5.40005 0.528999 5.50838 0.487 5.62505C0.445666 5.74172 0.424999 5.86672 0.424999 6.00005C0.424999 6.13338 0.445666 6.25838 0.487 6.37505C0.528999 6.49172 0.6 6.60005 0.700001 6.70005L5.3 11.3C5.48333 11.4834 5.71233 11.575 5.987 11.575C6.26233 11.575 6.5 11.475 6.7 11.275Z" />;
  } else if(icon === "close") {
    var back = <SVG style={[styles.margin_lg.y]} fill={fill} width={30} height={30} d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z" />;
  }  else {
    var back = <SVG style={[styles.margin_lg.y]} fill={fill} width={30} height={30} d={icon} />;
  }

  return (
    <View style={[...style]}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => onPress ?? navigation.goBack()}>
        {back}
      </TouchableOpacity>
    </View>
  );
}
