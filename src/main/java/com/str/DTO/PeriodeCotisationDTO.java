// Classe PeriodeCotisationDTO
package com.str.DTO;

import jakarta.annotation.Nullable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

public record PeriodeCotisationDTO(
        // Champs communs
        LocalDate dateDebut,
        LocalDate dateFin,
        BigDecimal salaireCotise,

        // Champs Response-only (peuvent être null en Request)
        @Nullable UUID id,                // Rempli en Response
        @Nullable String regime           // Rempli en Response
) {
    public UUID dossierId() {
        // Retourne l'ID du dossier associé, ou null si non défini
        return null; // Implémentation à adapter selon le contexte
    }
}