const mongoose = require('mongoose');

module.exports = async function connect() {
  try {
    await mongoose.connect('mongodb+srv://20040301an:xM7l1AZkM4vPvwz9@cluster0.phkaqlp.mongodb.net/register', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connected Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
