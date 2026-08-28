import java.util.*;

public class ASerejaAndDima {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        int[] cards = new int[n];

        for (int i = 0; i < n; i++) {
            cards[i] = sc.nextInt();
        }

        int left = 0;
        int right = n - 1;

        int sereja = 0;
        int dima = 0;

        boolean serejaTurn = true;

        while (left <= right) {

            int card;

            if (cards[left] > cards[right]) {
                card = cards[left];
                left++;
            } else {
                card = cards[right];
                right--;
            }

            if (serejaTurn) {
                sereja += card;
            } else {
                dima += card;
            }

            serejaTurn = !serejaTurn;
        }

        System.out.println(sereja + " " + dima);
    }
}