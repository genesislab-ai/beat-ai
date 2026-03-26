## 9.6 权重衰减

权重衰减（Weight Decay）是一种在模型训练过程中防止模型过拟合的技术。

### 9.6.1 权重衰减的原理

权重衰减的思想很简单，就是在训练的每一步用梯度更新参数时，同时缩小参数值。防止参数的绝对值过大。权重衰减的思想和L1、L2正则是类似的，都是减少参数的绝对值。不同的是L1、L2正则是在loss函数里增加额外项实现的。而权重衰减的做法更直接，直接减小参数的绝对值。

它的具体做法为：

$$
w_t=w_t-lr\times g_w-lr\times \lambda w_t
$$

其中$lr$是学习率，$\lambda$是权重衰减系数。一般取值在1e-2到1e-4。如果你的模型过拟合现象比较严重，$\lambda$就设置大一些。

### 9.6.2 PyTorch里的权重衰减

PyTorch里一般在定义优化器时，可以同步设置weight decay。并指定$\lambda$的值。示例代码如下：

```
optimizer = optim.SGD(model.parameters(), lr=0.1, weight_decay=1e-4)

```

### 9.6.3 权重衰减和L2正则的关系

对标准的梯度下降算法应用权重衰减和L2正则，效果是一样的。

**L2正则**

loss函数加上L2正则项：

$$
L=L_{error}+\frac{\lambda}{2}w^2
$$

更新参数w,等于w减去学习率lr乘以L对w的偏导数：

$$
w=w-lr\frac{\partial L}{\partial w}
$$

$$
=w-lr\frac{\partial L_{error}}{\partial w}-lr\times \lambda w
$$

**权重衰减**

$$
L=L_{error}
$$

更新参数w：

$$
w=w-lr\frac{\partial L_{error}}{\partial w}-lr\times \lambda w
$$

可以看到不论是改变loss函数，还是直接减小参数值，最后的公式都是一样的。

但是对于Adam优化器来说，权重衰减和L2正则就不一样了。因为添加在Loss里的L2正则，梯度经过动量和平方根调整后，已经和直接减小参数值不一样了。
