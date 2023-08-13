const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dayOfWeek: {
    type: String, // Pode ser 'Segunda', 'Terça', etc.
    required: true,
  },
  personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  selectedEquipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
  }],
});

const WorkoutModel = mongoose.model('Workout', workoutSchema);

class Workout {
  #title;
  #description;
  #dayOfWeek;
  #personalId;
  #clientId;
  #selectedEquipment;

  constructor(title, description, dayOfWeek, personalId, clientId) {
    this.#title = title;
    this.#description = description;
    this.#dayOfWeek = dayOfWeek;
    this.#personalId = personalId;
    this.#clientId = clientId;
    this.#selectedEquipment = [];
  }

  // Getters
  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get dayOfWeek() {
    return this.#dayOfWeek;
  }

  get personalId() {
    return this.#personalId;
  }

  get clientId() {
    return this.#clientId;
  }

  get selectedEquipment() {
    return this.#selectedEquipment;
  }

  // Setters
  set title(title) {
    this.#title = title;
  }

  set description(description) {
    this.#description = description;
  }

  set dayOfWeek(dayOfWeek) {
    this.#dayOfWeek = dayOfWeek;
  }

  set personalId(personalId) {
    this.#personalId = personalId;
  }

  set clientId(clientId) {
    this.#clientId = clientId;
  }

  // Custom methods
  selectEquipment(equipmentId) {
    this.#selectedEquipment.push(equipmentId);
  }

  async save() {
    try {
      const newWorkout = new WorkoutModel({
        title: this.#title,
        description: this.#description,
        dayOfWeek: this.#dayOfWeek,
        personal: this.#personalId,
        client: this.#clientId,
        selectedEquipment: this.#selectedEquipment,
      });
      await newWorkout.save();
      return newWorkout;
    } catch (error) {
      throw new Error('Workout could not be saved');
    }
  }
}

module.exports = Workout;
