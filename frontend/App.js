import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.log('Failed to load posts:', error);
      // Fallback mock data
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const getMockPosts = () => [
    {
      _id: '1',
      title: 'Hotels in Bali',
      excerpt: 'Great deals in Bali',
      location: 'Bali',
      hotelData: [
        { name: 'Bali Resort', price: 150, rating: 4.5 },
        { name: 'Beach Hotel', price: 120, rating: 4.2 }
      ],
      publishedAt: new Date().toISOString()
    }
  ];

  const renderHotel = (hotel, index) => (
    <View key={index} style={styles.hotelCard}>
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <Text style={styles.hotelPrice}>${hotel.price}/night</Text>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postLocation}>📍 {item.location}</Text>
      <Text style={styles.postExcerpt}>{item.excerpt}</Text>
      
      <View style={styles.hotelsList}>
        {item.hotelData.map(renderHotel)}
      </View>
      
      <Text style={styles.postDate}>
        {new Date(item.publishedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading hotel deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hotel Deals</Text>
        <Text style={styles.headerSubtitle}>Updated every 2 hours</Text>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item._id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    flex: 1
  },
  postCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  postLocation: {
    color: '#007AFF',
    marginBottom: 5
  },
  postExcerpt: {
    color: '#666',
    marginBottom: 10
  },
  hotelsList: {
    marginBottom: 10
  },
  hotelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  hotelName: {
    flex: 1
  },
  hotelPrice: {
    fontWeight: 'bold',
    color: '#007AFF'
  },
  postDate: {
    color: '#999',
    fontSize: 12
  }
});