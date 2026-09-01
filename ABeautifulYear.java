import java.util.*;

public class ABeautifulYear {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int y = sc.nextInt();

        while (true) {
            y++;

            String s = String.valueOf(y);
            boolean[] seen = new boolean[10];
            boolean distinct = true;

            for (char ch : s.toCharArray()) {
                int digit = ch - '0';

                if (seen[digit]) {
                    distinct = false;
                    break;
                }

                seen[digit] = true;
            }

            if (distinct) {
                System.out.println(y);
                break;
            }
        }
    }
}