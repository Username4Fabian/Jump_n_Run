package at.htlle.jump_n_run.models;

public class Player {
    private Long ID; 
    private String name;
    private int Highscore; 
    private int totalPlaytime; 

    public Player() {
    }

    public Player(Long ID, String name, int Highscore, int totalPlaytime) {
        this.ID = ID;
        this.name = name;
        this.Highscore = Highscore;
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

    public int getTotalPlaytime() {
        return this.totalPlaytime;
    }

    public void setTotalPlaytime(int totalPlaytime) {
        this.totalPlaytime = totalPlaytime;
    }


}
