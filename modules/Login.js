import { useEffect, useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Input from './Input';
import Button from './Button';
import styles from './Styles';
import Header from './Header';
import ModalAlert from './ModalAlert';
import { Success, Error } from './Icon';
import { AppContext } from './Context';
import LocalAuth from './LocalAuth';
import APIs from './APIs';
import { setLocalData, getLocalData } from './Storage';

export default function Login({ navigation }) {
  const { readFromStorage } = useContext(AppContext);
  const [ data, setData ] = useState({
    email: '',
    password: '',
  });
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ verify, setVerify ] = useState(false);
  const [ processing, setProcessing ] = useState(false);
  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
const urlData = APIs.baseURL;

  const submit = (data) => {
    setProcessing(true);
    if (!data.email || !data.password) {
      var errorMessage = () => {
        if (!data.email && !data.password) { return 'Please enter your Email Address and Password' };
        if(!data.email) { return 'Please enter your Email Address' };
        if(!data.password) { return 'Please enter your Password' };
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
    if(data.email && data.password) {
      axios
        .post(`${urlData}useraccess/login`, {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          if(response.data.requestResponse.enabled) {
            setLocalData('auth', data);
            setLocalData('token', response.data.requestResponse.authentication);
            setLocalData('status', 'true');
            setLocalData('user', response.data.requestResponse);
            setSuccess(response.data.requestResponse.statusDescription);
            readFromStorage();
          } else if((!(response.data.requestResponse.enabled)) && (response.data.requestResponse.statusDescription === 'User not Verified')) {
            setVerify(true);
            setError(response.data.requestResponse.statusDescription);
          } else {
            setVerify(false);
            setError(response.data.requestResponse.statusDescription);
          }
        }
        return setProcessing(false);
      })
      .catch(error => {
        console.error(error);
        setError('Network Error!');
        return setProcessing(false);
      });
    }
  };
  
  const reSendOtp = () => {
    setProcessing(true);
    if(data.email && data.password) {
      axios
        .post(`${urlData}useraccess/send-verification`, {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        //console.log(response.data);
        if (response.status === 200) {
          setVerify(false);
          setError('');
          navigation.navigate('Verify', data);
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

  const [ authData, setAuthData ] = useState(null);
  const [ localAuthentication, setLocalAuthentication ] = useState(false);
  useEffect(() => {
    if(localAuthentication) {
      setData(authData);
      submit(authData);
    }
  }, [ localAuthentication ]);

  const [ showBiometrics, setShowBiometrics ] = useState(false);
  const handleBiometrics = async () => {
    const auth = await getLocalData('auth');
    if(!(auth === null)) {
      setAuthData(auth);
      setShowBiometrics(true);
    }
  };
  useState(() => {
    handleBiometrics();
  }, []);

  return (<>
    <Header
      center={<Image
        style={[styles.radius_lg, styles.bg_color_secondary, {width: 200, height: 200}]}
        source={require('../assets/illustrations/logo-white.png')}
        resizeMode="contain"
      />}
      styleHeader={[styles.bg_color_secondary, styles.text_color_white, styles.header_rounded]}
      />

    <ScrollView
      //stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={[styles.container]}>

      <View style={[styles.margin_md.b]}>
        
        <Text style={[styles.center, styles.text_lg, styles.fw_bolder, styles.margin_md.b]}>Login</Text>

        <View style={[styles.form]}>
          <Input
            label="Email Address"
            name="email"
            value={data.email}
            handleChange={onHandleChange}
          />
          
          <Input
            label="Password"
            name="password"
            value={data.password}
            handleChange={onHandleChange}
            type="password"
            secureTextEntry={true}
            styleField={[styles.margin_sm.b]}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.end, styles.margin_xl.b]}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.text_sm]}>Forgot Password</Text>
          </TouchableOpacity>

          <LocalAuth login={setLocalAuthentication} show={showBiometrics} />
          
          <Button
            onPress = {() => submit(data)}
            processing={processing}
            style = {[
                    styles.button_md,
                    styles.text_color_primary,
                    styles.bg_color_secondary,
                    styles.button_stretch,
                    styles.margin_sm.b,
                ]}
            styleText = {[
                styles.text_color_primary,
            ]}
            >
                Sign In
          </Button>

          <ModalAlert
            icon={<Error />}
            title="Error!"
            message={error}
            primary={!verify ? "Okay" : "Send Verification"}
            onPressPrimary={() => {!verify ? setError('') : reSendOtp()} }
            />

          <ModalAlert
            icon={<Success />}
            title="Success!"
            message={success}
            primary="Go to Dashboard"
            onPressPrimary={() => {setSuccess(''); readFromStorage();} }
            />

          
          <View style={[styles.bars, styles.center]}>
            <Text style={[styles.text_xs, styles.center, styles.margin_md.y, styles.margin_sm.e]}>
              Don’t have an account? 
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.text_xs, styles.text_color_primary]}>Create Account</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        
      </View>

    </ScrollView>
  </>);
}
