package com.ems.ems_backend.service;

import com.ems.ems_backend.dto.CompanyRequest;
import com.ems.ems_backend.dto.CompanyResponse;
import com.ems.ems_backend.exception.NotFoundException;
import com.ems.ems_backend.model.Company;
import com.ems.ems_backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository repository;

    public Page<CompanyResponse> list(Pageable pageable) {
        return repository.findAll(pageable)
                .map(c -> new CompanyResponse(c.getId(), c.getName(), c.getCompanyKey(), c.isActive()));
    }

    public CompanyResponse get(Long id) {
        Company c = repository.findById(id).orElseThrow(() -> new NotFoundException("Company not found"));
        return new CompanyResponse(c.getId(), c.getName(), c.getCompanyKey(), c.isActive());
    }

    public CompanyResponse create(CompanyRequest req) {
        Company c = new Company();
        c.setName(req.getName());
        c.setCompanyKey(req.getCompanyKey());
        c.setDbUrl(req.getDbUrl());
        c.setDbUsername(req.getDbUsername());
        c.setDbPassword(req.getDbPassword());
        if (req.getActive() != null) c.setActive(req.getActive());
        Company saved = repository.save(c);
        return new CompanyResponse(saved.getId(), saved.getName(), saved.getCompanyKey(), saved.isActive());
    }

    public CompanyResponse update(Long id, CompanyRequest req) {
        Company c = repository.findById(id).orElseThrow(() -> new NotFoundException("Company not found"));
        if (req.getName() != null) c.setName(req.getName());
        if (req.getCompanyKey() != null) c.setCompanyKey(req.getCompanyKey());
        if (req.getDbUrl() != null) c.setDbUrl(req.getDbUrl());
        if (req.getDbUsername() != null) c.setDbUsername(req.getDbUsername());
        if (req.getDbPassword() != null) c.setDbPassword(req.getDbPassword());
        if (req.getActive() != null) c.setActive(req.getActive());
        Company saved = repository.save(c);
        return new CompanyResponse(saved.getId(), saved.getName(), saved.getCompanyKey(), saved.isActive());
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new NotFoundException("Company not found");
        repository.deleteById(id);
    }

    public Company requireActiveByKey(String key) {
        Company c = repository.findByCompanyKey(key)
                .orElseThrow(() -> new NotFoundException("Invalid company key"));
        if (!c.isActive()) throw new NotFoundException("Company is inactive");
        return c;
    }
}
