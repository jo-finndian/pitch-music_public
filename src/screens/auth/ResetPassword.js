import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert
} from "react-native";
import firebase from "firebase";

const ResetPassword = ({ navigation }) => {

  const [resetForm, setResetForm] = useState({
    email: "",
  });

  const onChangeTextEmail = (email) => {
    setResetForm({
      ...resetForm,
      email,
    });
  };

  const resetHandler = () => {
    return new Promise(() => {
      firebase
        .auth()
        .sendPasswordResetEmail(resetForm.email)
        .then((res) => {
            Alert.alert(
                "Email Sent",
                `A link to reset your password has been sent to ${resetForm.email}.` ,
                [
                  { text: "OK", onPress: () => navigation.navigate("Login") }
                ],
                { cancelable: false }
              );
        })
        .catch((err) => alert(err.message));
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pitch</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={resetForm.email}
        onChangeText={onChangeTextEmail}
      />
      <TouchableOpacity style={styles.button} onPress={resetHandler}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // style={styles.button}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText2}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkslateblue",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    color: 'white',
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "mediumpurple",
    borderRadius: 40,
    marginBottom: 10,
    padding: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
  buttonText2: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
