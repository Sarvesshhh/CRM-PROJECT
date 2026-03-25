package com.crm.repository;

import com.crm.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Page<Customer> findAll(Pageable pageable);

    Page<Customer> findByAssignedToId(Long userId, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Customer> searchByName(@Param("name") String name, Pageable pageable);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) AND c.assignedTo.id = :userId")
    Page<Customer> searchByNameAndAssignedToId(@Param("name") String name, @Param("userId") Long userId, Pageable pageable);

    List<Customer> findByStatus(String status);

    List<Customer> findByAssignedToId(Long userId);

    long countByAssignedToId(Long userId);
}
