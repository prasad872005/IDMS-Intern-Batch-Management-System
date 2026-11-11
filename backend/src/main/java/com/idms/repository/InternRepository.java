
package com.idms.repository;

import com.idms.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InternRepository extends JpaRepository<Intern, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByBatchIdAndCardType(Long batchId, CardType cardType);

    Optional<Intern> findTopByBatchIdAndCardTypeOrderByInternIdDesc(
        Long batchId,
        CardType cardType
    );

    List<Intern> findByBatchId(Long batchId);
}
