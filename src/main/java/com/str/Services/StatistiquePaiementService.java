package com.str.Services;

import com.str.DTO.StatistiquePaiementDTO;
import com.str.Models.Paiement;
import com.str.Models.StatistiquePaiement;
import com.str.Repositories.PaiementRepository;
import com.str.Repositories.StatistiquePaiementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;


@Service
public class StatistiquePaiementService {

    private final StatistiquePaiementRepository statsRepository;
    private final PaiementRepository paiementRepository;

    public StatistiquePaiementService(StatistiquePaiementRepository statsRepository, PaiementRepository paiementRepository) {
        this.statsRepository = statsRepository;
        this.paiementRepository = paiementRepository;
    }

    @Transactional
    public StatistiquePaiementDTO generateStats(YearMonth periode) {
        List<Paiement> paiements = paiementRepository.findByPeriode(periode);

        BigDecimal total = paiements.stream()
                .map(Paiement::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long count = paiements.size();
        BigDecimal moyenne = count > 0
                ? total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Enregistrement des stats
        StatistiquePaiement stats = new StatistiquePaiement();
        stats.setPeriode(periode);
        stats.setTotalVerse(total);
        stats.setNombreDossiers((int) count);
        statsRepository.save(stats);

        return new StatistiquePaiementDTO(
                null, // periode déjà dans le constructeur
                total,
                count,
                moyenne
        );
    }

    public StatistiquePaiementDTO getStatistiques(YearMonth periode) {
        StatistiquePaiement stats = statsRepository.findByPeriode(periode)
                .orElseThrow(() -> new IllegalArgumentException("Aucune statistique trouvée pour la période " + periode));

        return new StatistiquePaiementDTO(
                periode,
                stats.getTotalVerse(),
                stats.getNombreDossiers(),
                stats.getTotalVerse().divide(BigDecimal.valueOf(stats.getNombreDossiers()), 2, RoundingMode.HALF_UP)
        );
    }

    public StatistiquePaiementDTO getStatistiquesGlobales() {
        List<StatistiquePaiement> allStats = statsRepository.findAll();
        BigDecimal totalVerse = allStats.stream()
                .map(StatistiquePaiement::getTotalVerse)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalDossiers = allStats.stream()
                .mapToLong(StatistiquePaiement::getNombreDossiers)
                .sum();

        BigDecimal moyenne = totalDossiers > 0
                ? totalVerse.divide(BigDecimal.valueOf(totalDossiers), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new StatistiquePaiementDTO(
                null, // Pas de période spécifique pour les stats globales
                totalVerse,
                totalDossiers,
                moyenne
        );
    }
}