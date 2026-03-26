## 6.5计算图与自动求梯度

在之前的章节里，我们自己实现了利用梯度下降方法对一个线性回归模型的训练。其中最复杂的部分就是对参数进行梯度计算。在后边我们学习了深度神经网络后，你更会发现求梯度是一个非常复杂的过程。

### 6.5.1一个简单的例子

有两个标量tensor：x，y。他们构成的一个计算式为：

$$
z = log\left ( 3x+4y \right ) ^2
$$
下边，我们需要计算梯度，分别对x和y求偏导。首先分析这个计算式，可以发现它是一个3重的复合函数，分别为：
$$
z = f(u) = logu
$$

$$
u = g(v) = v^2
$$

$$
v = h(x,y) = 3x+4y
$$

上边3个式子彼此关联，形成一个计算图：

![图片1](../imgs/0609.png)

接下来利用链式求导法则，对x求偏导数：
$$
\frac{\partial z}{\partial x} =\frac{\partial z}{\partial u}\frac{\partial u}{\partial v}\frac{\partial v}{\partial x}
$$

$$
\frac{\partial z}{\partial x}=\frac{1}{\left ( 3x+4y \right ) ^2}\cdot2(3x+4y)\cdot3
$$

同理，我们可以得到对y的偏导为：
$$
\frac{\partial z}{\partial y}=\frac{1}{\left ( 3x+4y \right ) ^2}\cdot2(3x+4y)\cdot4
$$

当x=1，y=1时，则z对x，y的偏导数约为：
$$
\frac{\partial z}{\partial x}\approx 0.8571
$$

$$
\frac{\partial z}{\partial y}\approx 1.1429
$$

再回顾一下上边这个简单的例子，我们需要分析自变量和因变量的关系，保存计算图。然后根据链式法则和求导公式计算偏导数，从而得到梯度。训练神经网络时，计算关系更加复杂。而且参数量为几十亿或者上百亿。如果靠人手动实现，那是不可能的。好在PyTorch已经帮我们自动实现了计算图生成和自动求梯度的功能。

### 6.5.2PyTorch里的自动求梯度

我们在PyTorch里完成上边这个简单的例子。

```
importtorch

x = torch.tensor(1.0, requires_grad=True)#指定需要计算梯度y = torch.tensor(1.0, requires_grad=True)#指定需要计算梯度v =3*x+4*y
u = torch.square(v)
z = torch.log(u)

z.backward()#反向传播求梯度print("x grad:", x.grad)
print("y grad:", y.grad)

```

结果为：

```
x grad: tensor(0.8571)
y grad: tensor(1.1429)

```

仔细分析PyTorch的代码可以发现，我们定义了x，y需要计算梯度，然后定义了计算的流程。PyTorch内部会自动帮我们构建和维护计算图。我们只要调用结果z的反向传播方法，PyTorch内部会根据计算图反向传播，计算梯度。最终打印出的x和y在（1,1）点的梯度和我们手动计算的梯度值是完全一致的。

利用PyTorch里的自动求梯度的能力，可以大大简化我们利用梯度下降方法对模型的训练。
