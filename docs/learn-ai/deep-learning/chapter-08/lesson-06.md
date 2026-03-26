## 8.6多分类神经网络的反向传播

虽然在PyTorch里你只需要定义模型的前向传播过程并给出损失函数。PyTorch框架会帮你在后向传播时自动计算梯度并使用优化器更新参数。但是我们还是需要自己推导一次神经网络反向传播的梯度计算。这将帮助你彻底了解神经网络的训练原理，消除它的神秘感。而且了解反向传播的具体过程也可以帮助我们理解后边一系列神经网络的训练优化技术。

这一节是我们这个课程里数学含量最高的一节，请你给自己倒一杯咖啡，拿出纸和笔。我们一起来推导一次神经网络的反向传播过程。相信我，这个过程对你会非常有意义。我现在还能清楚的回忆起自己当年第一次推导完成整个神经网络反向传播过程，然后通过简洁的代码实现，训练模型，最终模型可以实现手写数字识别时自己的欣喜。

如果这里你这里实在没有学懂，也完全没有关系，神经网络对参数求梯度PyTorch已经帮我们实现好了，你实际工作中从来都不需要手动来计算梯度。你可以跳过这一节继续学习。不要以此为借口停止对深度学习技术的探索。你完全可以在学完本门课程后有空时再来看这一部分。

### 8.6.1网络结构

![神经网络图](../imgs/0821.png)

我们以上边这个图里展示的神经网络为例，输入feature维度为2，2个隐藏层，每层的神经元为2个，输出层有3个神经元来支持3分类任务。

### 8.6.2前向传播过程

我们先写出前向传播过程。
输入：

$$
\begin{bmatrix} x_1& x_2 \end{bmatrix}
$$

第一个隐藏层的logits：

$$
\begin{bmatrix}z_1^1& z_2^1 \end{bmatrix}=\begin{bmatrix}x_1& x_2 \end{bmatrix}\begin{bmatrix} w_{11}^1 & w_{12}^1\\ w_{21}^1 & w_{22}^1\end{bmatrix}+\begin{bmatrix} b_1^1& b_2^1 \end{bmatrix}
$$

第一个隐藏层的输出如下。其中act()是激活函数，对logits的值逐个应用激活函数：

$$
\begin{bmatrix}a_1^1& a_2^1 \end{bmatrix}=\begin{bmatrix} act(z_1^1)& act(z_2^1) \end{bmatrix}
$$

第一个隐藏层的输出作为第二个隐藏层的输入，则第二个隐藏层的logits为：

$$
\begin{bmatrix}z_1^2& z_2^2 \end{bmatrix}=\begin{bmatrix}a_1^1& a_2^1 \end{bmatrix}\begin{bmatrix} w_{11}^2 & w_{12}^2\\ w_{21}^2 & w_{22}^2\end{bmatrix}+\begin{bmatrix} b_1^2& b_2^2 \end{bmatrix}
$$

第二个隐藏层的输出：

$$
\begin{bmatrix}a_1^2& a_2^2 \end{bmatrix}=\begin{bmatrix} act(z_1^2)& act(z_2^2) \end{bmatrix}
$$

输出层的logits：

$$
\begin{bmatrix}z_1^3& z_2^3 & z_3^3 \end{bmatrix}=\begin{bmatrix}a_1^2& a_2^2 \end{bmatrix}\begin{bmatrix} w_{11}^3 & w_{12}^3& w_{13}^3\\ w_{21}^3 & w_{22}^3 & w_{23}^3\end{bmatrix}+\begin{bmatrix} b_1^3& b_2^3 & b_3^3\end{bmatrix}
$$

输出层经过softmax得到神经网络的输出：

$$
a^3 = \begin{bmatrix}a_1^3& a_2^3 & a_3^3 \end{bmatrix},a_i^3=\frac{e^{z_i^3}}{\sum_{j=1}^{3}e^{z_j^3}}
$$

网络输出结果和标签值利用交叉熵损失函数来计算loss：
真实标签用一维的one-hot向量表示：

$$
y=\begin{bmatrix} y_1& y_2 & y_3 \end{bmatrix}
$$

其中向量$y$的元素中只有一个元素为1，其余元素为0。
则交叉熵loss公式为：

$$
loss=-(y_1lna_1^3+y_2lna_2^3+y_3lna_3^3)
$$

### 8.6.3反向传播过程

神经网络里每层的权重和偏置都可以看成是一个由多个参数构成的矩阵。反向传播时需要计算每个权重和偏置的梯度，实际上就是用最终的loss值对每一个参数求导，这些对单个参数的求导计算可以通过矩阵运算进行加速。后边我们会详细来解释。如果你不理解其中的过程，你可以从最终的loss对单个参数利用链式法则进行求导。你会发现和我下边讲的结果是一致的。推导的过程可能有些麻烦，但是一旦你完成一次，神经网络对你而言，就不再神秘了。

#### 8.6.3.1 loss对logits求导

首先我们来求解loss对模型输出的logits$z^3$的偏导数。它等于loss对$z_1^3,z_2^3,z_3^3$分别求导，我们以loss对$z_1^3$求导为例来求解。这是一个复合函数求导，要用到链式法则。

$z_1^3$通过softmax函数，参与了$a_1^3,a_2^3,a_3^3$的计算。然后$a_1^3,a_2^3,a_3^3$参与了最终loss的计算。所以loss对$z^3$的求导，就是loss先对$a_1^3,a_2^3,a_3^3$求导，然后乘以$a_1^3,a_2^3,a_3^3$对$z^3$求导。

又因为最终loss表达式可以看作是$-y_1lna_1^3,-y_1lna_1^3,-y_3lna_3^3$三个表达式加和的形式。所以最终loss对z13的求导，也是三个复合函数求导结果的加和形式。具体公式如下：

$$
\frac{\partial loss}{\partial z_1^3}=\frac{\partial loss}{\partial a_1^3}\cdot\frac{\partial a_1^3}{\partial z_1^3}+\frac{\partial loss}{\partial a_2^3}\cdot\frac{\partial a_2^3}{\partial z_1^3}+\frac{\partial loss}{\partial a_3^3}\cdot\frac{\partial a_3^3}{\partial z_1^3}
$$

$=\frac{-y_1}{a_1^3}\cdot\frac{\partial a_1^3}{\partial z_1^3}+\frac{-y_2}{a_2^3}\cdot\frac{\partial a_2^3}{\partial z_1^3}+\frac{-y_3}{a_3^3}\cdot\frac{\partial a_3^3}{\partial z_1^3}$(式8-1)

接下来，我们分两种情况进行讨论：

**第一种情况**

这个样本分类结果就是第一类，这时label为：$y_1=1,y_2=0,y_3=0$,可以化简上式为：$\frac{\partial loss}{\partial z_1^3}=\frac{-y_1}{a_1^3}\cdot\frac{\partial a_1^3}{\partial z_1^3}$

继续求导：

$$
\frac{\partial loss}{\partial z_1^3}=\frac{-y_1}{a_1^3}\cdot\frac{e^{z_1^3}\sum_{j=1}^{3}e^{z_j^3}-(e^{z_1^3})^2}{(\sum_{j=1}^{3}e^{z_j^3})^2}
$$

带入以下$a_1^3$的公式进行化简：

$$
a_1^3=\frac{e^{z_1^3}}{\sum_{j=1}^{3}e^{z_j^3}}
$$

化简后的结果为：

$$
\frac{\partial loss}{\partial z_1^3}=\frac{-y_1}{a_1^3}\cdot (a_1^3-(a_1^3)^2)
$$

继续化简：

$$
\frac{\partial loss}{\partial z_1^3}=a_1^3y_1-y_1
$$

因为$y_1=1$,所以：

$$
\frac{\partial loss}{\partial z_1^3}=a_1^3-y_1
$$

**第二种情况**

这个样本分类结果不是第一类：
假设类别为k，k不是第一类。
则化简式8-1为：

$$
\frac{\partial loss}{\partial z_1^3}=\frac{-y_k}{a_k^3}\cdot\frac{\partial a_k^3}{\partial z_1^3}
$$

继续求导：（因为k不等于1，所以$z_1^3$仅出现在softmax的分母里。）

$$
\frac{\partial loss}{\partial z_1^3}=\frac{-y_k}{a_k^3}\cdot\frac{-e^{z_k^3}e^{z_1^3}}{(\sum_{j=1}^{3}e^{z_j^3})^2}
$$

同样，根据softmax公式进行化简：

$$
\frac{\partial loss}{\partial z_1^3}=\frac{-y_k}{a_k^3}\cdot-a_1^3a_k^3=y_ka_1^3
$$

此时，$y_k=1,y_1=0$，所以可以改写为：

$$
\frac{\partial loss}{\partial z_1^3}=a_1^3-y_1
$$

可以看到，两种情况都可以得到同一个结果。上边是loss对$z_1^3$求导。不失一般性，loss对$z_i^3$求导公式为：

$$
\frac{\partial loss}{\partial z_i^3}=a_i^3-y_i\;(i=1,2,3)
$$

我们把loss对第三层的logits的导数记作：

$$
\delta^3=\begin{bmatrix}a_1^3-y_1& a_2^3-y_2 & a_3^3-y_3 \end{bmatrix}
$$

#### 8.6.3.1 输出层的梯度

输出层的logits计算公式如下：

$$
\begin{bmatrix}z_1^3& z_2^3 & z_3^3 \end{bmatrix}=\begin{bmatrix}a_1^2& a_2^2 \end{bmatrix}\begin{bmatrix} w_{11}^3 & w_{12}^3& w_{13}^3\\ w_{21}^3 & w_{22}^3 & w_{23}^3\end{bmatrix}+\begin{bmatrix} b_1^3& b_2^3 & b_3^3\end{bmatrix}
$$

而且上边我们已经求得了loss对输出层logits的导数。我们下边分别求loss对每一个$w_{ij}^3$的梯度。

我们以loss对$w_{11}^3$的偏导数为例：

$$
\frac{\partial loss}{\partial w_{11}^3}=\frac{\partial loss}{\partial z_1^3}\cdot\frac{\partial z_1^3}{\partial w_{11}^3}+\frac{\partial loss}{\partial z_2^3}\cdot\frac{\partial z_2^3}{\partial w_{11}^3}+\frac{\partial loss}{\partial z_3^3}\cdot\frac{\partial z_3^3}{\partial w_{11}^3}
$$

因为其中只有$z_1^3$和$w_{11}^3$有关，上边连加表达式的后两项$z_2^3,z_3^3$对$w_{11}^3$求导都为0，所以有：

$$
\frac{\partial loss}{\partial w_{11}^3}=\frac{\partial loss}{\partial z_1^3}\cdot\frac{\partial z_1^3}{\partial w_{11}^3}
$$

其中$\frac{\partial loss}{\partial z_1^3}$等于$\delta_1^3$，而$z_1^3=a_1^2 \times w_{11}^3 + a_2^2 \times w_{21}^3+b_1^3$，所以$\frac{\partial z_1^3}{\partial w_{11}^3}$的结果为$a_1^2$。最终结果为:

$$
\frac{\partial loss}{\partial w_{11}^3}=\delta_1^3a_1^2
$$

依次类推，我们可以求出每个$w_{ij}^3$的梯度：

$$
\begin{bmatrix} \delta_1^3a_1^2 & \delta_2^3a_1^2& \delta_3^3a_1^2\\ \delta_1^3a_2^2 & \delta_2^3a_2^2 & \delta_3^3a_2^2\end{bmatrix}
$$

可以用矩阵运算表示如下：

$$
\frac{\partial loss}{\partial w^3}={(a^2)}^T\delta^3=\begin{bmatrix}a_1^2\\ a_2^2 \end{bmatrix}\begin{bmatrix}\delta_1^3 & \delta_2^3 & \delta_3^3\end{bmatrix}
$$

下边我们来考虑偏置的梯度值。以loss对$b_1^3$的偏导为例：

loss对$b_1^3$求偏导，因为只有$b_1^3$只和$z_1^3$有关，所以:

$$
\frac{\partial loss}{\partial b_1^3}=\frac{\partial loss}{\partial z_1^3}\cdot\frac{\partial z_1^3}{\partial b_1^3}
$$

其中$\frac{\partial loss}{\partial z_1^3}$为$\delta_1^3$，又因为$z_1^3=a_1^2 \times w_{11}^3 + a_2^2 \times w_{21}^3+b_1^3$，所以$\frac{\partial z_1^3}{\partial b_1^3}$就等于1。最终结果为:

$$
\frac{\partial loss}{\partial b_1^3}=\frac{\partial loss}{\partial z_1^3}\cdot\frac{\partial z_1^3}{\partial b_1^3}=\delta_1^3
$$

同理，loss对$b_2^3,b_3^3$的偏导为：$\delta_2^3,\delta_3^3$，所以loss对于第三层偏置的偏导就等于$\delta^3$。

因为接下来我们要计算loss对于第二层参数的偏导数，这里利用链式法则，通过$a^2$进行传递，所以下边我们先计算loss对于$a^2$的偏导数。

我们以loss对$a_1^2$为例：

$$
\frac{\partial loss}{\partial a_1^2}=\frac{\partial loss}{\partial z_1^3}\cdot\frac{\partial z_1^3}{\partial a_1^2}+\frac{\partial loss}{\partial z_2^3}\cdot\frac{\partial z_2^3}{\partial a_1^2}+\frac{\partial loss}{\partial z_3^3}\cdot\frac{\partial z_3^3}{\partial a_1^2}
$$

$$
=\delta_1^3w_{11}^3+\delta_2^3w_{12}^3+\delta_3^3w_{13}^3
$$

同理，可以得到：

$$
\frac{\partial loss}{\partial a_2^2}=\delta_1^3w_{21}^3+\delta_2^3w_{22}^3+\delta_3^3w_{23}^3
$$

改为矩阵表示loss对第二层激活值的偏导为：

$$
\frac{\partial loss}{\partial a^2}=\delta^3(w^3)^T=\begin{bmatrix}\delta_1^3 & \delta_2^3 & \delta_3^3\end{bmatrix}\begin{bmatrix}w_{11}^3& w_{21}^3\\w_{12}^3&w_{22}^3\\w_{13}^3&w_{23}^3\end{bmatrix}
$$

接着，我们求loss对第二层logits值的偏导：

$$
\delta^2=\frac{\partial loss}{\partial z^2}=\frac{\partial loss}{\partial a^2}\cdot \frac{\partial a^2}{\partial z^2}=\delta^3(w^3)^T\odot act'(z^2)
$$

其中$\odot$是矩阵对应元素相乘，因为激活函数是对每个z值单独应用的，所以这里求导也是逐个元素应用的。

#### 8.6.3.2 第二层的梯度

与上边对输出层的权重和偏置的求导方法一样，我们可以得到：

$$
\frac{\partial loss}{\partial w^2}={(a^1)}^T\delta^2
$$

loss对于第二层偏置的偏导就等于$\delta^2$。

loss对于第一层logits值的偏导为：

$$
\delta^1=\delta^2(w^2)^T\odot act'(z^1)
$$

#### 8.6.3.3 第一层的梯度

loss对于第一层权重的偏导为：

$$
\frac{\partial loss}{\partial w^1}={x}^T\delta^1
$$

loss对于第一层偏置的偏导就等于$\delta^1$

### 8.6.4 各层的梯度

其中$\delta^i$表示loss对第$i$层logits的偏导数。

$$
\delta^3=\begin{bmatrix}a_1^3-y_1& a_2^3-y_2 & a_3^3-y_3 \end{bmatrix}
$$

$$
\frac{\partial loss}{\partial w^3}={(a^2)}^T\delta^3
$$

$$
\frac{\partial loss}{\partial b^3}=\delta^3
$$

$$
\delta^2=\delta^3(w^3)^T\odot act'(z^2)
$$

$$
\frac{\partial loss}{\partial w^2}={(a^1)}^T\delta^2
$$

$$
\frac{\partial loss}{\partial b^2}=\delta^2
$$

$$
\delta^1=\delta^2(w^2)^T\odot act'(z^1)
$$

$$
\frac{\partial loss}{\partial w^1}={x}^T\delta^1
$$

$$
\frac{\partial loss}{\partial b^1}=\delta^1
$$

通过上边的推导，你应该已经可以看出来了每一层参数和偏置求导的规律。
假设这个神经网络一共有n层，第n层是输出层。x是输入向量，y是one-hot的label向量。
则:

$$
\delta^n=a^n-y
$$

对于第i层而言：

$$
\delta^i=\delta^{i+1}(w^{i+1})^T\odot act'(z^i)
$$

$$
\frac{\partial loss}{\partial w^i}={(a^{i-1})}^T\delta^i
$$

$$
\frac{\partial loss}{\partial b^i}=\delta^i
$$

第一层的输入是x：

$$
a^0=x
$$

### 8.6.5 批量数据支持

上边我们的推导是针对一条数据的，但是我们实际训练神经网络时都是用一个batch的数据进行训练的。

同样以上边的网络结构为例：

按行输入三条数据，batch size是3：

$$
\begin{bmatrix} x_{11}& x_{12}\\ x_{21}& x_{22}\\ x_{31}& x_{32}\end{bmatrix}
$$

第一个隐藏层的logits：

$$
\begin{bmatrix}z_{11}^1& z_{12}^1 \\z_{21}^1& z_{22}^1\\z_{31}^1& z_{32}^1\end{bmatrix}=\begin{bmatrix} x_{11}& x_{12}\\ x_{21}& x_{22}\\ x_{31}& x_{32}\end{bmatrix}\begin{bmatrix} w_{11}^1 & w_{12}^1\\ w_{21}^1 & w_{22}^1\end{bmatrix}+\begin{bmatrix} b_1^1& b_2^1\\ b_1^1& b_2^1 \\ b_1^1& b_2^1\end{bmatrix}
$$

注意上边的偏置参数矩阵，它的三行是相同的参数。这是因为需要对每条记录的计算结果都增加偏置，所以将偏置复制了3行，这里的3是BatchSize。权重参数矩阵不变。

忽略第二个隐藏层，我们看输出层的logits：

$$
\begin{bmatrix}z_{11}^3& z_{12}^3 & z_{13}^3 \\z_{21}^3& z_{22}^3 & z_{23}^3\\z_{31}^3& z_{32}^3 & z_{33}^3 \end{bmatrix}=\begin{bmatrix}a_{11}^2& a_{12}^2 \\a_{21}^2& a_{22}^2\\a_{31}^2& a_{32}^2 \end{bmatrix}\begin{bmatrix} w_{11}^3 & w_{12}^3& w_{13}^3\\ w_{21}^3 & w_{22}^3 & w_{23}^3\end{bmatrix}+\begin{bmatrix} b_1^3& b_2^3 & b_3^3\\b_1^3& b_2^3 & b_3^3\\b_1^3& b_2^3 & b_3^3\end{bmatrix}
$$

输出层对每一行应用softmax，得到：

$$
a^3 = \begin{bmatrix}a_{11}^3& a_{12}^3 & a_{13}^3 \\a_{21}^3& a_{22}^3 & a_{23}^3\\a_{31}^3& a_{32}^3 & a_{33}^3 \end{bmatrix}
$$

label为：

$$
y=\begin{bmatrix} y_{11}& y_{12} & y_{13}\\y_{21}& y_{22} & y_{23}\\y_{31}& y_{32} & y_{33}\end{bmatrix}
$$

其中y的每一行都是one-hot编码的，也就是每行只有一个元素是1，其余为0。

loss函数为：

$$
loss=-\frac{1}{3}\sum_{i=1}^{3} (y_{i1}lna_{i1}^3+y_{i2}lna_{i2}^3+y_{i3}lna_{i3}^3)
$$

因为softmax是按行计算，loss计算也是按行进行计算，最终再对loss求平均，其他行的数据并不会对当前行的计算造成影响。所以3行的$\frac{\partial loss}{\partial z^3}$和只有一行的唯一区别就是前边多了个$\frac{1}{3}$。所以：

$$
\delta^3=\frac{1}{3}\begin{bmatrix}a_{11}^3-y_{11}& a_{12}^3-y_{12} & a_{13}^3-y_{13} \\a_{21}^3-y_{21}& a_{22}^3-y_{22} & a_{23}^3-y_{23} \\a_{31}^3-y_{31}& a_{32}^3-y_{32} & a_{33}^3-y_{33} \end{bmatrix}
$$

接下来我们分析loss对输出层权重的偏导数。以$w_{11}^3$为例，因为$w_{11}^3$参与了batch内3条数据，在输出层第一个神经元的$z_{11}^3,z_{21}^3,z_{31}^3$的计算。所以loss对$w_{11}^3$的偏导，需要通过对$z_{11}^3,z_{21}^3,z_{31}^3$求偏导，然后对$w_{11}^3$求偏导的链式计算得到：

$$
\frac{\partial loss}{\partial w_{11}^3}=\frac{\partial loss}{\partial z_{11}^3}\cdot\frac{\partial z_{11}^3}{\partial w_{11}^3}+\frac{\partial loss}{\partial z_{21}^3}\cdot\frac{\partial z_{21}^3}{\partial w_{11}^3}+\frac{\partial loss}{\partial z_{31}^3}\cdot\frac{\partial z_{31}^3}{\partial w_{11}^3}
$$

$$
=\delta_{11}^3a_{11}^2+\delta_{21}^3a_{21}^2+\delta_{31}^3a_{31}^2
$$

你可以求出其他第三层权重的偏导数，你会发现它和只有一行输入的情况下，没有变化，依然是：

$$
\frac{\partial loss}{\partial w^3}={(a^2)}^T\delta^3
$$

接下来我们分析loss对输出层偏置的偏导数，以$b_1^3$为例，因为$b_1^3$参与了batch内3条数据，在输出层第一个神经元的$z_{11}^3,z_{21}^3,z_{31}^3$的计算，所以通过链式法则计算如下：

$$
\frac{\partial loss}{\partial b_1^3}=\frac{\partial loss}{\partial z_{11}^3}\cdot\frac{\partial z_{11}^3}{\partial b_1^3}+\frac{\partial loss}{\partial z_{21}^3}\cdot\frac{\partial z_{21}^3}{\partial b_1^3}+\frac{\partial loss}{\partial z_{31}^3}\cdot\frac{\partial z_{31}^3}{\partial b_1^3}
$$

$$
=\frac{\partial loss}{\partial z_{11}^3}+\frac{\partial loss}{\partial z_{21}^3}+\frac{\partial loss}{\partial z_{31}^3}
$$

$$
=\delta_{11}^3+\delta_{21}^3+\delta_{31}^3
$$

同理可以得到：

$$
\frac{\partial loss}{\partial b_2^3}=\delta_{12}^3+\delta_{22}^3+\delta_{32}^3
$$

$$
\frac{\partial loss}{\partial b_3^3}=\delta_{13}^3+\delta_{23}^3+\delta_{33}^3
$$

注意，可以看到这里loss对$b^3$求偏导的结果和单个样本的结果不同。之前只有一个样本，$\delta^3$也只有一行，loss对$b^3$求偏导就直接是$\delta^3$。但是当BatchSize为3的时候，截距被复制到3行，对每一个样本都起作用。$\delta^3$也有3行。loss对$b^3$求偏导就是$\delta^3$的三行相加。

loss对于下一层logits的偏导和权重类似，都不受BatchSize的影响，依然为：

$$
\delta^i=\delta^{i+1}(w^{i+1})^T\odot act'(z^i)
$$

最终我们得到针对BatchSize为N的批量数据的梯度公式如下：

$$
\delta^n=\frac{1}{N}(a^n-y)
$$

对于第i层而言：

$$
\delta^i=\delta^{i+1}(w^{i+1})^T\odot act'(z^i)
$$

$$
\frac{\partial loss}{\partial w^i}={(a^{i-1})}^T\delta^i
$$

$$
\frac{\partial loss}{\partial b_j^i}=\sum_{k=1}^{N}\delta_{kj}^i
$$

第一层的输入是x：

$$
a^0=x
$$

好了，我们终于算出了所有的梯度值，后边我们会利用这些我们推导出的公式来手动实现一个神经网络的训练。再强调一遍，如果这里你没有学懂，没有关系，神经网络对参数求梯度PyTorch已经帮我们实现好了，你实际工作中不需要手动来计算梯度。你可以完全没有心里负担的跳过这一节，继续进行下边章节的学习。

---

如果你学懂了这一节，扫码请作者喝一杯咖啡来分享你的喜悦。

![zsm](../imgs/zsm.png)
