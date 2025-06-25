// components/MyButton.js
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function MyButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: '#007bff', padding: 12, borderRadius: 5 },
  text: { color: '#fff', textAlign: 'center' },
});
