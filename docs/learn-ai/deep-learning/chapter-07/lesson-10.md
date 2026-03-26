## 7.10利用PyTorch定义逻辑回归模型

本小节，我们将利用PyTorch定义一个逻辑回归模型。首先我们从PyTorch里的`nn.Module`类讲起。

### 7.10.1 nn.Module

nn.Module是PyTorch里的核心组件，在PyTorch里所有的模型，或者模型内的模块，都是基于nn.Module构建的。假如你定义一个复杂的模型，它是由多个嵌套的模块构成的。那么你的这个复杂模型和内部的各个可训练模块，都必须继承自nn.Module。正是因为所有可训练的模块都是基于nn.Module构建，PyTorch可以方便的对可训练参数进行管理，并为我们的实现提供了便利。

nn.Module带来了以下好处：

- 模块化构建：对于复杂的网络，你可以将它划分为多个子模块进行构建。然后将它们组合为一个复杂模型。

- 自动管理参数：nn.Module会自动追踪模块内所有的参数，无论这些参数是嵌套在子模块中还是作为属性值直接存储在当前模块中。可以通过模块的`parameters()`或者`named_parameters()`进行查看。

- 统一的forward方法：所有继承自nn.Module的类必须实现一个`forward`方法，这样各个模块之间根据组合关系对数据进行前向处理。PyTorch里的计算图和自动求梯度机制会帮助我们实现反向传播。

- 统一的设备管理：利用`nn.Module`提供的`.to(device)`方法，可以方便的将整个模型迁移到GPU或者CPU。

- 模型的保存和加载：`nn.Module`提供了标准的模型保存和加载方法。

- 定义了模型的train和eval状态：有的模块在训练时和预测（或者叫推理）时前向传播实现是不同的，可以通过`model.train()`或者`model.eval()`统一切换本身，和内部包含的所有模块的状态。

### 7.10.2 实现逻辑回归模型

要自定义一个模型，需要继承`nn.Module`，然后你必须实现两个方法，一个是`__init__`，一个是`forward`。

__init__方法:
实现`__init__`的第一步，是调用父类的`__init__`方法。接着是定义模型的参数和其他继承自`nn.Module`的模块。

forward方法：
在`forward`方法内，你定义数据是如何在你的模块内进行传递计算的。需要特别注意的是，`forward`函数定义是给PyTorch框架内部调用的，当你想调用模型的前向传播时，千万不要直接调用`forward`方法，你只需要直接调用`model(inputs)`就可以了。

逻辑回归模型的实现代码如下：

```
classLogisticRegressionModel(nn.Module):def__init__(self, input_dim):super().__init__()
self.linear = nn.Linear(input_dim,1)# nn.Linear也继承自nn.Module，输入为input_dim,输出一个值defforward(self, x):returntorch.sigmoid(self.linear(x))# Logistic Regression 输出概率

```

其中`nn.Linear`是定义一个线性回归模型。它传入两个参数，第一个是输入特征的个数。第二个是输出特征的个数，你可能奇怪线性回归输出的个数不就是1吗，为什么还可以是其他值？实际上这里的`nn.Linear`是一个线性层。它可以一次性定义多个线性回归，所以可以有多个输出，当我们设置输出值为1时，那么就是我们之前讲的线性回归了。关于`nn.Linear`的更多知识我们会在讲神经网络时谈及。
