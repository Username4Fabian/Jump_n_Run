package at.htlle.jump_n_run.service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;


public class TokenService {

    /*
    public static void main(String[] args) {
        TokenService tokenService = new TokenService();
        String token = TokenService.generateToken("admin");
        System.out.println("Token: " + token);
        System.out.println("Valid token: " + tokenService.validateToken(token));
    } */

    private static String secretKey = "VerySecretKey";

    public static String generateToken(String username) {
        long expirationTime = 900000;
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("Invalid token: " + e.getMessage());
        }
        return false;
    }
}


