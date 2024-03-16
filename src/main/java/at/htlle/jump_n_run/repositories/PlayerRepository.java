package at.htlle.jump_n_run.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import at.htlle.jump_n_run.models.Player;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>{
    Player findByName(String name);
}


