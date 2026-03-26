## 10.7 用PyTorch实现卷积神经网络

之前我们已经学习过卷积神经网络的原理，下边是时候用代码来实际试一下了。

### 10.7.1 猫狗分类

首先你需要进入Kaggle，注册用户并下载猫狗分类的数据集。[点此进入](https://www.kaggle.com/datasets/shaunthesheep/microsoft-catsvsdogs-dataset)

下载后的文件是`archive.zip`,解压后，在`PetImages`文件夹下，你会看到两个子文件夹。一个`Cat`，一个`Dog`。这两个文件夹内存放着猫和狗的图片。

![1028.png](../imgs/1028.png)

### 10.7.2 数据准备

和实际项目中采集的图片数据类似，图片不仅大小和分辨率不一样，而且有的图片可能损坏，比如`Cat/666.jpg`就是一个大小为0KB的损坏的图片。所以我们在加载图片前，需要对图片做一次验证，只加载完好的图片。

另外我们需要给出每个图片对应的标签。我们知道，神经网络里最终的标签只能是数字，所以，我们把猫编码为0，狗编码为1。下边的代码将验证过的图片和对应的标签组成一个元组，并将这些元组放入一个列表返回。

你需要安装Pillow库，才能保证下边代码的运行。

```
defverify_images(image_folder):classes = ["Cat","Dog"]
class_to_idx = {"Cat":0,"Dog":1}
samples = []forcls_nameinclasses:
cls_dir = os.path.join(image_folder, cls_name)forfnameinos.listdir(cls_dir):ifnotfname.lower().endswith(('.jpg','.jpeg','.png')):continuepath = os.path.join(cls_dir, fname)try:withImage.open(path)asimg:
img.verify()
samples.append((path, class_to_idx[cls_name]))exceptException:
print(f"Warning: Skipping corrupted image {path}")returnsamples

```

接下来，我们定义Dataset类，它的初始化函数接受两个参数，一个是上边函数返回的图片和对应标签的列表。一个是对图片进行的操作。对图片进行操作的对象是PyTorch的`torchvision.transforms`模块下的`Transform`对象。它代表是对图像的一个或一系列操作，常用于调整图片大小，将图片转化为Tensor，对图片进行归一化操作等。

```
classImageDataset(Dataset):def__init__(self, samples, transform=None):self.samples = samples
self.transform = transformdef__len__(self):returnlen(self.samples)def__getitem__(self, idx):path, label = self.samples[idx]withImage.open(path)asimg:
img=img.convert('RGB')ifself.transform:
img=self.transform(img)returnimg, label

```

定义卷积神经网络模型：

```
classCNNModel(nn.Module):def__init__(self):super().__init__()
self.model = nn.Sequential(
nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=128, out_channels=1, kernel_size=1),# 1乘1卷积nn.AdaptiveAvgPool2d((1,1)),# 全局平均池化层nn.Flatten(),
nn.Sigmoid()
)defforward(self, x):returnself.model(x)

```

上边代码中用`nn.Sequential`来顺序组合一系列模块。其中特征提取模块都是卷积，激活，最大池化。最后经过一个1乘1卷积，因为最后是二分类，只需要输出一个特征，进行sigmoid，0代表猫，1代表狗。所以1乘1卷积的只用一个Filter，输出通道数为1。最后接全局平均池化，Flatten，Sigmoid。

定义在验证集上检验模型正确率的代码：

```
defevaluate(model, test_dataloader):model.eval()
val_correct =0val_total =0withtorch.no_grad():forinputs, labelsintest_dataloader:
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

outputs = model(inputs)
preds = (outputs >0.5).float()
val_correct += (preds == labels).sum().item()
val_total += labels.size(0)

val_acc = val_correct / val_totalreturnval_acc

```

对数据集进行加载，然后打乱顺序，划分训练集和验证集。

```
DATA_DIR =r"E:\电子书\RethinkFun深度学习\data\PetImages"BATCH_SIZE =64IMG_SIZE =128EPOCHS =10LR =0.001PRINT_STEP =100DEVICE = torch.device("cuda"iftorch.cuda.is_available()else"cpu")

all_samples = verify_images(DATA_DIR)
random.seed(42)
random.shuffle(all_samples)
train_size = int(len(all_samples) *0.8)
train_samples = all_samples[:train_size]
valid_samples = all_samples[train_size:]

```

定义对图片进行一系列操作的`Transform`对象。

```
data_transform = transforms.Compose([
transforms.Resize((IMG_SIZE, IMG_SIZE)),
transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

```

因为数据集里的图片大小不一，我们训练时设置为统一大小来进行训练，上边代码通过`Resize`设置为128×128。然后转化为`Tensor`对象，最后进行标准化，其中3个通道的均值和标准差的具体值是通过在ImageNet 训练集中超过 100 万张图像的每个 RGB 通道进行统计计算得出的。

接下来定义`DataSet`和`DataLoader`。

```
train_dataset = ImageDataset(train_samples, data_transform)
valid_dataset = ImageDataset(valid_samples, data_transform)

train_dataloader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
valid_dataloader = DataLoader(valid_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

```

定义模型，loss函数，优化器

```
model = CNNModel().to(DEVICE)
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

```

定义训练循环：

```
forepochinrange(EPOCHS):
print(f"\nEpoch {epoch + 1}/{EPOCHS}")
model.train()
running_loss =0.0forstep, (inputs, labels)inenumerate(train_dataloader):
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

optimizer.zero_grad()
outputs = model(inputs)
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()

running_loss += loss.item()if(step +1) % PRINT_STEP ==0:
avg_loss = running_loss / PRINT_STEP
print(f"  Step [{step + 1}] - Loss: {avg_loss:.4f}")
running_loss =0.0val_acc = evaluate(model, valid_dataloader)
print(f"Validation Accuracy after epoch {epoch + 1}: {val_acc:.4f}")

```

完整代码如下：

```
fromtorch.utils.dataimportDataset, DataLoaderfromPILimportImageimportrandomimporttorchfromtorchvisionimporttransformsimporttorch.nnasnnimportosdefverify_images(image_folder):classes = ["Cat","Dog"]
class_to_idx = {"Cat":0,"Dog":1}
samples = []forcls_nameinclasses:
cls_dir = os.path.join(image_folder, cls_name)forfnameinos.listdir(cls_dir):ifnotfname.lower().endswith(('.jpg','.jpeg','.png')):continuepath = os.path.join(cls_dir, fname)try:withImage.open(path)asimg:
img.verify()
samples.append((path, class_to_idx[cls_name]))exceptException:
print(f"Warning: Skipping corrupted image {path}")returnsamplesclassImageDataset(Dataset):def__init__(self, samples, transform=None):self.samples = samples
self.transform = transformdef__len__(self):returnlen(self.samples)def__getitem__(self, idx):path, label = self.samples[idx]withImage.open(path)asimg:
img = img.convert('RGB')ifself.transform:
img = self.transform(img)returnimg, labelclassCNNModel(nn.Module):def__init__(self):super().__init__()
self.model = nn.Sequential(
nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=16, out_channels=32, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
nn.ReLU(),
nn.MaxPool2d(kernel_size=2, stride=2),

nn.Conv2d(in_channels=128, out_channels=1, kernel_size=1),# 1乘1卷积nn.AdaptiveAvgPool2d((1,1)),# 全局平均池化层nn.Flatten(),
nn.Sigmoid()
)defforward(self, x):returnself.model(x)defevaluate(model, test_dataloader):model.eval()
val_correct =0val_total =0withtorch.no_grad():forinputs, labelsintest_dataloader:
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

outputs = model(inputs)
preds = (outputs >0.5).float()
val_correct += (preds == labels).sum().item()
val_total += labels.size(0)

val_acc = val_correct / val_totalreturnval_accif__name__ =="__main__":
DATA_DIR =r"E:\电子书\RethinkFun深度学习\data\PetImages"BATCH_SIZE =64IMG_SIZE =128EPOCHS =10LR =0.001PRINT_STEP =100DEVICE = torch.device("cuda"iftorch.cuda.is_available()else"cpu")

all_samples = verify_images(DATA_DIR)
random.seed(42)
random.shuffle(all_samples)
train_size = int(len(all_samples) *0.8)
train_samples = all_samples[:train_size]
valid_samples = all_samples[train_size:]

data_transform = transforms.Compose([
transforms.Resize((IMG_SIZE, IMG_SIZE)),
transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

train_dataset = ImageDataset(train_samples, data_transform)
valid_dataset = ImageDataset(valid_samples, data_transform)

train_dataloader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
valid_dataloader = DataLoader(valid_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

model = CNNModel().to(DEVICE)
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)forepochinrange(EPOCHS):
print(f"\nEpoch {epoch + 1}/{EPOCHS}")
model.train()
running_loss =0.0forstep, (inputs, labels)inenumerate(train_dataloader):
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

optimizer.zero_grad()
outputs = model(inputs)
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()

running_loss += loss.item()if(step +1) % PRINT_STEP ==0:
avg_loss = running_loss / PRINT_STEP
print(f"  Step [{step + 1}] - Loss: {avg_loss:.4f}")
running_loss =0.0val_acc = evaluate(model, valid_dataloader)
print(f"Validation Accuracy after epoch {epoch + 1}: {val_acc:.4f}")

```

---

恭喜你，成功训练了你的第一个卷积神经网络。

扫码请作者喝一杯咖啡来分享你的喜悦吧!

![zsm](../imgs/zsm.png)
