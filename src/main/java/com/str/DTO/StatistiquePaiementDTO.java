package com.str.DTO;


import jakarta.annotation.Nullable;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;

/**
 * DTO unifié pour les requêtes (filtres) ET les réponses (stats).
 * Exemple d'utilisation :
 * - En requête : Filtrer par année/mois
 * - En réponse : Retourner les KPI clés
 */
public record StatistiquePaiementDTO(
        // Champs de filtrage (Request)
        @Nullable YearMonth periode,  // Peut être null si on veut toutes les données
        @Nullable Integer annee,      // Filtre alternatif à YearMonth

        // Champs de réponse (Response)
        @Nullable BigDecimal totalVerse,         // Rempli côté serveur
        @Nullable Long nombreDossiers,          // Rempli côté serveur
        @Nullable BigDecimal montantMoyen       // Rempli côté serveur
) {
    public StatistiquePaiementDTO(YearMonth periode, BigDecimal totalVerse, long nombreDossiers, BigDecimal montantMoyen) {
        this(periode, periode != null ? periode.getYear() : null, totalVerse, nombreDossiers, montantMoyen);
    }

    // Méthode factory pour une requête de filtrage
    public static StatistiquePaiementDTO forRequest(YearMonth periode) {
        return new StatistiquePaiementDTO(periode, null, null, null, null);
    }

    // Méthode factory pour une réponse
    public static StatistiquePaiementDTO forResponse(BigDecimal total, long count) {
        BigDecimal moyenne = count > 0 ? total.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        return new StatistiquePaiementDTO(null, null, total, count, moyenne);
    }
}