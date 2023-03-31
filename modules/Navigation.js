import { useRef, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppContext } from './Context';
import API from './API';
import APIs from './APIs';
import { getAllKeys, getLocalData, delLocalData, setLocalData } from './Storage';
import styles, { color } from './Styles';
import SVG from './SVG';
import Onboarding from './Onboarding';
import Login from './Login';
import Verify from './Verify';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ComingSoon from './ComingSoon';
import Dashboard from './Dashboard';
import Wallet from './Wallet';
import CreateAccount from './CreateAccount';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Index() {
  const [ token, setToken ] = useState(null);
  const [ status, setStatus ] = useState(false);
  const [ data, setData ] = useState({});
  
  const readFromStorage = async () => {
    const token = await getLocalData('token');
    setToken(token);
    const status = await getLocalData('status');
    setStatus(status);
    const user = await getLocalData('user');
    const accounts = await getLocalData('accounts');
    const transactions = await getLocalData('transactions');
    setData({...data, token: token, user: user, accounts: accounts, transactions: transactions});
    //const all = await getAllKeys();
    //console.log(all);
  console.log(accounts);
  };
  console.log(data);
  //console.log(token);
  
  useEffect(() => {
    readFromStorage();
  }, [status]);
  
  useEffect(() => {
    if(token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, [token]);

  /* useEffect(() => {
    if(token) {
      APIs.User()
      .then(response => {
        if (response.status === 200) {
          setData(response.data)
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [token]); */

  const [ timeout, setTimeout ] = useState(null);

  const readTimeout = async () => {
    const timestamp = await getLocalData('timestamp');
    setTimeout(timestamp);
  }

  const resetTimeout = () => {
    var timestamp = new Date();
    setLocalData('timestamp', timestamp);
    setTimeout(timestamp);
  }

  const logoutTimeout = () => {
    if(timeout) {
      var currentTimestamp = new Date();
      var newTimestamp = new Date(timeout);
      newTimestamp.setTime(newTimestamp.getTime() + (10 * 60 * 1000));
      if( newTimestamp < currentTimestamp ) {
        delLocalData('status');
        readFromStorage();
      }
      /* console.log('( newTimestamp < currentTimestamp ): ' + ( newTimestamp < currentTimestamp ));
      console.log('currentTimestamp: ' + currentTimestamp);
      console.log('newTimestamp: ' + newTimestamp); */
    }
  }
  
  useEffect(() => {
      const interval = setInterval(() => {
        logoutTimeout();
      }, 1000);
      
      return () => {
        clearInterval(interval);
      };
  }, [timeout]);
  
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    readTimeout();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      //console.log('AppState', appState.current);
      if (!(appState.current === 'active')) {
        resetTimeout();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);



  return (
    <AppContext.Provider value={{ appData: data, readFromStorage: () => readFromStorage(), resetTimeout: () => resetTimeout(), }}>
      <NavigationContainer>
        {(token && status) ? 
          <Tab.Navigator
              initialRouteName="Home"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { height: 60, backgroundColor: color.secondary, paddingTop: 10, paddingBottom: 5 },
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused
                      ? 'M12 26.4V17.0824H18V26.4H25.5V13.9765H30L15 0L0 13.9765H4.5V26.4H12Z'
                      : 'M12 26.4V17.0824H18V26.4H25.5V13.9765H30L15 0L0 13.9765H4.5V26.4H12Z';
                  } else if (route.name === 'Ajo') {
                    iconName = 'M10.2273 9.45946L8.72727 6.21622L5.45455 4.72973L8.72727 3.24324L10.2273 0L11.7273 3.24324L15 4.72973L11.7273 6.21622L10.2273 9.45946ZM19.0909 13.5135L17.7955 10.7432L15 9.45946L17.7955 8.17568L19.0909 5.40541L20.3864 8.17568L23.1818 9.45946L20.3864 10.7432L19.0909 13.5135ZM4.09091 16.2162L2.79545 13.4459L0 12.1622L2.79545 10.8784L4.09091 8.10811L5.38636 10.8784L8.18182 12.1622L5.38636 13.4459L4.09091 16.2162ZM4.77273 25L2.72727 22.973L12.9545 12.8378L18.4091 18.2432L28.0909 7.46622L30 9.35811L18.4091 22.2973L12.9545 16.8919L4.77273 25Z';
                  } else if (route.name === 'Accounts') {
                    iconName = 'M25.9091 0H12.2727C11.1878 0 10.1472 0.431005 9.38002 1.1982C8.61282 1.96539 8.18182 3.00593 8.18182 4.09091V13.6364C8.18182 14.7213 8.61282 15.7619 9.38002 16.5291C10.1472 17.2963 11.1878 17.7273 12.2727 17.7273H25.9091C26.9941 17.7273 28.0346 17.2963 28.8018 16.5291C29.569 15.7619 30 14.7213 30 13.6364V4.09091C30 3.00593 29.569 1.96539 28.8018 1.1982C28.0346 0.431005 26.9941 0 25.9091 0ZM27.2727 13.6364C27.2727 13.998 27.1291 14.3449 26.8733 14.6006C26.6176 14.8563 26.2707 15 25.9091 15H12.2727C11.9111 15 11.5642 14.8563 11.3085 14.6006C11.0528 14.3449 10.9091 13.998 10.9091 13.6364V4.09091C10.9091 3.72925 11.0528 3.3824 11.3085 3.12667C11.5642 2.87094 11.9111 2.72727 12.2727 2.72727H25.9091C26.2707 2.72727 26.6176 2.87094 26.8733 3.12667C27.1291 3.3824 27.2727 3.72925 27.2727 4.09091V13.6364ZM22.5 8.18182C21.9952 8.18353 21.5091 8.37311 21.1364 8.71364C20.8431 8.44712 20.4788 8.2715 20.0877 8.20814C19.6965 8.14478 19.2954 8.19639 18.933 8.35671C18.5706 8.51703 18.2626 8.77916 18.0464 9.11123C17.8302 9.4433 17.7151 9.83102 17.7151 10.2273C17.7151 10.6235 17.8302 11.0112 18.0464 11.3433C18.2626 11.6754 18.5706 11.9375 18.933 12.0978C19.2954 12.2582 19.6965 12.3098 20.0877 12.2464C20.4788 12.183 20.8431 12.0074 21.1364 11.7409C21.3826 11.9647 21.6798 12.1251 22.002 12.2081C22.3242 12.2911 22.6619 12.2942 22.9856 12.2171C23.3093 12.1401 23.6094 11.9853 23.8597 11.766C24.11 11.5468 24.3031 11.2698 24.4222 10.9591C24.5412 10.6483 24.5827 10.3132 24.5429 9.98285C24.5032 9.65248 24.3834 9.33678 24.194 9.06316C24.0046 8.78954 23.7514 8.56626 23.4562 8.41268C23.161 8.25909 22.8328 8.17985 22.5 8.18182V8.18182ZM20.4545 20.4545C20.0929 20.4545 19.746 20.5982 19.4903 20.8539C19.2346 21.1097 19.0909 21.4565 19.0909 21.8182V23.1818C19.0909 23.5435 18.9472 23.8903 18.6915 24.1461C18.4358 24.4018 18.0889 24.5455 17.7273 24.5455H4.09091C3.72925 24.5455 3.3824 24.4018 3.12667 24.1461C2.87094 23.8903 2.72727 23.5435 2.72727 23.1818V17.7273H4.09091C4.45257 17.7273 4.79941 17.5836 5.05515 17.3279C5.31088 17.0721 5.45455 16.7253 5.45455 16.3636C5.45455 16.002 5.31088 15.6551 5.05515 15.3994C4.79941 15.1437 4.45257 15 4.09091 15H2.72727V13.6364C2.72727 13.2747 2.87094 12.9279 3.12667 12.6721C3.3824 12.4164 3.72925 12.2727 4.09091 12.2727C4.45257 12.2727 4.79941 12.1291 5.05515 11.8733C5.31088 11.6176 5.45455 11.2707 5.45455 10.9091C5.45455 10.5474 5.31088 10.2006 5.05515 9.94485C4.79941 9.68912 4.45257 9.54545 4.09091 9.54545C3.00593 9.54545 1.96539 9.97646 1.1982 10.7437C0.431005 11.5108 0 12.5514 0 13.6364V23.1818C0 24.2668 0.431005 25.3073 1.1982 26.0745C1.96539 26.8417 3.00593 27.2727 4.09091 27.2727H17.7273C18.8122 27.2727 19.8528 26.8417 20.62 26.0745C21.3872 25.3073 21.8182 24.2668 21.8182 23.1818V21.8182C21.8182 21.4565 21.6745 21.1097 21.4188 20.8539C21.1631 20.5982 20.8162 20.4545 20.4545 20.4545ZM6.81818 21.8182H8.18182C8.54348 21.8182 8.89032 21.6745 9.14605 21.4188C9.40179 21.1631 9.54545 20.8162 9.54545 20.4545C9.54545 20.0929 9.40179 19.746 9.14605 19.4903C8.89032 19.2346 8.54348 19.0909 8.18182 19.0909H6.81818C6.45652 19.0909 6.10968 19.2346 5.85395 19.4903C5.59821 19.746 5.45455 20.0929 5.45455 20.4545C5.45455 20.8162 5.59821 21.1631 5.85395 21.4188C6.10968 21.6745 6.45652 21.8182 6.81818 21.8182Z';
                  } else if (route.name === 'More') {
                    iconName = 'M1.875 1.01146e-06C1.50416 1.01146e-06 1.14165 0.109968 0.833307 0.315996C0.524965 0.522023 0.284641 0.814858 0.142727 1.15747C0.000812411 1.50008 -0.0363188 1.87708 0.0360284 2.2408C0.108376 2.60451 0.286952 2.9386 0.549176 3.20083C0.811399 3.46305 1.14549 3.64163 1.50921 3.71397C1.87292 3.78632 2.24992 3.74919 2.59253 3.60727C2.93514 3.46536 3.22798 3.22504 3.43401 2.91669C3.64003 2.60835 3.75 2.24584 3.75 1.875C3.75 1.37772 3.55246 0.900806 3.20083 0.549176C2.8492 0.197545 2.37228 1.01146e-06 1.875 1.01146e-06V1.01146e-06ZM12.5 1.01146e-06C12.1292 1.01146e-06 11.7666 0.109968 11.4583 0.315996C11.15 0.522023 10.9096 0.814858 10.7677 1.15747C10.6258 1.50008 10.5887 1.87708 10.661 2.2408C10.7334 2.60451 10.912 2.9386 11.1742 3.20083C11.4364 3.46305 11.7705 3.64163 12.1342 3.71397C12.4979 3.78632 12.8749 3.74919 13.2175 3.60727C13.5601 3.46536 13.853 3.22504 14.059 2.91669C14.265 2.60835 14.375 2.24584 14.375 1.875C14.375 1.37772 14.1775 0.900806 13.8258 0.549176C13.4742 0.197545 12.9973 1.01146e-06 12.5 1.01146e-06ZM23.125 3.75C23.4958 3.75 23.8583 3.64003 24.1667 3.43401C24.475 3.22798 24.7154 2.93514 24.8573 2.59253C24.9992 2.24992 25.0363 1.87292 24.964 1.50921C24.8916 1.14549 24.713 0.811399 24.4508 0.549176C24.1886 0.286952 23.8545 0.108376 23.4908 0.0360284C23.1271 -0.0363188 22.7501 0.000812411 22.4075 0.142727C22.0649 0.284641 21.772 0.524965 21.566 0.833307C21.36 1.14165 21.25 1.50416 21.25 1.875C21.25 2.37228 21.4475 2.8492 21.7992 3.20083C22.1508 3.55246 22.6277 3.75 23.125 3.75ZM1.875 21.25C1.50416 21.25 1.14165 21.36 0.833307 21.566C0.524965 21.772 0.284641 22.0649 0.142727 22.4075C0.000812411 22.7501 -0.0363188 23.1271 0.0360284 23.4908C0.108376 23.8545 0.286952 24.1886 0.549176 24.4508C0.811399 24.713 1.14549 24.8916 1.50921 24.964C1.87292 25.0363 2.24992 24.9992 2.59253 24.8573C2.93514 24.7154 3.22798 24.475 3.43401 24.1667C3.64003 23.8583 3.75 23.4958 3.75 23.125C3.75 22.6277 3.55246 22.1508 3.20083 21.7992C2.8492 21.4475 2.37228 21.25 1.875 21.25V21.25ZM12.5 21.25C12.1292 21.25 11.7666 21.36 11.4583 21.566C11.15 21.772 10.9096 22.0649 10.7677 22.4075C10.6258 22.7501 10.5887 23.1271 10.661 23.4908C10.7334 23.8545 10.912 24.1886 11.1742 24.4508C11.4364 24.713 11.7705 24.8916 12.1342 24.964C12.4979 25.0363 12.8749 24.9992 13.2175 24.8573C13.5601 24.7154 13.853 24.475 14.059 24.1667C14.265 23.8583 14.375 23.4958 14.375 23.125C14.375 22.6277 14.1775 22.1508 13.8258 21.7992C13.4742 21.4475 12.9973 21.25 12.5 21.25ZM23.125 21.25C22.7542 21.25 22.3916 21.36 22.0833 21.566C21.775 21.772 21.5346 22.0649 21.3927 22.4075C21.2508 22.7501 21.2137 23.1271 21.286 23.4908C21.3584 23.8545 21.537 24.1886 21.7992 24.4508C22.0614 24.713 22.3955 24.8916 22.7592 24.964C23.1229 25.0363 23.4999 24.9992 23.8425 24.8573C24.1851 24.7154 24.478 24.475 24.684 24.1667C24.89 23.8583 25 23.4958 25 23.125C25 22.6277 24.8025 22.1508 24.4508 21.7992C24.0992 21.4475 23.6223 21.25 23.125 21.25ZM1.875 10.625C1.50416 10.625 1.14165 10.735 0.833307 10.941C0.524965 11.147 0.284641 11.4399 0.142727 11.7825C0.000812411 12.1251 -0.0363188 12.5021 0.0360284 12.8658C0.108376 13.2295 0.286952 13.5636 0.549176 13.8258C0.811399 14.088 1.14549 14.2666 1.50921 14.339C1.87292 14.4113 2.24992 14.3742 2.59253 14.2323C2.93514 14.0904 3.22798 13.85 3.43401 13.5417C3.64003 13.2334 3.75 12.8708 3.75 12.5C3.75 12.0027 3.55246 11.5258 3.20083 11.1742C2.8492 10.8225 2.37228 10.625 1.875 10.625V10.625ZM12.5 10.625C12.1292 10.625 11.7666 10.735 11.4583 10.941C11.15 11.147 10.9096 11.4399 10.7677 11.7825C10.6258 12.1251 10.5887 12.5021 10.661 12.8658C10.7334 13.2295 10.912 13.5636 11.1742 13.8258C11.4364 14.088 11.7705 14.2666 12.1342 14.339C12.4979 14.4113 12.8749 14.3742 13.2175 14.2323C13.5601 14.0904 13.853 13.85 14.059 13.5417C14.265 13.2334 14.375 12.8708 14.375 12.5C14.375 12.0027 14.1775 11.5258 13.8258 11.1742C13.4742 10.8225 12.9973 10.625 12.5 10.625ZM23.125 10.625C22.7542 10.625 22.3916 10.735 22.0833 10.941C21.775 11.147 21.5346 11.4399 21.3927 11.7825C21.2508 12.1251 21.2137 12.5021 21.286 12.8658C21.3584 13.2295 21.537 13.5636 21.7992 13.8258C22.0614 14.088 22.3955 14.2666 22.7592 14.339C23.1229 14.4113 23.4999 14.3742 23.8425 14.2323C24.1851 14.0904 24.478 13.85 24.684 13.5417C24.89 13.2334 25 12.8708 25 12.5C25 12.0027 24.8025 11.5258 24.4508 11.1742C24.0992 10.8225 23.6223 10.625 23.125 10.625Z';
                  }

                  // You can return any component that you like here! {size}
                  return <SVG width={30} height={29} fill={color} d={iconName} />;
                },
                tabBarActiveTintColor: color.primary,
                tabBarInactiveTintColor: color.white,
              })}
            >
            <Tab.Screen name="Home">
              {(props) => <StackScreen {...props} routeName="Dashboard" setStatus={setStatus} />}
            </Tab.Screen>
            <Tab.Screen name="Ajo">
              {(props) => <StackScreen {...props} routeName="AjoTab" />}
            </Tab.Screen>
            <Tab.Screen name="Accounts">
              {(props) => <StackScreen {...props} routeName="AccountsTab" />}
            </Tab.Screen>
            <Tab.Screen name="More">
              {(props) => <StackScreen {...props} routeName="MoreTab" setStatus={setStatus} />}
            </Tab.Screen>
          </Tab.Navigator>
            :
          <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              />
            <Stack.Screen name="Login">
              {(props) => <Login {...props} setStatus={setStatus} />}
            </Stack.Screen>
            <Stack.Screen name="Verify">
              {(props) => <Verify {...props} setStatus={setStatus} />}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              component={Register}
              />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPassword}
              />
            <Stack.Screen
              name="ComingSoon"
              component={ComingSoon}
              />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </AppContext.Provider>
  );
};


function StackScreen({ routeName, setStatus }) {

  return (
    <Stack.Navigator initialRouteName={routeName ?? "Dashboard"} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard">
        {(props) => <Dashboard {...props} setStatus={setStatus} />}
      </Stack.Screen>
      <Stack.Screen
        name="AjoTab"
        component={ComingSoon}
        />
      <Stack.Screen
        name="AccountsTab"
        component={ComingSoon}
        />
      <Stack.Screen
        name="MoreTab"
        component={ComingSoon}
        />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoon}
        />
        
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        />
        
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        />
    </Stack.Navigator>
  );
}