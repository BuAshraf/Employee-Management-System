package com.ems.ems_backend.repository;

import com.ems.ems_backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyKey(String companyKey);
    boolean existsByCompanyKey(String companyKey);
}
