package at.htlle.jump_n_run;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JumpNRunApplication {

    public static void main(String[] args) {
        SpringApplication.run(JumpNRunApplication.class, args);
        System.out.println("Server started. Go to http://localhost:8080/");
    }

}
