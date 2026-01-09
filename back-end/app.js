import express from "express";
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import artRoutes from './routes/artRoutes.js'; // note the .js extension
import userRoutes from "./routes/userRoutes.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images")); // Serve static files from images directory
app.use("/site_images", express.static("site_images")); // Serve static files from site_images directory
// Enable CORS for requests from the front-end
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

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

const upload = multer({ storage: storage })
//-------------------------------------------------------------


/* // get all arts data stored in db
app.get("/arts", async(req, res) => {
  try {
      const data = await pool.query(
        `SELECT * from arts;`
      );
      res.status(202).json({
        arts: data[0],
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
});

// get art with specific artFilePath name
app.get("/arts/:filename", async (req, res) => {
  console.log(req.params);
  try {
    const data = await pool.query(
      `SELECT * FROM arts WHERE artFilePath = '${req.params.filename}';`
    );
    res.status(202).json({
      art: data[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

*/

// register routes
artRoutes(app, upload);
userRoutes(app);

// start server

app.listen(process.env.PORT, () => {
  console.log(`Server listening in http://${process.env.HOST}:${process.env.PORT}`);
});