import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import SuperAdmin from '../models/SuperAdmin.js';

const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.admin = await SuperAdmin.findById(decoded.id).select('-password');

            if (!req.admin) {
                res.status(401);
                throw new Error('Not authorized, invalid admin token');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protectAdmin };