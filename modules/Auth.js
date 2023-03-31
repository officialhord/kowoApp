import API from './API';


const authURL = 'https://kintrust-api.herokuapp.com/';

const AUTH_API_URL = '/useraccess';

    //Auth
    const Register = (data) => {
        return API(authURL).post(AUTH_API_URL + '/register-user', data);
    };
    const ForgotPassword = (data) => {
        return API(authURL).post(AUTH_API_URL + '/send-verification', data);
    };
    const ResetPassword = (data) => {
        return API(authURL).post(AUTH_API_URL + '/reset-password', data);
    };
    const SendOtp = (data) => {
        return API(authURL).post(AUTH_API_URL + '/send-verification', data);
    };
    const Verify = (data) => {
        return API(authURL).post(AUTH_API_URL + '/verify-user', data);
    };
    const Login = (data) => {
        return API(authURL).post(AUTH_API_URL + '/login', data);
    };
    const Logout = (data) => {
        return API(authURL).post(AUTH_API_URL + '/logout', data);
    };
  
    const Auth = {
        Register, ForgotPassword, ResetPassword, SendOtp, Verify, Login, Logout
    };

export default Auth;