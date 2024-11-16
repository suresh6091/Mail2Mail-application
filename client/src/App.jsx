import React from 'react';
import EmailForm from './EmailForm'; // Assuming EmailForm is in the same directory

const App = () => {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Email Sender App</h1>
      </header>

      <main className="mt-8">
        <EmailForm />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; 2024 Your Company Name</p>
      </footer>
    </div>
  );
};

export default App;
