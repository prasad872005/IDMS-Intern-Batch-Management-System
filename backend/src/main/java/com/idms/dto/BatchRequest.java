package com.idms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BatchRequest(
    @NotBlank String batchName,
    @NotNull LocalDate startDate
) {}