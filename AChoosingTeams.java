import java.util.*;

public class AChoosingTeams {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int k = sc.nextInt();

        int eligible = 0;

        for (int i = 0; i < n; i++) {
            int y = sc.nextInt();

            if (y + k <= 5) {
                eligible++;
            }
        }

        System.out.println(eligible / 3);
    }
}