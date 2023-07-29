const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  cpf: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sexo: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

class User {
    constructor(name, email, cpf, age, sex) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.age = age;
    this.sex = sex;
  }

  // Getters
  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getCPF() {
    return this.cpf;
  }

  getAge() {
    return this.age;
  }

  getSex() {
    return this.sex;
  }

  // Setters
  setName(name) {
    this.name = name;
  }

  setEmail(email) {
    this.email = email;
  }

  setCPF(cpf) {
    this.cpf = cpf;
  }

  setAge(age) {
    this.age = age;
  }

  setSex(sex) {
    this.sex = sex;
  }

  // CRUD operations
  async createUser() {
    try {
      const newUser = new UserModel({
        name: this.name,
        email: this.email,
        cpf: this.cpf,
        age: this.age,
        sex: this.sex,
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateUser(userId, updatedData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteUser(userId) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = User;
