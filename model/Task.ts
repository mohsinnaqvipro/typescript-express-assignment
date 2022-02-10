const mongoos = require("mongoose");

const TaskSchema = new mongoos.Schema({
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoos.model("task", TaskSchema);
