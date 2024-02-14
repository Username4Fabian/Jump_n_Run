package at.htlle.jump_n_run.controller;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RestController;

import at.htlle.jump_n_run.models.Player;
import at.htlle.jump_n_run.models.ScoreRequest;
import at.htlle.jump_n_run.models.Scores;
import at.htlle.jump_n_run.repositories.PlayerRepository;
import at.htlle.jump_n_run.repositories.ScoreRepository;

import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/getScores")
    public List<Map<String, Object>> getScores() {
        List<Scores> scores = scoreRepository.findAll(Sort.by(Sort.Direction.DESC, "score"));
        List<Map<String, Object>> result = new ArrayList<>();

        for (Scores score : scores) {
            Map<String, Object> scoreMap = new HashMap<>();
            scoreMap.put("name", score.getPlayer().getName());
            scoreMap.put("score", score.getScore());
            scoreMap.put("level", score.getLevel());
            scoreMap.put("playtime", score.getPlaytime());
            scoreMap.put("date", score.getDate());
            result.add(scoreMap);
        }

        return result;
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

