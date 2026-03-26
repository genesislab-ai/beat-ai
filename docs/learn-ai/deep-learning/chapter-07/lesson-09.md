## 7.9PyTorch里的Dataset和DataLoader

在深度学习项目中，数据处理是非常重要的一环，PyTorch提供这两个类来帮助用户高效地加载和处理数据。Dataset负责数据的读取和预处理，而DataLoader则负责将数据分成小批量，支持多线程加速，以及数据的打乱等。本节，我们就以Titanic数据集为例，讲解如何使用PyTorch里的Dataset和DataLoader类来处理数据。

### 7.9.1Dataset

Dataset类提供对数据集的抽象，任何自定义数据集都需要继承`torch.utils.data.Dataset`,并实现两个方法：`__len__`和`__getitem__(idx)`。其中`__len__`需要返回整个数据集样本的个数。`__getitem__(idx)`需要能根据样本的index返回具体的样本。

另外一般情况下，我们也把对数据的预处理工作放在自定义的Dataset类定义里。

接下来我们就来看一下对于Titanic数据集，我们的自定义Dataset类怎么实现，具体代码如下：

```
fromtorch.utils.dataimportDatasetimportpandasaspdimporttorchclassTitanicDataset(Dataset):def__init__(self, file_path):self.file_path = file_path
self.mean = {"Pclass":2.236695,"Age":29.699118,"SibSp":0.512605,"Parch":0.431373,"Fare":34.694514,"Sex_female":0.365546,"Sex_male":0.634454,"Embarked_C":0.182073,"Embarked_Q":0.039216,"Embarked_S":0.775910}

self.std = {"Pclass":0.838250,"Age":14.526497,"SibSp":0.929783,"Parch":0.853289,"Fare":52.918930,"Sex_female":0.481921,"Sex_male":0.481921,"Embarked_C":0.386175,"Embarked_Q":0.194244,"Embarked_S":0.417274}

self.data = self._load_data()
self.feature_size = len(self.data.columns) -1def_load_data(self):df = pd.read_csv(self.file_path)
df = df.drop(columns=["PassengerId","Name","Ticket","Cabin"])##删除不用的列df = df.dropna(subset=["Age"])##删除Age有缺失的行df = pd.get_dummies(df, columns=["Sex","Embarked"], dtype=int)##进行one-hot编码##进行数据的标准化base_features = ["Pclass","Age","SibSp","Parch","Fare"]foriinrange(len(base_features)):
df[base_features[i]] = (df[base_features[i]] - self.mean[base_features[i]]) / self.std[base_features[i]]returndfdef__len__(self):returnlen(self.data)def__getitem__(self, idx):features = self.data.drop(columns=["Survived"]).iloc[idx].values
label = self.data["Survived"].iloc[idx]returntorch.tensor(features, dtype=torch.float32), torch.tensor(label, dtype=torch.float32)

```

可以看到我们自定义了一个`Dataset`类：`TitanicDataset`。其中定义了一个方法`_load_data`，它负责加载数据，并且对数据进行预处理，以及标准化。

另外继承自Dataset类则必须实现的`__len__`和`__getitem__`我们也进行了对应的实现。这样我们的TitanicDataset就是一个合格的PyTorch里的`Dataset`了。

### 7.9.2DataLoader

一般情况下，我们不需要自定义DataLoader。PyTorch里默认实现的DataLoader就可以满足我们的使用，它定义了如何批量读取数据的功能。比如你可以通过batch*size设置每次读取数据的大小，通过shuffle参数设置是否对数据集进行打乱。另外如果你的Dataset的`*_getitem__`比较费时，你可以通过num_workers参数指定多进程加载。

```
fromtorch.utils.dataimportDataLoader

dataset = TitanicDataset(r"E:\电子书\RethinkFun深度学习\data\titanic\train.csv")
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)forinputs, labelsindataloader:
print(inputs.shape, labels.shape)break

```

输出为：

```
torch.Size([32, 10]) torch.Size([32])

```
