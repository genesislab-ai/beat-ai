# 2.3 线性变换和矩阵

线性代数里主要研究的是向量，以及对向量的操作。并且对于向量来说，基本操作就只有两个：**数乘**和**向量加法**。今天我们来学习对向量进行线性变换和矩阵。

## 2.3.1 线性变换

你可以将线性变换理解成对向量的一个函数，输入是一个向量，输出还是一个向量。但是这个函数必须满足对数乘和向量加法的封闭性：

**加法封闭性**：对于任意两个向量**u**和**v**，线性变换**T**满足:

$$
T(u+v)=T(u)+T(v)
$$

**数乘封闭性**：对于任意向量**v**和标量**c**，线性变换**T**满足：

$$
T(cv)=cT(v)
$$

为什么线性变换必须满足加法封闭性和数乘封闭性呢？

首先因为向量的基本操作就两个：一个是数乘，一个是向量加法。

如果映射前向量**a,b,c,d**有以下关系：

$$
c=a+b
$$

$$
c=0.4d
$$

**a,b,c,d**经过一个线性变换后，得到${a}',{b}',{c}',{d}'$。我们希望以下关系还成立：

$$
{c}'={a}'+{b}'
$$

$$
{c}'=0.4{d}'
$$

加法封闭性和数乘封闭性就保证了这样性质的成立。保证了线性变换后向量之间的关系不发生变化。线性变换有两个非常好的性质：

**直线保持**：线性变换前多个终点在一条线上的向量，经过线性变换后，这些向量的终点仍在一条直线上。

**原点不变**：线性变换后原点仍然在原点位置。

![0208.png](../imgs/0208.png)

通过线性变换，可以把一个向量进行拉伸，旋转，翻转等。那如何用数字准确表述这种线性变化呢？比如上图中向量**a,b**经过线性变换为**a',b'**,线性变换的规则是对于二维空间的向量，x坐标取负值，y坐标不变，也就是沿y轴镜像。我们需要一个数学的方式来描述这个线性变换。

**线性变换的表示**之前我们讲过一个向量和基的关系，我们再来复习一下。一个向量可以理解为用它的各个分量对标准基里的对应向量进行缩放，再将缩放后的基向量相加。
我们只需要记录标准基里的向量(i,j)经过线性变换后的向量(i',j')。原始向量各个分量对变换后的基向量的线性组合就是对该向量的线性变换后的向量。按照这样规则生成的向量就保证了线性变换对向量加法和数乘的封闭性。我们举一个例子：
还是以上图沿y轴镜像的线性变换的例子来说，用这个变换规则来对二维向量空间的标准基向量**i**和**j**进行变换。

$$
\mathbf{i'} =\begin{bmatrix}-1 \\0 \end{bmatrix}\mathbf{j'} =\begin{bmatrix}0 \\1\end{bmatrix}
$$

原始向量b为：

$$
\mathbf{b} =\begin{bmatrix}2 \\1 \end{bmatrix}
$$

对b进行相同线性变换时，只需要用b的各个分量对**i'**和**j'**进行缩放再相加就可以。

$$
\mathbf{b'} =2i'+1j'=2\begin{bmatrix}-1 \\0 \end{bmatrix} + 1\begin{bmatrix}0 \\1 \end{bmatrix} = \begin{bmatrix}-2 \\1 \end{bmatrix}
$$

也就是说只需要记录标准基经过线性变换后的基就可以表示这个线性变换了。

## 2.3.2 矩阵

矩阵就是对向量进行线性变换的函数。矩阵就是由线性变换后的基构成的。还是上边以y轴为镜像的例子，我们把线性变换后的**i'**和**j'**放在一起就构成了一个矩阵$A$。

$$
A=\begin{bmatrix} -1&0 \\ 0&1 \end{bmatrix}
$$

这个矩阵就表示对一个向量按Y轴进行镜像的线性转换。它对向量**b**的计算法则如下：

$$
b=\begin{bmatrix} 2\\ 1 \end{bmatrix}
$$

$$
Ab=2\begin{bmatrix}-1 \\0 \end{bmatrix} + 1\begin{bmatrix}0 \\1 \end{bmatrix} = \begin{bmatrix}-2 \\1 \end{bmatrix}
$$

我们可以再定义二维空间里向量逆时针旋转90°的线性变换来试一下。二维空间的标准基向量**i,j**，经过逆时针90°旋转后如下图，旋转后的向量为：

$$
\mathbf{i'} =\begin{bmatrix}0 \\1 \end{bmatrix}\mathbf{j'} =\begin{bmatrix}-1 \\0\end{bmatrix}
$$

![0209.png](../imgs/0209.png)

接下来我们用**i'**和**j'**构成矩阵$A$：

$$
A=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}
$$

我们尝试对向量**b**进行线性变换，看是否可以对向量**b**逆时针旋转90°。

$$
\mathbf{b} =\begin{bmatrix}2 \\1 \end{bmatrix}
$$

$$
\mathbf{b'} =Ab=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix}2 \\1 \end{bmatrix}=2\begin{bmatrix}0 \\1 \end{bmatrix} + 1\begin{bmatrix}-1 \\0 \end{bmatrix} = \begin{bmatrix}-1 \\2 \end{bmatrix}
$$

![0210.png](../imgs/0210.png)

可以看到矩阵$A$确实可以对向量$b$进行逆时针旋转90°的线性变换。**单位矩阵**标准基向量构成的矩阵就是一个单位矩阵，单位矩阵对向量进行线性变换后还是向量本身。单位矩阵里的行数和列数相等，只有对角线上元素为1，其他位置元素为0。比如3维单位矩阵为：

$$
I=\begin{bmatrix} 1&0&0 \\ 0&1&0 \\ 0&0&1 \end{bmatrix}
$$

单位矩阵对于一个向量的线性变换，还是这个向量本身。比如：

$$
v =\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}
$$

$$
Iv =\begin{bmatrix} 1&0&0 \\ 0&1&0 \\ 0&0&1 \end{bmatrix}\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}=1\begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}+2\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}+3\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}=\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}
$$

**矩阵的行和列**上边我们讲的矩阵的行数和列数都是相等的，它们叫做**方阵**。但矩阵的行数和列数可以不相等。比如下边这个矩阵$C$，它就是一个3行2列的矩阵。

$$
C=\begin{bmatrix} 0&-1 \\ 1&0 \\ 2&1 \end{bmatrix}
$$

矩阵$C$也代表一个线性变换，矩阵$C$里的第一列是把二维向量空间里的$i$向量通过这个线性变换得到的3维向量。矩阵$C$里的第二列是把二维向量空间里的$j$向量通过这个线性变换得到的3维向量。所以矩阵$C$是一个可以把2维向量映射到3维向量的线性变换。矩阵$C$对于向量$b$进行向量变换如下：

$$
\mathbf{b} =\begin{bmatrix}2 \\1 \end{bmatrix}
$$

$$
\mathbf{b'} =Cb=\begin{bmatrix} 0&-1 \\ 1&0 \\ 2&1 \end{bmatrix}\begin{bmatrix}2 \\1 \end{bmatrix}=2\begin{bmatrix}0 \\1\\2 \end{bmatrix} + 1\begin{bmatrix}-1 \\0 \\1\end{bmatrix} = \begin{bmatrix}-1 \\2\\5 \end{bmatrix}
$$

所以，不是方阵的矩阵进行的线性变换，会给进行变换的向量带来维度上的变换。上边的例子，是把一个2维向量变换为3维向量。下边我们看一个把3维向量变换为2维向量的例子。比如下边矩阵D，它是一个2行3列的矩阵，它就可以把3维向量线性变换为2维向量。

$$
D=\begin{bmatrix} 0&-1&1 \\ 1&0&2 \end{bmatrix}
$$

$$
\mathbf{c} =\begin{bmatrix}2 \\1\\1 \end{bmatrix}
$$

$$
\mathbf{c'} =Dc=\begin{bmatrix} 0&-1&1 \\ 1&0&2 \end{bmatrix}\begin{bmatrix}2 \\1\\1\end{bmatrix}=2\begin{bmatrix}0 \\1 \end{bmatrix} + 1\begin{bmatrix}-1 \\0\end{bmatrix} + 1\begin{bmatrix}1 \\2\end{bmatrix}= \begin{bmatrix}0 \\4 \end{bmatrix}
$$

**矩阵乘法**比如代表逆时针旋转90°的矩阵$A$,可以同时对3个向量进行旋转。

$$
A=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}
$$

$$
\mathbf{a} =\begin{bmatrix}0 \\1 \end{bmatrix}\mathbf{b} =\begin{bmatrix}1 \\1 \end{bmatrix}\mathbf{c} =\begin{bmatrix}-1 \\1 \end{bmatrix}
$$

可以把**a,b,c**组成一个矩阵$B$：

$$
B=\begin{bmatrix} 0&1&-1 \\ 1&1&1 \end{bmatrix}
$$

$$
AB=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix} 0&1&-1 \\ 1&1&1 \end{bmatrix}
$$

这就变成了矩阵之间的乘法，它的计算法则就是先取$B$矩阵的第一列，用$A$进行线性变换。

$$
\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix}0 \\1 \end{bmatrix}=\begin{bmatrix}-1 \\0 \end{bmatrix}
$$

然后取$B$矩阵的第二列，用A进行线性变换。

$$
\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix}1 \\1 \end{bmatrix}=\begin{bmatrix}-1 \\1 \end{bmatrix}
$$

最后取$B$矩阵的第三列，用A进行线性变换。

$$
\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix}-1 \\1 \end{bmatrix}=\begin{bmatrix}-1 \\-1 \end{bmatrix}
$$

最后把三个向量经过线性变换后的向量组成最终的结果矩阵：

$$
\begin{bmatrix} -1&-1&-1 \\ 0&1&-1 \end{bmatrix}
$$

所以，完整的矩阵乘法就为：

$$
AB=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix} 0&1&-1 \\ 1&1&1 \end{bmatrix}=\begin{bmatrix} -1&-1&-1 \\ 0&1&-1 \end{bmatrix}
$$

通过上边的不同计算，可以发现矩阵乘法有以下规则：
若矩阵$A$的维度是$m\times n$，矩阵$B$的维度是$n\times p$，那么矩阵$A$和矩阵$B$的乘积$AB$的维度是$m\times p$。

**矩阵的转置**对一个矩阵$A$，维度为$m\times n$，即$A$有m行，n列。矩阵$A$的转置，记作$A^{T}$。$A^{T}$维度为$n\times m$。
其中$A^{T}$的第$i$行第$j$列的元素是$A$的第$j$行第$i$列的元素。
也就是说如果用$a_{ij}$表示$A$中的第$i$行，第$j$列。那么它等于$A^{T}$中的元素$a_{ji}$。
比如：

$$
A=\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}\quad A^T=\begin{bmatrix} 1 & 4 \\ 2 & 5 \\ 3 & 6 \end{bmatrix}
$$

**矩阵乘法的两种理解**

之前我们都是列向量视角，比如对二维空间里对向量进行逆时针旋转90°的线性变换。对标准基向量**i**和**j**进行逆时针旋转90°操作，得到**i'**和**j'**。然后将**i'**和**j'**合并为一个矩阵**A**，这个矩阵就可以对二维空间里的任意列向量进行逆时针旋转90°的操作。

$$
\mathbf{b} =\begin{bmatrix}2 \\1 \end{bmatrix}
$$

$$
\mathbf{b'} =Ab=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix}2 \\1 \end{bmatrix}=2\begin{bmatrix}0 \\1 \end{bmatrix} + 1\begin{bmatrix}-1 \\0 \end{bmatrix} = \begin{bmatrix}-1 \\2 \end{bmatrix}
$$

上边矩阵**A**对列向量**b**的线性变换，可以理解为用**b**的第一个分量2缩放矩阵A的第一个列向量，1缩放矩阵A的第二个列向量，再将两个列向量相加，得到最终结果。

行向量视角下，二维空间的标准基向量**i**，**j**是行向量。

$$
i=\begin{bmatrix} 1 & 0 \end{bmatrix}\quad j=\begin{bmatrix} 0 & 1 \end{bmatrix}
$$

对**i**，**j**逆时针旋转90°，得到**i'**和**j'**，也是两个行向量。

$$
i'=\begin{bmatrix} 0 & 1 \end{bmatrix}\quad j'=\begin{bmatrix} -1 & 0 \end{bmatrix}
$$

将这两个行向量合并，得到矩阵A。

$$
\begin{bmatrix} 0 & 1 \end{bmatrix}
$$

这个矩阵A可以对二维空间里的任意行向量进行逆时针旋转90°的操作。

比如:

$$
\mathbf{b'} =bA=\begin{bmatrix} 2&1 \end{bmatrix}\begin{bmatrix}0&1 \\-1&0 \end{bmatrix}=2\begin{bmatrix}0 &1 \end{bmatrix} + 1\begin{bmatrix}-1 &0 \end{bmatrix} = \begin{bmatrix}-1 &2 \end{bmatrix}
$$

对于行向量**b**，矩阵A对**b**进行线性变换时，行向量**b**在矩阵**A**的左边。因为**b**实际就是一个一行两列的矩阵，必须满足矩阵乘法的原则，也就是**b**的列数必须等于**A**的行数。进行线性变换时，用**b**的第一个分量2，缩放矩阵**A**的第一个行向量，1缩放矩阵**A**的第二个行向量，再将两个行向量相加，得到最终结果。结果为[-1,2]，和列向量视角下的向量元素值都一样，只不过一个是行向量一个是列向量。

对于

$$
AB=\begin{bmatrix} 0&-1 \\ 1&0 \end{bmatrix}\begin{bmatrix} 0&1&-1 \\ 1&1&1 \end{bmatrix}=\begin{bmatrix} -1&-1&-1 \\ 0&1&-1 \end{bmatrix}
$$

观察我们上边的矩阵乘法，矩阵$A$代表线性变换，类似函数。矩阵$B$是一组列向量的组合，类似函数的输入。矩阵乘法的结果就是函数的输出。这种理解就是用B里的列向量的分量对A里的列向量进行线性组合。也就是从列向量的角度去理解矩阵乘法。

另一种不同的视角是行向量视角。在深度学习行向量视角更常用。行向量视角下，A是待变换的行向量的集合，B是线性变换的函数。用A里行向量的每个维度的分量，对B里的行向量进行线性组合

## 2.3.3 深度学习里的矩阵

矩阵在深度学习里有两种作用，一种是存储数据向量，比如你收集的学生的年龄，身高，体重。[12,154, 52]。可以理解为它是函数的输入。
一种是存储参数，可以理解为它是一个函数，对输入向量进行线性变化。
