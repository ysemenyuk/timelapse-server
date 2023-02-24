import jwt from 'jsonwebtoken';

const secretkey = process.env.SECRET_KEY;

const sign = (userId) => jwt.sign({ userId }, secretkey, { expiresIn: '1h' });
const verify = (token) => jwt.verify(token, secretkey);

export default { sign, verify };
