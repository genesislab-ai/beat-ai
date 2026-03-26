## 9.5 Adam优化器

Adam(Adaptive Moment Estimation)，结合了Momentum优化器和RMSProp优化器的优点，目前已经是深度学习领域默认的优化器。
Adam优化器同时利用动量来给梯度更新增加惯性和震荡阻尼，也利用历史梯度的均方根来自适应调整学习率。下边我们给出它的具体计算过程。

首先计算参数w的梯度：

$$
g_w=\frac{\partial loss}{\partial w}
$$

然以后计算并更新一阶矩指数加权平均值$V_w$，和二阶矩指数加权平均值$S_w$。

$$
V_w=\beta_1V_w+(1-\beta_1)g_w
$$

$$
S_w=\beta_2S_w+(1-\beta_2){g_w}^2
$$

$$
\beta_1=0.9;\beta_2=0.999
$$

接着对这两个值进行校正：

$$
V_w^{correct}=\frac{V_w}{1-{\beta_1}^t}
$$

$$
S_w^{correct}=\frac{S_w}{1-{\beta_2}^t}
$$

最后更新参数：

$$
w=w-lr\frac{V_w^{correct}}{\sqrt{S_w^{correct}}+\varepsilon}
$$

Adam优化器可以稳定且迅速的训练深度神经网络，但是它需要为每个参数额外在显存里保存两个值：V和S，来记录梯度的一阶和二阶指数加权平均值。这占据了大量宝贵的显存空间。
