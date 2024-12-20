<style type="text/css">
    ol ol { list-style-type: lower-alpha; }
</style>
# OAuth-Imp

### **Purpose**
*OAuth* is a public standard for granting user access to server resources.  Since OAuth only provideds guidelines, the implementation can vary according to interpretation.  Client access is granted by an authentication server, which provides a temporary access token, upon user login.  Once the access token expires, a new token must be generated with a refresh token, or the user must log back into the application.

OAuth-Imp is my implementation of the OAuth standard.  It implements the main client  authentication features above, including a refresh token for continued access.  It also, implements *Role Based Access Control (RBAC)*.  RBAC is a method of managing application privileges based on user roles (visitor, user, admin).  In essence, a resource can only be displayed, if the user's role has access to view it.

To demonstrate this concept I have setup a crude *Single Page Application (SPA)*, using REACT.  Users are allowed to perform the following functions on a products database.  However, user privilege is role-based (see below).     

**Products Page Access**
1. View (visitor, user, admin)
2. Hide (user, admin)
3. View Details (user, admin)
4. Update Products (admin)
5. Delete Products  (admin)

**Admin Page Access:**
1. Insert New Products (admin)

**Role Based Credentials:**
Unauthenticated users are given the visitor role by default.  In addition, newly registered users are given user access, by default.  However, in order to see the difference in authorization, I have setup the following test roles.  Please feel free to use them to test the application.

1.  `Admin Credentials:`
    1. id: admin@ymail.com
    2. pw: admin
1. `User Credentials:`
    1. id: user@ymail.com
    2. pw: user
1. `Visitor Credentials:`
    1. id: visitor@ymail.com
    1. pw: visitor

---
### **IMPORTANT LINKS**
* [Link to github repository](https://github.com/tlockhart/image-uploader)
* [Demo Version](https://shielded-bayou-40362.herokuapp.com/)
* [OAuth](https://auth0.com/blog/5-steps-to-add-modern-authentication-to-legacy-apps-using-jwts/)
* [RBACS](https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/)
* [MDBReact](https://mdbootstrap.com/docs/react/navigation/navbar/)
---
### **Technologies Used**

- MySql2
- JWT
- Axios
- Moment
- BCrypt
- Cloudinary
- Node.js with Async/Await
- React
- DotEnv
---
### **Setup**

In order to run the app, you will need to clone this repository and install all required technologies listed below.  Note: You will also need to setup a mongoDB and cloudinary account, and add the credentials to a .env file in the root directory.
___
### **Required Technologies**

1. [Node.js LTS](https://nodejs.org/en/)<br/>
2. [NPM](https://www.npmjs.com/get-npm)<br/>
3. [Git & Git Bash](https://git-scm.com/downloads)<br/>
4. [Sequelize](https://sequelize.org/v5/)<br/>
5. [MySql2](https://www.npmjs.com/package/mysql2)<br/>
6. [Cloudinary](https://cloudinary.com/)<br/>
7. [MySQL Workbench](https://www.mysql.com/products/workbench/)<br/>
---
### **Installation and Configuration**

1. Open Bash and Clone the OAuth-Imp repo
2. Install all required technologies
3. [Optional] In Bash, change the current directory to the OAuth-Imp directory and install create-react-app module using the following command:
    1. npm install -g create-react-app
4. In Bash, change to the OAuth-Imp directory, install all modules from the package.json, using the following command:
    1. npm install [Enter]
___
### **Execute Program**

1. In Bash, enter the following command in the OAuth-Imp directory, to start the server.
    1. npm start [ENTER]
2. The application will open your browser and run the app in test mode:
    1. http://localhost:3000
___
### **Use**
This repo is available for public non-commercial use only.