package com.str.DTO;

import com.str.Enum.StatutDossier;
import com.str.Models.DossierRetraite;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

// 📍 DTO unifié (si pas de différence métier ou sécurité)
public record DossierDTO(
        UUID id,               // Null en Request, rempli en Response
        String statut,         // Ignoré en Request, rempli en Response
        LocalDate dateDepot,   // Auto-généré côté serveur
        @NotBlank String userId, // Validé en Request
        BigDecimal pension// Calculé côté serveur

) {

}
