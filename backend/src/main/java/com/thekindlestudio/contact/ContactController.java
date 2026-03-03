package com.thekindlestudio.contact;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

record ContactRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @Size(max = 30) String phone,
        @NotBlank @Size(max = 2000) String message
) {
}

record ContactResponse(
        Long id,
        String name
) {
}

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository repository;

    public ContactController(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage entity = new ContactMessage();
        entity.setName(request.name());
        entity.setEmail(request.email());
        entity.setPhone(request.phone());
        entity.setMessage(request.message());
        entity.setStatus(ContactStatus.NEW);

        ContactMessage saved = repository.save(entity);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ContactResponse(saved.getId(), saved.getName()));
    }
}

