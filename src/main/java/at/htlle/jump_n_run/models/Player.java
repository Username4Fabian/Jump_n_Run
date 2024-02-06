package at.htlle.jump_n_run.models;
import java.sql.Time;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long ID; 
    private String name;
    private int Highscore; 
    private LocalDate creationDate; 
    private String password;
    private Time totalPlaytime;

    public Player() {
    }

    public Player(Long ID, String name, int Highscore, LocalDate creationDate, String password, Time totalPlaytime) {
        this.ID = ID;
        this.name = name;
        this.Highscore = Highscore;
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
        return this.Highscore;
    }

    public void setHighscore(int Highscore) {
        this.Highscore = Highscore;
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

    public Time getTotalPlaytime() {
        return this.totalPlaytime;
    }

    public void setTotalPlaytime(Time totalPlaytime) {
        this.totalPlaytime = totalPlaytime;
    }


}
