## 8.8手动实现多分类神经网络

这一节，我们不使用PyTorch定义好的Linear模块，自动求导，以及优化器。完全通过手动实现来搞清楚神经网络的运行细节。

### 8.8.1 MNIST数据集

![MNIST](../imgs/0822.png)

上边展示的是MNIST（Modified National Institute of Standards and Technology）数据集，它是机器学习和图像识别领域中最经典、最常用的数据集之一，主要用于手写数字识别任务。

MNIST 数据集包含共 70,000 张手写数字图像，其中训练集有60,000 张图像，测试集有10,000 张图像。

每张图像都是一个 28×28 像素 的灰度图，像素值范围：0（白色）~ 255（黑色）。图像内容是手写的数字 0 到 9。每张图像对应一个标签，标注其代表的数字（0~9）

你可以从[这个地址](https://github.com/RethinkFun/DeepLearning/blob/master/chapter8/data/mnist.zip)下载。下载并解压后，你可以打开mnist_train.csv进行观察。这个数据一共有785列构成。其中第一列是样本的label值，其余784列分别是图像从上到下，从左到右的28x28像素的灰度值。

### 8.8.2 加载数据

```
importtorchfromtorch.utils.dataimportDataLoader, DatasetclassMNISTDataset(Dataset):def__init__(self, file_path):self.images, self.labels = self._read_file(file_path)def_read_file(self, file_path):images = []
labels = []withopen(file_path,'r')asf:
next(f)# 跳过标题行forlineinf:
line = line.rstrip("\n")
items = line.split(",")
images.append([float(x)forxinitems[1:]])
labels.append(int(items[0]))returnimages, labelsdef__getitem__(self, index):image, label = self.images[index], self.labels[index]
image = torch.tensor(image)
image = image /255.0# 归一化image = (image -0.1307) /0.3081# 标准化，对所有手写数字图片的所有像素灰度值统计出均值为0.1307，标准差为0.3081label = torch.tensor(label)returnimage, labeldef__len__(self):returnlen(self.images)

```

通过上边的代码我们定义了MNIST数据的`Dataset`类，它实现了`__getitem__`和`__len__`方法。并且进行了数据的归一化和标准化。
注意这里是对训练图片所有的像素整体进行归一化和标准化的。而不是针对一个batch的多个图像对应位置上的单个像素进行归一化和标准化的。这是因为图像的信息是通过像素之间的明暗对比产生的，它们必须被当做一个整体来处理。
接着定义训练集和测试集的DataLoader。

```
batch_size =64train_dataset = MNISTDataset(r'E:\电子书\RethinkFun深度学习\data\mnist\mnist_train.csv\mnist_train.csv')
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_dataset = MNISTDataset(r"E:\电子书\RethinkFun深度学习\data\mnist\mnist_test.csv\mnist_test.csv")
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=True)

```

需要将数据加载路径改成你自己的路径。

### 8.8.3 定义神经网络

#### 8.8.3.1定义并初始化参数

```
layer_sizes = [28*28,128,128,128,64,10]# 可根据需要修改，例如 [输入, 隐层1, 隐层2, ..., 输出]# 手动初始化参数weights = []
biases = []forin_size, out_sizeinzip(layer_sizes[:-1], layer_sizes[1:]):
W = torch.randn(in_size, out_size, device=device) * torch.sqrt(torch.tensor(2/ in_size))
b = torch.zeros(out_size, device=device)
weights.append(W)
biases.append(b)

```

通过上边的代码我们定义和初始化了每一层的权重和偏置参数。注意权重参数我们是在标准的正态分布基础上，乘以$\sqrt{\frac{2}{in\_size}}$来进行初始化。

#### 8.8.3.2函数定义

**ReLU**

```
defrelu(x):returntorch.clamp(x, min=0)defrelu_grad(x):return(x >0).float()

```

`relu_grad(x)`是计算ReLU导数的函数，当x大于0时，布尔表达式(x>0)为True，转化为浮点型就为1，x小于0，布尔表达式为False，转化为浮点型就为0。这正是ReLU函数对x的导数值。

**softmax**

```
defsoftmax(x):x_exp = torch.exp(x - x.max(dim=1, keepdim=True).values)returnx_exp / x_exp.sum(dim=1, keepdim=True)

```

注意这里softmax的实现有个小的技巧，为了防止输入的值过大，比如1000，e的1000次方就超过float的表示范围了。解决办法是给softmax函数的分子分母同时除以$e^{x.max}$，这就等于指数部分相减torch.exp(x-x.max)。

**交叉熵损失函数**

```
defcross_entropy(pred, labels):N = pred.shape[0]
one_hot = torch.zeros_like(pred)
one_hot[torch.arange(N), labels] =1# 生成label的one-hot编码loss = - (one_hot * torch.log(pred +1e-8)).sum() / N# 计算平均lossreturnloss, one_hot

```

为了避免对 0 取对数，确保`torch.log(pred + 1e-8)`始终是有限数值，增强稳定性，所以加上1e-8，这个非常小的数。

**训练循环**

```
# 训练循环
for epoch in range(num_epochs):
total_loss = 0
for images, labels in train_loader:
x = images.to(device)
y = labels.to(device)
N = x.shape[0]

# 前向传播
activations = [x]
pre_acts = []
for W, b in zip(weights[:-1], biases[:-1]):
z = activations[-1] @ W + b
pre_acts.append(z)
a = relu(z)
activations.append(a)
# 输出层
z_out = activations[-1] @ weights[-1] + biases[-1]
pre_acts.append(z_out)
y_pred = softmax(z_out)

# 损失
loss, one_hot = cross_entropy(y_pred, y)
total_loss += loss.item()

# 反向传播
grads_W = [None] * len(weights)
grads_b = [None] * len(biases)
# 输出层梯度
dL_dz = (y_pred - one_hot) / N  # [N, output]
grads_W[-1] = activations[-1].t() @ dL_dz
grads_b[-1] = dL_dz.sum(dim=0)
# 隐层梯度
for i in range(len(weights)-2, -1, -1):
dL_dz = dL_dz @ weights[i+1].t() * relu_grad(pre_acts[i])
grads_W[i] = activations[i].t() @ dL_dz
grads_b[i] = dL_dz.sum(dim=0)

# 更新参数
with torch.no_grad():
for i in range(len(weights)):
weights[i] -= learning_rate * grads_W[i]
biases[i]  -= learning_rate * grads_b[i]

avg_loss = total_loss / len(train_loader)
print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}")

```

你可以对照我们之前讲解原理和公式的文章，一步步理解上边的代码。

**测试集评估**

```
withtorch.no_grad():
correct =0total =0forimages, labelsintest_loader:
x = images.view(-1, layer_sizes[0]).to(device)
y = labels.to(device)
a = xforW, binzip(weights[:-1], biases[:-1]):
a = relu(a @ W + b)
logits = a @ weights[-1] + biases[-1]
preds = logits.argmax(dim=1)
correct += (preds == y).sum().item()
total += y.size(0)
print(f"Test Accuracy: {correct/total*100:.2f}%")

```

### 8.8.4完整代码

```
importtorchfromtorch.utils.dataimportDataLoader, DatasetclassMNISTDataset(Dataset):def__init__(self, file_path):self.images, self.labels = self._read_file(file_path)def_read_file(self, file_path):images = []
labels = []withopen(file_path,'r')asf:
next(f)# 跳过标题行forlineinf:
line = line.rstrip("\n")
items = line.split(",")
images.append([float(x)forxinitems[1:]])
labels.append(int(items[0]))returnimages, labelsdef__getitem__(self, index):image, label = self.images[index], self.labels[index]
image = torch.tensor(image)
image = image /255.0# 归一化image = (image -0.1307) /0.3081# 标准化label = torch.tensor(label)returnimage, labeldef__len__(self):returnlen(self.images)

batch_size =64train_dataset = MNISTDataset(r'E:\电子书\RethinkFun深度学习\data\mnist\mnist_train.csv\mnist_train.csv')
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_dataset = MNISTDataset(r"E:\电子书\RethinkFun深度学习\data\mnist\mnist_test.csv\mnist_test.csv")
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=True)

learning_rate =0.1num_epochs =10device = torch.device('cuda'iftorch.cuda.is_available()else'cpu')# 配置网络结构，包含输入层、隐藏层、输出层大小layer_sizes = [28*28,128,128,128,64,10]# 可根据需要修改，例如 [输入, 隐层1, 隐层2, ..., 输出]# 手动初始化参数weights = []
biases = []forin_size, out_sizeinzip(layer_sizes[:-1], layer_sizes[1:]):
W = torch.randn(in_size, out_size, device=device) * torch.sqrt(torch.tensor(2/ in_size))
b = torch.zeros(out_size, device=device)
weights.append(W)
biases.append(b)# 激活函数及其导数defrelu(x):returntorch.clamp(x, min=0)defrelu_grad(x):return(x >0).float()# Softmax + 交叉熵损失 (手动实现)defsoftmax(x):x_exp = torch.exp(x - x.max(dim=1, keepdim=True).values)returnx_exp / x_exp.sum(dim=1, keepdim=True)defcross_entropy(pred, labels):N = pred.shape[0]
one_hot = torch.zeros_like(pred)
one_hot[torch.arange(N), labels] =1# 生成one-hot编码loss = - (one_hot * torch.log(pred +1e-8)).sum() / N# 计算平均loss，这里加上一个很小的数1e-8，是为了防止出现log(0)时出现负无穷大的情况。returnloss, one_hot# 训练循环forepochinrange(num_epochs):
total_loss =0forimages, labelsintrain_loader:
x = images.to(device)
y = labels.to(device)
N = x.shape[0]# 前向传播activations = [x]
pre_acts = []forW, binzip(weights[:-1], biases[:-1]):
z = activations[-1] @ W + b
pre_acts.append(z)
a = relu(z)
activations.append(a)# 输出层z_out = activations[-1] @ weights[-1] + biases[-1]
pre_acts.append(z_out)
y_pred = softmax(z_out)# 损失loss, one_hot = cross_entropy(y_pred, y)
total_loss += loss.item()# 反向传播grads_W = [None] * len(weights)
grads_b = [None] * len(biases)# 输出层梯度dL_dz = (y_pred - one_hot) / N# [N, output]grads_W[-1] = activations[-1].t() @ dL_dz
grads_b[-1] = dL_dz.sum(dim=0)# 隐层梯度foriinrange(len(weights)-2,-1,-1):
dL_dz = dL_dz @ weights[i+1].t() * relu_grad(pre_acts[i])
grads_W[i] = activations[i].t() @ dL_dz
grads_b[i] = dL_dz.sum(dim=0)# 更新参数withtorch.no_grad():foriinrange(len(weights)):
weights[i] -= learning_rate * grads_W[i]
biases[i]  -= learning_rate * grads_b[i]

avg_loss = total_loss / len(train_loader)
print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}")# 测试withtorch.no_grad():
correct =0total =0forimages, labelsintest_loader:
x = images.view(-1, layer_sizes[0]).to(device)
y = labels.to(device)
a = xforW, binzip(weights[:-1], biases[:-1]):
a = relu(a @ W + b)
logits = a @ weights[-1] + biases[-1]
preds = logits.argmax(dim=1)
correct += (preds == y).sum().item()
total += y.size(0)
print(f"Test Accuracy: {correct/total*100:.2f}%")

```

通过运行上边的代码，可以看到对于手写数字的识别正确率，可以达到97%以上。相信现在你应该对神经网络的训练有了深刻的理解。比如为了保证后向传播时计算梯度，框架会保存前向传播时每层计算的中间结果。

强烈建议你自己动手实现一次上边的代码。从此神经网络对你将不再神秘。

---

如果你学懂了这一节，扫码请作者喝一杯咖啡来分享你的喜悦。

![zsm](../imgs/zsm.png)
