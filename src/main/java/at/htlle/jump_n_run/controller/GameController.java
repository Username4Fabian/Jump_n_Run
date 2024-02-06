package at.htlle.jump_n_run.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import at.htlle.jump_n_run.repositories.PlayerRepository;
import at.htlle.jump_n_run.repositories.ScoreRepository;



@RestController
public class GameController {
    @SuppressWarnings("unused")
    @Autowired
    private PlayerRepository playerRepository;
    @SuppressWarnings("unused")
    @Autowired
    private ScoreRepository scoreRepository;
    

    
}
