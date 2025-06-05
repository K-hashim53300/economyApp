# API Documentation - Economic App

## Base URL:

https://economyapp.up.railway.app/economy-api/v1/

---

## ** Authentication APIs**

### **1. Signup**

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Request Body:**

```json
{
  "fullName": "Karim Mohamed",
  "email": "karimhashim530@gmail.com",
  "password": "Karim123!",
  "cPassword": "Karim123!"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "User registered successfully. Please confirm your email.",
  "user": {
    "_id": "67e94c75036efb11b14130c7",
    "fullName": "Karim Mohamed",
    "email": "karimhashim530@gmail.com",
    "address": null,
    "isConfirm": false
  }
}
```

### **2. Confirm Account**

- **URL:** `/auth/confirm/:token`
- **Method:** `GET`
- **Response:**

```json
{
  "status": "success",
  "message": "Email confirmed successfully. You can now log in."
}
```

### **3. Login**

- **URL:** `/auth/login`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "karimhashim530@gmail.com",
  "password": "Karim123!"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTk0Yzc1MDM2ZWZiMTFiMTQxMzBjNyIsImlhdCI6MTc0MzM0MzA5MCwiZXhwIjoxNzQzNTU5MDkwfQ.CgYtyeZB_7Ip1cICKb-7yYmDl5uZMiVXDfarfidJrv8"
}
```

### **4. Send Code to reset password**

- **URL:** `/auth/send-code`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "karimhashim530@gmail.com"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Verification code sent to your email."
}
```

### **5. Forget password**

- **URL:** `/auth/forget-password`
- **Method:** `POST`
- **Request Body:**

```json
{
  "code": "165561",
  "email": "karimhashim530@gmail.com",
  "password": "Karim123$"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Password reset successfully. You can now log in."
}
```

### **6. Logout**

- **URL:** `/auth/logout`
- **Method:** `GET`
- **Response:**

```json
{
  "message": "Logged out successfully"
}
```

## ** User APIs**

### **1. Get user profile**

- **URL:** `/user/profile`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "user": {
    "_id": "67e94c75036efb11b14130c7",
    "fullName": "Karim Mohamed",
    "email": "karimhashim530@gmail.com",
    "address": null
  }
}
```

### **2. Update user**

- **URL:** `/user/update/{id}`
- **URL:** `/user/update/67e959f9036efb11b14130e2`
- **Method:** `PUT`
- **Request Body:**

```json
{
  "address": "AL Husinia Sharqia"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "User updated successfully",
  "updatedUser": {
    "address": "AL Husinia Sharqia"
  }
}
```

### **3. Update user password **

- **URL:** `/user/update-password`
- **Method:** `PATCH`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Request Body:**

```json
{
  "currentPassword": "Karim123$",
  "newPassword": "Karim123!@",
  "newCPassword": "Karim123!@"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Your password updated successfully",
  "updated": {
    "_id": "67e94c75036efb11b14130c7",
    "fullName": "Karim Mohamed",
    "email": "karimhashim530@gmail.com",
    "password": "$2b$06$okdXnGLta/8bxoEnnxS5ze6CiT8RUMEy7UrgyJuUXErZjrhW/zIue",
    "address": "AL Husinia Sharqia",
    "isConfirm": true,
    "createdAt": "2025-03-30T13:51:49.163Z",
    "updatedAt": "2025-03-30T14:34:32.009Z",
    "__v": 0,
    "code": null
  }
}
```

### **4. Delete user **

- **URL:** `/user/delete/{id}`
- **Method:** `DELETE`
- **Response:**

```json
{
  "status": "success",
  "message": "The user and his data have been deleted"
}
```

## ** Income APIs**

### **1. Add income**

- **URL:** `/icome/add`
- **Method:** `POST`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Request Body:**

```json
{
  "incomeType": "My salary",
  "incomeValue": 15000
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Your income added successfully",
  "savedIncome": {
    "userId": "67e959f9036efb11b14130e2",
    "incomeType": "My salary",
    "incomeValue": 15000,
    "_id": "67e95b1e036efb11b14130ea",
    "incomeDate": "2025-03-30T14:54:22.360Z",
    "createdAt": "2025-03-30T14:54:22.365Z",
    "updatedAt": "2025-03-30T14:54:22.365Z",
    "__v": 0
  }
}
```

### **2. Update income**

- **URL:** `/icome/update/{id}`
- **Method:** `PUT`
- **Request Body:**

```json
{
  "incomeType": "My business"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Income updated successfully",
  "updatedIncome": {
    "_id": "67e95b1e036efb11b14130ea",
    "userId": "67e959f9036efb11b14130e2",
    "incomeType": "My business",
    "incomeValue": 15000,
    "incomeDate": "2025-03-30T14:54:22.360Z",
    "createdAt": "2025-03-30T14:54:22.365Z",
    "updatedAt": "2025-03-30T15:00:51.957Z",
    "__v": 0
  }
}
```

### **3. Delete income**

- **URL:** `/icome/delete/{id}`
- **Method:** `DELETE`

- **Response:**

```json
{
  "status": "success",
  "message": "Income deleted successfully"
}
```

### **4. Get all incomes**

- **URL:** `/icome`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "incomes": [
    {
      "_id": "67e95e77036efb11b14130f3",
      "userId": "67e959f9036efb11b14130e2",
      "incomeType": "My salary",
      "incomeValue": 15000,
      "incomeDate": "2025-03-30T15:08:39.261Z",
      "createdAt": "2025-03-30T15:08:39.262Z",
      "updatedAt": "2025-03-30T15:08:39.262Z",
      "__v": 0
    },
    {
      "_id": "67e95e8b036efb11b14130f6",
      "userId": "67e959f9036efb11b14130e2",
      "incomeType": "My business",
      "incomeValue": 45000,
      "incomeDate": "2025-03-30T15:08:59.513Z",
      "createdAt": "2025-03-30T15:08:59.514Z",
      "updatedAt": "2025-03-30T15:08:59.514Z",
      "__v": 0
    }
  ]
}
```

## ** Expenses APIs**

### **1. Add expense**

- **URL:** `/expense/add`
- **Method:** `POST`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Request Body:**

```json
{
  "expenseType": "Foods",
  "expenseValue": 9000,
  "description": "buy some foods"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Your expense added successfully",
  "savedexpense": {
    "userId": "67e959f9036efb11b14130e2",
    "expenseType": "Foods",
    "expenseValue": 9000,
    "description": "buy some foods",
    "_id": "67e95fb4036efb11b14130fc",
    "expenseDate": "2025-03-30T15:13:56.857Z",
    "createdAt": "2025-03-30T15:13:56.858Z",
    "updatedAt": "2025-03-30T15:13:56.858Z",
    "__v": 0
  }
}
```

### **2. Update expense**

- **URL:** `/expense/update/{id}`
- **Method:** `PUT`
- **Request Body:**

```json
{
  "expenseValue": 12000
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Expense updated successfully",
  "updatedExpense": {
    "_id": "67e95fb4036efb11b14130fc",
    "userId": "67e959f9036efb11b14130e2",
    "expenseType": "Foods",
    "expenseValue": 12000,
    "description": "buy some foods",
    "expenseDate": "2025-03-30T15:13:56.857Z",
    "createdAt": "2025-03-30T15:13:56.858Z",
    "updatedAt": "2025-03-30T15:16:24.755Z",
    "__v": 0
  }
}
```

### **3. Delete expense**

- **URL:** `/expense/delete/{id}`
- **Method:** `DELETE`

- **Response:**

```json
{
  "status": "success",
  "message": "Expense deleted successfully"
}
```

### **4. Get all expenses**

- **URL:** `/expense`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "expenses": [
    {
      "_id": "67e96163036efb11b1413105",
      "userId": "67e959f9036efb11b14130e2",
      "expenseType": "Foods",
      "expenseValue": 9000,
      "description": "buy some foods",
      "expenseDate": "2025-03-30T15:21:07.878Z",
      "createdAt": "2025-03-30T15:21:07.880Z",
      "updatedAt": "2025-03-30T15:21:07.880Z",
      "__v": 0
    },
    {
      "_id": "67e9619b036efb11b1413108",
      "userId": "67e959f9036efb11b14130e2",
      "expenseType": "internet",
      "expenseValue": 500,
      "expenseDate": "2025-03-30T15:22:03.835Z",
      "createdAt": "2025-03-30T15:22:03.837Z",
      "updatedAt": "2025-03-30T15:22:03.837Z",
      "__v": 0
    }
  ]
}
```

## ** Members APIs**

### **1. Add member**

- **URL:** `/member/add`
- **Method:** `POST`
- **Headers**

```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "multipart/form-data"
}
```

- **Request Body:**
  | Key | Type | Required |Description |
  |------------|----------|----------|--------------------|
  |memberName |`text` | ✅ | `normal string` |
  |------------|----------|----------|--------------------|
  |roleInFamily|`text` | ✅ |`normal string` |
  |------------|----------|----------|--------------------|
  |gender |`text` | ❌ | `defualt male` |
  |------------|----------|----------|------------------- |
  | birthday |`text` | ❌ | `Date` |
  |------------|----------|----------|------------------- |
  | image |`file` | ❌ |`image jpg/jpeg/png` |
  |------------|----------|----------|--------------------|
  | job |`text` | ❌ | `normal string` |
  |------------|----------|----------|------------------- |
  | salary |`text` | ❌ | `Number` |

- **Response:**

```json
{
  "status": "success",
  "message": "Member added successfully",
  "savedMember": {
    "userId": "67e959f9036efb11b14130e2",
    "memberName": "Yazan Karim Mohamed",
    "gender": "male",
    "birthday": "2020-03-03T00:00:00.000Z",
    "image": "https://res.cloudinary.com/dnpyxgn4n/image/upload/v1743348819/members/f2logkojqf2vsembokjw.png",
    "roleInFamily": "son1",
    "job": "enginerr",
    "salary": 7000,
    "_id": "67e96453036efb11b141310d",
    "createdAt": "2025-03-30T15:33:39.860Z",
    "updatedAt": "2025-03-30T15:33:39.860Z",
    "__v": 0
  }
}
```

### **2. Update member**

- **URL:** `/member/update/{id}`
- **Method:** `PUT`
- **Request Body:**

  | Key          | Type       | Required   | Description          |
  | ------------ | ---------- | ---------- | -------------------- |
  | roleInFamily | `text`     | ✅         | `normal string`      |
  | ------------ | ---------- | ---------- | -------------------- |

- **Response:**

```json
{
  "status": "success",
  "message": "Member updated successfully",
  "updatedMember": {
    "_id": "67ec223c036efb11b1413128",
    "userId": "67e959f9036efb11b14130e2",
    "memberName": "Marim Karim Mohamed",
    "gender": "female",
    "birthday": "2020-03-03T00:00:00.000Z",
    "image": "https://res.cloudinary.com/dnpyxgn4n/image/upload/v1743533783/members/ancmf8xsllrhqgndl1es.png",
    "roleInFamily": "Son4",
    "job": "Freelancer",
    "salary": 40000,
    "createdAt": "2025-04-01T17:28:28.438Z",
    "updatedAt": "2025-04-01T18:56:24.517Z",
    "__v": 0
  }
}
```

### **3. Delete member**

- **URL:** `/member/delete/{id}`
- **Method:** `DELETE`

- **Response:**

```json
{
  "status": "success",
  "message": "Member deleted successfully"
}
```

### **4. Get all members**

- **URL:** `/member`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "members": [
    {
      "_id": "67ec21c0036efb11b1413125",
      "userId": "67e959f9036efb11b14130e2",
      "memberName": "Yazan Karim Mohamed",
      "gender": "male",
      "birthday": "2020-03-03T00:00:00.000Z",
      "image": "https://res.cloudinary.com/dnpyxgn4n/image/upload/v1743528384/members/isl6gajv8z06nimnklkf.png",
      "roleInFamily": "son1",
      "job": "enginerr",
      "salary": 7000,
      "createdAt": "2025-04-01T17:26:24.620Z",
      "updatedAt": "2025-04-01T17:26:24.620Z",
      "__v": 0
    },
    {
      "_id": "67ec223c036efb11b1413128",
      "userId": "67e959f9036efb11b14130e2",
      "memberName": "Marim Karim Mohamed",
      "gender": "female",
      "birthday": "2020-03-03T00:00:00.000Z",
      "image": "https://res.cloudinary.com/dnpyxgn4n/image/upload/v1743528507/members/habbhiwptpt0ufbbwpqx.png",
      "roleInFamily": "son2",
      "job": "Doctor",
      "salary": 40000,
      "createdAt": "2025-04-01T17:28:28.438Z",
      "updatedAt": "2025-04-01T17:28:28.438Z",
      "__v": 0
    }
  ]
}
```

### **4. Get member by his name**

- **URL:** `/member/{memberName}`
- **URL:** `/member/Marim Karim Mohamed`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "member": {
    "_id": "67ec223c036efb11b1413128",
    "userId": "67e959f9036efb11b14130e2",
    "memberName": "Marim Karim Mohamed",
    "gender": "female",
    "birthday": "2020-03-03T00:00:00.000Z",
    "image": "https://res.cloudinary.com/dnpyxgn4n/image/upload/v1743528507/members/habbhiwptpt0ufbbwpqx.png",
    "roleInFamily": "son2",
    "job": "Doctor",
    "salary": 40000,
    "createdAt": "2025-04-01T17:28:28.438Z",
    "updatedAt": "2025-04-01T17:28:28.438Z",
    "__v": 0
  }
}
```

## ** Statistics APIs**

### **4. Get all statistics**

- **URL:** `/statistics`
- **Method:** `GET`
- **Headers**Authorization: Bearer <JWT_TOKEN>
- **Response:**

```json
{
  "status": "success",
  "message": "Done",
  "savedStatistics": {
    "_id": "67ec2411036efb11b1413134",
    "userId": "67e959f9036efb11b14130e2",
    "totalIncome": 107000,
    "totalExpense": 9500,
    "balance": 97500,
    "expensePercentage": 8.878504672897195,
    "monthlyExpenses": [
      {
        "month": "2025-03",
        "total": 9500,
        "_id": "67ec242c55e527323c5cb028"
      }
    ],
    "createdAt": "2025-04-01T17:36:17.430Z",
    "updatedAt": "2025-04-01T17:36:44.463Z",
    "__v": 1
  }
}
```
