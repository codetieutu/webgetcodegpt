import express from 'express';
import webRouter from './router/web.js';
import apiRouter from './router/api.js';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use('/', webRouter)
app.use('/api', apiRouter);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
