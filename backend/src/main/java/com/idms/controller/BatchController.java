package com.idms.controller;
import com.idms.dto.*; import com.idms.service.*; import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/batches")
public class BatchController {
 private final BatchService batches; private final InternService interns;
 public BatchController(BatchService b,InternService i){batches=b;interns=i;}
 @GetMapping public List<BatchResponse> all(){return batches.all();}
 @GetMapping("/{id}") public BatchResponse get(@PathVariable Long id){return batches.get(id);}
 @GetMapping("/{id}/interns") public List<InternResponse> interns(@PathVariable Long id){return interns.byBatch(id);}
 @PostMapping public BatchResponse create(@Valid @RequestBody BatchRequest r){return batches.create(r);}
 @DeleteMapping("/{id}") public void delete(@PathVariable Long id){batches.delete(id);}
}
