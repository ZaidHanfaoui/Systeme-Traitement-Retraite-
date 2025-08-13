// Types pour l'authentification
export interface User {
  id: string;
  username: string;
  name?: string; // Added for display
  email: string;
  roles: string[];
  isAdmin: boolean;
  isUser: boolean;
}

// Types pour les bénéficiaires
export interface Beneficiaire {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone?: string;
  adresse?: string;
}

// Types pour les dossiers de retraite
export enum StatutDossier {
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  BROUILLON = 'BROUILLON'
}

export interface DossierRetraite {
  id?: number;
  numeroSecuriteSociale: string;
  dateCreation?: string;
  statut: StatutDossier;
  beneficiaire?: Beneficiaire;
  carrieres?: Carriere[];
  documents?: Document[];
  paiements?: Paiement[];
}

// Types pour les carrières
export enum RegimeRetraite {
  GENERAL = 'GENERAL',
  FONCTION_PUBLIQUE = 'FONCTION_PUBLIQUE',
  AGRICOLE = 'AGRICOLE',
  LIBERAL = 'LIBERAL',
  COMPLEMENTAIRE = 'COMPLEMENTAIRE'
}

export interface Carriere {
  id?: number;
  entreprise: string;
  poste: string;
  dateDebut: string;
  dateFin?: string;
  salaireMoyen: number;
  regimeRetraite: RegimeRetraite;
  trimestresValides?: number;
  dossierRetraite?: DossierRetraite;
  dossierId?: number;
}

// Types pour les documents
export interface Document {
  id?: number;
  nom?: string;
  type?: string;
  dateUpload?: string;
  description?: string;
  tailleFichier?: number;
  taille?: number; // Added for compatibility
  dossierRetraite?: DossierRetraite;
  dossierId?: number;
}

// Types pour les paiements
export enum TypePaiement {
  PENSION = 'PENSION',
  ALLOCATION = 'ALLOCATION',
  SUPPLEMENT = 'SUPPLEMENT'
}

export interface Paiement {
  id?: number;
  montant: number;
  dateVersement: string;
  datePaiement?: string;
  typePaiement: TypePaiement;
  reference?: string;
  statut?: string;
  dateExecution?: string;
  dossierId?: number;
}

// Types pour les calculs de pension
export interface PensionCalculation {
  montant: number;
  details?: {
    salaireMoyenAnnuel: number;
    trimestresValides: number;
    tauxPension: number;
  };
}

// Types pour les props des composants
export interface CreateDossierProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
  dossier?: DossierRetraite;
}

export interface CreateCarriereProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
  onSuccess?: () => Promise<void>;
}

export interface CreatePaiementProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
  onSuccess?: () => Promise<void>;
}

export interface CreateDocumentProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
  onSuccess?: () => Promise<void>;
}

export interface CarriereListProps {
  dossierId?: number;
}

export interface DocumentListProps {
  dossierId?: number;
}

export interface PaiementListProps {
  dossierId?: number;
}

export interface DossierSelectorProps {
  selectedDossierId: number | null;
  onDossierChange: (id: number | null) => void;
  label: string;
  placeholder?: string; // Added for compatibility
}

export interface SidebarProps {
  open: boolean;
}

export interface AdminSidebarProps {
  open: boolean;
}

export interface NavbarProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export interface LoginProps {
  onLogin?: () => void;
}

export interface DossierFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: DossierRetraite) => void;
  initialValues?: DossierRetraite;
  onSuccess?: () => void | Promise<void>; // Added for compatibility
  onDossierCreated?: () => void | Promise<void>; // Added for compatibility
  dossier?: DossierRetraite; // Added for edit mode
  isEdit?: boolean; // Added for edit mode
}

export interface CalculPensionResult {
  montant: number;
  details: {
    salaireMoyenAnnuel: number;
    trimestresValides: number;
    tauxPension: number;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Types pour le chatbot
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'data' | 'report';
  data?: any;
}
