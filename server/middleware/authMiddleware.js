import admin from '../config/firebaseAdmin.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import FleetManager from '../models/fleetmanager.js';
import Driver from '../models/driver.js';

const protect = asyncHandler(async (req,res,next)=>{
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization.split(' ')[1];

            const decodeToken = await admin.auth().verifyIdToken(token);
            req.user = await FleetManager.findOne({firebaseUID: decodeToken.uid});

            if(!req.user){
                res.status(404);
                throw new Error('User profile not found in the database');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }

        if(!token){
            res.status(401);
            throw new Error('Not authorized, no token')
        }
    }
});

const protectDriver = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using your Local Secret (NOT Firebase)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get driver from the token
      req.user = await Driver.findById(decoded.id).select('-password');

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

export { protect, protectDriver };