package com.idms.service;

import com.idms.dto.*;
import com.idms.model.*;
import com.idms.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BatchService {

    private final BatchRepository batches;
    private final InternRepository interns;

    public BatchService(BatchRepository b, InternRepository i) {
        batches = b;
        interns = i;
    }

    @Transactional
    public BatchResponse create(BatchRequest request) {
        Batch b = new Batch();
        b.setBatchName(request.batchName().trim());
        b.setStartDate(request.startDate());
        b.setEndDate(request.startDate().plusMonths(6));

        b = batches.save(b);
        return toResponse(b);
    }

    @Transactional(readOnly = true)
    public List<BatchResponse> all() {
        return batches.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public BatchResponse get(Long id) {
        return toResponse(
            batches.findById(id).orElseThrow(
                () -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Batch not found"
                )
            )
        );
    }

    @Transactional
    public void delete(Long id) {
        Batch b = batches.findById(id).orElseThrow(
            () -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Batch not found"
            )
        );

        if (!interns.findByBatchId(id).isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Move or delete interns before deleting this batch"
            );
        }

        batches.delete(b);
    }

    private BatchResponse toResponse(Batch b) {
        return new BatchResponse(
            b.getId(),
            b.getBatchName(),
            b.getStartDate(),
            b.getEndDate(),
            interns.findByBatchId(b.getId()).size()
        );
    }
}