import express from "express";
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import artRoutes from './routes/artRoutes.js'; // note the .js extension
import userRoutes from "./routes/userRoutes.js";
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use("/images", express.static("images")); // Serve static files from images directory
app.use("/site_images", express.static("site_images")); // Serve static files from site_images directory
// Enable CORS for requests from the front-end
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "20mb" }));

//-----------Multer for file upload and download---------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type');
      error.code = 'INVALID_FILE_TYPE';
      return cb(error, false);
    }

    cb(null, true);
  }
});

// swagger setup
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Art Gallery",
      version: "0.1.0",
      description:
        "CRUD API of an art gallery application",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })

);

// register routes
artRoutes(app, upload);
userRoutes(app);

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server listening in http://${process.env.HOST}:${process.env.PORT}`);
});