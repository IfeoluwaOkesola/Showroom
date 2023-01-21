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
2. Create database on your mysql workbench
3. Change directory to backend
   ```
   cd backend
4. Run

   ```
   npm install
5. Create a .env file. Add the following to it

   ```
   DATABASE_USER='your database user name'
   DATABASE_PASSWORD='password of your database'
   DATABASE='name of your database created'   
6. Run the dbmanager.js file on your terminal to create the database tables.
   
   ```
   node dbmanager.js
7. Run the index.js file on your terminal to be able to test functions on your localhost
   
   ```
   node index.js
8. Open a different terminal

9.  cd into frontend
10. Run npm install to install node modules
    ```
    npm install
11. Run index.js
    ```
    node index.js
12. Go to your browser to use localhost
   ```
   http://localhost:4000

   ```

13. You will be able to create account and log in at the point.

14. To test the withdrawal and transfer function, directly insert into the transactions table from your mysql database


## Demo Video

 [demoVideo1](https://vimeo.com/787021257/238a8b7831) is a demo video of the various functions.

[demoVideo2](https://vimeo.com/787026466/feaf6a7e13) is a demo video of the exceptionalities accounted for

