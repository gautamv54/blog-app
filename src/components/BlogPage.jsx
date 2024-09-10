import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Ensure you export storage from your firebase configuration file

const BlogPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [file, setFile] = useState(null); // State for file input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, 'posts', id);
        const postSnapshot = await getDoc(postDoc);

        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          setPost(postData);
          setTitle(postData.title);
          setDescription(postData.description);
          setCoverImageUrl(postData.coverImageUrl);
        } else {
          setError('Post not found.');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post.');
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        title,
        description,
        coverImageUrl
      });
      alert('Post updated successfully! Refresh to see changes!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post.');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        const postRef = doc(db, 'posts', id);
        await deleteDoc(postRef);
        alert('Post deleted successfully!');
        navigate('/'); // Redirect to home page after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        setError('Failed to delete post.');
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const storageRef = ref(storage, `coverImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setCoverImageUrl(downloadURL);
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload image.');
      }
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="blog-page">
      <h1>{isEditing ? 'Edit Post' : post.title}</h1>
      {post.coverImageUrl && <img src={post.coverImageUrl} alt={post.title} className="cover-image" />}
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button onClick={handleUpload}>Upload Image</button>
          {coverImageUrl && <img src={coverImageUrl} alt="New cover" className="cover-image-preview" />}
          <button onClick={handleUpdate}>Update Post</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete Post</button>
        </div>
      ) : (
        <div>
          <p>{post.description}</p>
          <button onClick={() => setIsEditing(true)}>Edit Post</button>
          <button className="btn-danger" onClick={handleDelete}>Delete Post</button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
