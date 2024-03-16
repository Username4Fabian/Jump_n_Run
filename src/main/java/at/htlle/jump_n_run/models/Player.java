package at.htlle.jump_n_run.models;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // IDENTITY für Reihenfolge
    private Long ID; 
    private String name;
    private int highscore; 
    private LocalDate creationDate; 
    private String password;
    private Long totalPlaytime;

    public Player() {
    }

    public Player(Long ID, String name, int highscore, LocalDate creationDate, String password, Long totalPlaytime) {
        this.ID = ID;
        this.name = name;
        this.highscore = highscore;
        this.creationDate = creationDate;
        this.password = password;
        this.totalPlaytime = totalPlaytime;
    }

    public Long getID() {
        return this.ID;
    }

    public void setID(Long ID) {
        this.ID = ID;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHighscore() {
        return this.highscore;
    }

    public void setHighscore(int highscore) {
        this.highscore = highscore;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getTotalPlaytime() {
        return this.totalPlaytime;
    }

    public void setTotalPlaytime(Long totalPlaytime) {
        this.totalPlaytime = totalPlaytime;
    }


}
