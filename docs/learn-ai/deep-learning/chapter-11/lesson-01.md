## 11.1 LeNet

在深度学习的发展史上，LeNet（又称LeNet-5）是一个里程碑式的模型。

![1036.png](../imgs/1036.png)

它由深度学习先驱Yann LeCun等人于1998年提出，被公认为第一个成功应用的卷积神经网络。尽管在LeNet之前已有类似卷积结构的研究，但LeNet首次将卷积、池化和反向传播结合，为现代计算机视觉奠定了基础。

### 11.1.1 网络结构

![1037.png](../imgs/1037.png)

Input: 1×32×32 图像（如手写数字）

C1: 卷积层，6个5×5卷积核 → 输出6×28×28

S2: 平均池化层 → 输出6×14×14

C3: 卷积层，16个5×5卷积核 → 输出16×10×10

S4: 平均池化层 → 输出16×5×5

C5: 卷积层，120个5×5卷积核 → 输出120×1×1（相当于全连接）

F6: 全连接层，输出84个神经元

Output: 全连接层，输出10类（数字0-9的概率）

注意：
输入为32×32图像（MNIST是28×28，用zero-padding补足）
使用平均池化（Average Pooling）而非现代常见的最大池化（Max Pooling）
激活函数为Sigmoid或tanh，而非ReLU

### 11.1.2 LeNet的实现

```
importtorchimporttorch.nnasnnimporttorch.nn.functionalasFclassLeNet(nn.Module):def__init__(self):super(LeNet, self).__init__()# C1: 输入1通道，输出6通道，卷积核5x5self.conv1 = nn.Conv2d(1,6, kernel_size=5)# S2: 平均池化层self.pool1 = nn.AvgPool2d(kernel_size=2, stride=2)# C3: 输入6通道，输出16通道self.conv2 = nn.Conv2d(6,16, kernel_size=5)# S4: 平均池化self.pool2 = nn.AvgPool2d(kernel_size=2, stride=2)# C5: 全连接等价层（输入16×5×5 -> 输出120）self.conv3 = nn.Conv2d(16,120, kernel_size=5)# F6: 全连接层self.fc1 = nn.Linear(120,84)# Output: 输出10类self.fc2 = nn.Linear(84,10)defforward(self, x):x = F.tanh(self.conv1(x))# C1 + 激活x = self.pool1(x)# S2x = F.tanh(self.conv2(x))# C3 + 激活x = self.pool2(x)# S4x = F.tanh(self.conv3(x))# C5 + 激活x = x.view(-1,120)# 展平x = F.tanh(self.fc1(x))# F6x = self.fc2(x)# 输出层returnx

```

### 11.1.3 LeNet的意义

LeNet 最初是为美国邮政局开发，用于识别手写邮政编码，是卷积神经网络（CNN）首次成功应用于现实世界问题。它在标准的 MNIST 数据集上取得了超过 99.2% 的准确率，远超当时的传统算法。与依赖人工特征设计的方法不同，LeNet 能通过卷积核自动学习图像特征，省去了手动构造特征的繁琐过程。它结构简单、效率高、准确率高，堪称 CNN 发展史上的里程碑。LeNet-5 首次系统性地引入了 Padding、卷积、池化和全连接等关键结构，这些核心思想至今仍是现代深度学习网络设计的基础。
