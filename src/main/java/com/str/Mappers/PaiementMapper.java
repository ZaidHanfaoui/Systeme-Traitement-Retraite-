package com.str.Mappers;

import com.str.DTO.PaiementDTO;
import com.str.Models.Paiement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaiementMapper {

    @Mapping(target = "dossierId", source = "dossier.id")
    @Mapping(target = "typePaiement", source = "typePaiement")
    @Mapping(target = "dateVersement", source = "dateVersement")
    @Mapping(target = "datePaiement", source = "datePaiement")
    @Mapping(target = "dateExecution", source = "dateExecution")
    PaiementDTO toDto(Paiement entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dossier", ignore = true)
    @Mapping(target = "typePaiement", source = "typePaiement")
    @Mapping(target = "dateVersement", source = "dateVersement")
    @Mapping(target = "datePaiement", source = "datePaiement")
    @Mapping(target = "dateExecution", source = "dateExecution")
    Paiement toEntity(PaiementDTO dto);
}