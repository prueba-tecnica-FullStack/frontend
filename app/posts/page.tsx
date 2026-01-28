'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  message: string;
  createdAt: string;
  user: {
    email: string;
  };
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const res = await fetch('http://localhost:3000/posts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    const data = await res.json();
    setPosts(data);
  }

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      setError('Error creando publicación');
      return;
    }

    setMessage('');
    fetchPosts();
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Publicaciones</h1>

      {/* Crear Post */}
      <form onSubmit={createPost} className="mb-6">
        <textarea
          className="w-full border p-2 mb-2"
          placeholder="¿Qué estás pensando?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="bg-black text-white px-4 py-2">
          Publicar
        </button>
      </form>

      {/* Listado */}
      {posts.map((post) => (
        <div key={post.id} className="border p-4 mb-3">
          <p className="mb-1">{post.message}</p>
          <small className="text-gray-500">
            {post.user.email} —{' '}
            {new Date(post.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </main>
  );
}
