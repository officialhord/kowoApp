import { useState } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import styles from './Styles';
import Header from './Header';
import BackButton from './BackButton';
import ModalAlert from './ModalAlert';
import { Success, Warning } from './Icon';

export default function ResetPassword({ route, navigation }) {
  const { email, reset } = route.params;
  const [ data, setData ] = useState({
    email: email,
    password: '',
    cpassword: '',
    reset: reset,
  });
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
  const submit = () => {
    setProcessing(true);
    if (!data.password) {
      var errorMessage = () => {
        if(!data.password) { return 'Please enter your Password' };
        if(!data.cpassword) { return 'Please enter your Confirm Password' };
      }
      setError(errorMessage);
      return setProcessing(false);
    } else if(!(data.password === data.cpassword)) {
      var errorMessage = () => {
        return 'Your Password Confirmation does not match your Password';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else {
      //
    }
    if(data.email) {
      axios
        .post('https://kintrust-api.herokuapp.com/useraccess/reset-password', {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        //console.log(response.data);
        if (response.status === 200) {
          if(response.data.requestResponse === "Password Reset Successful") {
            setSuccess('Your password reset was successful! Now login with your new password');
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
          source={require('../assets/illustrations/reset-password.png')}
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.text_sm, styles.text_color_primary, styles.fw_bold, styles.center]}>
        Reset your password
      </Text>
      <Text style={[styles.text_sm, styles.center, styles.margin_md.y]}>
        Enter your new password and confirm
      </Text>

      <View style={[styles.form]}>
        
        <Input
          label="Password"
          name="password"
          value={data.password}
          handleChange={onHandleChange}
          type="password"
          secureTextEntry={true}
          styleField={[styles.margin_md.b]}
        />
        
        <Input
          label="Confirm Password"
          name="cpassword"
          value={data.cpassword}
          handleChange={onHandleChange}
          type="password"
          secureTextEntry={true}
          styleField={[styles.margin_md.b]}
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
              Reset Password
        </Button>

        <ModalAlert
          icon={<Warning />}
          title="Error!"
          message={error}
          primary="Okay"
          onPressPrimary={() => setError('')}
          />

        <ModalAlert
          icon={<Success />}
          title="Success!"
          message={success}
          primary="Login"
          onPressPrimary={() => {setSuccess(''); navigation.navigate('Login');}}
          />
        
      </View>
      
    </ScrollView>
  </>);
}
