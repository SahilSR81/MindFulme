import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getContent } from '../services/api';

const contentTypes = ['quote', 'joke', 'game', 'yoga', 'story'];

export default function ContentFeed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    try {
      const initialFeed = await Promise.all(
        contentTypes.map(type => getContent(type))
      );
      setFeed(initialFeed);
    } catch (error) {
      console.error('Failed to fetch initial content:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.contentItem}>
      <Text style={styles.contentType}>{item.type.toUpperCase()}</Text>
      <Text style={styles.contentText}>{item.content}</Text>
      <Text style={styles.contentSource}>{item.source}</Text>
    </View>
  );

  const handleRefresh = async () => {
    await fetchInitialContent();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wellness Feed</Text>
      <FlatList
        data={feed}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        refreshing={false}
        onRefresh={handleRefresh}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Feed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  contentType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 5,
  },
  contentSource: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});