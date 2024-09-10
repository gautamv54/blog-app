import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom'; // Import Link for navigation

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const postsSnapshot = await getDocs(postsCollection);
        const postsList = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts.');
      }
    };

    fetchPosts();
  }, []);

  // function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div>
      <h1>Posts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h2>{truncateText(post.title, 40)}</h2>
            {post.coverImageUrl && <img src={post.coverImageUrl} alt={post.title} className="cover-image" />}
            <p>{truncateText(post.description, 200)}</p>
            <Link to={`/blog/${post.id}`}>Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
