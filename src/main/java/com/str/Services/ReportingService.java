package com.str.Services;

import com.str.Models.DossierRetraite;
import com.str.Models.Carriere;
import com.str.Models.Paiement;
import com.str.Models.Document;
import com.str.Repositories.DossierRepository;
import com.str.Repositories.CarriereRepository;
import com.str.Repositories.PaiementRepository;
import com.str.Repositories.DocumentRepository;
import com.str.Enum.StatutDossier;
import com.str.Enum.TypePaiement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportingService {

    @Autowired
    private DossierRepository dossierRepository;

    @Autowired
    private CarriereRepository carriereRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public Map<String, Object> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques des dossiers
        List<DossierRetraite> allDossiers = dossierRepository.findAll();
        stats.put("totalDossiers", allDossiers.size());
        stats.put("dossiersEnCours", allDossiers.stream()
            .filter(d -> d.getStatut() == StatutDossier.EN_COURS)
            .count());
        stats.put("dossiersValides", allDossiers.stream()
            .filter(d -> d.getStatut() == StatutDossier.VALIDE)
            .count());
        stats.put("dossiersRejetes", allDossiers.stream()
            .filter(d -> d.getStatut() == StatutDossier.REJETE)
            .count());

        // Statistiques des carrières
        List<Carriere> allCarrieres = carriereRepository.findAll();
        stats.put("totalCarrieres", allCarrieres.size());

        // Calcul du salaire moyen
        double salaireMoyen = allCarrieres.stream()
            .mapToDouble(c -> c.getSalaireMoyen() != null ? c.getSalaireMoyen().doubleValue() : 0)
            .average()
            .orElse(0.0);
        stats.put("salaireMoyen", BigDecimal.valueOf(salaireMoyen));

        // Statistiques des paiements
        List<Paiement> allPaiements = paiementRepository.findAll();
        stats.put("totalPaiements", allPaiements.size());

        BigDecimal montantTotalPaiements = allPaiements.stream()
            .map(p -> p.getMontant() != null ? p.getMontant() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("montantTotalPaiements", montantTotalPaiements);

        // Statistiques des documents
        List<Document> allDocuments = documentRepository.findAll();
        stats.put("totalDocuments", allDocuments.size());

        return stats;
    }

    public Map<String, Object> getMonthlyStatistics() {
        Map<String, Object> monthlyStats = new HashMap<>();

        // Dossiers créés par mois (derniers 12 mois)
        LocalDate now = LocalDate.now();
        Map<String, Long> dossiersByMonth = new HashMap<>();

        for (int i = 11; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            long count = dossierRepository.findAll().stream()
                .filter(d -> d.getDateCreation() != null)
                .filter(d -> {
                    LocalDate creationDate = d.getDateCreation();
                    return creationDate.getYear() == month.getYear() &&
                           creationDate.getMonth() == month.getMonth();
                })
                .count();

            dossiersByMonth.put(monthKey, count);
        }

        monthlyStats.put("dossiersByMonth", dossiersByMonth);
        return monthlyStats;
    }

    public List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Derniers dossiers créés
        List<DossierRetraite> recentDossiers = dossierRepository.findAll().stream()
            .filter(d -> d.getDateCreation() != null)
            .sorted((d1, d2) -> d2.getDateCreation().compareTo(d1.getDateCreation()))
            .limit(5)
            .toList();

        for (DossierRetraite dossier : recentDossiers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "DOSSIER_CREE");
            activity.put("description", "Nouveau dossier créé: " + dossier.getNumeroSecuriteSociale());
            activity.put("date", dossier.getDateCreation());
            activity.put("entityId", dossier.getId());
            activities.add(activity);
        }

        // Derniers documents uploadés
        List<Document> recentDocuments = documentRepository.findAll().stream()
            .filter(d -> d.getDateUpload() != null)
            .sorted((d1, d2) -> d2.getDateUpload().compareTo(d1.getDateUpload()))
            .limit(5)
            .toList();

        for (Document document : recentDocuments) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "DOCUMENT_UPLOAD");
            activity.put("description", "Document uploadé: " + document.getNom());
            activity.put("date", document.getDateUpload());
            activity.put("entityId", document.getId());
            activities.add(activity);
        }

        // Trier toutes les activités par date
        activities.sort((a1, a2) -> {
            Object date1Obj = a1.get("date");
            Object date2Obj = a2.get("date");

            if (date1Obj instanceof LocalDate date1 && date2Obj instanceof LocalDate date2) {
                return date2.compareTo(date1);
            }
            return 0;
        });
        return activities.stream().limit(10).toList();
    }
}
