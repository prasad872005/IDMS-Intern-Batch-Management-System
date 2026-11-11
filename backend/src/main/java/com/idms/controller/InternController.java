package com.idms.controller;
import com.idms.dto.*; import com.idms.model.CardType; import com.idms.service.InternService;
import jakarta.validation.Valid; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/interns")
public class InternController {
 private final InternService service; public InternController(InternService s){service=s;}
 @GetMapping public List<InternResponse> all(@RequestParam(required=false) String search,@RequestParam(required=false) Long batchId,@RequestParam(required=false) CardType cardType){return service.all(search,batchId,cardType);}
 @GetMapping("/{id}") public InternResponse get(@PathVariable Long id){return service.get(id);}
 @PostMapping public InternResponse create(@Valid @RequestBody InternRequest r){return service.create(r);}
 @PutMapping("/{id}") public InternResponse update(@PathVariable Long id,@Valid @RequestBody InternRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") public void delete(@PathVariable Long id){service.delete(id);}
}
