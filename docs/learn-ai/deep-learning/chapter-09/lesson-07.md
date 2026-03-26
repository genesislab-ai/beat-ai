## 9.7 Dropout

Dropout也是一种解决模型过拟合问题的方法，它是从简化网络结构的方面进行正则化的。本节我们就来学习Dropout的原理。

### 9.7.1 训练阶段

![0904.png](../imgs/0904.png)

上图是一个标准的全连接神经网络，每个神经元都接受上一层所有神经元的输出，并把自己的输出作为下一层每个神经元的输入。在训练阶段，Dropout会按照超参数p的设置，随机禁用一些神经元。被禁用的神经元不接受任何输入也不为下一层的神经元提供输出。Dropout一般应用在隐藏层，不对输入和输出层应用。

![0905.png](../imgs/0905.png)

比如上图中，设置p=0.5，在一次前向传播过程中隐藏层中有3个神经元被随机禁用掉。注意，每次前向传播禁用的神经元并不相同，每个神经元都有p的概率被禁用。
对于保留的神经元的输出也需要做一些调整，对于未被禁用的神经元的输出需要除以1−p来进行缩放。这样就确保了下一层进行线性计算时，输入加权累加值的期望不变。

Dropout可以理解成每次都在训练一个简化的神经网络，让网络每个神经元都学到通用的特征，而不是过份依赖某几个神经元。

### 9.7.2 推理阶段

在利用Dropout训练好了一个神经网络了，要利用训练好的神经网络进行预测，也叫做推理阶段。这时，Dropout不起作用，所有神经元都起作用。因为之前在训练时对起作用的神经元做过缩放操作，它保证了推理阶段的数值稳定。

### 9.7.3 PyTorch里的Dropout

在PyTorch里定义Dropout层很简单，如下代码所示：

```
# 模型定义（加入 Dropout）classNeuralNetwork(nn.Module):def__init__(self):super().__init__()
self.model = nn.Sequential(
nn.Linear(28*28,128),
nn.ReLU(),
nn.Dropout(0.5),
nn.Linear(128,128),
nn.ReLU(),
nn.Dropout(0.5),
nn.Linear(128,128),
nn.ReLU(),
nn.Dropout(0.5),
nn.Linear(128,64),
nn.ReLU(),
nn.Dropout(0.5),
nn.Linear(64,10)
)defforward(self, x):returnself.model(x)

```

p的值我们一般取0.1-0.5。p值越大，正则化效果越强。
还有一点需要注意，Dropout 在训练阶段与推理阶段的行为是不同的，所以你一定在训练前调用`model.train()`，推理前调用`model.eval()`函数。

```
model.train()## 在这里训练你的模型。model.eval()## 在这里利用模型进行预测。

```
