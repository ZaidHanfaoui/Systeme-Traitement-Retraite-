import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Chip,
  Fade,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { dossierService, paiementService, carriereService, documentService } from '../../services/api';
import { Message as GlobalMessage, DossierRetraite, Paiement, Document } from '../../types';

interface Message extends GlobalMessage {}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Bonjour ! Je suis votre assistant STR. Posez-moi vos questions ou choisissez une suggestion ci-dessous.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedMessages = [
    "Voir la liste des dossiers de retraite",
    "Ajouter un nouveau dossier",
    "Consulter et valider les paiements",
    "Gérer les documents des bénéficiaires",
    "Analyser les carrières et trimestres"
  ];

  const quickActions = [
    { label: "Voir les dossiers", action: "view_dossiers" },
    { label: "Consulter les paiements", action: "view_paiements" },
    { label: "Analyser les carrières", action: "analyze_carrieres" },
    { label: "Gérer les documents", action: "manage_documents" },
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (msg?: string) => {
    const messageToSend = msg ?? inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = generateBotResponse(messageToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 700);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('dossier') || input.includes('retraite')) {
      return 'Je peux vous aider avec la gestion des dossiers de retraite. Vous pouvez créer, consulter, modifier ou supprimer des dossiers depuis la section "Dossiers" du menu.';
    }

    if (input.includes('paiement') || input.includes('pension')) {
      return 'Pour les paiements et pensions, vous pouvez consulter l\'historique, ajouter de nouveaux paiements et calculer les montants depuis la section "Paiements".';
    }

    if (input.includes('carriere') || input.includes('carrière') || input.includes('emploi')) {
      return 'La section "Carrières" vous permet de gérer les parcours professionnels des bénéficiaires. Vous pouvez ajouter des périodes d\'emploi, calculer les trimestres validés et gérer les différents régimes.';
    }

    if (input.includes('document') || input.includes('fichier')) {
      return 'Dans la section "Documents", vous pouvez télécharger, consulter et gérer tous les documents nécessaires pour les dossiers de retraite (justificatifs, attestations, etc.).';
    }

    if (input.includes('calcul') || input.includes('calculator')) {
      return 'Le système peut calculer automatiquement les pensions de retraite basées sur les carrières et cotisations. Utilisez le bouton "Calculer la pension" dans les détails d\'un dossier.';
    }

    if (input.includes('aide') || input.includes('help') || input.includes('comment')) {
      return 'Je suis là pour vous aider ! Vous pouvez me poser des questions sur :\n• La gestion des dossiers\n• Les paiements et pensions\n• Les carrières professionnelles\n• Les documents\n• Les calculs de retraite';
    }

    if (input.includes('merci') || input.includes('thanks')) {
      return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
    }

    if (input.includes('bonjour') || input.includes('salut') || input.includes('hello')) {
      return 'Bonjour ! Comment puis-je vous aider avec la gestion des retraites aujourd\'hui ?';
    }

    // Réponse par défaut
    return 'Je comprends votre question. Pour une assistance plus précise, pourriez-vous me donner plus de détails sur ce que vous cherchez à faire ? Je peux vous aider avec les dossiers, paiements, carrières, documents et calculs de retraite.';
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action: string) => {
    let botResponse: Message;

    switch (action) {
      case "view_dossiers":
        botResponse = {
          id: Date.now().toString(),
          text: "Voici la liste des dossiers disponibles.",
          sender: "bot",
          timestamp: new Date(),
          type: "data",
          data: (await dossierService.getAllDossiers()).data as DossierRetraite[],
        };
        break;
      case "view_paiements":
        botResponse = {
          id: Date.now().toString(),
          text: "Voici les paiements enregistrés.",
          sender: "bot",
          timestamp: new Date(),
          type: "data",
          data: (await paiementService.getAllPaiements()).data as Paiement[],
        };
        break;
      case "analyze_carrieres":
        botResponse = {
          id: Date.now().toString(),
          text: "Analyse des carrières en cours.",
          sender: "bot",
          timestamp: new Date(),
          type: "report",
          data: (await carriereService.getCarriereStats()) as {
            totalCarrieres: number;
            averageSalary: number;
            totalTrimestres: number;
          },
        };
        break;
      case "manage_documents":
        botResponse = {
          id: Date.now().toString(),
          text: "Gestion des documents activée.",
          sender: "bot",
          timestamp: new Date(),
          type: "data",
          data: (await documentService.getAllDocuments()).data as Document[],
        };
        break;
      default:
        botResponse = {
          id: Date.now().toString(),
          text: "Action non reconnue.",
          sender: "bot",
          timestamp: new Date(),
        };
    }

    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <>
      {/* Bouton flottant animé */}
      <Fade in={!isOpen}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: 4,
          }}
        >
          <ChatIcon />
        </Fab>
      </Fade>

      {/* Fenêtre de chat moderne */}
      <Fade in={isOpen}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 370,
            height: 540,
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 6,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#222',
          }}
        >
          {/* En-tête du chat avec avatar */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(90deg, #009688 60%, #43e97b 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#fff', color: '#009688', width: 32, height: 32, fontWeight: 700 }}>S</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Assistant STR</Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages en bulles alternées */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1, bgcolor: '#222' }}>
            {messages.map((message, idx) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1.2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 1.2,
                    borderRadius: 2,
                    background: message.sender === 'user' ? 'linear-gradient(90deg, #009688 60%, #43e97b 100%)' : '#333',
                    color: message.sender === 'user' ? 'white' : '#fff',
                    boxShadow: message.sender === 'user' ? 2 : 0,
                    fontSize: '1rem',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.2 }}>
                <Chip label="Assistant tape..." color="default" size="small" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>


          {/* Suggestions prédéfinies (chips bleus) */}
          <Box sx={{ px: 2, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#43e97b', fontWeight: 600, mb: 1 }}>Suggestions</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {predefinedMessages.map((suggestion, idx) => (
                <Chip
                  key={idx}
                  label={suggestion}
                  color="primary"
                  clickable
                  onClick={() => handleSendMessage(suggestion)}
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>

          {/* Zone de saisie moderne */}
          <Box
            sx={{
              p: 1.5,
              borderTop: '1px solid #444',
              display: 'flex',
              gap: 1,
              bgcolor: '#222',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Écrivez votre message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{ bgcolor: '#333', borderRadius: 2, input: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ bgcolor: '#43e97b', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#009688' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default FloatingChatbot;
