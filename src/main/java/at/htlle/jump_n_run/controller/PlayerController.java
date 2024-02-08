package at.htlle.jump_n_run.controller;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import at.htlle.jump_n_run.models.Player;
import at.htlle.jump_n_run.repositories.PlayerRepository;
import at.htlle.jump_n_run.repositories.ScoreRepository;

@RestController
public class PlayerController {
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    @SuppressWarnings("unused")
    private ScoreRepository scoreRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/createPlayer")
    public ResponseEntity<Object> createPlayer(@RequestParam String name, @RequestParam String password) {
        Player existingPlayer = playerRepository.findByName(name);
        if(existingPlayer != null) {
            if(bCryptPasswordEncoder.matches(password, existingPlayer.getPassword())) {
                return new ResponseEntity<>(existingPlayer.getName(), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>("Username already taken", HttpStatus.BAD_REQUEST);
            }
        }
        Player player = new Player();
        player.setName(name);
        player.setPassword(bCryptPasswordEncoder.encode(password));
        player.setCreationDate(LocalDate.now());
        player.setHighscore(0);
        player.setTotalPlaytime(java.sql.Time.valueOf("00:00:00"));
        playerRepository.save(player);
    
        return new ResponseEntity<>("Player created", HttpStatus.OK);
    }
}