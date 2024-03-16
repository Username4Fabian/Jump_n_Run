package at.htlle.jump_n_run.models;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Scores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ID;
    private LocalDateTime date;
    private int score;
    private int level; 
    private Long playtime;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    public Scores() {
    }

    public Scores(Long ID, LocalDateTime date, int score, int level, Long playtime, Player player) {
        this.ID = ID;
        this.date = date;
        this.score = score;
        this.level = level;
        this.playtime = playtime;
        this.player = player;
    }


    public Long getID() {
        return this.ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public LocalDateTime getDate() {
        return this.date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getScore() {
        return this.score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getLevel() {
        return this.level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Long getPlaytime() {
        return this.playtime;
    }

    public void setPlaytime(Long playtime) {
        this.playtime = playtime;
    }

    public Player getPlayer() {
        return this.player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }


    
}
