
import React from 'react';
import { useParams } from 'react-router-dom';

const Article = () => {
  const { slug } = useParams();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Article: {slug}</h1>
      <p className="text-lg">Article content will go here.</p>
    </div>
  );
};

export default Article;
