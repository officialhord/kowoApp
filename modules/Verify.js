import { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import styles from './Styles';
import Header from './Header';
import BackButton from './BackButton';
import ModalAlert from './ModalAlert';
import { Success, Warning } from './Icon';
import InputOtp from './InputOtp';
import { AppContext } from './Context';
import { setLocalData, getLocalData } from './Storage';

export default function Verify({ route, navigation }) {
  const { readFromStorage } = useContext(AppContext);
  const { email, password = '', reset = null, } = route.params;
  const [ data, setData ] = useState({
    email: email,
    password: password,
    tokenValue: '',
  });
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  const [ otpReady, setOtpReady ] = useState(false);
  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
  const submit = () => {
    setProcessing(true);
    if (!(data.tokenValue.length === 5)) {
      var errorMessage = () => {
        return 'Please enter complete OTP Code';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else {
      //
    }
    if(data.email && data.tokenValue) {
      axios
        .post('https://kintrust-api.herokuapp.com/useraccess/verify-user', {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        //console.log(response.data);
        if (response.status === 200) {
          setLocalData('auth', data);
          if(response.data.requestResponse.verified && !reset) {
            setLocalData('token', response.data.requestResponse.authentication);
            setLocalData('status', 'true');
            setLocalData('user', response.data.requestResponse);
            setSuccess('Yipee! You have successfully verified your account.');
          } else if(response.data.requestResponse.verified && reset) {
            navigation.navigate('ResetPassword', data);
          } else {
            setError(response.data.requestResponse.description);
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
  
  const reSendOtp = () => {
    setProcessing(true);
    if(data.email && data.password) {
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
          setReSendTime((5 * 60));
          setSuccess(response.data.requestResponse.description);
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
  
  const [reSendTime, setReSendTime] = useState((5 * 60));
  useEffect(() => {
      const interval = setInterval(() => {
          if (reSendTime === 0) {
              clearInterval(interval);
          } else {
              setReSendTime(reSendTime - 1);
          }
      }, 1000);
      
      return () => {
          clearInterval(interval);
      };
  }, [reSendTime]);
  var showReSendTime = () => {
      var minutes = parseInt(reSendTime / 60);
      var seconds = reSendTime % 60;
      var result = minutes + ':' + seconds;
      return result;
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
          source={require('../assets/illustrations/verify.png')}
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.text_sm, styles.text_color_primary, styles.fw_bold]}>
        Email Verification 
      </Text>

      <View style={[styles.form]}>

        <InputOtp
          label="Enter the verification code sent to your email. Code expires in 5 minutes"
          styleLabel={[styles.text_xs, styles.margin_sm.y]}
          style={[styles.text_md, styles.border_color_primary]}
          name="tokenValue"
          code={data.tokenValue}
          setCode={onHandleChange}
          setOtpReady={setOtpReady}
        />
        
        <View style={[styles.space_between]}>
          <Text style={[styles.text_xs]}>
            Enter Code
          </Text>
          <Text style={[styles.text_xs]}>
            {showReSendTime()}
          </Text>
        </View>
        
        <View style={[styles.bars, styles.center]}>
          <Text style={[styles.text_sm, styles.center, styles.margin_xs.y, styles.margin_sm.e]}>
            Didn’t receive the code? 
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => reSendOtp()}
            disabled={!(reSendTime === 0)}>
            <Text style={[styles.text_sm, styles.text_color_primary]}>Resend</Text>
          </TouchableOpacity>
        </View>
        
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
              Verify Email
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
          title="Verified!"
          message={success}
          primary="Go to Dashboard"
          onPressPrimary={() => {setSuccess(''); readFromStorage();}}
          />
        
      </View>
      
    </ScrollView>
  </>);
}
