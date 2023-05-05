const express = require('express');
const CookieParser = require('cookie-parser');
const publicRouter = require('./routers/publicRouter');
const privateRouter = require('./routers/privateRouter');
const authRouter = require('./routers/authRouter');
const resultsRouter = require('./routers/resultsRouter');
const { PUBLIC_DIR } = require('./utils/paths');
const errorsHandler = require('./routers/errorsHandler');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(PUBLIC_DIR, {
    index: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) return false;
        res.setHeader('Cache-Control', 'public, max-age=0');
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(CookieParser());
app.use(privateRouter, publicRouter);
app.use('/api', authRouter, resultsRouter);
app.use(errorsHandler);

app.listen(PORT, () => {
    console.log(`Server is up on Port: ${PORT}`);
});