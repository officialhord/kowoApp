import API from "./API";

const baseURL = "https://router-kowoapp-5f04b6aa8916.herokuapp.com/";

const API_URL = "/api";
const ACCOUNT_API_URL = "/account-service";

//User
const User = baseURL + API_URL + "/user";

//Account
const UserAccounts = baseURL + "/fetch-accounts";

const UserTransactions = baseURL + ACCOUNT_API_URL + "/fetch-transactions";

const UserAccountsTransactions =
  baseURL + ACCOUNT_API_URL + "/fetch-user-accounts";

const APIs = {
  User,
  UserAccounts,
  UserTransactions,
  UserAccountsTransactions,
  baseURL,
};

export default APIs;
