import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function TopUsers({ users, posts }) {
  const userPostCounts = Object.keys(users).map((id) => ({
    name: users[id],
    count: posts.filter((p) => p.userid === Number(id)).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Top Users</h1>
      <ul className="list-disc pl-5">
        {userPostCounts.map((u) => (
          <li key={u.name} className="text-lg">{u.name}: {u.count} posts</li>
        ))}
      </ul>
    </div>
  );
}

function TrendingPosts({ posts, comments }) {
  const postCommentCounts = posts.map((p) => ({
    ...p,
    commentCount: comments[p.id]?.length || 0,
  }));
  const maxComments = Math.max(...postCommentCounts.map((p) => p.commentCount));
  const trending = postCommentCounts.filter((p) => p.commentCount === maxComments);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Trending Posts</h1>
      {trending.map((p) => (
        <div key={p.id} className="border p-2 my-2 rounded bg-gray-100">
          <p className="text-lg">{p.content}</p>
          <p className="text-sm text-gray-600">Comments: {p.commentCount}</p>
        </div>
      ))}
    </div>
  );
}

function Feed({ posts }) {
  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Feed</h1>
      {sortedPosts.map((p) => (
        <div key={p.id} className="border p-2 my-2 rounded bg-gray-100">
          <p className="text-lg">{p.content}</p>
          <img src={`https://picsum.photos/200?random=${p.id}`} alt="post" className="mt-2 rounded" />
        </div>
      ))}
    </div>
  );
}

function App() {
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNTk5NDc2LCJpYXQiOjE3NDM1OTkxNzYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZlZDNjNjIwLTFiMGYtNDIwNS1hMWIyLTBkMGYyZDdkNDk5OCIsInN1YiI6InB1c2hrYXJqYXkuYWpheTFAZ21haWwuY29tIn0sImVtYWlsIjoicHVzaGthcmpheS5hamF5MUBnbWFpbC5jb20iLCJuYW1lIjoicHVzaGthcmpheSBhamF5Iiwicm9sbE5vIjoiMjIwNTIzMjgiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI2ZWQzYzYyMC0xYjBmLTQyMDUtYTFiMi0wZDBmMmQ3ZDQ5OTgiLCJjbGllbnRTZWNyZXQiOiJ4U3VkdHdKZmRlRFpUdkZCIn0.-DbDnDBe4SCCySP9FizuWasgBWr1P43ldvYimKFnWGc";
    fetch("http://20.244.56.144/evaluation-service/users", { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error("Users fetch error:", err));
    const fetchPostsAndComments = async () => {
      const postPromises = Object.keys(users).map((id) =>
        fetch(`http://20.244.56.144/evaluation-service/users/${id}/posts`, { headers: { Authorization: token } })
          .then((res) => res.json())
          .then((data) => data.posts)
      );
      const allPosts = (await Promise.all(postPromises)).flat();
      setPosts(allPosts);
      const commentPromises = allPosts.map((p) =>
        fetch(`http://20.244.56.144/evaluation-service/posts/${p.id}/comments`, { headers: { Authorization: token } })
          .then((res) => res.json())
          .then((data) => ({ [p.id]: data.comments }))
      );
      const allComments = Object.assign({}, ...(await Promise.all(commentPromises)));
      setComments(allComments);
    };
    if (Object.keys(users).length) fetchPostsAndComments();
  }, [users]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopUsers users={users} posts={posts} />} />
        <Route path="/trending" element={<TrendingPosts posts={posts} comments={comments} />} />
        <Route path="/feed" element={<Feed posts={posts} />} />
      </Routes>
    </Router>
  );
}

export default App;