## 6.6用PyTorch实现线性回归

在之前的章节里我们曾自己手动实现了一个线性回归。当时我们还需要自己用loss函数对每个weight和bias进行求导，然后利用梯度下降算法，多次迭代更新模型的参数（weight和bias）。
上一节，通过学习我们知道。在PyTorch里我们只需要定义前向的计算过程，PyTorch可以自动生成计算图，和自动求梯度。并且可以将Tensor的运算放到GPU上进行加速。这一节，我们就来实际试一下。

### 6.6.1生成训练数据

```
importtorch# 确保CUDA可用device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")# 生成数据inputs = torch.rand(100,3)# 随机生成shape为(100,3)的tensor，里边每个元素的值都是0-1之间weights = torch.tensor([[1.1], [2.2], [3.3]])#预设的权重bias = torch.tensor(4.4)#预设的biastargets = inputs @ weights + bias +0.1*torch.randn(100,1)#增加一些误差，模拟真实情况

```

上边的代码首先随机生成100条数据，每条数据都有3个feature。具体值是随机产生的0-1之间的值。接着通过我们人为设定的weight和bias，对随机生成的inputs经过线性变化，再加上一些小的随机误差。生成对应的targets作为label值。
我们希望线性回归模型，通过inputs和targets进行训练。最终能调整训练的权重和偏置参数，达到和我们人为设置的weights和bias接近的值。

### 6.6.2初始化线性回归的参数

```
# 初始化参数时直接放在CUDA上，并启用梯度追踪
w = torch.rand((3, 1), requires_grad=True, device=device)
b = torch.rand((1,), requires_grad=True, device=device)

```

用随机值初始化线性回归模型的参数。

### 6.6.3进行训练

```
# 将数据移至相同设备inputs = inputs.to(device)
targets = targets.to(device)#设置超参数epoch =10000lr =0.003foriinrange(epoch):
outputs = inputs @ w + b
loss = torch.mean(torch.square(outputs - targets))
print("loss:", loss.item())

loss.backward()withtorch.no_grad():#下边的计算不需要跟踪梯度w -= lr * w.grad
b -= lr * b.grad# 清零梯度w.grad.zero_()
b.grad.zero_()

print("训练后的权重 w:", w)
print("训练后的偏置 b:", b)

```

上边的代码，首先必须将inputs和targets也移动到和参数同样的设备上，不同设备上的tensor是无法进行计算的。
然后我们设置超参数迭代次数epoch，和学习率lr。
然后进入训练循环，我们只需要定义前向传播过程就可以，最后调用loss的backward方法。PyTorch会根据自动生成的计算图进行反向传播和梯度计算。后边我们就可以用`w.grad`来获取loss对w的偏导数了。
然后对参数进行梯度更新，需要注意这个更新计算不记录梯度，所以放在torch.no_grad()的上下文里。
还需要注意的是，需要对更新后的参数的梯度进行清零，不然梯度值会一直累积。
经过多次迭代后，可以打印出模型训练后的参数值，看看和我们生成数据时预设的参数值是否接近。我运行代码得到的结果如下：

```
训练后的权重 w: tensor([[1.1198],
[2.1980],
[3.2416]], device='cuda:0', requires_grad=True)
训练后的偏置 b: tensor([4.4238], device='cuda:0', requires_grad=True)

```

可以看到和我们预设的参数值是非常接近的。
当然PyTorch对我们训练的帮助远不止于此，后边我们会逐步讲到。
