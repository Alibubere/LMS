package com.example.lms.config;

import com.example.lms.entity.Category;
import com.example.lms.entity.User;
import com.example.lms.repository.CategoryRepository;
import com.example.lms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Initialize default categories if empty
        if (categoryRepository.count() == 0) {
            log.info("Initializing default course categories...");
            categoryRepository.save(new Category(null, "Web Development", "Frontend, Backend, and Full-Stack development courses."));
            categoryRepository.save(new Category(null, "Computer Science", "Algorithms, Data Structures, and Systems."));
            categoryRepository.save(new Category(null, "Cloud & DevOps", "Cloud Computing, Containers, CI/CD, and Infrastructure."));
            categoryRepository.save(new Category(null, "Data Science & AI", "Machine Learning, Deep Learning, and Data Analytics."));
        }

        // Initialize default admin user if none exists
        if (userRepository.count() == 0) {
            log.info("Initializing default users...");
            User admin = new User(null, "Admin User", "admin@example.com", passwordEncoder.encode("admin123"), User.Role.ADMIN);
            admin.setBio("Platform Administrator");
            userRepository.save(admin);

            User instructor = new User(null, "Sarah Instructor", "instructor@example.com", passwordEncoder.encode("password123"), User.Role.INSTRUCTOR);
            instructor.setBio("Senior Software Engineer & Lead Educator");
            userRepository.save(instructor);

            User learner = new User(null, "Alex Learner", "learner@example.com", passwordEncoder.encode("password123"), User.Role.LEARNER);
            learner.setBio("Enthusiastic Computer Science Student");
            userRepository.save(learner);
        }
    }
}
