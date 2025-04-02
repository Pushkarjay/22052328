import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function TopUsers({ users, posts }) {
  const userPostCounts = Object.keys(users)
    .map((id) => ({
      name: users[id],
      count: posts.filter((p) => p.userid === Number(id)).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

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
  const maxComments = Math.max(...postCommentCounts.map((p) => p.commentCount), 0);
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = "Bearer YOUR_TOKEN_HERE";

    fetch("http://20.244.56.144/evaluation-service/users", { headers: { Authorization: token } })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => setError("Failed to fetch users: " + err.message));

    const fetchPostsAndComments = async () => {
      try {
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
      } catch (err) {
        setError("Failed to fetch posts or comments: " + err.message);
      }
    };

    if (Object.keys(users).length) fetchPostsAndComments();
  }, [users]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!Object.keys(users).length) return <div className="p-4">Loading...</div>;

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