const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    required: true,
  },
});

const EquipmentModel = mongoose.model('Equipment', equipmentSchema);

class Equipment {
  constructor(name, description, quantity, quality) {
    this._name = name;
    this._description = description;
    this._quantity = quantity;
    this._quality = quality;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    if (value < 0) {
      throw new Error('Quantity must be a positive number');
    }
    this._quantity = value;
  }

  get quality() {
    return this._quality;
  }

  set quality(value) {
    if (!['optimal', 'good', 'defective'].includes(value)) {
      throw new Error('Invalid quality value');
    }
    this._quality = value;
  }

  async saveEquipment() {
    try {
      const newEquipment = new EquipmentModel({
        name: this.name,
        description: this.description,
        quantity: this.quantity,
        quality: this.quality,
      });
      await newEquipment.save();
      return newEquipment;
    } catch (error) {
      throw new Error('Equipment could not be saved');
    }
  }


  static async getAllEquipments() {
    try {
      return await EquipmentModel.find();
    } catch (error) {
      throw new Error('Error fetching equipments');
    }
  }

  static async getEquipmentById(id) {
    try {
      return await EquipmentModel.findById(id);
    } catch (error) {
      throw new Error('Error fetching equipment by ID');
    }
  }

  async updateEquipment() {
    try {
      console.log('Função Update');
      return await EquipmentModel.findByIdAndUpdate(
        this._id,
        { name: this.name, description: this.description, quantity: this.quantity, quality: this.quality },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error updating equipment');
    }
  }

  static async deleteEquipment(id) {
    try {
      return await EquipmentModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting equipment');
    }
  }

  static async getAllFilterEquipments(filter = {}) {
    return EquipmentModel.find(filter);
  }
}

module.exports = Equipment;
