import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
// import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Blog />} exact />
      <Route path="/blog/:slug" element={<BlogPost />} exact />
      <Route path='*' element={<Blog />} />
      {/* <Analytics /> */}
    </Routes>
  );
}

export default App;
