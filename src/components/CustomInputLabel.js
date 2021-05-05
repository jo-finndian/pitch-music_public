import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';

export default function CustomTextInput({ style, label, ...otherProps }) {
  return (
    <Text
      style={[styles.label, style]}
      {...otherProps}>
        {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: 'uppercase',
    fontSize: 10,
    marginBottom: 12,
    fontFamily: 'Poppins_500Medium',
  },
});