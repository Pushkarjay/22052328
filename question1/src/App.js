import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function TopUsers() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Top Users</h1>
      <ul className="list-disc pl-5">
        <li className="text-lg">Sample User: 5 posts</li>
      </ul>
    </div>
  );
}

function TrendingPosts() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Trending Posts</h1>
      <div className="border p-2 my-2 rounded bg-gray-100">
        <p className="text-lg">Sample trending post</p>
        <p className="text-sm text-gray-600">Comments: 10</p>
      </div>
    </div>
  );
}

function Feed() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Feed</h1>
      <div className="border p-2 my-2 rounded bg-gray-100">
        <p className="text-lg">Sample feed post</p>
        <img src="https://picsum.photos/200" alt="post" className="mt-2 rounded" />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopUsers />} />
        <Route path="/trending" element={<TrendingPosts />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;