// components/MessagingSystem.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, Paperclip, Image, Smile, 
  Video, Phone, MoreVertical, Check,
  CheckCheck
} from 'lucide-react';

const MessagingSystem = ({ senderId, receiverId, jobId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      content: newMessage,
      senderId,
      receiverId,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // Save to Firestore
    await saveMessageToFirestore(message);
  };

  const sendAttachment = (type) => {
    // Handle file upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'image' ? 'image/*' : 
                      type === 'video' ? 'video/*' : 
                      'application/pdf, .doc, .docx';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Upload file and get URL
        const fileUrl = await uploadFile(file);
        
        const message = {
          id: Date.now(),
          content: '',
          attachments: [{
            type: type,
            url: fileUrl,
            name: file.name
          }],
          senderId,
          receiverId,
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        
        setMessages([...messages, message]);
      }
    };
    
    fileInput.click();
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://i.pravatar.cc/150?img=2"
            alt="Receiver"
            className="h-10 w-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold">Dr. Sharma (Institute)</h3>
            <div className="text-sm text-green-600 flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-primary-600">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.senderId === senderId ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[70%] rounded-2xl px-4 py-2 ${
                msg.senderId === senderId
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.content}
              
              {msg.attachments && msg.attachments.map((att, idx) => (
                <div key={idx} className="mt-2">
                  {/* Render attachment */}
                </div>
              ))}
              
              <div className={`text-xs mt-1 ${
                msg.senderId === senderId ? 'text-primary-200' : 'text-gray-500'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {msg.senderId === senderId && (
                  <span className="ml-2">
                    {msg.status === 'sent' ? (
                      <Check className="h-3 w-3 inline" />
                    ) : (
                      <CheckCheck className="h-3 w-3 inline text-green-300" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          {/* Attachment Buttons */}
          <div className="flex items-center space-x-2 mr-4">
            <button
              onClick={() => sendAttachment('image')}
              className="p-2 text-gray-600 hover:text-primary-600"
            >
              <Image className="h-5 w-5" />
            </button>
            <button
              onClick={() => sendAttachment('file')}
              className="p-2 text-gray-600 hover:text-primary-600"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-600">
              <Smile className="h-5 w-5" />
            </button>
          </div>

          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="ml-4 p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};