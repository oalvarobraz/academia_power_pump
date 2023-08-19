const mongoose = require('mongoose');
const Client = require('./Client');

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
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  clientCPF: {
    type: String,
    required: true,
  },
  selectedEquipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
  }],
  repetitions: {
    type: String,
  }
});

const WorkoutModel = mongoose.model('Workout', workoutSchema);

class Workout {

  constructor(title, description, dayOfWeek, clientId, clientCPF, selectedEquipment, repetitions) {
    this.title = title;
    this.description = description;
    this.dayOfWeek = dayOfWeek;
    this.clientId = clientId;
    this.clientCPF = clientCPF;  
    this.selectedEquipment = selectedEquipment || [];
    this.repetitions = repetitions;
  }


  async save() {
    try {
      const newWorkout = new WorkoutModel({
        title: this.title,
        description: this.description,
        dayOfWeek: this.dayOfWeek,
        client: this.clientId,
        clientCPF: this.clientCPF,
        selectedEquipment: this.selectedEquipment,
        repetitions: this.repetitions,
      });
      await newWorkout.save();
      return newWorkout;
    } catch (error) {
      console.log(error)
      throw new Error('Workout could not be saved');
    }
  }

  static async workoutExistsForDay(clientCPF, dayOfWeek) {
    try {
      const existingWorkout = await WorkoutModel.findOne({ clientCPF, dayOfWeek });
      return !!existingWorkout;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  

  static async findWorkoutByCPF(clientCPF) {
      try {
        //console.log('Searching for workout with CPF:', clientCPF);
        const workout = await WorkoutModel.findOne({ clientCPF });
        //console.log('Found Workout:', workout);
        return workout;
      } catch (error) {
        throw new Error(error.message);
      }
  }

  static async findCPFById(clientId) {
    try {
      const client = await Client.getClientById(clientId); 
      return client.cpf;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateWorkout(clientCPF, dayOfWeek, title, description, selectedEquipment) {
    try {
      const existingWorkout = await WorkoutModel.findOne({ clientCPF, dayOfWeek });
      
      if (!existingWorkout) {
        throw new Error('No existing workout found for this day');
      }
      
      existingWorkout.title = title;
      existingWorkout.description = description;
      existingWorkout.selectedEquipment = selectedEquipment;
  
      await existingWorkout.save();
      return existingWorkout;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findExistingWorkout(clientId, dayOfWeek) {
    try {
      const clientCPF = await Client.findCPFById(clientId);
      return await WorkoutModel.findOne({ clientCPF, dayOfWeek });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findExistingWorkoutbyCPF(clientCPF, dayOfWeek) {
    try {
      const workout = await WorkoutModel.findOne({ clientCPF, dayOfWeek }).populate('selectedEquipment');
      //console.log('workout by cpf and day: ', workout);
      return workout;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = Workout;
