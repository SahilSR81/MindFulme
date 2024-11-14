import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MoodTracker from './MoodTracker';
import ContentFeed from './ContentFeed';
import { getContent } from '../services/api';

export default function HomeScreen() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await getContent('quote');
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Wellness App</Text>
      <MoodTracker />
      {content && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{content.content}</Text>
          <Text style={styles.quoteAuthor}>- {content.source}</Text>
        </View>
      )}
      <ContentFeed />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quoteContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    textAlign: 'right',
  },
});