package com.str.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;

import java.math.BigDecimal;
import java.util.UUID;

public record PaiementDTO(
        // Champs communs
        UUID dossierId,

        // Champs Request (validés)
        @NotBlank(groups = {Create.class})
        String iban,

        // Champs Response-only
        @Null(groups = {Create.class})  // Interdit en Request
        UUID id,
        @Null(groups = {Create.class})
        BigDecimal montant
) {
    public interface Create {} // Marqueur pour la validation
}