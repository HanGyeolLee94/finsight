# Finsight

## Project Overview

Finsight is a web application with a separate frontend and backend.

## Folder Structure

```
├── backend   # Backend source code
├── docs      # Documentation and manuals
├── frontend  # Frontend source code
└── README.md  # Project documentation
```

## Environment Setup

### 1. Common Configuration

Both **frontend** and **backend** must use the same `.env` file.
Refer to `.env.example` to create your `.env` file and ensure that `FINSIGHT_JWT_SECRET` is set identically in both.

```sh
FINSIGHT_JWT_SECRET=your_jwt_secret_here
```

## Backend Setup

### 1. Required Installations

To run the backend, install the following:

- [Java 17](https://adoptium.net/)
- [Gradle](https://gradle.org/install/)
- [MariaDB 11.4](https://mariadb.org/download/)

### 2. Backend `.env` Configuration
Create a `.env` file inside the `backend` folder and add the following:

```sh
# FMP API Key
FINSIGHT_FMP_API_KEY=your_fmp_api_key_here

# Email Configuration
FINSIGHT_MAIL_USERNAME=your_email_here
FINSIGHT_MAIL_PASSWORD=your_email_password_here

# JWT Secret Key
FINSIGHT_JWT_SECRET=your_jwt_secret_here

# Database Configuration
FINSIGHT_DB_USERNAME=your_db_username_here
FINSIGHT_DB_PASSWORD=your_db_password_here
```

### 3. Backend Initial Data Setup

Before running the backend, configure the database and import initial data:

1. Modify `backend/script/import/config.bat` with your database credentials.
2. Run `import_all.bat` to import initial data:

   ```sh
   cd backend/script/import
   ./import_all.bat
   ```

### 4. Run Backend

Use **Command Prompt (cmd) or Git Bash** to navigate to the `backend` folder and run:

```sh
cd backend
./gradlew bootRun
```

## Frontend Setup

### 1. Required Installations

To run the frontend, install the following:

- [Node.js (LTS version)](https://nodejs.org/)
- [NPM](https://www.npmjs.com/)

### 2. Install Packages and Run

Use **Command Prompt (cmd) or Git Bash** to navigate to the `frontend` folder and run:

```sh
cd frontend
npm install
npm run dev
```

## Product Manual
A detailed product manual is available for download. Please refer to the documentation for further instructions.

📄 **[Download Product Manual](https://github.com/HanGyeolLee94/finsight/docs/FinSight Product Manual.pdf)**
