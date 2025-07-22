//package com.str.Mappers;
//
//import com.str.DTO.PeriodeCotisationDTO;
//import com.str.Enum.RegimeCotisation;
//import com.str.Models.DossierRetraite;
//import com.str.Models.PeriodeCotisation;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//
//import java.util.List;
//import java.util.UUID;
//
//@Mapper(componentModel = "spring")
//public interface PeriodeCotisationMapper {
//    @Mapping(target = "dossierId", source = "dossier.id")
//    @Mapping(target = "regime", source = "regime", qualifiedByName = "regimeToString")
//    PeriodeCotisationDTO toDto(PeriodeCotisation periode);
//
//    @Mapping(target = "dossier", source = "dossierId", qualifiedByName = "mapDossier")
//    @Mapping(target = "regime", source = "regime", qualifiedByName = "stringToRegime")
//    PeriodeCotisation toEntity(PeriodeCotisationDTO dto);
//
//    @Named("regimeToString")
//    default String regimeToString(RegimeCotisation regime) {
//        return regime != null ? regime.name() : null;
//    }
//
//    @Named("stringToRegime")
//    default RegimeCotisation stringToRegime(String regime) {
//        return regime != null ? RegimeCotisation.valueOf(regime) : null;
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