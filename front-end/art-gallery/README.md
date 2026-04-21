# Art Gallery
Art gallery is under development, its not responsive and many features are not implemented yet.

## Installation
1. Download project from git.
2. Open project in code editor and install node modules for front-end and back-end. 
3. Install mysql database if you do not have it already. Create database, you will need database password, name and user on later steps.
4. Create tables for your database. Table structure can be found from tables file, navigate to back-end -> db -> tables.
5. Create .env file under back-end folder. the File must contain next data: 
<br>
DB_PASSWORD = your database password
<br>
DB = your database
<br>
DB_PORT = 3306
<br>
DB_HOST = "127.0.0.1"
<br>
DB_USER = database user
<br>
HOST = "localhost"
<br>
PORT = 5000
<br>
JWT_SECRET = your jwt secret (can be anything)
<br>
NODE_ENV=development
6. Frontend starts like any react app with *npm run dev* command. Backend start running also with *npm run dev* command. Note you must run commands under front-end folder or back-end folder.

## API Documentation (Swagger)
API docementation is created by using swagger.
1. first start back end
2. next navigate to http://localhost:5000/api-docs
