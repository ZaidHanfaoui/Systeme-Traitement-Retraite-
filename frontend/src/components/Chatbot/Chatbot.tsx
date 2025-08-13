import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { Send } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis votre assistant pour les questions de retraite. Comment puis-je vous aider ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Simulation d'une réponse du chatbot
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(newMessage),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setIsLoading(false);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('pension') || message.includes('retraite')) {
      return 'Pour calculer votre pension de retraite, nous prenons en compte vos carrières professionnelles, vos trimestres validés et votre salaire moyen. Souhaitez-vous que je vous aide à estimer votre pension ?';
    }

    if (message.includes('dossier')) {
      return 'Votre dossier de retraite contient toutes vos informations professionnelles. Vous pouvez consulter vos carrières, documents et paiements dans les sections correspondantes.';
    }

    if (message.includes('document')) {
      return 'Vous pouvez télécharger vos documents justificatifs dans la section Documents. Les formats acceptés sont PDF, Word et images.';
    }

    if (message.includes('carrière') || message.includes('carriere')) {
      return 'Vos carrières professionnelles sont importantes pour le calcul de votre retraite. Assurez-vous que toutes vos périodes d\'activité sont bien enregistrées.';
    }

    if (message.includes('trimestre')) {
      return 'Il faut généralement 160 à 172 trimestres pour bénéficier d\'une retraite à taux plein, selon votre année de naissance.';
    }

    return 'Je comprends votre question. Pour plus d\'informations spécifiques, n\'hésitez pas à consulter votre dossier ou à contacter notre service client.';
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "Comment calculer ma retraite ?",
    "Quels sont les documents nécessaires ?",
    "Comment ajouter une carrière ?",
    "Comment suivre mes paiements ?",
    "Comment contacter le support ?"
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ flex: 1, p: 2, overflow: 'auto', maxHeight: '400px' }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper
                sx={{
                  p: 1,
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                  color: message.sender === 'user' ? 'white' : 'black'
                }}
              >
                <ListItemText primary={message.text} />
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            </ListItem>
          ))}
          {isLoading && (
            <ListItem sx={{ justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Assistant en train d'écrire...</Typography>
              </Box>
            </ListItem>
          )}
        </List>
      </Paper>
      {/* Suggestions de questions */}
      <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {suggestions.map((sugg, idx) => (
          <Button key={idx} variant="outlined" size="small" onClick={() => setNewMessage(sugg)}>
            {sugg}
          </Button>
        ))}
      </Box>
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tapez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isLoading}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <Send />
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
