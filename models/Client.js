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
    enum: ['Masculino', 'Feminino', 'Outro'],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Date,
    required: true,
  },
});

const ClientModel = mongoose.model('Client', ClientSchema);

class Client {
  constructor(name, email, cpf, age, sex, isPaid, data) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.age = age;
    this.sex = sex;
    this.isPaid = isPaid;
    this.data = data;
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

  getData() {
    return this.data;
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

  setData(data) {
    this.data = data;
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
        data: this.data,
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

  static async getClientByCPF(cpf) {
    try {
      return await ClientModel.findOne({ cpf });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateClient(clientId, updatedData) {
    try {
      return await ClientModel.findByIdAndUpdate(
        this._id,
        { name: this.name, email: this.email, cpf: this.cpf, sex: this.sex, isPaid: this.isPaid, date: this.date},
        { new: true }
      );
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
  
  static async updatePaymentStatus(clientId) {
    try {
      const client = await ClientModel.findById(clientId);

      if (!client) {
        throw new Error('Client not found');
      }
      await ClientModel.findByIdAndUpdate(clientId, { isPaid: true, data: new Date() });
      
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateAllPaymentsStatus() {
    try {
      const clients = await ClientModel.find();
      const currentDate = new Date();

      for (const client of clients) {
        const clientDate = new Date(client.data);
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);

        if (clientDate < oneMonthAgo) {
          await ClientModel.findByIdAndUpdate(client._id, { isPaid: false });
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllFilterClients(filter = {}) {
    return ClientModel.find(filter);
  }

  static async selectEquipmentForWorkout(workout, equipmentId) {
    try {
      workout.selectEquipment(equipmentId);
      await workout.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findCPFById(clientId) {
    try {
      const client = await ClientModel.findById(clientId);
      return client.cpf;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
}

module.exports = Client;