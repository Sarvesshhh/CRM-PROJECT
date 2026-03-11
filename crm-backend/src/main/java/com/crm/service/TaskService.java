package com.crm.service;

import com.crm.dto.TaskRequest;
import com.crm.dto.TaskResponse;
import com.crm.entity.Customer;
import com.crm.entity.Task;
import com.crm.entity.User;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.CustomerRepository;
import com.crm.repository.TaskRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public TaskResponse createTask(TaskRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .build();

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(user);
        }

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            task.setCustomer(customer);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(user);
        }

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            task.setCustomer(customer);
        }

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToResponse(task);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .assignedToName(task.getAssignedTo() != null ? task.getAssignedTo().getName() : null)
                .assignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
                .customerName(task.getCustomer() != null ? task.getCustomer().getName() : null)
                .customerId(task.getCustomer() != null ? task.getCustomer().getId() : null)
                .build();
    }
}
