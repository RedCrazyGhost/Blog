# 第十三届蓝桥杯JavaB组题目
> 作者 : RedCrazyGhost
> 创建时间 : 2022-04-9 
> 修改时间 : 2022-04-23
> 标签 :  <span class="badge bg-secondary">Mac OS</span> <span class="badge bg-primary">Java</span> <span class="badge bg-dark">算法</span>

### 试题 A: 星期计算
>本题总分： 5 分
> 【题目描述】
> 已知今天是星期六(2022年4月9日)，请问 20 22 天后是星期几？注意用数字 1 到 7 表示星期一到星期日。
> 【答案提交】
> 这是一道结果填空的题，你只需要算出结果后提交即可。本题的结果为一个整数，在提交答案时只填写这个整数，填写多余的内容将无法得分。

参考答案：7

参考代码：
```java
public class QuestionA {
    public void methode(){
        int nowDay=6,addDay=(int)Math.pow(20,22)%7;

        System.out.println("使用LocalDate计算结果 : "+LocalDate.of(2022, 4, 9).plusDays((int) Math.pow(20, 22)).getDayOfWeek().getValue());

        System.out.println("使用取余计算结果 : "+((nowDay + addDay) % 7 == 0 ? 7 : (nowDay + addDay) % 7));
    }
}
```

### 试题 B: 山
>本题总分： 5 分
>【问题描述】
> 这天小明正在学数数。他突然发现有些正整数的形状像一座“山”，比如 123565321 、 145541 ，它们左右对称（回文）且数位上的数字<kbd>先单调不减，后单调不增</kbd>。小明数了很久也没有数完，他想让你告诉他在区间 [2022 , 2022222022] 中有多少个数的形状像一座“山”。
>【答案提交】
> 这是一道结果填空的题，你只需要算出结果后提交即可。本题的结果为一个整数，在提交答案时只填写这个整数，填写多余的内容将无法得分。

参考答案：3139

参考代码：
```java
public class QuestionB {
    public void methode(){
        int sum=0;
      top:  for (int i = 2022; i <= 2022222022 ; i++) {
            char[] chars=String.valueOf(i).toCharArray();
            for (int j = 0; j < chars.length/2; j++) {
                if (chars[j]!=chars[chars.length-1-j]||chars[j]>chars[j+1]){
                    continue top;
                }
            }
            sum+=1;
        }
//        sum= 3138
        System.out.println("[2022 , 2022222022] 中存在的回文数个数 ："+sum);
    }
}
```

### 试题 C: 字符统计
> 时间限制 : 1.0s 内存限制 : 512.0MB 本题总分： 10 分
>【问题描述】
> 给定一个只包含大写字母的字符串 S ，请你输出其中出现次数最多的字母。如果有多个字母均出现了最多次，按字母表顺序依次输出所有这些字母。
>【输入格式】
> 一个只包含大写字母的字符串 S .
>【输出格式】
> 若干个大写字母，代表答案。
>【样例输入】
> BABBACAC
>【样例输出】
> AB
>【评测用例规模与约定】
> 对于 100 % 的评测用例， 1 ≤ | S | ≤ 10^ 6 .

参考代码：
```java
public class QuestionC {
    public void methode(){
        Scanner scanner=new Scanner(System.in);
        String str=scanner.next();
        int[] arr=new int[26];
        int max=Integer.MIN_VALUE;
        for(char c:str.toCharArray()){
            arr[c-'A']+=1;
            max=Math.max(max,arr[c-'A']);
        }
        StringBuilder stringBuilder=new StringBuilder();
        for (int i = 0; i < arr.length; i++) {
            if (arr[i]==max){
                stringBuilder.append((char)(i+'A'));
            }
        }
        System.out.println(stringBuilder);
    }
}
```

### 试题 D: 最少刷题数
> 时间限制 : 1.0s 内存限制 : 512.0MB 本题总分： 10 分
>【问题描述】
> 小蓝老师教的编程课有 N 名学生，编号依次是 1 . . . N 。第 i 号学生这学期刷题的数量是 A i 。对于每一名学生，请你计算他至少还要再刷多少道题，才能使得全班刷题比他多的学生数不超过刷题比他少的学生数。
>【输入格式】
> 第一行包含一个正整数 N 。
> 第二行包含 N 个整数： A 1 , A 2 , A 3 , . . . , A N .
>【输出格式】
> 输出 N 个整数，依次表示第 1 . . . N 号学生分别至少还要再刷多少道题。
>【样例输入】
> 5
> 12 10 15 20 6
>【样例输出】
> 0 3 0 0 7
>【评测用例规模与约定】
> 对于 30 % 的数据， 1 ≤ N ≤ 1000 , 0 ≤ A i ≤ 1000 .
> 对于 100 % 的数据， 1 ≤ N ≤ 100000 , 0 ≤ A i ≤ 100000 .

参考代码：
```java
public class QuestionD {
    public void methode(){
        Scanner scanner=new Scanner(System.in);
        int len=scanner.nextInt();
        int[] arr=new int[len];
        Set<Integer> set=new TreeSet<>();
        for (int i = 0; i < arr.length; i++) {
            arr[i]=scanner.nextInt();
            set.add(arr[i]);
        }
        List<Integer> list=new ArrayList<>(set);
        Map<Integer,Integer> map=new HashMap<>();
        for (int i = 0; i < list.size()/2; i++) {
            map.put(list.get(i),list.get((list.size()/2))- list.get(i)+1);
        }
        for (int i = 0; i < arr.length; i++) {
            arr[i]=map.getOrDefault(arr[i],0);
        }
        System.out.println(Arrays.toString(arr));
    }
}
```

### 试题 E: 求阶乘
> 时间限制 : 1.0s 内存限制 : 512.0MB 本题总分： 15 分
>【问题描述】
> 满足 N ! 的末尾恰好有 K 个 0 的最小的 N 是多少 ? 如果这样的 N 不存在输出 − 1 。
>【输入格式】
> 一个整数 K 。
>【输出格式】
> 一个整数代表答案。
>【样例输入】
> 2
>【样例输出】
> 10
>【评测用例规模与约定】
> 对于 30 % 的数据， 1 ≤ K ≤ 10^ 6 .
> 对于 100 % 的数据， 1 ≤ K ≤ 10^ 18 .

参考代码：

[LeetCode 172](https://leetcode-cn.com/problems/factorial-trailing-zeroes/)

[LeetCode 793](https://leetcode-cn.com/problems/preimage-size-of-factorial-zeroes-function/)
```java
public class QuestionE {
//    参考 LeetCode 172 : https://leetcode-cn.com/problems/factorial-trailing-zeroes/
//    参考 LeetCode 793 : https://leetcode-cn.com/problems/preimage-size-of-factorial-zeroes-function/
    public void methode(){
        Scanner scanner=new Scanner(System.in);
        int K= scanner.nextInt();
    }
}
```

### 试题 G: 数组切分
> 时间限制 : 1.0s 内存限制 : 512.0MB 本题总分： 20 分
>【问题描述】
> 已知一个长度为 N 的数组： A 1 , A 2 , A 3 , ... A N 恰好是 1 ∼ N 的一个排列。现在要求你将 A 数组切分成若干个 ( 最少一个，最多 N 个 ) 连续的子数组，并且每个子数组中包含的整数恰好可以组成一段连续的自然数。
>例如对于 A = { 1 , 3 , 2 , 4 } , 一共有 5 种切分方法：
>{ 1 }{ 3 }{ 2 }{ 4 } ：每个单独的数显然是 ( 长度为 1 的 ) 一段连续的自然数 。
>{ 1 }{ 3 , 2 }{ 4 } ： { 3 , 2 } 包含 2 到 3 ，是 一段连续的自然数 ，另外 { 1 } 和 { 4 } 显然也是。
>{ 1 }{ 3 , 2 , 4 } ： { 3 , 2 , 4 } 包含 2 到 4 ，是 一段连续的自然数 ，另外 { 1 } 显然也是。
>{ 1 , 3 , 2 }{ 4 } ： { 1 , 3 , 2 } 包含 1 到 3 ，是 一段连续的自然数 ，另外 { 4 } 显然也是。
>{ 1 , 3 , 2 , 4 } ：只有一个子数组，包含 1 到 4 ，是 一段连续的自然数 。
>【输入格式】
> 第一行包含一个整数 N 。第二行包含 N 个整数，代表 A 数组。
>【输出格式】
> 输出一个整数表示答案。由于答案可能很大，所以输出其对 1000000007 取模后的值
>【样例输入】
> 4
> 1 3 2 4
>【样例输出】
> 5
>【评测用例规模与约定】
> 对于 30 % 评测用例， 1 ≤ N ≤ 20 .
> 对于 100 % 评测用例， 1 ≤ N ≤ 10000 .

参考代码：
```java
public class QuestionG {
    public void methode(){
        Scanner scanner=new Scanner(System.in);
        int len=scanner.nextInt();
        int[] arr=new int[len];
        int sum=0;
        for (int i = 0; i < arr.length; i++) {
            arr[i]=scanner.nextInt();
        }

        for (int i = 2; i <=arr.length ; i++) {
         index:   for (int j = 0; j <= arr.length-i ; j++) {
                int[] test=new int[i];
                System.arraycopy(arr, j, test, 0, i);
                Arrays.sort(test);
                for (int k = 0; k < test.length-1; k++) {
                    if (Math.abs(test[k]-test[k+1])!=1){
                        continue index;
                    }
                }
                sum+=1;
            }
        }
        sum+=1;
        System.out.println(sum);
    }
}
```