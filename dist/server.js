import express from 'express';
import bodyParser from 'body-parser';
import { db } from './models/index.js';
import TrainingRoutes from "./routes/training.routes.js";
import AdminRoutes from "./routes/admin.routes.js";
import SubjectRoutes from "./routes/subject.routes.js";
const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to dynasty-assessment application" });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
// register all the routers
app.use('/api/trainings', TrainingRoutes);
app.use('/api/subjects', SubjectRoutes);
app.use('/api/admin', AdminRoutes);
app.use((err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    }
    else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({
        status: 500,
        message: err.message,
        error: err
    });
});
await db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});
console.log("Connected to the database!");
// await recreateSampleData();
