const express = require('express');
const publicRouter = require('./routers/publicRouter');
const privateRouter = require('./routers/privateRouter');
const authRouter = require('./routers/authRouter');
const { PUBLIC_DIR } = require('./utils/paths');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(PUBLIC_DIR));
app.use(express.json());

app.use(publicRouter, privateRouter);
app.use('/api', authRouter);

app.listen(PORT, () => {
    console.log(`Server is up on Port: ${PORT}`);
});