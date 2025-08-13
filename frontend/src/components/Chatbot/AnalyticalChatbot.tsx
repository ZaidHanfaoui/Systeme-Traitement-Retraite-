import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion' | 'chart';
  data?: any;
}

interface AnalyticalChatbotProps {
  onAnalysisRequest?: (type: string, params: any) => void;
}

const AnalyticalChatbot: React.FC<AnalyticalChatbotProps> = ({ onAnalysisRequest }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Message de bienvenue avec suggestions
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Bonjour ! Je suis votre assistant intelligent pour l'analyse des retraites. Je peux vous aider avec :",
        sender: 'bot',
        timestamp: new Date(),
        type: 'suggestion',
        data: {
          suggestions: [
            { text: "Analyser un dossier spécifique", action: "analyze_dossier" },
            { text: "Rapport global des dossiers", action: "global_report" },
            { text: "Guide de calcul de pension", action: "pension_guide" },
            { text: "Statistiques du dashboard", action: "dashboard_stats" },
            { text: "Suggestions d'actions", action: "action_suggestions" }
          ]
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [open, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await processUserMessage(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type || 'text',
        data: response.data
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je rencontre une difficulté. Pouvez-vous reformuler votre question ?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const processUserMessage = async (message: string): Promise<any> => {
    const lowerMessage = message.toLowerCase();

    // Analyse des intentions
    if (lowerMessage.includes('analyser') || lowerMessage.includes('analyse')) {
      if (lowerMessage.includes('dossier')) {
        const dossierMatch = message.match(/dossier\s*(\d+)/i);
        if (dossierMatch) {
          const dossierId = dossierMatch[1];
          return await analyzeDossier(dossierId);
        } else {
          return {
            text: "Quel dossier souhaitez-vous analyser ? Précisez l'ID du dossier (ex: dossier 1)",
            type: 'text'
          };
        }
      }
    }

    if (lowerMessage.includes('rapport') || lowerMessage.includes('statistiques')) {
      return await getGlobalReport();
    }

    if (lowerMessage.includes('pension') || lowerMessage.includes('calcul')) {
      const dossierMatch = message.match(/dossier\s*(\d+)/i);
      if (dossierMatch) {
        const dossierId = dossierMatch[1];
        return await getPensionGuide(dossierId);
      } else {
        return {
          text: "Pour quel dossier souhaitez-vous le guide de calcul de pension ? (ex: pension dossier 1)",
          type: 'text'
        };
      }
    }

    if (lowerMessage.includes('créer') || lowerMessage.includes('nouveau')) {
      return {
        text: "Pour créer un nouveau dossier, suivez ces étapes :\n1. Allez dans 'Gestion des Dossiers'\n2. Cliquez sur 'Nouveau Dossier'\n3. Remplissez les informations du bénéficiaire\n4. Ajoutez le statut initial\n5. Sauvegardez le dossier",
        type: 'suggestion',
        data: {
          suggestions: [
            { text: "Créer un dossier maintenant", action: "create_dossier", link: "/dossiers/nouveau" }
          ]
        }
      };
    }

    if (lowerMessage.includes('approuver') || lowerMessage.includes('valider')) {
      return {
        text: "Pour approuver un paiement :\n1. Accédez à la liste des paiements\n2. Filtrez par statut 'EN_ATTENTE'\n3. Sélectionnez le paiement\n4. Vérifiez les informations\n5. Changez le statut à 'VALIDÉ'",
        type: 'suggestion',
        data: {
          suggestions: [
            { text: "Voir les paiements en attente", action: "view_pending_payments", link: "/paiements?statut=EN_ATTENTE" }
          ]
        }
      };
    }

    if (lowerMessage.includes('dashboard') || lowerMessage.includes('tableau')) {
      return await getDashboardStats();
    }

    if (lowerMessage.includes('suggestion') || lowerMessage.includes('recommandation')) {
      return await getActionSuggestions();
    }

    // Réponse par défaut avec suggestions contextuelles
    return {
      text: "Je peux vous aider avec l'analyse des dossiers de retraite. Voici ce que je peux faire :",
      type: 'suggestion',
      data: {
        suggestions: [
          { text: "Analyser le dossier 1", action: "analyze_dossier_1" },
          { text: "Rapport global", action: "global_report" },
          { text: "Guide création dossier", action: "creation_guide" },
          { text: "Statistiques dashboard", action: "dashboard_stats" }
        ]
      }
    };
  };

  const analyzeDossier = async (dossierId: string) => {
    try {
      const response = await axios.get(`http://localhost:8088/api/reporting/dossier-analysis/${dossierId}`);
      const analysis = response.data;

      return {
        text: `Analyse du dossier ${dossierId} :`,
        type: 'analysis',
        data: {
          dossier: analysis.dossier,
          stats: {
            carrieres: analysis.nombreCarrieres || 0,
            paiements: analysis.nombrePaiements || 0,
            documents: analysis.nombreDocuments || 0,
            salaireMoyen: analysis.salaireMoyenCarrieres || 0,
            trimestres: analysis.trimestresTotal || 0
          },
          suggestions: analysis.suggestions || []
        }
      };
    } catch (error) {
      return {
        text: `Impossible d'analyser le dossier ${dossierId}. Vérifiez qu'il existe.`,
        type: 'text'
      };
    }
  };

  const getGlobalReport = async () => {
    try {
      const response = await axios.get('http://localhost:8088/api/reporting/global-report');
      const report = response.data;

      return {
        text: "Rapport global du système :",
        type: 'analysis',
        data: {
          summary: report.resumeGeneral,
          trends: report.tendances,
          recommendations: report.recommendationsGlobales
        }
      };
    } catch (error) {
      return {
        text: "Erreur lors de la génération du rapport global.",
        type: 'text'
      };
    }
  };

  const getPensionGuide = async (dossierId: string) => {
    try {
      const response = await axios.get(`http://localhost:8088/api/reporting/pension-calculation-guide/${dossierId}`);
      const guide = response.data;

      return {
        text: `Guide de calcul de pension pour le dossier ${dossierId} :`,
        type: 'analysis',
        data: {
          steps: guide.etapes || []
        }
      };
    } catch (error) {
      return {
        text: `Impossible de générer le guide pour le dossier ${dossierId}.`,
        type: 'text'
      };
    }
  };

  const getDashboardStats = async () => {
    try {
      const response = await axios.get('/api/reporting/dashboard-stats');
      const stats = response.data;

      return {
        text: "Statistiques du dashboard :",
        type: 'analysis',
        data: {
          totalDossiers: stats.totalDossiers,
          dossiersEnCours: stats.dossiersEnCours,
          dossiersValides: stats.dossiersValides,
          totalPaiements: stats.totalPaiements,
          montantTotal: stats.montantTotalPaiements,
          totalCarrieres: stats.totalCarrieres,
          totalDocuments: stats.totalDocuments
        }
      };
    } catch (error) {
      return {
        text: "Erreur lors du chargement des statistiques.",
        type: 'text'
      };
    }
  };

  const getActionSuggestions = async () => {
    try {
      const response = await axios.get('http://localhost:8088/api/reporting/suggestions');
      const suggestions = response.data;

      return {
        text: "Suggestions d'actions prioritaires :",
        type: 'suggestion',
        data: {
          suggestions: suggestions.suggestions || []
        }
      };
    } catch (error) {
      return {
        text: "Erreur lors du chargement des suggestions.",
        type: 'text'
      };
    }
  };

  const handleSuggestionClick = async (action: string) => {
    switch (action) {
      case 'analyze_dossier_1':
        const analysis = await analyzeDossier('1');
        const analysisMessage: Message = {
          id: Date.now().toString(),
          text: analysis.text,
          sender: 'bot',
          timestamp: new Date(),
          type: analysis.type as "text" | "analysis" | "suggestion" | "chart",
          data: analysis.data
        };
        setMessages(prev => [...prev, analysisMessage]);
        break;
      case 'global_report':
        const report = await getGlobalReport();
        const reportMessage: Message = {
          id: Date.now().toString(),
          text: report.text,
          sender: 'bot',
          timestamp: new Date(),
          type: report.type as "text" | "analysis" | "suggestion" | "chart",
          data: report.data
        };
        setMessages(prev => [...prev, reportMessage]);
        break;
      case 'dashboard_stats':
        const stats = await getDashboardStats();
        const statsMessage: Message = {
          id: Date.now().toString(),
          text: stats.text,
          sender: 'bot',
          timestamp: new Date(),
          type: stats.type as "text" | "analysis" | "suggestion" | "chart",
          data: stats.data
        };
        setMessages(prev => [...prev, statsMessage]);
        break;
      default:
        break;
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 1
        }}
      >
        <Paper
          sx={{
            p: 2,
            maxWidth: '80%',
            backgroundColor: isUser ? '#1976d2' : '#f5f5f5',
            color: isUser ? 'white' : 'black'
          }}
        >
          <Typography variant="body2">{message.text}</Typography>

          {message.type === 'analysis' && message.data && (
            <Box sx={{ mt: 2 }}>
              {message.data.stats && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Statistiques :
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip label={`Carrières: ${message.data.stats.carrieres}`} size="small" />
                    <Chip label={`Paiements: ${message.data.stats.paiements}`} size="small" />
                    <Chip label={`Documents: ${message.data.stats.documents}`} size="small" />
                  </Box>
                </Box>
              )}

              {message.data.suggestions && message.data.suggestions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Suggestions :
                  </Typography>
                  <List dense>
                    {message.data.suggestions.map((suggestion: string, index: number) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText
                          primary={`• ${suggestion}`}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          {message.type === 'suggestion' && message.data?.suggestions && (
            <Box sx={{ mt: 2 }}>
              {message.data.suggestions.map((suggestion: any, index: number) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => handleSuggestionClick(suggestion.action)}
                >
                  {suggestion.text}
                </Button>
              ))}
            </Box>
          )}

          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh', display: 'flex', flexDirection: 'column' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 1 }} />
            Assistant Intelligent - Analyse des Retraites
          </Box>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
              {messages.map(renderMessage)}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tapez votre question... (ex: analyser dossier 1, rapport global, calcul pension)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            endIcon={<SendIcon />}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnalyticalChatbot;
