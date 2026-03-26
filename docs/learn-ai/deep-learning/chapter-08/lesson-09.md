## 8.9用PyTorch实现多分类神经网络

上一节，我们自己实现了一个多分类神经网络来对手写数字进行识别，它的目的是让你了解神经网络底层的原理，这一节，我们就利用PyTorch来实现同样的功能，你会发现我们的工作会变简单不少。

### 8.9.1定义模型

```
classNeuralNetwork(nn.Module):def__init__(self):super().__init__()
self.model = nn.Sequential(
nn.Linear(28*28,128),
nn.ReLU(),
nn.Linear(128,128),
nn.ReLU(),
nn.Linear(128,128),
nn.ReLU(),
nn.Linear(128,64),
nn.ReLU(),
nn.Linear(64,10)
)defforward(self, x):returnself.model(x)

```

可以看到定义了一个神经网络的类，它继承自`nn.Module`，我们就可以直接利用PyTorch定义好的`Linear`和`ReLU`。在初始化函数里，我们定义了一个`nn.Sequential`的对象，它会顺序链接内部各个模块。`forward`方法就是直接调用我们定义的model。

### 8.9.2准备工作

```
# 参数设置batch_size =64learning_rate =0.1num_epochs =10device = torch.device('cuda'iftorch.cuda.is_available()else'cpu')# 数据加载train_dataset = MNISTDataset(r'E:\电子书\RethinkFun深度学习\data\mnist\mnist_train.csv\mnist_train.csv')
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_dataset = MNISTDataset(r"E:\电子书\RethinkFun深度学习\data\mnist\mnist_test.csv\mnist_test.csv")
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)# 模型、损失函数、优化器model = NeuralNetwork().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=learning_rate)

```

我们利用PyTorch内部定义的交叉熵损失函数，以及优化器。

### 8.9.3训练模型

```
# 训练过程model.train()forepochinrange(num_epochs):
total_loss =0forimages, labelsintrain_loader:
images, labels = images.to(device), labels.to(device)

outputs = model(images)
loss = criterion(outputs, labels)# 计算lossoptimizer.zero_grad()# 清理梯度loss.backward()# 反向传播optimizer.step()# 更新参数total_loss += loss.item()

avg_loss = total_loss / len(train_loader)
print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}")

```

### 8.9.4测试模型

```
model.eval()
correct =0total =0withtorch.no_grad():forimages, labelsintest_loader:
images, labels = images.to(device), labels.to(device)
outputs = model(images)
preds = torch.argmax(outputs, dim=1)
correct += (preds == labels).sum().item()
total += labels.size(0)

print(f"Test Accuracy: {100 * correct / total:.2f}%")

```

### 8.9.5完整代码

```
importtorchimporttorch.nnasnnimporttorch.optimasoptimfromtorch.utils.dataimportDataLoader, Dataset# 自定义数据集classMNISTDataset(Dataset):def__init__(self, file_path):self.images, self.labels = self._read_file(file_path)def_read_file(self, file_path):images = []
labels = []withopen(file_path,'r')asf:
next(f)# 跳过标题行forlineinf:
items = line.strip().split(",")
images.append([float(x)forxinitems[1:]])
labels.append(int(items[0]))returnimages, labelsdef__getitem__(self, index):image = torch.tensor(self.images[index], dtype=torch.float32).view(-1)
image = image /255.0# 归一化image = (image -0.1307) /0.3081# 标准化label = torch.tensor(self.labels[index], dtype=torch.long)returnimage, labeldef__len__(self):returnlen(self.images)# 模型定义classNeuralNetwork(nn.Module):def__init__(self):super().__init__()
self.model = nn.Sequential(
nn.Linear(28*28,128),
nn.ReLU(),
nn.Linear(128,128),
nn.ReLU(),
nn.Linear(128,128),
nn.ReLU(),
nn.Linear(128,64),
nn.ReLU(),
nn.Linear(64,10)
)defforward(self, x):returnself.model(x)# 参数设置batch_size =64learning_rate =0.1num_epochs =10device = torch.device('cuda'iftorch.cuda.is_available()else'cpu')# 数据加载train_dataset = MNISTDataset(r'E:\电子书\RethinkFun深度学习\data\mnist\mnist_train.csv\mnist_train.csv')
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
test_dataset = MNISTDataset(r"E:\电子书\RethinkFun深度学习\data\mnist\mnist_test.csv\mnist_test.csv")
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)# 模型、损失函数、优化器model = NeuralNetwork().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=learning_rate)# 训练过程model.train()forepochinrange(num_epochs):
total_loss =0forimages, labelsintrain_loader:
images, labels = images.to(device), labels.to(device)

outputs = model(images)
loss = criterion(outputs, labels)

optimizer.zero_grad()
loss.backward()
optimizer.step()

total_loss += loss.item()

avg_loss = total_loss / len(train_loader)
print(f"Epoch {epoch+1}/{num_epochs}, Loss: {avg_loss:.4f}")# 测试过程model.eval()
correct =0total =0withtorch.no_grad():forimages, labelsintest_loader:
images, labels = images.to(device), labels.to(device)
outputs = model(images)
preds = torch.argmax(outputs, dim=1)
correct += (preds == labels).sum().item()
total += labels.size(0)

print(f"Test Accuracy: {100 * correct / total:.2f}%")

```

运行后，你会得到和我们之前手动实现的神经网络差不多的精度。
