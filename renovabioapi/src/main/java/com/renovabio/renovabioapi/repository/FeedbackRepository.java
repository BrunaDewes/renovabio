package com.renovabio.renovabioapi.repository;

import com.renovabio.renovabioapi.model.Feedback;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUsuarioCidadeId(Long cidadeId);
}
