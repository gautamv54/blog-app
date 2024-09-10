import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Check if the user is authenticated
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page if not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSavePost = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!isAuthenticated) {
      setError('You must be logged in to create a post.');
      return;
    }

    try {
      let coverImageUrl = '';

      if (coverImage) {
        const imageRef = ref(storage, `coverImages/${coverImage.name}`);
        await uploadBytes(imageRef, coverImage);
        coverImageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'posts'), {
        title,
        description,
        coverImageUrl,
        time: serverTimestamp(), // Add timestamp
      });

      alert('Post added successfully!');
      setTitle('');
      setDescription('');
      setCoverImage(null);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.message);
      console.error('Error adding post:', err);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSavePost}>
        <h2>Create Post</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
