# Art Gallery
Art gallery is under development, its not fully responsive and some features are not implemented yet. Art gallery is web application that is used for sharing art. Anyone can search and view artworks made by any user. Logged users can post new arts and comment any arts. The User can also delete and update their own existing art. Anyone can create an account. App uses jwt token authentication. Macine learning is used for art recommendations.

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
JWT_RESET_SECRET= you reset secret (can be anything)
<br>
FRONTEND_URL=your url example http://localhost:5173
<br>
EMAIL_USER= your cms email adress
<br>
EMAIL_PASS= your cms password, this is not your email's actual password
<br>
NODE_ENV=development

6. Create .env file inside recommendation-service folder the File must contain next data:
<br>
DB_PASSWORD = your db password
<br>
DB_NAME = your database name
<br>
DB_PORT = 3306
<br>
DB_HOST = "127.0.0.1"
<br>
DB_USER = your database user
<br>
7. Navigate to front-end/art-gallery create .env file. File contains next data:
<br>
VITE_API_URL= your api url example http://localhost:5000
<br>
8. Frontend starts like any react app with **npm run dev** command. Backend start running also with *npm run dev* command. Note you must run commands under front-end folder or back-end folder. Recommendation-service run by using **python -m uvicorn main:app --reload** command inside recommendation-service folder.

## API Documentation (Swagger)
API docementation is created by using swagger.
1. first start back end
2. then navigate to http://localhost:5000/api-docs
