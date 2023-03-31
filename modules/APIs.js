import API from './API';

const authURL = 'https://kintrust-api.herokuapp.com/';
const accountsURL = 'https://kintrust-api.herokuapp.com/';

const API_URL = '/api';
const ACCOUNT_API_URL = '/account-service';


    //User
    const User = () => {
        return API(accountsURL).post(API_URL + '/user');
    };

    //Account
    const UserAccounts = () => {
        return API(accountsURL).post(ACCOUNT_API_URL + '/fetch-accounts');
    };
    const UserTransactions = () => {
        return API(accountsURL).post(ACCOUNT_API_URL + '/fetch-transactions');
    };
    const UserAccountsTransactions = () => {
        return API(accountsURL).post(ACCOUNT_API_URL + '/fetch-user-accounts');
    };
  
    const APIs = {
        User,
        UserAccounts, UserTransactions, UserAccountsTransactions,
    };

export default APIs;