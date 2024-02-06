package at.htlle.jump_n_run.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import at.htlle.jump_n_run.models.Player;

public interface PlayerRepository extends JpaRepository<Player, Long>{
    Player findByName(String name);
}
