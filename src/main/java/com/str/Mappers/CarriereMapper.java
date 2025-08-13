package com.str.Mappers;

import com.str.DTO.CarriereDTO;
import com.str.Models.Carriere;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CarriereMapper {

    @Mapping(target = "dossierId", source = "dossier.id")
    @Mapping(target = "dateDebut", expression = "java(entity.getDateDebut() != null ? entity.getDateDebut().toString() : null)")
    @Mapping(target = "dateFin", expression = "java(entity.getDateFin() != null ? entity.getDateFin().toString() : null)")
    @Mapping(target = "salaireMoyen", expression = "java(entity.getSalaireMoyen() != null ? entity.getSalaireMoyen().doubleValue() : null)")
    CarriereDTO toDto(Carriere entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dossier", ignore = true)
    @Mapping(target = "dateDebut", expression = "java(dto.getDateDebut() != null ? java.time.LocalDate.parse(dto.getDateDebut()) : null)")
    @Mapping(target = "dateFin", expression = "java(dto.getDateFin() != null && !dto.getDateFin().isEmpty() ? java.time.LocalDate.parse(dto.getDateFin()) : null)")
    @Mapping(target = "salaireMoyen", expression = "java(dto.getSalaireMoyen() != null ? java.math.BigDecimal.valueOf(dto.getSalaireMoyen()) : null)")
    Carriere toEntity(CarriereDTO dto);
}