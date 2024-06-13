import React, { useEffect, useState, useRef } from 'react';
import './index.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {


    socketRef.current = new WebSocket("wss://ws-be-60wr.onrender.com");

    socketRef.current.onopen = () => {
      console.log('Connected to server');
    };

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from server');
    };

    socketRef.current.onerror = () => {
      console.log('Error in connection');
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = (e:any) => {
    e.preventDefault();
    if (socketRef.current && input) {
      socketRef.current.send(input);
      setInput('');
    }
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="font-bold text-3xl mb-8">Who is chatting?</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col space-y-4">
          <ul className="flex flex-col space-y-2 overflow-y-auto max-h-64">
            {messages.map((msg, index) => (
              <li key={index} className="p-2 bg-blue-100 rounded-lg">
                {msg}
              </li>
            ))}
          </ul>
            <form onSubmit={sendMessage} className='flex space-x-2'>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter message"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Send
            </button>
            </form>
        </div>
      </div>
    </div>
    <footer className='bg-blue-400 items-center flex justify-center'>
      <div className='text-center'>
      <h1>Chat anonymously about anything</h1>
      <h1>Do not do unethical chats</h1>
      </div>
    </footer>
    </>
  );
};

export default App;
