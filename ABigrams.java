import java.util.*;

public class ABigrams {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();

        while (t-- > 0) {
            int k = sc.nextInt();

            int countTwoOrMore = 0;
            boolean possible = false;

            for (int i = 0; i < k; i++) {
                long c = sc.nextLong();

                if (c >= 3) {
                    possible = true;
                }

                if (c >= 2) {
                    countTwoOrMore++;
                }
            }

            if (countTwoOrMore >= 2) {
                possible = true;
            }

            System.out.println(possible ? "YES" : "NO");
        }

        sc.close();
    }
}