package com.str.Services;

import com.str.Models.DossierRetraite;
import com.str.Models.PeriodeCotisation;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

@Service
public class PensionCalculatorService {

    private static final BigDecimal TAUX_DE_BASE = new BigDecimal("0.75"); // 75% du salaire moyen

    public BigDecimal calculerPension(DossierRetraite dossier) {
        BigDecimal salaireMoyen = calculerSalaireMoyen(dossier);
        int anneesCotisees = calculerAnneesCotisation(dossier);

        return salaireMoyen.multiply(TAUX_DE_BASE)
                .multiply(new BigDecimal(anneesCotisees))
                .divide(new BigDecimal(100), RoundingMode.HALF_UP);
    }

    private BigDecimal calculerSalaireMoyen(DossierRetraite dossier) {
        return dossier.getPeriodesCotisation().stream()
                .map(PeriodeCotisation::getSalaireCotise)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(new BigDecimal(dossier.getPeriodesCotisation().size()), RoundingMode.HALF_UP);
    }

    private int calculerAnneesCotisation(DossierRetraite dossier) {
        return (int) dossier.getPeriodesCotisation().stream()
                .mapToLong(p -> ChronoUnit.YEARS.between(p.getDateDebut(), p.getDateFin()))
                .sum();
    }
}