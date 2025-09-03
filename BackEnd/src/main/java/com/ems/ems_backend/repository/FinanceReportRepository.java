package com.ems.ems_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.ems.ems_backend.model.FinanceReport;

@Repository
public interface FinanceReportRepository extends JpaRepository<FinanceReport, Long>, JpaSpecificationExecutor<FinanceReport> { }
