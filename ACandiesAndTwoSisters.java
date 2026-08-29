import java.util.*;

public class ACandiesAndTwoSisters {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int t = sc.nextInt();

        while (t-- > 0) {
            long n = sc.nextLong();

            if (n <= 2) {
                System.out.println(0);
            } else if (n % 2 == 1) {
                System.out.println(n / 2);
            } else {
                System.out.println(n / 2 - 1);
            }
        }
    }
}