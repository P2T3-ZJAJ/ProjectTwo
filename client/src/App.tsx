// import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import LoginButton from './components/LoginButton';
import CardGrid from './components/CardGrid';
import { useState } from 'react';

const App: React.FC = () => {
  const [cards] = useState<{ title: string; description: string; image: string }[]>([
    { title: 'Card 1', description: 'Description 1', image: 'image1.jpg' },
    { title: 'Card 2', description: 'Description 2', image: 'image2.jpg' },
  ]);
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleLogin = () => {
    console.log("User has been summoned");
  };

  return (
    <div className='app'>
      <Navbar />
      <SearchBar onSearch={handleSearch} />
      <LoginButton onLogin={handleLogin} />
      <CardGrid cards={cards} />
      <main className='container pt-5'>
        <Outlet />
      </main>
    </div>
  );
};

export default App
