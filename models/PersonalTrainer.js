const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const PersonalModel = mongoose.model('Personal', PersonalSchema);

class PersonalTrainer {
  constructor(name, age, username, password) {
    this.name = name;
    this.age = age;
    this.username = username;
    this.password = password;
  }

  // Getters
  getName() {
    return this.name;
  }

  getAge() {
    return this.age;
  }

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  // Setters
  setName(name) {
    this.name = name;
  }

  setAge(age) {
    this.age = age;
  }

  setUsername(username) {
    this.username = username;
  }

  setPassword(password) {
    this.password = password;
  }

  // CRUD operations
  async createPersonal() {
    try {
      const newPersonal = new PersonalModel({
        name: this.name,
        age: this.age,
        username: this.username,
        password: this.password
      });
      await newPersonal.save();
      return newPersonal;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllPersonals() {
    try {
      return await PersonalModel.find();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPersonalById(personalId) {
    try {
      const personal = await PersonalModel.findById(personalId);
      return personal;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPersonalUser(username) {
    try {
      return await PersonalModel.findOne({username});
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePersonal() {
    try {
      return await PersonalModel.findByIdAndUpdate(
        this._id,
        { name: this.name, age: this.age, username: this.username, password: this.password },
        { new: true }
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deletePersonal(personalId) {
    try {
      const deletedPersonal = await PersonalModel.findByIdAndDelete(personalId);
      return deletedPersonal;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = PersonalTrainer;