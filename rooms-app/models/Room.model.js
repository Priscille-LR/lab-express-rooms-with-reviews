const { Schema, model } = require('mongoose');

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      unique: true,
      trim: true,
    },
    imageUrl: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  {
    timestamps: true,
  }
);

const Room = model('Room', roomSchema);

module.exports = Room;
