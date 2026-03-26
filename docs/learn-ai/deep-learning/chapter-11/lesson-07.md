## 11.7 迁移学习

回想你第一次学骑自行车的经历：想必经历过不少磕碰，花费了不少时间才掌握平衡。但你会发现，一旦学会了骑自行车，再去学骑电动车就容易多了。这种学习速度的显著提升，正是你在不知不觉中运用了**迁移学习**的原理。

![1101.png](../imgs/1101.png)

### 11.7.1 什么是迁移学习

迁移学习的核心思想是：将在一个任务（源任务）中获得的知识或能力，有效地应用到另一个相关但不同的任务（目标任务）中。例如，从骑自行车中习得的保持平衡和转向控制能力，可以直接迁移到学习骑电动车上。这种能力的迁移能够大幅缩短学习新任务所需的时间。

### 11.7.2 神经网络中的迁移学习

之前我们了解到，神经网络的浅层通常学习基础的通用特征（如线条、纹理），而深层则学习更抽象、更与任务相关的高级特征。最终，这些特征会输入一个由线性层和激活函数（Sigmoid/Softmax）构成的分类器（称为"分类头"）进行图像分类。

假设我们已经在ImageNet的海量数据上训练了一个ResNet模型来完成1000类图像分类任务。现在，我们需要为一家面包店开发一个面包种类识别的视觉模型。这时，迁移学习就能大显身手：

![1102.png](../imgs/1102.png)

- **加载预训练模型**：获取已在ImageNet上训练好的ResNet模型及其权重。

- **冻结特征提取层**：锁定ResNet中负责特征提取的层（通常是除了最后的分类层之外的所有层），使其参数在后续训练中保持不变。

- **替换分类头**：移除ResNet原有的1000类分类层，根据面包分类任务的需求（例如，10种面包），创建一个新的、随机初始化的分类层。

- **微调新分类头**：使用标注好的面包图像数据集进行训练。在训练过程中，**只更新新添加的分类层的参数**，而预训练的特征提取层参数保持冻结。

通过这种方式，我们就能利用在ImageNet上学到的强大特征提取能力，即使只使用少量标注的面包数据，也能快速训练出一个性能不错的面包分类模型。

### 11.7.3 迁移学习的一般原则与策略

迁移学习的核心流程是：首先在一个具有**大量标注数据**的数据集（如ImageNet）上训练一个**基础模型（预训练模型）**。然后，根据目标任务的特点和数据量，采取不同的迁移策略：

- **任务相关性是关键**：新任务（目标任务）必须与预训练模型的源任务（如ImageNet分类）**领域相近**。任务越相似，迁移学习的效果通常越好。

- **策略取决于目标数据量**：

- **数据量很少（如几百张）**：仅替换预训练模型的最后一层（分类头），创建一个新的、适应目标类别数的分类层。**冻结**网络中除新分类层外的**所有参数**。训练时**只更新新分类层的参数**。使用**较小的学习率**（如1e-4, 1e-5）。

- **数据量适中（如几千张）**：替换分类头。同时，**解冻**预训练模型**靠近输出端的最后几层**（例如ResNet的`layer4`）。训练时，允许这些解冻层的参数以及新分类头的参数一起更新。其他层参数保持冻结。学习率设置仍需谨慎。

- **数据量较大（如几万张或更多）**：替换分类头，并允许**整个网络的参数（包括预训练部分）**在目标数据集上进行更新（微调）。此时可以使用稍大的学习率（但仍通常小于从头训练的学习率），或采用学习率衰减策略。

**为什么主要替换最后一层？**

- **分类需求不同**：预训练模型的最后一层（分类头）的神经元数量与源任务的类别数（如ImageNet的1000类）严格对应。新任务的类别数几乎必然不同，因此必须创建一个新的、尺寸匹配的分类层。

- **特征组合不同**：即使新旧任务的类别数巧合地相同（例如都是2类），其分类的具体语义也完全不同。例如，源任务是区分狗的"公/母"（性别），新任务是区分"金毛/哈士奇"（品种）。最后一层负责将高级特征组合映射到具体类别，这种组合关系因任务而异，保留原参数没有意义，重新初始化更优。

- **特征通用性**：网络的浅层和中间层学习到的特征（边缘、纹理、基本形状、物体部件）通常是**通用**的，与最终的具体分类任务关联较弱。这些特征对许多视觉任务都有价值，因此在数据不足时，冻结这些层可以保留其强大的通用特征提取能力，避免在小数据集上过拟合。

### 11.7.4 用PyTorch进行迁移学习

只更换分类头：

```
fromtorchvisionimportmodels

model = models.resnet18(pretrained=True)# 加载 ImageNet 预训练权重forparaminmodel.parameters():
param.requires_grad =False# 冻结所有层in_features = model.fc.in_features
model.fc = nn.Linear(in_features,1)# 新生成一个二分类头

```

更换分类头同时解冻第四阶段的参数：

```
model = models.resnet18(pretrained=True)# 加载 ImageNet 预训练权重forparaminmodel.parameters():
param.requires_grad =False# 冻结所有层# 解冻第四阶段的参数（最后一个残差模块）forparaminmodel.layer4.parameters():
param.requires_grad =Truein_features = model.fc.in_features
model.fc = nn.Linear(in_features,1)# 二分类

```

你可以用上边的代码去重新训练我们之前的猫狗分类模型，利用强大的ResNet和迁移学习，模型精度可以大幅提升。下边是利用迁移学习进行猫狗分类的代码：

```
importtorchvision.modelsfromtorch.utils.dataimportDataset, DataLoaderfromPILimportImageimportrandomimporttorchfromtorchvisionimporttransforms, modelsimporttorch.nnasnnimportos

torchvision.models.resnet18()defverify_images(image_folder):classes = ["Cat","Dog"]
class_to_idx = {"Cat":0,"Dog":1}
samples = []forcls_nameinclasses:
cls_dir = os.path.join(image_folder, cls_name)forfnameinos.listdir(cls_dir):ifnotfname.lower().endswith(('.jpg','.jpeg','.png')):continuepath = os.path.join(cls_dir, fname)try:withImage.open(path)asimg:
img.verify()
samples.append((path, class_to_idx[cls_name]))exceptException:
print(f"Warning: Skipping corrupted image {path}")returnsamplesclassImageDataset(Dataset):def__init__(self, samples, transform=None):self.samples = samples
self.transform = transformdef__len__(self):returnlen(self.samples)def__getitem__(self, idx):path, label = self.samples[idx]withImage.open(path)asimg:
img = img.convert('RGB')ifself.transform:
img = self.transform(img)returnimg, labeldefevaluate(model, test_dataloader):model.eval()
val_correct =0val_total =0withtorch.no_grad():forinputs, labelsintest_dataloader:
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

outputs = torch.sigmoid(model(inputs))
preds = (outputs >0.5).float()
val_correct += (preds == labels).sum().item()
val_total += labels.size(0)

val_acc = val_correct / val_totalreturnval_accif__name__ =="__main__":
DATA_DIR =r"E:\电子书\RethinkFun深度学习\data\PetImages"BATCH_SIZE =64IMG_SIZE =128EPOCHS =15LR =0.001PRINT_STEP =100DEVICE = torch.device("cuda"iftorch.cuda.is_available()else"cpu")

all_samples = verify_images(DATA_DIR)
random.seed(42)
random.shuffle(all_samples)
train_size = int(len(all_samples) *0.8)
train_samples = all_samples[:train_size]
valid_samples = all_samples[train_size:]

train_transform = transforms.Compose([
transforms.Resize((150,150)),
transforms.RandomCrop(size=(IMG_SIZE, IMG_SIZE)),
transforms.RandomHorizontalFlip(p=0.5),
transforms.ColorJitter(
brightness=0.2,
contrast=0.2,# saturation=0.2,# hue=0.1),#transforms.RandomRotation(degrees=30),transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

valid_transform = transforms.Compose([
transforms.Resize((IMG_SIZE, IMG_SIZE)),
transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

train_dataset = ImageDataset(train_samples, train_transform)
valid_dataset = ImageDataset(valid_samples, valid_transform)

train_dataloader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
valid_dataloader = DataLoader(valid_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)
model = models.resnet18(pretrained=True)# 加载 ImageNet 预训练权重forparaminmodel.parameters():
param.requires_grad =False# 冻结所有层# 解冻第四阶段的参数（最后一个残差模块）forparaminmodel.layer4.parameters():
param.requires_grad =Truein_features = model.fc.in_features
model.fc = nn.Linear(in_features,1)# 二分类model = model.to(DEVICE)

criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)forepochinrange(EPOCHS):
print(f"\nEpoch {epoch + 1}/{EPOCHS}")
model.train()
running_loss =0.0forstep, (inputs, labels)inenumerate(train_dataloader):
inputs = inputs.to(DEVICE)
labels = labels.float().unsqueeze(1).to(DEVICE)

optimizer.zero_grad()
outputs = torch.sigmoid(model(inputs))
loss = criterion(outputs, labels)
loss.backward()
optimizer.step()

running_loss += loss.item()if(step +1) % PRINT_STEP ==0:
avg_loss = running_loss / PRINT_STEP
print(f"  Step [{step + 1}] - Loss: {avg_loss:.4f}")
running_loss =0.0val_acc = evaluate(model, valid_dataloader)
print(f"Validation Accuracy after epoch {epoch + 1}: {val_acc:.4f}")

```
