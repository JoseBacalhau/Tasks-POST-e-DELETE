import React from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity } from "react-native";

export const CardTask = ({ task, taskDoneChange, onDelete }) => {
  const handleChange = () => {
    taskDoneChange({ objectId: task.objectId, done: !task.done });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskDescription}>
        {task.description} - {task.done ? "feita" : "a fazer"}
      </Text>
      <View style={styles.buttonsContainer}>
        <Switch value={task.done} onValueChange={handleChange} />
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    backgroundColor: "floralwhite",
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  taskDescription: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "red",
  },
});
