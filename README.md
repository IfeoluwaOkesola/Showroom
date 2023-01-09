# Wallet

Wallet is an app developed that mimics a bank app and is for making transactions. Wallet started as an app that creates account, able to authenticate and allows you log in.
Over time, a withdrawal and transfer function was added. 
Lastly, a transaction history section was added.

## Difference between Wallet and regular bank accounts.
Wallet allows the use of username to transfer funds from one user to another. Usernames are unique just like bank accounts but unlike bank accounts, they are easy to remember.

## Future contributions
Features like chatroom between users will be added in future.

## Language/Database used
1. Nodejs
2. Mysql Db


## Installation

1. Make a pull request
2. Create database savings on your mysql workbench
3. Change directory to backend
   ```
   cd backend
4. Run the dbmanager.js file on your terminal to create the database tables.
   
   ```
   node dbmanager.js
5. Run the index.js file on your terminal to be able to test functions on your localhost
   
   ```
   node index.js

6. Go to your browser to use localhost
   ```
   http://localhost:4000

7. You will be able to create account and log in at the point.

8. To test the withrawal and transfer function, directly insert into the transactions table from your mysql database


## Demo Video

This link [Demo Video 1](https://vimeo.com/787026466/feaf6a7e13) takes you to a demo of the functions.

This link [Demo Video 2](https://vimeo.com/787026466/feaf6a7e13) takes you to a demo of eventualities accounted for
