import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './Styles';
import SVG from './SVG';

export default function DateTime({
  label,
  name,
  value,
  handleChange,
  style = "",
  styleLabel = "",
  styleField = "",
}) {
  const [ showDateTime, setShowDateTime ] = useState(false);

  return (
    <View style={[styles.field, ...styleField]}>
      <Text style={[styles.text_sm, ...styleLabel]}>{label}</Text>
      <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setShowDateTime(true)}>
        <TextInput
          style={[styles.input, ...style, styles.padding_xl.e, styles.text_sm]}
          onChangeText={() => null}
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          editable={false}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.date_icon}
          onPress={() => setShowDateTime(true)}>
            <SVG
              d="M14.5 2H13V1h-1v1H4V1H3v1H1.5l-.5.5v12l.5.5h13l.5-.5v-12l-.5-.5zM14 14H2V5h12v9zm0-10H2V3h12v1zM4 8H3v1h1V8zm-1 2h1v1H3v-1zm1 2H3v1h1v-1zm2-4h1v1H6V8zm1 2H6v1h1v-1zm-1 2h1v1H6v-1zm1-6H6v1h1V6zm2 2h1v1H9V8zm1 2H9v1h1v-1zm-1 2h1v1H9v-1zm1-6H9v1h1V6zm2 2h1v1h-1V8zm1 2h-1v1h1v-1zm-1-4h1v1h-1V6z"
              />
        </TouchableOpacity>
      </TouchableOpacity>
        
      {showDateTime && <DateTimePicker
        testID="dateTimePicker"
        value={value ? new Date(value) : new Date()}
        mode="date"
        is24Hour={true}
        onChange={(event, selectedDate) => { handleChange(name, event, selectedDate); setShowDateTime(false); }}
      />}
    </View>
  );
}
