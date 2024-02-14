package at.htlle.jump_n_run.controller;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import at.htlle.jump_n_run.models.Player;
import at.htlle.jump_n_run.models.ScoreRequest;
import at.htlle.jump_n_run.models.Scores;
import at.htlle.jump_n_run.repositories.PlayerRepository;
import at.htlle.jump_n_run.repositories.ScoreRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
public class GameController {
    @SuppressWarnings("unused")
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private ScoreRepository scoreRepository;
    

    @PostMapping("/createScore")
    public String createScore(@RequestBody ScoreRequest request) {
        Scores score = new Scores();
        score.setDate(LocalDateTime.now());
        score.setScore(request.getScore());
        score.setLevel(request.getLevel());
        score.setPlaytime(request.getPlaytime());
    
        Player player = playerRepository.findByName(request.getName());
        if (player == null) {
            return "Player not found";
        }
    
        score.setPlayer(player);
        scoreRepository.save(score);

        updateTotalPlaytime(score, player);
        updateHighscore(score, player);
    
        return "Score created";
    }
    
    private void updateHighscore(Scores score, Player player){
        if(score.getScore() > player.getHighscore()){
            player.setHighscore(score.getScore());
            playerRepository.save(player);
        }
    }

    private void updateTotalPlaytime(Scores score, Player player){
        Long newPlaytime = player.getTotalPlaytime() + score.getPlaytime();
        player.setTotalPlaytime(newPlaytime + score.getPlaytime());
        playerRepository.save(player);
    }
}

