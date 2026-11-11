package com.idms.dto;
import com.idms.model.CardType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record InternRequest(@NotBlank @Size(max=100) String name,
 @NotBlank @Email @Size(max=150) String email,
 @NotBlank @Pattern(regexp="^[+]?[0-9]{10,15}$", message="Mobile number must contain 10 to 15 digits") String mobileNumber,
 @NotNull CardType cardType, @NotNull LocalDate dateOfJoining, @NotNull Long batchId) {}
