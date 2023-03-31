import { useState } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import styles from './Styles';
import Header from './Header';
import BackButton from './BackButton';
import ModalAlert from './ModalAlert';
import { Warning } from './Icon';

export default function ForgotPassword({ navigation }) {
  const [ data, setData ] = useState({
    email: '',
    reset: true,
  });
  const [ error, setError ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
  const submit = () => {
    setProcessing(true);
    if (!data.email) {
      var errorMessage = () => {
        return 'Please enter your Email Address';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else if(!(/\S+@\S+\.\S+/.test(data.email))) {
      var errorMessage = () => {
        return 'Please enter a valid Email Address';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else {
      //
    }
    if(data.email) {
      axios
        .post('https://kintrust-api.herokuapp.com/useraccess/send-verification', {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        //console.log(response.data);
        if (response.status === 200) {
          if(response.data.requestResponse === "Token Sent") {
            navigation.navigate('Verify', data);
          } else {
            setError(response.data.requestResponse);
          }
        }
        return setProcessing(false);
      })
      .catch(error => {
        //console.error(error);
        setError('Network Error!');
        return setProcessing(false);
      });
    }
  };

  return (<>
    <Header
      start={<BackButton icon = "close" navigation={navigation} />}
      center={<Text style={[styles.text_md, styles.fw_bold]}></Text>}
      end={<Text style={styles.text_sm}></Text>}
      styleHeader={[styles.padding_md.x, styles.padding_lg.t]}
      />

    <ScrollView
      //stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}>

      <View style={[styles.center, styles.margin_xl.b]}>
        <Image
          style={styles.margin_sm}
          source={require('../assets/illustrations/forgot-password.png')}
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.text_sm, styles.text_color_primary, styles.fw_bold]}>
        Forgot Password? 
      </Text>

      <View style={[styles.form]}>
        <Input
          label="It’s okay! reset your password"
          styleLabel={[styles.text_xs, styles.margin_sm.y]}
          placeholder="Email Address"
          name="email"
          style={[styles.text_sm, styles.bg_color_white, styles.border_width_s, styles.border_color_gray]}
          value={data.email}
          handleChange={onHandleChange}
        />
        
        <Button
          onPress = {() => submit()}
          processing={processing}
          style = {[
                  styles.button_md,
                  styles.text_color_primary,
                  styles.bg_color_secondary,
                  styles.button_stretch,
                  styles.margin_xl.b,
              ]}
          styleText = {[
              styles.text_color_primary,
          ]}
          >
              Continue
        </Button>

        <ModalAlert
          icon={<Warning />}
          title="Error!"
          message={error}
          primary="Okay"
          onPressPrimary={() => setError('')}
          />
        
      </View>
      
    </ScrollView>
  </>);
}
