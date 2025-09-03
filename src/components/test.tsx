import React, { useState, useRef, useEffect } from 'react';
import { 
  handleExecutionStreaming, 
  createUserMessage,
  createErrorMessage,
} from './utils';
import './index.css';

// Message type definition
type Message = {
  id: number;
  role: 'user' | 'assistant';
  type: 'text' | 'image' | 'audio';
  content: string;
  file?: string;
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // const [input, setInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [streamingData, setStreamingData] = useState<string[]>([]);
  
  const chatboxRef = useRef<HTMLDivElement>(null);
  
  const baseURL = 'https://dev.studio.bluemesh.ai/flow/execution/v3/d184cffc-60f4-45b1-8df1-4b899833ef5a';

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, streamingData]);

  const handleSend = async () => {
    if (!file) return;

    console.log('Sending file:', file);

    setLoading(true);
    setLoadingText('Processing your request...');
    setStreamingData([]);

    // Store file reference before it might be cleared
    const currentFile = file;
    
    // Create FormData - FIXED: Remove Content-Type header to let browser set it with boundary
    const formData = new FormData();
    formData.append('file', currentFile);
    const payload = { input: 'convert the passport image to text', chatHistory: messages };
    formData.append('payload', JSON.stringify(payload));

    // Add user message
    const userMessage = createUserMessage(
      currentFile.name,
      'image',
      URL.createObjectURL(currentFile)
    );

    setMessages(prev => [...prev, userMessage]);

    try {
      let finalResponse: any = '';
      const streamData: string[] = [];
      let lastchunk: any = null;

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log('Sending to:', baseURL);

      // FIXED: Pass FormData directly, not JSON
      await handleExecutionStreaming(baseURL, formData, async (chunk: any, done: boolean) => {
        if (chunk && !done) {
          lastchunk = chunk;
          console.log('Received chunk:', chunk);
          const nodeIds = Object.keys(chunk);
          const lastNodeId = nodeIds[nodeIds.length - 1];
          const output = lastchunk[lastNodeId]?.raw;
          if (typeof output === 'string') {
            streamData.push(output);
            setStreamingData([...streamData]);
          }
        }

        if (done) {
          const finalChunk = lastchunk;
          if (finalChunk) {
            const nodeIds = Object.keys(finalChunk);
            const lastNodeId = nodeIds[nodeIds.length - 1];
            finalResponse = finalChunk[lastNodeId];
          }
        }
      });

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        type: 'text',
        content: finalResponse?.raw || 'No response',
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, createErrorMessage() as Message]);
    } finally {
      setLoading(false);
      setLoadingText('');
      setStreamingData([]);
      setFile(null);
    }
  };

  const renderMessage = (message: Message) => {
    if (message.type === 'audio' && message.file) {
      return (
        <>
          <p className="message-content">{message.content}</p>
          <audio controls className="message-audio">
            <source src={message.file} type="audio/wav" />
          </audio>
        </>
      );
    } else if (message.type === 'image' && message.file) {
      return (
        <>
          <p className="message-content">{message.content}</p>
          <img src={message.file} alt="Response" className="message-image" />
        </>
      );
    } else {
      return <div>{message.content}</div>;
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <h3 className="chatbot-title">Your AI Application</h3>
      </div>
      
      {/* Messages */}
      <div ref={chatboxRef} className="chatbot-messages">
        {messages.map(message => (
          <div key={message.id} className={`message-container ${message.role}`}>
            <div className={`message-bubble ${message.role} ${message.type === 'audio' ? 'audio' : ''}`}>
              {renderMessage(message)}
            </div>
          </div>
        ))}
        
        {/* Streaming data display */}
        {loading && streamingData.length > 0 && (
          <div className="message-container assistant">
            <div className="message-bubble assistant streaming">
              <div>{streamingData.join('')}</div>
              <div className="typing-indicator">Typing...</div>
            </div>
          </div>
        )}
        
        {loading && streamingData.length === 0 && (
          <div className="loading-text">{loadingText}</div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="chatbot-input">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="file-input"
        />
        <button
          onClick={handleSend}
          disabled={loading || !file}
          className={`send-button full-width ${loading || !file ? 'disabled' : 'enabled'}`}
        >
          {loading ? 'Processing...' : 'Send Image'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;