const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
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
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

const ClientModel = mongoose.model('Client', ClientSchema);

class Client {
  constructor(name, email, cpf, age, sex) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.age = age;
    this.sex = sex;
    this.isPaid = false; // Default value is false, assuming the client has not paid initially
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

  getIsPaid() {
    return this.isPaid;
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

  setIsPaid(isPaid) {
    this.isPaid = isPaid;
  }

  // CRUD operations
  async createClient() {
    try {
      const newClient = new ClientModel({
        name: this.name,
        email: this.email,
        cpf: this.cpf,
        age: this.age,
        sex: this.sex,
        isPaid: this.isPaid,
      });
      await newClient.save();
      return newClient;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllClients() {
    try {
      return await ClientModel.find();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getClientById(clientId) {
    try {
      const client = await ClientModel.findById(clientId);
      return client;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getClientByEmail(email) {
    try {
      return await ClientModel.findOne({ email });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateClient(clientId, updatedData) {
    try {
      const updatedClient = await ClientModel.findByIdAndUpdate(clientId, updatedData, {
        new: true,
      });
      return updatedClient;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteClient(clientId) {
    try {
      const deletedClient = await ClientModel.findByIdAndDelete(clientId);
      return deletedClient;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = Client;