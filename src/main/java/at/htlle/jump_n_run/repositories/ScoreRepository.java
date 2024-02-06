package at.htlle.jump_n_run.repositories;
import at.htlle.jump_n_run.models.Scores;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Scores, Long>{
    
}