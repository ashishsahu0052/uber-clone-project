import java.io.*;
import java.util.*;

public class AWhoWatchesTheWatchpig {

    public static void main(String[] args) throws Exception {

        BufferedReader br = new BufferedReader(
                new InputStreamReader(System.in));

        int t = Integer.parseInt(br.readLine().trim());

        while (t-- > 0) {

            StringTokenizer st = new StringTokenizer(br.readLine());

            int n = Integer.parseInt(st.nextToken());
            int k = Integer.parseInt(st.nextToken());

            String s = br.readLine().trim();

            // Impossible: first k need to be R
            // and last k need to be L,
            // but these groups would overlap.
            if (2 * k > n) {
                System.out.println(-1);
                continue;
            }

            int ans = 0;

            // First k positions must be R
            for (int i = 0; i < k; i++) {
                if (s.charAt(i) != 'R') {
                    ans++;
                }
            }

            // Last k positions must be L
            for (int i = n - k; i < n; i++) {
                if (s.charAt(i) != 'L') {
                    ans++;
                }
            }

            System.out.println(ans);
        }
    }
}