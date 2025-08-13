package com.str.Config;

import com.str.Enum.StatutDossier;
import com.str.Enum.TypePaiement;
import com.str.Enum.RegimeRetraite;
import com.str.Models.*;
import com.str.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DossierRepository dossierRepository;

    @Autowired
    private CarriereRepository carriereRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si des données existent déjà
        if (dossierRepository.count() > 0) {
            System.out.println("Des données existent déjà, pas d'initialisation nécessaire.");
            return;
        }

        System.out.println("Initialisation des données de test...");

        // Créer des dossiers de test
        DossierRetraite dossier1 = createDossier("1234567890123", "Dupont", "Jean", "1980-05-15", "jean.dupont@email.com", "0123456789", "123 Rue de la Paix, Paris");
        DossierRetraite dossier2 = createDossier("9876543210987", "Martin", "Marie", "1975-08-22", "marie.martin@email.com", "0987654321", "456 Avenue des Champs, Lyon");
        DossierRetraite dossier3 = createDossier("4567891230456", "Bernard", "Pierre", "1985-03-10", "pierre.bernard@email.com", "0567891234", "789 Boulevard Central, Marseille");

        System.out.println("Dossiers créés: " + dossier1.getId() + ", " + dossier2.getId() + ", " + dossier3.getId());

        // Créer des carrières
        createCarriere(dossier1, "Entreprise A", "Ingénieur", LocalDate.of(2010, 1, 1), LocalDate.of(2020, 12, 31), new BigDecimal("45000.00"));
        createCarriere(dossier1, "Entreprise B", "Chef de projet", LocalDate.of(2021, 1, 1), null, new BigDecimal("55000.00"));
        createCarriere(dossier2, "Entreprise C", "Comptable", LocalDate.of(2005, 6, 1), LocalDate.of(2015, 5, 31), new BigDecimal("35000.00"));
        createCarriere(dossier2, "Entreprise D", "Directeur financier", LocalDate.of(2015, 6, 1), null, new BigDecimal("65000.00"));
        createCarriere(dossier3, "Entreprise E", "Développeur", LocalDate.of(2012, 3, 1), LocalDate.of(2022, 2, 28), new BigDecimal("40000.00"));
        createCarriere(dossier3, "Entreprise F", "Architecte logiciel", LocalDate.of(2022, 3, 1), null, new BigDecimal("60000.00"));

        // Créer des documents
        createDocument(dossier1, "Contrat de travail", "PDF", "Contrat initial");
        createDocument(dossier1, "Bulletin de salaire", "PDF", "Bulletin 2023");
        createDocument(dossier2, "Certificat de travail", "PDF", "Certificat Entreprise C");
        createDocument(dossier2, "Attestation employeur", "PDF", "Attestation 2023");
        createDocument(dossier3, "Fiche de paie", "PDF", "Fiche de paie janvier 2024");

        // Créer des paiements
        createPaiement(dossier1, new BigDecimal("1200.00"), LocalDate.of(2024, 1, 15), TypePaiement.PENSION, "REF001");
        createPaiement(dossier1, new BigDecimal("800.00"), LocalDate.of(2024, 2, 15), TypePaiement.ALLOCATION, "REF002");
        createPaiement(dossier2, new BigDecimal("1500.00"), LocalDate.of(2024, 1, 20), TypePaiement.PENSION, "REF003");
        createPaiement(dossier2, new BigDecimal("600.00"), LocalDate.of(2024, 2, 20), TypePaiement.SUPPLEMENT, "REF004");
        createPaiement(dossier3, new BigDecimal("1100.00"), LocalDate.of(2024, 1, 25), TypePaiement.PENSION, "REF005");

        System.out.println("Données de test créées avec succès !");
        System.out.println("- 3 dossiers créés");
        System.out.println("- 6 carrières créées");
        System.out.println("- 5 documents créés");
        System.out.println("- 5 paiements créés");
        
        // Vérifier les données créées
        System.out.println("Vérification des données:");
        System.out.println("Dossiers: " + dossierRepository.count());
        System.out.println("Carrières: " + carriereRepository.count());
        System.out.println("Documents: " + documentRepository.count());
        System.out.println("Paiements: " + paiementRepository.count());
    }

    private DossierRetraite createDossier(String numeroSecuriteSociale, String nom, String prenom, 
                                         String dateNaissance, String email, String telephone, String adresse) {
        Beneficiaire beneficiaire = new Beneficiaire();
        beneficiaire.setNom(nom);
        beneficiaire.setPrenom(prenom);
        beneficiaire.setDateNaissance(LocalDate.parse(dateNaissance));
        beneficiaire.setEmail(email);
        beneficiaire.setTelephone(telephone);
        beneficiaire.setAdresse(adresse);

        DossierRetraite dossier = new DossierRetraite();
        dossier.setNumeroSecuriteSociale(numeroSecuriteSociale);
        dossier.setBeneficiaire(beneficiaire);
        dossier.setStatut(StatutDossier.EN_COURS);
        dossier.setDateCreation(LocalDate.now());

        return dossierRepository.save(dossier);
    }

    private void createCarriere(DossierRetraite dossier, String entreprise, String poste, 
                               LocalDate dateDebut, LocalDate dateFin, BigDecimal salaireMoyen) {
        Carriere carriere = new Carriere();
        carriere.setEntreprise(entreprise);
        carriere.setPoste(poste);
        carriere.setDateDebut(dateDebut);
        carriere.setDateFin(dateFin);
        carriere.setSalaireMoyen(salaireMoyen);
        carriere.setRegimeRetraite(RegimeRetraite.GENERAL);
        carriere.setDossier(dossier);
        carriere.setTrimestresValides(4); // 1 an par défaut

        carriereRepository.save(carriere);
    }

    private void createDocument(DossierRetraite dossier, String nom, String type, String description) {
        Document document = new Document();
        document.setNom(nom);
        document.setNomFichier(nom + ".pdf");
        document.setType(type);
        document.setTypeMime("application/pdf");
        document.setDateUpload(LocalDateTime.now());
        document.setDescription(description);
        document.setTailleFichier(1024L); // 1KB par défaut
        document.setDossier(dossier);

        documentRepository.save(document);
    }

    private void createPaiement(DossierRetraite dossier, BigDecimal montant, LocalDate dateVersement, 
                               TypePaiement typePaiement, String reference) {
        Paiement paiement = new Paiement();
        paiement.setMontant(montant);
        paiement.setDateVersement(dateVersement);
        paiement.setDatePaiement(dateVersement);
        paiement.setTypePaiement(typePaiement);
        paiement.setReference(reference);
        paiement.setStatut("PAYE");
        paiement.setDossier(dossier);

        paiementRepository.save(paiement);
    }
} 