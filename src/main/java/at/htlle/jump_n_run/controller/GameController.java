package at.htlle.jump_n_run.controller;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class GameController {
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private ScoreRepository scoreRepository;
    

    @PostMapping("/createScore")
    public String createScore(@RequestBody ScoreRequest request) {
        Player player = playerRepository.findByName(request.getName());
        if (player == null) {
            return "Player not found";
        }

        Scores lastScore = scoreRepository.findTopByPlayerOrderByDateDesc(player);
        if (lastScore != null && ChronoUnit.SECONDS.between(lastScore.getDate(), LocalDateTime.now()) <= 1) {
            return "Score not saved, previous score was less than 1 second ago";
        }

        Scores score = new Scores();
        score.setDate(LocalDateTime.now());
        score.setScore(request.getScore());
        score.setLevel(request.getLevel());
        score.setPlaytime(request.getPlaytime());

        if(score.getScore() <= 0){
            return "Score must be greater than 0";
        }

        score.setPlayer(player);
        scoreRepository.save(score);

        updateTotalPlaytime(score, player);
        updateHighscore(score, player);

        return "Score created";
    }

    @GetMapping("/getPlayerList")
    public List<Map<String, Object>> getPlayerList() {
        List<Player> players = playerRepository.findAll(Sort.by(Sort.Direction.DESC, "highscore"));
        List<Map<String, Object>> result = new ArrayList<>();

        for (Player player : players) {
            Map<String, Object> playerMap = new HashMap<>();
            playerMap.put("name", player.getName());
            playerMap.put("score", player.getHighscore());
            playerMap.put("playtime", player.getTotalPlaytime());
            playerMap.put("date", player.getCreationDate());
            result.add(playerMap);
        }
        return result;
    }

    @GetMapping("/getScores")
    public List<Map<String, Object>> getScores(@RequestParam String name) {
        List<Scores> scores = scoreRepository.findByPlayerName(name, Sort.by(Sort.Direction.DESC, "score"));
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
        player.setTotalPlaytime(newPlaytime);
        playerRepository.save(player);
    }
}

