package com.idms.dto;

import java.time.LocalDate;

public record BatchResponse(
    Long id,
    String batchName,
    LocalDate startDate,
    LocalDate endDate,
    long internCount
) {}