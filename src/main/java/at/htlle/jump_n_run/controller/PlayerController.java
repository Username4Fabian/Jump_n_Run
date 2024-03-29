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
import at.htlle.jump_n_run.service.TokenService;

import org.springframework.web.bind.annotation.GetMapping;



@RestController
public class PlayerController {
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public static Boolean tokenisValid = false;

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
        player.setTotalPlaytime((long) 0);
        playerRepository.save(player);
    
        return new ResponseEntity<>("Player created", HttpStatus.OK);
    }

    @GetMapping("/getToken")
    public ResponseEntity<String> getMethodName(@RequestParam String userName) {
        String token = TokenService.generateToken(userName);
        if(validateToken(token)) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(500).body("Token error");
        }
    }

/*
    @GetMapping("/validateToken")
    public ResponseEntity<String> validateTokenReq(@RequestParam String token) {
        if(TokenService.validateToken(token)) {
            tokenisValid = true;
            return ResponseEntity.ok("Token is valid");
        } else {
            tokenisValid = false;
            return ResponseEntity.status(500).body("Token is invalid");
        }
    } */
    
    private static boolean validateToken(String token) {
        return TokenService.validateToken(token);
    }

}