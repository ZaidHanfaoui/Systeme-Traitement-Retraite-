//package com.str.Mappers;
//
//import com.str.DTO.DossierDTO;
//import com.str.Enum.StatutDossier;
//import com.str.Models.DossierRetraite;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//
//import java.math.BigDecimal;
//
//@Mapper(componentModel = "spring")
//public interface DossierMapper {
//
//    @Mapping(target = "id", source = "id")
//    @Mapping(target = "statut", source = "statut", qualifiedByName = "statutToString")
//    @Mapping(target = "dateDepot", source = "dateDepot")
//    @Mapping(target = "userId", source = "keycloakUserId")
//    @Mapping(target = "pension", source = "pensionMensuelle")
//    DossierDTO toDTO(DossierRetraite entity);
//
//    @Mapping(target = "id", ignore = true) // Ignoré car généré automatiquement
//    @Mapping(target = "statut", ignore = true) // Géré par le service
//    @Mapping(target = "dateDepot", ignore = true) // Géré par le service
//    @Mapping(target = "keycloakUserId", source = "userId")
//    @Mapping(target = "paiements", ignore = true) // Géré séparément
//    @Mapping(target = "periodesCotisation", ignore = true) // Géré séparément
//    DossierRetraite toEntity(DossierDTO dto);
//
//    @Named("statutToString")
//    default String statutToString(StatutDossier statut) {
//        return statut != null ? statut.name() : null;
//    }
//
//    @Named("calculatePension")
//    default BigDecimal calculatePension(DossierRetraite entity) {
//        return entity.getPensionMensuelle();
//    }
//}