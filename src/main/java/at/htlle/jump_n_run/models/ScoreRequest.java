package at.htlle.jump_n_run.models;

public class ScoreRequest {
    private int score; 
    private int level;
    private Long playtime;
    private String name;

    public ScoreRequest() {
    }

    public ScoreRequest(int score, int level, Long playtime, String name) {
        this.score = score;
        this.level = level;
        this.playtime = playtime;
        this.name = name;
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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
}