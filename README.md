
# Banking Service API 💰

Create an account, fund your wallet, transfer funds to other users, withdraw funds, and see transaction history.

> [Preview deployed API 🚀](https://banking-service.herokuapp.com/) 


**Environments**

- Node version - v16.13.0

**This application uses the following technologies:**


- NodeJS
- ExpressJS
- Typescript
- Supertest

note: `run all commands in the applications root directory`


### To run the app manually

**Install all dependencies**

```
npm install
```

**Database setup**

```
- get a mongodb uri
- create a '.env' file on the root directory, or simply rename the '.env.example'
- set the connection uri  in the .env file (i.e TEST_DB=<connection uri> and PROD_DB=<connection uri>)
```

**Start the application**

```
source .env

npm start
```

**Run test**

```
npm test
```


--- 

**Documentation**

<!-- > [The postman collection 📜](https://******/) -->

---

> [Click to preview swagger documentation 📜](https://banking-service.herokuapp.com/api/v1/api-docs/) 

![Swagger Demo](https://github.com/giwajossy/banking-service-api/blob/main/demo.gif)



---


### application/json



----

### Create Account
---

**Endpoint** `/api/v1/auth/register` - method (POST)

- Registers, and generates a wallet address for new user

**Payload**

```json
{
    "name": "Giwa Jossy",
    "email": "giwajossy@gmail.com",
    "password": "******"
}
```

**Response format**

```json
{
    "success": true,
    "message": "Sign Up successful!",
    "data": {
        "name": "Giwa Jossy",
        "email": "giwajossy@gmail.com",
        "wallet": {
            "address": "30eaffcb-a116-4755-9c3d-f97a4770581d",
            "balance": 0
        },
        "isDeleted": false,
        "createdAt": "2022-08-16T23:24:23.761Z"
    }
}
```



### Fund wallet 
---

**Endpoint** `/api/v1/transaction/fund_wallet` - method (POST)

- Funds the user's wallet

**Payload**

```json
{
    "amount": 1000000
}
```

**Response format**

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "type": "deposit",
        "amount": 1000000
    }
}
```




### Transfer Funds 
---

**Endpoint** `/api/v1/transaction/transfer_funds` - method (POST)

- Sends funds from one user to another

**Payload**

```json
{
    "amount": 20000,
    "recipientAddress": "dadd16ee-d241-407a-a81d-018d3407bdc5"
}
```

**Response format**

```json
{
    "success": true,
    "message": "Operation Successful",
    "data": {
        "type": "transfer",
        "recipient": "dadd16ee-d241-407a-a81d-018d3407bdc5",
        "amount": 20000
    }
}
```




### Withdraw Funds 
---

**Endpoint** `/api/v1/transaction/withdraw_funds` - method (POST)

- Withdraws from the user's wallet

**Payload**

```json
{
    "amount": 50000
}
```

**Response format**

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        "type": "withdrawal",
        "amount": 50000
    }
}
```




### Transaction History
---

**Endpoint** `/api/v1/transaction/transaction_history/62fbdccbcaaf70be72382b7d` - method (GET)

- Returns user's transaction history


**Response format**

```json
{
    "success": true,
    "message": "Operation successful",
    "data": [
        {
            "sender": "62fbdccbcaaf70be72382b7d",
            "type": "deposit",
            "recipient": "8cae7736-0f75-4ad2-abe2-dec4496756c2",
            "amount": 1000000,
            "createdAt": "2022-08-16T18:19:24.718Z"
        },
        {
            "sender": "62fbdccbcaaf70be72382b7d",
            "type": "transfer",
            "recipient": "dadd16ee-d241-407a-a81d-018d3407bdc5",
            "amount": 20000,
            "createdAt": "2022-08-16T18:38:03.021Z"
        },
        {
            "sender": "62fbdccbcaaf70be72382b7d",
            "type": "withdrawal",
            "recipient": "8cae7736-0f75-4ad2-abe2-dec4496756c2",
            "amount": 50000,
            "createdAt": "2022-08-16T18:25:56.390Z"
        }
        
    ]
}
```

---

**To do**
- Migrate Database to MySQL/KnexJS ORM

---

**Author:** Giwa Jossy