import java.util.*;

public class AAmusingJoke {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String guest = sc.nextLine();
        String host = sc.nextLine();
        String pile = sc.nextLine();

        int[] freq = new int[26];

        // Letters we need
        for (char ch : guest.toCharArray()) {
            freq[ch - 'A']++;
        }

        for (char ch : host.toCharArray()) {
            freq[ch - 'A']++;
        }

        // Letters available in the pile
        for (char ch : pile.toCharArray()) {
            freq[ch - 'A']--;
        }

        // Every frequency must be exactly zero
        for (int x : freq) {
            if (x != 0) {
                System.out.println("NO");
                return;
            }
        }

        System.out.println("YES");
    }
}