package com.ems.ems_backend.service;

import com.ems.ems_backend.model.Company;
import com.ems.ems_backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@Order(0)
public class CompanyInitializationService implements ApplicationRunner {

    private final CompanyRepository companyRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (!companyRepository.existsByCompanyKey("default")) {
            Company c = new Company();
            c.setName("Default Company");
            c.setCompanyKey("default");
            companyRepository.save(c);
            log.info("Seeded default company with key 'default'");
        }
    }
}
