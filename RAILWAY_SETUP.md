# 🚀 Railway Deployment & MySQL Setup Guide for KERIS Backend

This guide outlines the steps to deploy the KERIS Backend and setup the MySQL database on [Railway](https://railway.app/).

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Create a MySQL Database Service on Railway](#step-1-create-a-mysql-database-service-on-railway)
3. [Step 2: Add Backend Service on Railway](#step-2-add-backend-service-on-railway)
4. [Step 3: Link Services & Bind Environment Variables](#step-3-link-services--bind-environment-variables)
5. [Step 4: Initialize the Database on Railway](#step-4-initialize-the-database-on-railway)
6. [Step 5: Verify the Deployment](#step-5-verify-the-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites
- A Railway account (connected to GitHub or via email).
- The KERIS Backend repository pushed to your GitHub.
- Railway CLI installed locally (optional, but useful).

---

## Step 1: Create a MySQL Database Service on Railway

1. Open your [Railway Dashboard](https://railway.app/dashboard).
2. Click **New Project** and select **Provision MySQL**.
3. Railway will provision a MySQL instance for you.
4. Once created, click on the **MySQL** service card, go to the **Variables** tab, and note the variables generated:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQL_URL` / `MYSQL_PRIVATE_URL`

Our backend is configured to automatically detect these Railway-provided variables, so you don't need to manually rename them!

---

## Step 2: Add Backend Service on Railway

1. In the same Railway project, click **+ New** (or **Add Service**).
2. Select **GitHub Repo** and choose your `KERIS-Backend` repository.
3. Railway will begin building and deploying the backend. It will read our `package.json` and build the TypeScript application.

---

## Step 3: Link Services & Bind Environment Variables

For the backend to connect to the MySQL service, you must copy or reference the MySQL credentials in your backend service.

1. Click on your backend service card in the Railway dashboard.
2. Go to the **Variables** tab.
3. Click **New Variable** and select **Reference Service** to automatically link the variables from the MySQL service:
   - Add `MYSQL_URL` as a reference: `${{MySQL.MYSQL_URL}}` (or `${{MySQL.MYSQL_PRIVATE_URL}}` for internal networking).
   - Alternatively, add individual references:
     - `MYSQLHOST` = `${{MySQL.MYSQLHOST}}`
     - `MYSQLPORT` = `${{MySQL.MYSQLPORT}}`
     - `MYSQLUSER` = `${{MySQL.MYSQLUSER}}`
     - `MYSQLPASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
     - `MYSQLDATABASE` = `${{MySQL.MYSQLDATABASE}}`
4. Add the remaining required backend environment variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your_super_secret_jwt_key` (Make sure to generate a secure random string)
   - `JWT_EXPIRY` = `7d`
   - `CORS_ORIGIN` = `https://your-frontend-domain.up.railway.app` (Add your deployed frontend URL here)
   - `PORT` = `5000` (Or leave blank, Railway automatically binds to `PORT`)

---

## Step 4: Initialize the Database on Railway

Because Sequelize auto-sync is disabled in production to protect data integrity, you must run the database initialization script once to create the tables and seed default data.

### Option A: Using Railway CLI (Recommended)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login to your account: `railway login`
3. Link your local directory to your Railway project: `railway link`
4. Run the database initialization command:
   ```bash
   railway run npm run db:init
   ```
   This will run:
   - `npm run seed:admin` (runs Sequelize schema sync and seeds the admin user)
   - `npm run seed:ruangbelajar` (seeds courses, modules, and lessons)
   - `npm run db:fix` (makes final schema structural adjustments)

### Option B: Temporarily running it as a Build/Deploy Command
1. In the Railway dashboard, go to your backend service settings.
2. Under **Deploy** -> **Start Command**, temporarily set it to:
   ```bash
   npm run db:init && npm start
   ```
3. Save the settings. Railway will redeploy and run the database initialization.
4. Once completed successfully, change the **Start Command** back to the default:
   ```bash
   npm start
   ```
   This ensures the server runs normally without repeating the initialization on every container restart.

---

## Step 5: Verify the Deployment

1. Check the deployment logs of the backend service. You should see:
   ```
   ✅ MySQL connected successfully
   ✅ Database models synchronized
   
   ╔════════════════════════════════════════╗
   ║    KERIS Backend Server Started        ║
   ║    Port    : 5000                       ║
   ║    Env     : production                 ║
   ║    DB      : keris_db                   ║
   ╚════════════════════════════════════════╝
   ```
2. Open the deployed backend URL with `/health` endpoint in your browser, e.g., `https://your-backend-app.up.railway.app/health`.
3. You should receive a response like:
   ```json
   {
     "status": "OK",
     "message": "Backend is running",
     "timestamp": "2026-06-21T09:20:00.000Z",
     "env": "production"
   }
   ```

---

## Troubleshooting

### Error: `Missing required database environment variables`
Ensure that `MYSQL_URL` or `MYSQLHOST`, `MYSQLUSER`, and `MYSQLDATABASE` are defined in the backend service variables and correctly referenced from the MySQL service.

### Error: `Table 'keris_db.users' doesn't exist`
You have not run the database initialization command. Follow **Step 4** to execute `npm run db:init`.

### Error: `Connection refused` or `ETIMEDOUT`
If using `MYSQL_URL`, try using `MYSQL_PRIVATE_URL` to connect internally within Railway's private network, which bypasses the public internet and is faster and more secure.
