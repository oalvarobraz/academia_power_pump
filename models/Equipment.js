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
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.quality = quality;
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
}

module.exports = Equipment;
