const UserModel = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  /* USER VALIDATION HANDLING */
  // const { name, email, password } = req.body;

  // if (!name || !email || !password) {
  //   throw new BadRequestError('Please provide name, email and password');
  // }

  /* MONGOOSE VALIDATORS DOES THE JOB */

  /* We should never store the password in simple strings*/

  /* 
    Instead of writing functionality of hashing here we can add it 
    in the USER model itself
  */

  /* 
    Instead of generating token here we can add it in mongoose instance methods
    in the USER model itself
  */

  const user = await UserModel.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  // password check
  const isPassword = await user.checkPassword(password);
  if (!isPassword) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
