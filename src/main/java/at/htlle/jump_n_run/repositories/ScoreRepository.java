package at.htlle.jump_n_run.repositories;
import at.htlle.jump_n_run.models.Player;
import at.htlle.jump_n_run.models.Scores;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends JpaRepository<Scores, Long>{
    List<Scores> findByPlayerName(String name, Sort sort);

    Scores findTopByPlayerOrderByDateDesc(Player player);
}