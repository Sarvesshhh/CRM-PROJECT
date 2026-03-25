package com.crm.repository;

import com.crm.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);
    List<Task> findByStatus(String status);
    List<Task> findByCustomerId(Long customerId);
    long countByStatus(String status);
    long countByStatusAndAssignedToId(String status, Long userId);
}
