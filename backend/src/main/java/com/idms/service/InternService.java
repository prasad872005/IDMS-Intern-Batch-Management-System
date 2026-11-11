
package com.idms.service;

import com.idms.dto.*;
import com.idms.model.*;
import com.idms.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class InternService {

    private final InternRepository interns;
    private final BatchRepository batches;

    private static final DateTimeFormatter DATE =
            DateTimeFormatter.BASIC_ISO_DATE;

    public InternService(InternRepository i, BatchRepository b) {
        interns = i;
        batches = b;
    }

    // Create Intern with batch-wise sequential ID
    @Transactional
    public InternResponse create(InternRequest r) {

        if (interns.existsByEmail(r.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        Batch batch = batches.findById(r.batchId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Selected batch does not exist"
                ));

        long next = interns
                .findTopByBatchIdAndCardTypeOrderByInternIdDesc(
                        batch.getId(),
                        r.cardType()
                )
                .map(last -> Long.parseLong(
                        last.getInternId().substring(
                                last.getInternId().lastIndexOf('-') + 1
                        )
                ) + 1)
                .orElse(1L);

        if (next > 999) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "ID sequence limit reached for this batch and card type"
            );
        }

        Intern x = new Intern();

        String prefix = r.cardType() == CardType.FREE
                ? "TDA"
                : "EMP";

        x.setInternId(
                prefix
                        + r.dateOfJoining().format(DATE)
                        + "-"
                        + String.format("%03d", next)
        );

        apply(x, r, batch);

        return toResponse(interns.save(x));
    }

    // Update Intern
    @Transactional
    public InternResponse update(Long id, InternRequest r) {

        Intern x = interns.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Intern not found"
                ));

        if (interns.existsByEmailAndIdNot(r.email(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already used by another intern"
            );
        }

        Batch b = batches.findById(r.batchId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Selected batch does not exist"
                ));

        apply(x, r, b);

        return toResponse(interns.save(x));
    }

    // Apply Intern Details
    private void apply(Intern x, InternRequest r, Batch b) {

        x.setName(r.name().trim());
        x.setEmail(r.email().trim().toLowerCase());
        x.setMobileNumber(r.mobileNumber().trim());
        x.setCardType(r.cardType());
        x.setDateOfJoining(r.dateOfJoining());
        x.setBatch(b);
    }

    // Get All Interns with Search and Filters
    @Transactional(readOnly = true)
    public List<InternResponse> all(
            String search,
            Long batchId,
            CardType cardType
    ) {

        return interns.findAll().stream()
                .filter(x -> batchId == null
                        || x.getBatch().getId().equals(batchId))
                .filter(x -> cardType == null
                        || x.getCardType() == cardType)
                .filter(x -> search == null
                        || search.isBlank()
                        || contains(x.getName(), search)
                        || contains(x.getInternId(), search)
                        || contains(x.getEmail(), search))
                .map(this::toResponse)
                .toList();
    }

    // Get Intern by ID
    @Transactional(readOnly = true)
    public InternResponse get(Long id) {

        return toResponse(
                interns.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Intern not found"
                        ))
        );
    }

    // Delete Intern
    @Transactional
    public void delete(Long id) {

        if (!interns.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Intern not found"
            );
        }

        interns.deleteById(id);
    }

    // Get Interns by Batch
    @Transactional(readOnly = true)
    public List<InternResponse> byBatch(Long id) {

        if (!batches.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Batch not found"
            );
        }

        return interns.findByBatchId(id).stream()
                .map(this::toResponse)
                .toList();
    }

    // Search Helper
    private boolean contains(String a, String b) {
        return a != null
                && a.toLowerCase().contains(b.toLowerCase());
    }

    // Convert Entity to Response
    private InternResponse toResponse(Intern x) {

        return new InternResponse(
                x.getId(),
                x.getInternId(),
                x.getName(),
                x.getEmail(),
                x.getMobileNumber(),
                x.getCardType(),
                x.getDateOfJoining(),
                x.getBatch().getId(),
                "Batch #" + x.getBatch().getId()
        );
    }
}
