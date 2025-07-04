import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const ChatContainer = styled.div`
  display: flex;
  height: 600px;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ContactsList = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(66, 153, 225, 0.5);
    border-radius: 10px;
  }
`;

const ContactsHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ContactsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #2D3748;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #A0AEC0;
  }
  
  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const ContactItem = styled(motion.div)`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  ${props => props.active && `
    background: rgba(66, 153, 225, 0.1);
    border-left: 4px solid #4299E1;
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ContactAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  
  ${props => props.online && `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background: #48BB78;
      border-radius: 50%;
      border: 2px solid white;
    }
  `}
`;

const ContactInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContactName = styled.div`
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContactMessage = styled.div`
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContactTime = styled.div`
  font-size: 0.7rem;
  color: #A0AEC0;
  margin-left: auto;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ChatHeaderInfo = styled.div`
  flex: 1;
`;

const ChatHeaderName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.2rem;
`;

const ChatHeaderStatus = styled.div`
  font-size: 0.8rem;
  color: #48BB78;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '●';
    font-size: 0.6rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(66, 153, 225, 0.5);
    border-radius: 10px;
  }
`;

const MessageBubble = styled(motion.div)`
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.own ? `
    background: linear-gradient(135deg, #4299E1, #667EEA);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 8px;
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: #2D3748;
    align-self: flex-start;
    border-bottom-left-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  text-align: ${props => props.own ? 'right' : 'left'};
`;

const MessageInput = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const InputField = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #2D3748;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #A0AEC0;
  }
  
  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const SendButton = styled(motion.button)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4299E1, #667EEA);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChatInterface = ({ userType = 'startup' }) => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mock contacts data
    const mockContacts = userType === 'startup' ? [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'SJ',
        lastMessage: 'I\'d love to discuss your Series A plans',
        time: '2m',
        online: true,
        unread: 2
      },
      {
        id: 2,
        name: 'Michael Chen',
        avatar: 'MC',
        lastMessage: 'Thanks for the pitch deck!',
        time: '1h',
        online: false,
        unread: 0
      },
      {
        id: 3,
        name: 'Lisa Rodriguez',
        avatar: 'LR',
        lastMessage: 'When can we schedule a call?',
        time: '3h',
        online: true,
        unread: 1
      }
    ] : [
      {
        id: 1,
        name: 'TechStart AI',
        avatar: 'TA',
        lastMessage: 'We\'re excited to share our traction',
        time: '5m',
        online: true,
        unread: 1
      },
      {
        id: 2,
        name: 'GreenTech Solutions',
        avatar: 'GT',
        lastMessage: 'Thank you for considering our proposal',
        time: '2h',
        online: false,
        unread: 0
      }
    ];

    setContacts(mockContacts);
    if (mockContacts.length > 0) {
      setActiveContact(mockContacts[0]);
    }
  }, [userType]);

  useEffect(() => {
    // Mock messages for active contact
    if (activeContact) {
      const mockMessages = [
        {
          id: 1,
          text: 'Hi! I reviewed your profile and I\'m very interested in your startup.',
          own: false,
          time: '2:30 PM'
        },
        {
          id: 2,
          text: 'Thank you for your interest! I\'d be happy to discuss our vision.',
          own: true,
          time: '2:35 PM'
        },
        {
          id: 3,
          text: 'Great! Could you share more details about your current traction?',
          own: false,
          time: '2:40 PM'
        },
        {
          id: 4,
          text: 'Absolutely! We\'ve grown 300% in the last 6 months with over 10K users.',
          own: true,
          time: '2:45 PM'
        }
      ];
      setMessages(mockMessages);
    }
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        own: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ChatContainer>
      <ContactsList>
        <ContactsHeader>
          <ContactsTitle>💬 Messages</ContactsTitle>
          <SearchInput
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </ContactsHeader>
        
        {filteredContacts.map((contact) => (
          <ContactItem
            key={contact.id}
            active={activeContact?.id === contact.id}
            onClick={() => setActiveContact(contact)}
            whileHover={{ x: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ContactAvatar online={contact.online}>
              {contact.avatar}
            </ContactAvatar>
            <ContactInfo>
              <ContactName>{contact.name}</ContactName>
              <ContactMessage>{contact.lastMessage}</ContactMessage>
            </ContactInfo>
            <ContactTime>{contact.time}</ContactTime>
          </ContactItem>
        ))}
      </ContactsList>

      <ChatArea>
        {activeContact ? (
          <>
            <ChatHeader>
              <ContactAvatar online={activeContact.online}>
                {activeContact.avatar}
              </ContactAvatar>
              <ChatHeaderInfo>
                <ChatHeaderName>{activeContact.name}</ChatHeaderName>
                <ChatHeaderStatus>
                  {activeContact.online ? 'Online' : 'Last seen 2h ago'}
                </ChatHeaderStatus>
              </ChatHeaderInfo>
            </ChatHeader>

            <MessagesContainer>
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    own={message.own}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {message.text}
                    <MessageTime own={message.own}>
                      {message.time}
                    </MessageTime>
                  </MessageBubble>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <MessageInput>
              <InputField
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ➤
              </SendButton>
            </MessageInput>
          </>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#718096',
            fontSize: '1.1rem'
          }}>
            Select a contact to start messaging
          </div>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default ChatInterface;