const jwt = require('jsonwebtoken');

// Fallback JWT_SECRET if environment variable is not set
const JWT_SECRET = process.env.JWT_SECRET || '2b5d94eb644c2edf7c4e1a46b716e137517e3bb0e6101f2dd01f6785a6ae1de0a8e6193c495d3aea3c5eb53f4a42c69ac964b520b834a8aedcdf69369c503386';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

const generateAccessToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
