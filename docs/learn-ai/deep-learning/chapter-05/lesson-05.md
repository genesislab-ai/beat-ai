## 5.5动手实现多元线性回归

本节我们将用python代码，利用梯度下降算法，实现一个多元线性回归。也是时候写一些代码了。

### 5.5.1已知条件

#### 数据

温度价格（元）销量（个）

10360

20385

253100

282.5120

302140

352.5145

402.5163

#### 多元线性回归公式

我们用$x_1$表示温度，$x_2$表示价格，$y$表示销量。

$w_0$表示截距，$w_1$表示温度对应的权重，$w_2$表示价格对应的权重。

则预测的销量为：

$$
\hat{y}=w_0+w_1x_1+w_2x_2
$$

#### 损失函数

损失函数我们用MSE，我们有7个数据，所以：

$$
loss = \frac{1}{7}\sum_{i=1}^{7}(\hat{y}^i-y^i)^2
$$

带入线性回归方程有：

$$
loss = \frac{1}{7}\sum_{i=1}^{7}(w_0+w_1x_1^i+w_2x_2^i-y^i)^2
$$

### 5.5.2 用梯度下降算法更新参数

我们用梯度下降算法逐步来更新参数$w_0,w_1,w_2$。

#### 梯度计算

利用损失函数对每个参数求偏导：

- $w_0$的偏导数：

$$
\frac{\partial loss}{\partial w_0} = \frac{2}{7} \sum_{i=1}^{7} (w_0 + w_1 x_1^i + w_2 x_2^i - y^i)
$$

- $w_1$的偏导数：

$$
\frac{\partial loss}{\partial w_1} = \frac{2}{7} \sum_{i=1}^{7} (w_0 + w_1 x_1^i + w_2 x_2^i - y^i) \cdot x_1^i
$$

- $w_2$的偏导数：

$$
\frac{\partial loss}{\partial w_2} = \frac{2}{7} \sum_{i=1}^{7} (w_0 + w_1 x_1^i + w_2 x_2^i - y^i) \cdot x_2^i
$$

#### 参数更新

在每次迭代中，参数按照以下规则更新：

$$
w_0=w_0-lr\cdot\frac{\partial loss}{\partial w_0}
$$

$$
w_1=w_1-lr\cdot\frac{\partial loss}{\partial w_1}
$$

$$
w_2=w_2-lr\cdot\frac{\partial loss}{\partial w_2}
$$

其中$lr$为学习率。

### 5.5.3 Python实现

```
# Feature 数据X = [[10,3], [20,3], [25,3], [28,2.5], [30,2], [35,2.5], [40,2.5]]
y = [60,85,100,120,140,145,163]# Label 数据# 初始化参数w = [0.0,0.0,0.0]# w0, w1, w2lr =0.0001# 学习率num_iterations =10000# 迭代次数# 梯度下降foriinrange(num_iterations):# 预测值y_pred = [w[0] + w[1] * x[0] + w[2] * x[1]forxinX]# 计算损失loss = sum((y_pred[j] - y[j]) **2forjinrange(len(y))) / len(y)# 计算梯度grad_w0 =2* sum(y_pred[j] - y[j]forjinrange(len(y))) / len(y)
grad_w1 =2* sum((y_pred[j] - y[j]) * X[j][0]forjinrange(len(y))) / len(y)
grad_w2 =2* sum((y_pred[j] - y[j]) * X[j][1]forjinrange(len(y))) / len(y)# 更新参数w[0] -= lr * grad_w0
w[1] -= lr * grad_w1
w[2] -= lr * grad_w2# 打印损失ifi %100==0:
print(f"Iteration {i}: Loss = {loss}")# 输出最终参数print(f"Final parameters: w0 = {w[0]}, w1 = {w[1]}, w2 = {w[2]}")

```

你可以尝试调整学习率，迭代次数。学习率太大的话，训练过程不会收敛，loss值可能会越来越大，直到程序出错。

恭喜你！你完成了你第一个模型的训练。
