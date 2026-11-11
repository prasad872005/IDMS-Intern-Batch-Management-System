package com.idms.dto;
import com.idms.model.CardType;
import java.time.LocalDate;
public record InternResponse(Long id, String internId, String name, String email, String mobileNumber, CardType cardType, LocalDate dateOfJoining, Long batchId, String batchName) {}
