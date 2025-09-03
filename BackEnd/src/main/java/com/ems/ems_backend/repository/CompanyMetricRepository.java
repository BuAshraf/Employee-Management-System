package com.ems.ems_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.ems.ems_backend.model.CompanyMetric;

@Repository
public interface CompanyMetricRepository extends JpaRepository<CompanyMetric, Long>, JpaSpecificationExecutor<CompanyMetric> { }
