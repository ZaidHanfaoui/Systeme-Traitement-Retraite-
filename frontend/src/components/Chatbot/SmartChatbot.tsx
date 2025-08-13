import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Minimize as MinimizeIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { dossierService, carriereService, paiementService, documentService } from '../../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'report' | 'data';
  data?: any;
}

interface ChatbotData {
  dossiers: any[];
  carrieres: any[];
  paiements: any[];
  documents: any[];
  stats: {
    totalDossiers: number;
    dossiersValides: number;
    dossiersEnCours: number;
    dossiersRejetes: number;
    totalPaiements: number;
    montantTotalPaiements: number;
    totalCarrieres: number;
    totalDocuments: number;
  };
}

const SmartChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Bonjour ! Je suis votre assistant intelligent STR. Je peux vous aider avec :\n\n• 📊 Générer des rapports détaillés\n• 📈 Analyser vos données\n• 🔍 Rechercher des informations\n• 💬 Répondre à vos questions\n\nTapez "rapport" pour un rapport complet ou posez-moi une question !',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAllData = async () => {
    try {
      const [dossiersRes, carrieresRes, paiementsRes, documentsRes] = await Promise.all([
        dossierService.getAllDossiers().catch(() => ({ data: [] })),
        carriereService.getAllCarrieres().catch(() => ({ data: [] })),
        paiementService.getAllPaiements().catch(() => ({ data: [] })),
        documentService.getAllDocuments().catch(() => ({ data: [] }))
      ]);

      const dossiers = dossiersRes.data || [];
      const carrieres = carrieresRes.data || [];
      const paiements = paiementsRes.data || [];
      const documents = documentsRes.data || [];

      const stats = {
        totalDossiers: dossiers.length,
        dossiersValides: dossiers.filter((d: any) => d.statut === 'VALIDE').length,
        dossiersEnCours: dossiers.filter((d: any) => d.statut === 'EN_COURS').length,
        dossiersRejetes: dossiers.filter((d: any) => d.statut === 'REJETE').length,
        totalPaiements: paiements.length,
        montantTotalPaiements: Array.isArray(paiements) && paiements.length > 0
          ? (paiements as any[]).reduce((sum: number, p: any) => sum + (Number(p.montant) || 0), 0)
          : 0,
        totalCarrieres: carrieres.length,
        totalDocuments: documents.length
      };

      setChatbotData({
        dossiers,
        carrieres,
        paiements,
        documents,
        stats
      });

      return { dossiers, carrieres, paiements, documents, stats };
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return null;
    }
  };

  const generateGeneralReport = (data: ChatbotData) => {
    const { stats } = data;
    return `📊 **RAPPORT GÉNÉRAL STR**

🗂️ **DOSSIERS DE RETRAITE**
• Total des dossiers : ${stats.totalDossiers}
• Dossiers validés : ${stats.dossiersValides}
• Dossiers en cours : ${stats.dossiersEnCours}
• Dossiers rejetés : ${stats.dossiersRejetes}

💰 **PAIEMENTS**
• Total des paiements : ${stats.totalPaiements}
• Montant total : ${stats.montantTotalPaiements.toLocaleString()} €
• Montant moyen : ${stats.totalPaiements > 0 ? (stats.montantTotalPaiements / stats.totalPaiements).toFixed(2) : 0} €

👔 **CARRIÈRES**
• Total des carrières : ${stats.totalCarrieres}
• Moyenne par dossier : ${stats.totalDossiers > 0 ? (stats.totalCarrieres / stats.totalDossiers).toFixed(1) : 0}

📄 **DOCUMENTS**
• Total des documents : ${stats.totalDocuments}
• Moyenne par dossier : ${stats.totalDossiers > 0 ? (stats.totalDocuments / stats.totalDossiers).toFixed(1) : 0}

📈 **TAUX DE SUCCÈS**
• Taux de validation : ${stats.totalDossiers > 0 ? ((stats.dossiersValides / stats.totalDossiers) * 100).toFixed(1) : 0}%
• Taux de rejet : ${stats.totalDossiers > 0 ? ((stats.dossiersRejetes / stats.totalDossiers) * 100).toFixed(1) : 0}%`;
  };

  const generateDossierReport = (dossier: any, data: ChatbotData) => {
    const carrieresDossier = data.carrieres.filter((c: any) => c.dossierId === dossier.id);
    const paiementsDossier = data.paiements.filter((p: any) => p.dossierId === dossier.id);
    const documentsDossier = data.documents.filter((d: any) => d.dossierId === dossier.id);

    return `📋 **RAPPORT DOSSIER #${dossier.id}**

👤 **BÉNÉFICIAIRE**
• Nom : ${dossier.beneficiaire?.nom || 'N/A'} ${dossier.beneficiaire?.prenom || ''}
• Email : ${dossier.beneficiaire?.email || 'N/A'}
• Téléphone : ${dossier.beneficiaire?.telephone || 'N/A'}
• N° Sécurité Sociale : ${dossier.numeroSecuriteSociale || 'N/A'}

📊 **STATUT**
• Statut actuel : ${dossier.statut}
• Date de création : ${dossier.dateCreation ? new Date(dossier.dateCreation).toLocaleDateString() : 'N/A'}

👔 **CARRIÈRES (${carrieresDossier.length})**
${carrieresDossier.map((c: any, index: number) => 
  `• ${index + 1}. ${c.entreprise || 'N/A'} - ${c.poste || 'N/A'}\n  Période : ${c.dateDebut} à ${c.dateFin || 'En cours'}\n  Salaire moyen : ${c.salaireMoyen?.toLocaleString() || 'N/A'} €`
).join('\n')}

💰 **PAIEMENTS (${paiementsDossier.length})**
${paiementsDossier.map((p: any, index: number) => 
  `• ${index + 1}. ${p.montant?.toLocaleString() || 'N/A'} € - ${p.dateVersement ? new Date(p.dateVersement).toLocaleDateString() : 'N/A'}\n  Type : ${p.typePaiement || 'N/A'} - Statut : ${p.statut || 'N/A'}`
).join('\n')}

📄 **DOCUMENTS (${documentsDossier.length})**
${documentsDossier.map((d: any, index: number) => 
  `• ${index + 1}. ${d.nom || 'N/A'}\n  Type : ${d.type || 'N/A'} - Taille : ${d.taille || 'N/A'}`
).join('\n')}`;
  };

  const processUserMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Charger les données si ce n'est pas déjà fait
    if (!chatbotData) {
      const data = await loadAllData();
      if (!data) {
        return 'Désolé, je n\'ai pas pu charger les données du système. Veuillez réessayer.';
      }
    }

    const data = chatbotData!;

    // Commandes spéciales
    if (lowerMessage.includes('rapport') || lowerMessage.includes('report')) {
      if (lowerMessage.includes('général') || lowerMessage.includes('global') || lowerMessage === 'rapport') {
        return generateGeneralReport(data);
      }

      // Recherche de rapport par ID de dossier
      const dossierIdMatch = message.match(/dossier\s*#?(\d+)/i);
      if (dossierIdMatch) {
        const dossierId = parseInt(dossierIdMatch[1]);
        const dossier = data.dossiers.find((d: any) => d.id === dossierId);
        if (dossier) {
          return generateDossierReport(dossier, data);
        } else {
          return `❌ Aucun dossier trouvé avec l'ID ${dossierId}.`;
        }
      }
    }

    // Statistiques
    if (lowerMessage.includes('statistique') || lowerMessage.includes('stats')) {
      return `📊 **STATISTIQUES RAPIDES**

• ${data.stats.totalDossiers} dossiers au total
• ${data.stats.dossiersValides} dossiers validés
• ${data.stats.totalPaiements} paiements effectués
• ${data.stats.montantTotalPaiements.toLocaleString()} € de paiements totaux
• ${data.stats.totalCarrieres} carrières enregistrées
• ${data.stats.totalDocuments} documents archivés`;
    }

    // Recherche de dossier
    if (lowerMessage.includes('dossier')) {
      const nameMatch = message.match(/dossier.*?(\w+)/i);
      if (nameMatch) {
        const searchTerm = nameMatch[1];
        const foundDossiers = data.dossiers.filter((d: any) =>
          d.beneficiaire?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.beneficiaire?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.numeroSecuriteSociale?.includes(searchTerm)
        );

        if (foundDossiers.length > 0) {
          return `🔍 **DOSSIERS TROUVÉS (${foundDossiers.length})**\n\n` +
            foundDossiers.map((d: any) =>
              `• Dossier #${d.id} - ${d.beneficiaire?.nom || 'N/A'} ${d.beneficiaire?.prenom || ''}\n  Statut : ${d.statut} - SSN : ${d.numeroSecuriteSociale}`
            ).join('\n');
        } else {
          return `❌ Aucun dossier trouvé pour "${searchTerm}".`;
        }
      }
    }

    // Aide
    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return `🆘 **AIDE - COMMANDES DISPONIBLES**

📊 **RAPPORTS**
• "rapport" ou "rapport général" - Rapport complet
• "rapport dossier #123" - Rapport d'un dossier spécifique
• "statistiques" - Statistiques rapides

🔍 **RECHERCHE**
• "dossier [nom]" - Rechercher un dossier
• "paiement" - Informations sur les paiements
• "carrière" - Informations sur les carrières

💬 **QUESTIONS GÉNÉRALES**
Posez-moi des questions sur :
• Les dossiers de retraite
• Les paiements
• Les carrières
• Les documents
• Le système STR`;
    }

    // Réponses contextuelles basées sur les mots-clés
    if (lowerMessage.includes('paiement')) {
      return `💰 **INFORMATIONS PAIEMENTS**

• Total des paiements : ${data.stats.totalPaiements}
• Montant total : ${data.stats.montantTotalPaiements.toLocaleString()} €
• Montant moyen : ${data.stats.totalPaiements > 0 ? (data.stats.montantTotalPaiements / data.stats.totalPaiements).toFixed(2) : 0} €

Les paiements les plus récents :
${data.paiements.slice(-3).map((p: any) => 
  `• ${p.montant?.toLocaleString() || 'N/A'} € - ${p.dateVersement ? new Date(p.dateVersement).toLocaleDateString() : 'N/A'}`
).join('\n')}`;
    }

    if (lowerMessage.includes('carrière') || lowerMessage.includes('carriere')) {
      return `👔 **INFORMATIONS CARRIÈRES**

• Total des carrières : ${data.stats.totalCarrieres}
• Moyenne par dossier : ${data.stats.totalDossiers > 0 ? (data.stats.totalCarrieres / data.stats.totalDossiers).toFixed(1) : 0}

Répartition par régime :
${data.carrieres.reduce((acc: any, c: any) => {
  const regime = c.regimeRetraite || 'Non spécifié';
  acc[regime] = (acc[regime] || 0) + 1;
  return acc;
}, {})}`;
    }

    // Réponse par défaut intelligente
    return `🤔 Je comprends votre question sur "${message}". 

Voici ce que je peux vous dire :
• Tapez "rapport" pour un rapport complet
• Tapez "aide" pour voir toutes les commandes
• Demandez-moi des informations sur les dossiers, paiements, carrières
• Utilisez "dossier #ID" pour un rapport spécifique

Y a-t-il quelque chose de spécifique que vous aimeriez savoir ?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

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
      const botResponse = await processUserMessage(inputValue);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ Désolé, une erreur s\'est produite. Veuillez réessayer.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
          }
        }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* Dialog du chat */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '70vh',
            position: 'fixed',
            bottom: minimized ? -400 : 100,
            right: 20,
            margin: 0,
            width: 400,
            maxWidth: 400,
            transition: 'bottom 0.3s ease-in-out'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            py: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon />
            <Typography variant="h6">Assistant STR</Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => setMinimized(!minimized)}
              sx={{ color: 'white', mr: 1 }}
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {!minimized && (
          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Zone des messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
              <List>
                {messages.map((message) => (
                  <ListItem key={message.id} sx={{ flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                        borderRadius: message.sender === 'user' ? '15px 15px 5px 15px' : '15px 15px 15px 5px'
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {message.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
                {loading && (
                  <ListItem sx={{ justifyContent: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">
                        Assistant en train de réfléchir...
                      </Typography>
                    </Box>
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>

            <Divider />

            {/* Zone de saisie */}
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Tapez votre message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                multiline
                maxRows={3}
                disabled={loading}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={loading || !inputValue.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SmartChatbot;
