package com.ems.ems_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ems.ems_backend.model.SystemSettings;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {

    /**
     * Find the current system settings (there should only be one record)
     * @return Optional<SystemSettings>
     */
    @Query("SELECT s FROM SystemSettings s ORDER BY s.updatedAt DESC")
    Optional<SystemSettings> findCurrentSettings();

    /**
     * Find settings by ID
     * @param id Settings ID
     * @return Optional<SystemSettings>
     */
    Optional<SystemSettings> findById(Long id);

    /**
     * Check if any settings exist
     * @return boolean indicating if settings exist
     */
    boolean existsById(Long id);

    /**
     * Count total settings records
     * @return count of settings records
     */
    long count();
}
