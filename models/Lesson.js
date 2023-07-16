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
});

const LessonModel = mongoose.model('Lesson', lessonSchema);

class Lesson {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  async save() {
    try {
      const newLesson = new LessonModel({
        title: this.title,
        description: this.description,
      });
      await newLesson.save();
      return newLesson;
    } catch (error) {
      throw new Error('Lesson could not be saved');
    }
  }

  static async getAll() {
    try {
      return await LessonModel.find();
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

  async update() {
    try {
      return await LessonModel.findByIdAndUpdate(
        this._id,
        { title: this.title, description: this.description },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error updating lesson');
    }
  }

  async delete() {
    try {
      return await LessonModel.findByIdAndDelete(this._id);
    } catch (error) {
      throw new Error('Error deleting lesson');
    }
  }
}

module.exports = Lesson;
