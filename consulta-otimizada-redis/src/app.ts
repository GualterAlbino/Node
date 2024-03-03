import express from 'express';
import UserController from './controllers/UserController';

const app = express();

app.listen(3000);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/users', UserController.find);

app.get('/usersCache', UserController.findCache);
