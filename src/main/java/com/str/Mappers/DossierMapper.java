package com.str.Mappers;

import com.str.DTO.DossierDTO;
import com.str.Models.DossierRetraite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.LocalDate;
import java.time.Period;

@Mapper(componentModel = "spring", uses = {CarriereMapper.class, PaiementMapper.class, DocumentMapper.class})
public interface DossierMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "numeroSecuriteSociale", source = "numeroSecuriteSociale")
    @Mapping(target = "beneficiaire", source = "beneficiaire")
    @Mapping(target = "statut", source = "statut")
    @Mapping(target = "carrieres", source = "carrieres")
    @Mapping(target = "paiements", source = "paiements")
    @Mapping(target = "documents", source = "documents")
    @Mapping(target = "dateCreation", source = "dateCreation")
    @Mapping(target = "pensionMensuelle", ignore = true)
    @Mapping(target = "age", expression = "java(calculateAge(entity))")
    DossierDTO toDto(DossierRetraite entity);

    @Mapping(target = "carrieres", ignore = true)
    @Mapping(target = "paiements", ignore = true)
    @Mapping(target = "documents", ignore = true)
    DossierRetraite toEntity(DossierDTO dto);

    default Integer calculateAge(DossierRetraite entity) {
        if (entity.getBeneficiaire() != null && entity.getBeneficiaire().getDateNaissance() != null) {
            return Period.between(entity.getBeneficiaire().getDateNaissance(), LocalDate.now()).getYears();
        }
        return null;
    }
}