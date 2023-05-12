import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, Button } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CardTask } from "../components/CardTask";
import { getTasks, addTask, updateTask, removeTask } from "../api/task";

export const TaskScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const [newTaskDescription, setNewTaskDescription] = useState(""); // Add this line

  const addNewTask = () => {
    if (newTaskDescription.trim() === "") {
      return;
    }

    const newTask = { description: newTaskDescription, done: false };
    addTask(newTask)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        setNewTaskDescription(""); // Reset the new task description
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const deleteTask = (taskId) => {
    removeTask(taskId)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <CardTask
      task={item}
      navigation={navigation}
      taskDoneChange={mutation.mutate}
      onDelete={() => deleteTask(item.objectId)}
    />
  );

  return (
    <View style={styles.container}>
      {isFetching && <Text>IS FETCHING</Text>}
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter task description"
          onChangeText={setNewTaskDescription}
        />
        <Button title="Add Task" onPress={addNewTask} />
      </View>
      <FlatList
        style={styles.flatList}
        data={data.results}
        keyExtractor={(item) => item.objectId}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
});
