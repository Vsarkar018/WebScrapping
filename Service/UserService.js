const UserRepository = require("../Repository/UserRepo");
const { StatusCodes } = require("http-status-codes");
const { getToken, validatePassword } = require("../utils/password");
const { Unauthorized, NotFound } = require("../errors");

const repository = new UserRepository();

module.exports = class UserService {
  constructor() {}

  async CreateUser(req, res) {
    try {
      const input = req.body;
      const user = await repository.createAccount(input);
      const token = getToken(user._id, user.name);
      res.status(StatusCodes.OK).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  async UserLogin(req, res) {
    try {
      const input = req.body;
      const user = await repository.findAccount(input.email);
      if (!user) {
        throw new Unauthorized("User Doesn't exists");
      }

      const isPasswordCorrect = await validatePassword(
        user.password,
        input.password
      );
      if (!isPasswordCorrect) {
        throw new Unauthorized("Wrong Password");
      }
      const token = getToken(user._id, user.name);
      res.status(StatusCodes.OK).json({ token });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
  async getAllUrl(req, res) {
    try {
      const { userId } = req.user;
      const urlData = await repository.getAllUrlId(userId);
      res.status(StatusCodes.OK).json({ urlData });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
};
