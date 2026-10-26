package com.pretender.controllers;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.pretender.forms.TenderRequest;
import com.pretender.forms.TenderResponse;
import com.pretender.services.TenderService;

@RestController
@RequestMapping("/api/tenders")
public class TenderController {
    private final TenderService tenders;
    public TenderController(TenderService tenders) { this.tenders = tenders; }

    @GetMapping
    public List<TenderResponse> list() { return tenders.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TenderResponse create(@Valid @RequestBody TenderRequest request) { return tenders.create(request); }
}