const mongoose = require('mongoose');

module.exports = async function connect() {
  try {
    await mongoose.connect('mongodb+srv://20040301an:534v5UeLW8tdrYzC@cluster0.nbfdexu.mongodb.net/student', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
