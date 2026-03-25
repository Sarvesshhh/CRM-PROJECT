package com.crm.repository;

import com.crm.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByCustomerIdOrderByDateDesc(Long customerId);
    List<Activity> findTop10ByOrderByDateDesc();
    List<Activity> findAllByOrderByDateDesc();
    List<Activity> findTop10ByPerformedByIdOrderByDateDesc(Long userId);
    List<Activity> findAllByPerformedByIdOrderByDateDesc(Long userId);
}
