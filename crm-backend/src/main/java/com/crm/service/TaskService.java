package com.crm.service;

import com.crm.dto.TaskRequest;
import com.crm.dto.TaskResponse;
import com.crm.entity.Customer;
import com.crm.entity.Role;
import com.crm.entity.Task;
import com.crm.entity.User;
import com.crm.entity.ActivityType;
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
    private final ActivityService activityService;

    private User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public TaskResponse createTask(TaskRequest request, String currentUserEmail) {
        User currentUser = getCurrentUser(currentUserEmail);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : "PENDING")
                .build();

        if (currentUser.getRole() == Role.ADMIN) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            task.setAssignedTo(assignee);
        } else {
            task.setAssignedTo(currentUser);
        }

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            task.setCustomer(customer);
        }

        Task savedTask = taskRepository.save(task);
        activityService.logSystemActivity(ActivityType.TASK_CREATED, "Created Task: " + savedTask.getTitle(), savedTask.getId(), "TASK", savedTask.getCustomer() != null ? savedTask.getCustomer().getId() : null, currentUserEmail);
        return mapToResponse(savedTask);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String currentUserEmail) {
        User currentUser = getCurrentUser(currentUserEmail);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        String oldStatus = task.getStatus();
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (currentUser.getRole() == Role.ADMIN) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            task.setAssignedTo(assignee);
        } else {
            task.setAssignedTo(currentUser);
        }

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            task.setCustomer(customer);
        }

        Task savedTask = taskRepository.save(task);
        if (!"COMPLETED".equals(oldStatus) && "COMPLETED".equals(savedTask.getStatus())) {
            activityService.logSystemActivity(ActivityType.TASK_COMPLETED, "Completed Task: " + savedTask.getTitle(), savedTask.getId(), "TASK", savedTask.getCustomer() != null ? savedTask.getCustomer().getId() : null, currentUserEmail);
        }
        return mapToResponse(savedTask);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    public List<TaskResponse> getAllTasks(String currentUserEmail) {
        User currentUser = getCurrentUser(currentUserEmail);

        List<Task> tasks;
        if (currentUser.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByAssignedToId(currentUser.getId());
        }
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
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
