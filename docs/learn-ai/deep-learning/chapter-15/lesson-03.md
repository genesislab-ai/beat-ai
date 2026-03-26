## 15.3 层归一化

在Transformer里采用了一种更适合序列数据的归一化方式：层归一化（Layer Normalization），本节我们就来介绍。

### 15.3.1 序列归一化问题

序列问题的一大特点是序列长度是可变的，为了让这些可变长度的序列放入维度固定的tensor，会在一个batch里短的序列后边填充`<pad>`token。如果用Batch Norm，会有以下两个问题：

-
因为序列可能很长，导致Batch Size很小，不同Batch 之间的均值和方差差距会非常大。

-
大量的`<pad>`token的特征会影响正常token的均值和方差计算。

另外BatchNorm本身还有一个问题，那就是区分训练和推理状态，训练时会动量更新维护每个特征的均值和方差。推理时需要用训练时保存的均值和方差。这样比较麻烦。

### 15.3.2 Layer Norm

在解决序列问题时，层归一化，会按照每个token来分别统计每个token所有特征的均值和方差。然后在token特征的每个维度都定义两个可学习参数γ和β来进行线性变化。

所以，如果一个token的编码维度为512维，则对每个token的这512个特征数字计算均值和方差，并且所有token共享512个γ参数和512个β参数。

$$
y=\frac{x-E[x]}{Std[x]+\epsilon}*\gamma+\beta
$$

通过Layer Norm后基本保证了每个token的特征大致分布为均值为0，方差为1。这样保证了后边进行注意力计算时点积值的稳定性，不会落入softmax的失活区域。

Layer Norm因为是对输入每个token embedding的维度进行均值和方差的统计。对于推理状态也可以进行，所以不区分训练状态和推理状态。

### 15.3.3 PyTorch实现

```
classLayerNormalization(nn.Module):def__init__(self, features: int, eps: float =10**-6)->None:super().__init__()
self.eps = eps# 可学习权重self.alpha = nn.Parameter(torch.ones(features))# 可学习偏差self.bias = nn.Parameter(torch.zeros(features))defforward(self, x):# x: (batch, seq_len, hidden_size)# 保留维度来进行广播mean = x.mean(dim=-1, keepdim=True)# (batch, seq_len, 1)std = x.std(dim=-1, keepdim=True)# (batch, seq_len, 1)# eps 是为了防止除0设置的很小的值returnself.alpha * (x - mean) / (std + self.eps) + self.bias

```
