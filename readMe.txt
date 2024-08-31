# Store Management Application

## Overview
This Store Management Application allows users to manage store details such as name, location, contact number, available products, website, and store hours. The application features authentication and role-based access control using JSON Web Tokens (JWT) to ensure secure access to various endpoints.

## Features
- **User Authentication**: Users must log in to access the application.
- **Role-Based Access**: Certain actions (e.g., adding, updating, or deleting stores) are restricted based on user roles.
- **Store Management**: Users can add, update, and delete stores. Each store includes an image, name, location, contact number, available products, website, and store hours.
- **Responsive Design**: The application is styled to be responsive and user-friendly.
- **JWT Security**: Authentication is secured using JWT, ensuring that only logged-in users can access specific routes.

## Security Features
- **JWT Authentication**: Protects endpoints by requiring a valid token to access them.
- **Password Hashing**: User passwords are securely hashed using bcrypt before storing in the database.
- **Access Control**: Unauthorized users are redirected to the login page if they try to access restricted endpoints.

## Installation and Setup

### Prerequisites
- Node.js
- npm (Node Package Manager)
- MySQL Workbench

### Steps to Run the Application

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/store-management-app.git
    cd store-management-app
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Database Setup**
    - Create a MySQL database using MySQL Workbench.
    - Import the provided SQL file with table content to set up the database structure.
    - Update the database configuration in `config/database.js` with your database credentials.

4. **Run Migrations (If Applicable)**
    ```bash
    npx sequelize-cli db:migrate
    ```

5. **Set Up Environment Variables**
    - Create a `.env` file in the root directory.
    - Add the following variables with your respective values:
    ```plaintext
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=storename
    JWT_SECRET=your_jwt_secret
    ```

6. **Start the Application**
    ```bash
    npm start
    ```

7. **Access the Application**
    - Open your browser and navigate to `http://localhost:3000`.

### Usage

- **Login Page**: Users can log in using their credentials.
- **Register**: New users can create an account.
- **Add Store**: After logging in, users can add a new store using the "Add Store" button.
- **Update Store**: Users can update store details by clicking the "Update Store" button on the store page.
- **Delete Store**: Users can delete a store by clicking the "Delete Store" button on the store page.
- **Logout**: Users can log out using the logout button in the top-right corner.

## Additional Information
- **File Uploads**: Store images can be uploaded and updated.
- **Responsive Design**: The application is optimized for desktop and mobile views.

## Future Enhancements
- Implement more advanced filtering and search features.
- Add user roles with different permissions (e.g., admin, user).