//package com.str.Mappers;
//
//import com.str.DTO.PaiementDTO;
//import com.str.Enum.StatutPaiement;
//import com.str.Models.DossierRetraite;
//import com.str.Models.Paiement;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//
//import java.util.UUID;
//
//@Mapper(componentModel = "spring")
//public interface PaiementMapper {
//    @Mapping(target = "dossierId", source = "dossier.id")
//    @Mapping(target = "statut", source = "statut", qualifiedByName = "statutToString")
//    PaiementDTO toDto(Paiement paiement);
//
//    @Mapping(target = "dossier", source = "dossierId", qualifiedByName = "mapDossier")
//    @Mapping(target = "statut", source = "statut", qualifiedByName = "stringToStatut")
//    Paiement toEntity(PaiementDTO dto);
//
//    @Named("statutToString")
//    default String statutToString(StatutPaiement statut) {
//        return statut != null ? statut.name() : null;
//    }
//
//    @Named("stringToStatut")
//    default StatutPaiement stringToStatut(String statut) {
//        return statut != null ? StatutPaiement.valueOf(statut) : null;
//    }
//
//    @Named("mapDossier")
//    default DossierRetraite mapDossier(UUID dossierId) {
//        if (dossierId == null) return null;
//        DossierRetraite dossier = new DossierRetraite();
//        dossier.setId(dossierId);
//        return dossier;
//    }
//}