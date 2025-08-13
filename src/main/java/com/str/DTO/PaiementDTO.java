package com.str.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.str.Enum.TypePaiement;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementDTO(
        Long id,

        @NotNull
        @Positive
        BigDecimal montant,

        @JsonFormat(pattern = "yyyy-MM-dd")
        String dateVersement,

        @JsonFormat(pattern = "yyyy-MM-dd")
        String datePaiement,

        @NotNull
        TypePaiement typePaiement,

        String reference,

        String statut,

        @JsonFormat(pattern = "yyyy-MM-dd")
        String dateExecution,

        Long dossierId
) {
    // Constructeur pour la création (sans ID)
    public static PaiementDTO forCreate(BigDecimal montant, TypePaiement typePaiement,
                                      String dateVersement, String datePaiement, String reference, Long dossierId) {
        return new PaiementDTO(null, montant, dateVersement, datePaiement, typePaiement, reference, "EN_ATTENTE", null, dossierId);
    }

    // Méthode pour formater le montant
    public String getMontantFormate() {
        return montant != null ? String.format("%,.2f €", montant) : null;
    }

    // Méthodes de compatibilité pour l'ancien nom 'type'
    public TypePaiement type() {
        return typePaiement;
    }
}