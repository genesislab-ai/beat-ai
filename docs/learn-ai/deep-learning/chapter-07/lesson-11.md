## 7.11用逻辑回归对Titanic数据进行训练

之前我们已经讲了逻辑回归的原理，以及如何在PyTorch里定义Dataset和DataLoader，如何在PyTorch里定义一个逻辑回归模型。这一节，我们就把它们组合起来，实现一个完整的在PyTorch里训练的代码。

### 7.11.1PyTorch里的优化器

之前我们手动实现多元线性回归时，我们自己对每个参数进行梯度计算，然后对每个参数根据学习率和梯度进行参数的更新。对于少量参数还可以，如果有几十亿参数需要你管理，那还是有不少工作的，另外我们之前学过的梯度更新算法还很简单，后边还有更负责的梯度更新策略。

为此PyTorch里专门提取出了优化器（Optimizer）类，它主要有以下的功能：

- 管理参数，对参数进行更新。

- 封装对参数进行梯度更新的算法。

- 提供在训练过程中管理学习率的接口。

我们之前学习的最基本的梯度下降的算法，对应PyTorch里的`torch.optim.SGD`优化器。我们之前讲SGD是随机梯度下降，每次只用一个样本的loss计算梯度，更新模型参数。这是严格的定义，但是PyTorch里的SGD优化器并没有要求只能利用一条数据计算loss。

使用SGD优化器的伪代码如下：

```
## 定义优化器，传入模型的参数，并且设置固定的学习率optimizer = torch.optim.SGD(model.parameters(), lr=0.1)forepochinrange(epochs):forfeatures,labelsinDataLoader(myDataset, batch_size=256):
optimizer.zero_grad()##优化器清理管理参数的梯度值。loss = forward_and_compute_loss(features, labels)##前向传播并计算lossloss.backward()##loss反向传播,每个参数计算梯度optimizer.step()##优化器进行参数更新

```

上边的代码中`optimizer.zero_grad()`你可能会疑惑，这里做一下解释。每个可训练的参数都有一个关联的梯度值。每次loss的后向传播时，新计算的梯度值都会累加在原来每个参数的梯度上。直到调用`optimizer.zero_grad()`，才会将这个优化器管理的参数对应的梯度值设置为0。

在每一个训练的step里：

- optimizer把自己管理参数的梯度值都置为0。

- 模型前向传播，计算loss。

- loss反向传播，计算出每个参数的梯度值。

- optimizer根据每个参数的梯度值，和优化器算法，学习率来更新参数。

### 7.11.2数据集的划分

Titanic这份数据集源自Kaggle的竞赛数据。你下载的数据集里有train.csv, test.csv, gender_submission.csv，其中trian.csv是训练数据集，test.csv是测试数据集，其中只有feature，不包含Label。其中gender_submission.csv是一份示例的提交Kaggle网站的文件。其中的值并不是test.csv里样本的真实Label值。

train.csv里有891条数据，我们用前800条数据作为训练集，放入train.csv文件。后91条数据作为验证集，放入validation.csv文件，这里需要你手动构建validation数据集。

### 7.11.3Titanic逻辑回归代码

我们来完整实现一下对Titanic数据进行逻辑回归模型训练。

```
fromtorch.utils.dataimportDataset, DataLoaderimporttorchimporttorch.nnasnnimportpandasaspdclassLogisticRegressionModel(nn.Module):def__init__(self, input_dim):super().__init__()
self.linear = nn.Linear(input_dim,1)# nn.Linear也继承自nn.Module，输入为input_dim,输出一个值defforward(self, x):returntorch.sigmoid(self.linear(x))# Logistic Regression 输出概率classTitanicDataset(Dataset):def__init__(self, file_path):self.file_path = file_path
self.mean = {"Pclass":2.236695,"Age":29.699118,"SibSp":0.512605,"Parch":0.431373,"Fare":34.694514,"Sex_female":0.365546,"Sex_male":0.634454,"Embarked_C":0.182073,"Embarked_Q":0.039216,"Embarked_S":0.775910}

self.std = {"Pclass":0.838250,"Age":14.526497,"SibSp":0.929783,"Parch":0.853289,"Fare":52.918930,"Sex_female":0.481921,"Sex_male":0.481921,"Embarked_C":0.386175,"Embarked_Q":0.194244,"Embarked_S":0.417274}

self.data = self._load_data()
self.feature_size = len(self.data.columns) -1def_load_data(self):df = pd.read_csv(self.file_path)
df = df.drop(columns=["PassengerId","Name","Ticket","Cabin"])##删除不用的列df = df.dropna(subset=["Age"])##删除Age有缺失的行df = pd.get_dummies(df, columns=["Sex","Embarked"], dtype=int)##进行one-hot编码##进行数据的标准化base_features = ["Pclass","Age","SibSp","Parch","Fare"]foriinrange(len(base_features)):
df[base_features[i]] = (df[base_features[i]] - self.mean[base_features[i]]) / self.std[base_features[i]]returndfdef__len__(self):returnlen(self.data)def__getitem__(self, idx):features = self.data.drop(columns=["Survived"]).iloc[idx].values
label = self.data["Survived"].iloc[idx]returntorch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.float32)

train_dataset = TitanicDataset(r"E:\电子书\RethinkFun深度学习\data\titanic\train.csv")
validation_dataset = TitanicDataset(r"E:\电子书\RethinkFun深度学习\data\titanic\validation.csv")

model = LogisticRegressionModel(train_dataset.feature_size)
model.to("cuda")
model.train()

optimizer = torch.optim.SGD(model.parameters(), lr=0.1)

epochs =100forepochinrange(epochs):
correct =0step =0total_loss =0forfeatures, labelsinDataLoader(train_dataset, batch_size=256, shuffle=True):
step +=1features = features.to("cuda")
labels = labels.to("cuda")
optimizer.zero_grad()
outputs = model(features).squeeze()
correct += torch.sum(((outputs >=0.5) == labels))
loss = torch.nn.functional.binary_cross_entropy(outputs, labels)
total_loss += loss.item()
loss.backward()
optimizer.step()
print(f'Epoch {epoch + 1}, Loss: {total_loss/step:.4f}')
print(f'Training Accuracy: {correct / len(train_dataset)}')

model.eval()withtorch.no_grad():
correct =0forfeatures, labelsinDataLoader(validation_dataset, batch_size=256):
features = features.to("cuda")
labels = labels.to("cuda")
outputs = model(features).squeeze()
correct += torch.sum(((outputs >=0.5) == labels))
print(f'Validation Accuracy: {correct / len(validation_dataset)}')

```

你可能会奇怪为什么需要通过`model.train()`把模型设置为训练模式，这是因为有的模型在训练时和预测时表现是不一样的。模型需要知道自己目前是在训练状态还是预测状态。逻辑回归模型在训练和预测状态下表现是一致的，后边我们学习到的批量归一化和Dropout模块它们在训练和预测是工作模式是不同的。到时我们再详细讨论。
经过训练，我们得到的结果在训练集上模型的正确率为0.80，在验证集上模型的正确率为0.83。可以看到我们模型目前没有过拟合，我们还可以尝试增加模型的复杂度，比如这里我们增加一些特征的二次项。

我们修改TitanicDataset代码如下：

```
classTitanicDataset(Dataset):def__init__(self, file_path):self.file_path = file_path
self.mean = {"Pclass":2.236695,"Age":29.699118,"SibSp":0.512605,"Parch":0.431373,"Fare":34.694514,"Sex_female":0.365546,"Sex_male":0.634454,"Embarked_C":0.182073,"Embarked_Q":0.039216,"Embarked_S":0.775910,"Pclass_Pclass":5.704482,"Pclass_Age":61.938151,"Pclass_SibSp":1.198880,"Pclass_Parch":0.983193,"Pclass_Fare":53.052327,"Pclass_Sex_female":0.754902,"Age_Age":1092.761169,"Age_SibSp":11.066415,"Age_Parch":10.470476,"Age_Fare":1104.142053,"Age_Sex_female":10.204482,"SibSp_SibSp":1.126050,"SibSp_Parch":0.525210,"SibSp_Fare":24.581262,"SibSp_Sex_female":0.233894,"Parch_Parch":0.913165,"Parch_Fare":24.215465,"Parch_Sex_female":0.259104,"Fare_Fare":4000.200255,"Fare_Sex_female":17.393698,"Sex_female_Sex_female":0.365546}

self.std = {"Pclass":0.838250,"Age":14.526497,"SibSp":0.929783,"Parch":0.853289,"Fare":52.918930,"Sex_female":0.481921,"Sex_male":0.481921,"Embarked_C":0.386175,"Embarked_Q":0.194244,"Embarked_S":0.417274,"Pclass_Pclass":3.447593,"Pclass_Age":34.379609,"Pclass_SibSp":2.603741,"Pclass_Parch":2.236945,"Pclass_Fare":52.407209,"Pclass_Sex_female":1.118572,"Age_Age":991.079188,"Age_SibSp":19.093099,"Age_Parch":29.164503,"Age_Fare":1949.356185,"Age_Sex_female":15.924481,"SibSp_SibSp":3.428831,"SibSp_Parch":1.561298,"SibSp_Fare":70.185369,"SibSp_Sex_female":0.639885,"Parch_Parch":3.008314,"Parch_Fare":77.207321,"Parch_Sex_female":0.729143,"Fare_Fare":19105.110593,"Fare_Sex_female":43.568303,"Sex_female_Sex_female":0.481921}

self.data = self._load_data()
self.feature_size = len(self.data.columns) -1def_load_data(self):df = pd.read_csv(self.file_path)
df = df.drop(columns=["PassengerId","Name","Ticket","Cabin"])
df = df.dropna(subset=["Age"])
df = pd.get_dummies(df, columns=["Sex","Embarked"], dtype=int)
base_features = ["Pclass","Age","SibSp","Parch","Fare","Sex_female"]foriinrange(len(base_features)):forjinrange(i, len(base_features)):
df[base_features[i] +"_"+ base_features[j]] = ((df[base_features[i]] * df[base_features[j]]
- self.mean[
base_features[i] +"_"+ base_features[j]])
/ self.std[base_features[i] +"_"+ base_features[j]])foriinrange(len(base_features)):
df[base_features[i]] = (df[base_features[i]] - self.mean[base_features[i]]) / self.std[base_features[i]]returndfdef__len__(self):returnlen(self.data)def__getitem__(self, idx):features = self.data.drop(columns=["Survived"]).iloc[idx].values
label = self.data["Survived"].iloc[idx]returntorch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.float32)

```

我们在上边的代码里增加了一些特征的二次项，并对这些新的特征也进行了标准化，然后我们再次训练模型，查看模型在训练集和验证集上的表现。训练结果为模型在训练集上正确率为0.82，在验证集上正确率为0.87。可以看到模型的性能有提升，而且没有发生过拟合。这很好，你可以继续尝试进一步增加模型的复杂度，比如增加模型的三次项。

---

这是你自己动手实现的第一个对真实数据进行训练和预测的模型，如果它开始工作了，扫码请作者喝一杯咖啡来分享你的喜悦。

![zsm](../imgs/zsm.png)
