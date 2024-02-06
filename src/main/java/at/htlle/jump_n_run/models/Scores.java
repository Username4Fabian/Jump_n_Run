package at.htlle.jump_n_run.models;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Scores {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long ID;
    private LocalDate date;
    private int score;
    private int level; 
    private int playtime;
    private Long player_ID; 

    public Scores() {
    }

    public Scores(Long ID, LocalDate date, int score, int level, int playtime, Long player_ID) {
        this.ID = ID;
        this.date = date;
        this.score = score;
        this.level = level;
        this.playtime = playtime;
        this.player_ID = player_ID;
    }


    public Long getID() {
        return this.ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setDate(LocalDate date) {
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

    public int getPlaytime() {
        return this.playtime;
    }

    public void setPlaytime(int playtime) {
        this.playtime = playtime;
    }

    public Long getPlayer_ID() {
        return this.player_ID;
    }

    public void setPlayer_ID(Long player_ID) {
        this.player_ID = player_ID;
    }

    
}
