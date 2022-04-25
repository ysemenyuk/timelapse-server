import jwt from 'jsonwebtoken';

const sign = (userId) => jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' });

const verify = (token) => jwt.verify(token, process.env.SECRET_KEY);

export default { sign, verify };
