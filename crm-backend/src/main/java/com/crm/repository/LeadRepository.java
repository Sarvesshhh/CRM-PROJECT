package com.crm.repository;

import com.crm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(String status);
    List<Lead> findByAssignedToId(Long userId);
    List<Lead> findByStatusAndAssignedToId(String status, Long userId);
}
