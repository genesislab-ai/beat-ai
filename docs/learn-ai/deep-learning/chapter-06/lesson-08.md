## 6.8Normalization

### 6.8.1一个例子

![图片1](../imgs/0611.png)

假设我们构造了如下的数据，这个数据是关于对外卖送餐时间的数据。对于送餐时间（分钟）。影响因素有两个，一个是路上红绿灯的数量，一个是饭店距你的距离（米）。构造数据时，我们假设：
$$
time=2*lights+0.01*distance+5
$$

timelightsdistance

1921000

3132000

142500

151800

4343000

这里的time是用lights和distance，严格按照上边给定参数的线性模型生成的。没有添加误差。

我们希望利用我们构造的数据，和随机初始化的线性回归参数，经过训练后，能够拟合出我们上边给定的线性回归的参数。

### 6.8.2用梯度下降训练

```
importtorch

device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")
inputs = torch.tensor([[2,1000], [3,2000], [2,500], [1,800], [4,3000]], dtype=torch.float, device=device)
labels = torch.tensor([[19], [31], [14], [15], [43]], dtype=torch.float, device=device)

w = torch.ones(2,1, requires_grad=True, device=device)
b = torch.ones(1, requires_grad=True, device=device)

epoch =200lr =0.0000001foriinrange(epoch):
outputs = inputs @ w + b
loss = torch.mean(torch.square(outputs - labels))
print("loss", loss.item())
loss.backward()
print("w.grad", w.grad.tolist())withtorch.no_grad():
w -= w.grad * lr
b -= b.grad * lr

w.grad.zero_()
b.grad.zero_()

```

通过上边的代码，可以训练一个线性回归模型，你可以尝试调整学习率lr，你会发现这个lr必须设置的很小。如果设置稍大，模型训练过程就会不收敛，loss值会快速增大，直到超过float的表示范围。而且loss值降到7左右，就很难再下降了。我们造的数据是严格按照线性方程构造的，理论上loss应该可以降到非常接近0的。但为什么loss值不能下降到0呢？
我们仔细观察第一次迭代的打印值：

```
loss 2898583.75
w.grad [[8600.0], [5876040.0]]

```

可以发现对于lights权重$w_0$的梯度值为8600，对于distance权重$w_1$的梯度值为5876040。$w_1$的梯度大概是$w_0$梯度的1000倍。
这是因为$w_1$这个权重是作用在distance上的，$w_0$这个权重是作用在lights上的。distance的值大概是lights值的1000倍。
作用到最终loss函数上，进行同样的改变，$w_1$的变化对loss值的影响就是$w_0$的1000倍。所以造成了两个权重的梯度值相差了1000倍。

初始化时，$w_0$和$w_1$都是1，最终我们希望$w_0$能调整为2，$w_1$能调整到0.01。我们看到$w_1$的梯度值非常大，如果学习率稍微大一些，1减去学习率乘以梯度值，就跨过了需要调整到的0.01。这就是为什么学习率需要设置的很小。

为了迁就对$w_1$的调整，学习率必须设置的很小，但是这会导致对$w_0$每次的调整太少，导致训练非常慢。这就是为什么当loss降到7左右就很难再下降了。

根本原因就是对$w_0$和$w_1$的训练，它们共用学习率，但是因为它们对应feature的取值范围不同，导致他们对loss函数的影响不同，进而导致它们对loss的梯度的取值范围不同。

### 6.8.3对feature进行归一化

如果我们让所有feature的取值范围相同，这样所有训练参数对loss函数的影响就相同了，计算得到的梯度都差不多，就可以用统一的学习率来进行调整了。
对于bias而言，它的系数为1，相当于它的输入feature大小永远都是1。那么我们就把其他feature都调整到1左右。最简单的做法，就是让输入feature都除以这个feature的最大值，这样所有feature的取值都是0到1之间了。
我们试一下这样是否可以改进训练的稳定性：

```
importtorch

device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")
inputs = torch.tensor([[2,1000], [3,2000], [2,500], [1,800], [4,3000]], dtype=torch.float, device=device)
labels = torch.tensor([[19], [31], [14], [15], [43]], dtype=torch.float, device=device)#进行归一化inputs = inputs / torch.tensor([4,3000], device=device)

w = torch.ones(2,1, requires_grad=True, device=device)
b = torch.ones(1, requires_grad=True, device=device)

epoch =1000lr =0.5foriinrange(epoch):
outputs = inputs @ w + b
loss = torch.mean(torch.square(outputs - labels))
print("loss", loss.item())
loss.backward()
print("w.grad", w.grad.tolist())withtorch.no_grad():
w -= w.grad * lr
b -= b.grad * lr

w.grad.zero_()
b.grad.zero_()

```

通过上边代码的调整，我们就可以给lr设置一个较大的值了，并且经过1000次迭代后，loss值就非常接近于0了。

### 6.8.4对特征进行标准化

实际上在深度学习里，更常用的是对特征进行标准化处理。也就是对每个feature减去自己的均值，再除以自己的标准差。这样就把这个feature转化为均值为0，标准差为1的分布了。在归一化操作里，是对每个feature除以这个feature所有样本中绝对值最大的值。只有这一个值决定缩放大小。但这个值有可能是个异常值。相比之下标准化处理会考虑所有样本的分布情况，避免缩放受异常值的影响，训练起来会更稳定。

```
importtorch

device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")
inputs = torch.tensor([[2,1000], [3,2000], [2,500], [1,800], [4,3000]], dtype=torch.float, device=device)
labels = torch.tensor([[19], [31], [14], [15], [43]], dtype=torch.float, device=device)#计算特征的均值和标准差mean = inputs.mean(dim=0)
std = inputs.std(dim=0)#对特征进行标准化inputs_norm = (inputs-mean)/std

w = torch.ones(2,1, requires_grad=True, device=device)
b = torch.ones(1, requires_grad=True, device=device)

epoch =1000lr =0.5foriinrange(epoch):
outputs = inputs_norm @ w + b
loss = torch.mean(torch.square(outputs - labels))
print("loss", loss.item())
loss.backward()
print("w.grad", w.grad.tolist())withtorch.no_grad():
w -= w.grad * lr
b -= b.grad * lr

w.grad.zero_()
b.grad.zero_()

```

可以看到，训练也是非常稳定，loss值也非常接近0。

### 6.8.5预测时的归一化

有一点要特别注意，假如你在训练时对数据做了归一化，那么你一定要记录你做归一化时的参数。在对数据进行预测时，首先需要先对feature用同样的参数进行归一化，然后再带入模型，得到预测值。

```
importtorch

device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")
inputs = torch.tensor([[2,1000], [3,2000], [2,500], [1,800], [4,3000]], dtype=torch.float, device=device)
labels = torch.tensor([[19], [31], [14], [15], [43]], dtype=torch.float, device=device)#计算每个特征的均值和标准差mean = inputs.mean(dim=0)
std = inputs.std(dim=0)#对特征进行标准化inputs = (inputs-mean)/std

w = torch.ones(2,1, requires_grad=True, device=device)
b = torch.ones(1, requires_grad=True, device=device)

epoch =2000lr =0.1foriinrange(epoch):
outputs = inputs @ w + b
loss = torch.mean(torch.square(outputs - labels))
print("loss", loss.item())
loss.backward()
print("w.grad", w.grad.tolist())withtorch.no_grad():
w -= w.grad * lr
b -= b.grad * lr

w.grad.zero_()
b.grad.zero_()# 对新采集的数据进行预测new_input = torch.tensor([[3,2500]],dtype=torch.float,device=device)# 对于新的数据进行预测时，同样要进行标准化new_input = (new_input-mean)/std# 预测predict = new_input @ w + b# 打印预测结果print("Predict:",predict.tolist()[0][0])

```

### 6.8.6 为什么归一化不会影响模型

你可能好奇，归一化实际改变了数据，为什么不影响训练模型呢？这是因为归一化仅对参数空间进行了可逆的线性变换，模型的理论表达能力不变，不改变数据的本质关系。这一现象类似于“换单位不会影响物理规律”。
归一化不会影响深度学习模型的训练结果，因为它只是数据的线性变换，保留了所有必要的信息，模型可以通过权重调整完全补偿这种变换。

### 6.8.7归一化还是标准化

严格来说，归一化指的是将数据变化调整到[-1,1]或者[0,1]之间。标准化是将数据减去均值除以标准差。但是在机器学习里，由于历史原因，都是用Normalization来表示。如果有人说他对数据进行了归一化，但是实际代码里是做了标准化，你也不用感到奇怪。

### 6.8.8什么时候用归一化

因为对feature进行归一化会让训练更稳定，且不会带来任何坏处。基本上所有的深度学习的模型都默认会对feature进行归一化操作。
