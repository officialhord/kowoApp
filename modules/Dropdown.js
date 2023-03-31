import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import ModalBottom from './ModalBottom';
import styles, { color } from './Styles';
import SVG from './SVG';

export default function Dropdown({
  label,
  title,
  name,
  value,
  options = [],
  handleChange,
  style = "",
  styleLabel = "",
  styleField = "",
}) {
  const [ showDropdown, setShowDropdown ] = useState(false);

  return (
    <View style={[styles.field, ...styleField]}>
      <Text style={[styles.text_sm, ...styleLabel]}>{label}</Text>
      <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setShowDropdown(true)}>
        <TextInput
          style={[styles.input, ...style, styles.padding_xl.e, styles.text_sm]}
          onChangeText={() => null}
          value={options.find(x => x.value == value) ? options.find(x => x.value == value).name : ''}
          editable={false}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.date_icon}
          onPress={() => setShowDropdown(true)}>
            <SVG
              d="M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z"
              />
        </TouchableOpacity>
      </TouchableOpacity>
        
      <ModalBottom visible={showDropdown} onDismiss={() => setShowDropdown(false)}>
          <Text style={[styles.text_sm, styles.text_color_white, styles.fw_bold]}>{title}</Text>

          <View style={[styles.row, {flexWrap:'wrap', marginVertical: 0}]}>
          {(options.length > 0) && options.map((option, index) => 
            <TouchableOpacity onPress={(event) => { handleChange(event, name, option.value); setShowDropdown(false); }} key={index}>
              <View style={[styles.margin_sm.xy, styles.radius_xl, styles.padding_xs.y, styles.padding_md.x, {backgroundColor: '#262626'}]}>
                  <Text style={[styles.text_sm, styles.center, styles.text_color_white, {marginTop: 3}]}>{option.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          </View>

      </ModalBottom>

    </View>
  );
}
