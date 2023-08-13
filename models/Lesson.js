const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  personal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personal',
    required: true,
  },
});

const LessonModel = mongoose.model('Lesson', lessonSchema);

class Lesson {
  constructor(title, description, data, time, personalId) {
    this.title = title;
    this.description = description;
    this.data = data;
    this.time = time;
    this.personalId = personalId;
  }

  get getTitle() {
    return this.title;
  }

  set setTitle(title) {
    this.title = title;
  }

  get getDescription() {
    return this.description;
  }

  set setDescription(description) {
    this.description = description;
  }

  get getData() {
    return this.data;
  }

  set setData(data) {
    this.data = data;
  }

  get getTime() {
    return this.time;
  }

  set setTime(time) {
    this.time = time;
  }

  get getPersonalId() {
    return this.personalId;
  }

  set setPersonalId(personalId) {
    this.personalId = personalId;
  }

  async save() {
    try {
      const newLesson = new LessonModel({
        title: this.title,
        description: this.description,
        data: this.data,
        time: this.time,
        personal: this.personalId,
      });
      await newLesson.save();
      return newLesson;
    } catch (error) {
      throw new Error('Lesson could not be saved');
    }
  }

  static async getAll() {
    try {
      return await LessonModel.find().populate('personal', 'name');
    } catch (error) {
      throw new Error('Error fetching lessons');
    }
  }

  static async getById(id) {
    try {
      return await LessonModel.findById(id);
    } catch (error) {
      throw new Error('Error fetching lesson by ID');
    }
  }

  async updateLesson() {
    try {
      return await LessonModel.findByIdAndUpdate(
        this._id,
        { title: this.title,
         description: this.description,
         data: this.data, 
         time: this.time,
         personal: this.personalId
        },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error updating lesson');
    }
  }

  static async getLessonById(lessonId) {
    try {
      const lesson = await LessonModel.findById(lessonId);
      return lesson;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async delete(id) {
    try {
      return await LessonModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error deleting lesson');
    }
  }
}

module.exports = Lesson;