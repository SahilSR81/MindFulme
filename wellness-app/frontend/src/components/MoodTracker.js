import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { recordMood } from '../services/api';

const emojis = ['😢', '😕', '😐', '🙂', '😄'];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelection = async (mood) => {
    setSelectedMood(mood);
    try {
      await recordMood(mood);
      // You can add some feedback here, like a success message
    } catch (error) {
      console.error('Failed to record mood:', error);
      // Show error message to user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.emojiContainer}>
        {emojis.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.emojiButton,
              selectedMood === index + 1 && styles.selectedEmoji,
            ]}
            onPress={() => handleMoodSelection(index + 1)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiButton: {
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedEmoji: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9',
  },
  emoji: {
    fontSize: 30,
  },
});