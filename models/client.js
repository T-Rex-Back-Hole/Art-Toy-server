const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { minimize: false }
);

const Client = mongoose.model("client", clientSchema);
module.exports = Client;
