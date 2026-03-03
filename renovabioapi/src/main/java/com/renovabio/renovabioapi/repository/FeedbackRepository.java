package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // métodos prontos --> save(), findAll(), findById(), deleteById()
}