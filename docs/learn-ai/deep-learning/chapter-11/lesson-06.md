## 11.6 ResNet实现

上一节我们介绍了ResNet的原理，这一节我们来讨论一些实现细节，最终给出完整的实现。

### 11.6.1 ResNet的整体架构

ResNet提供了ResNet-18，ResNet-34，ResNet-50，ResNet-101，ResNet-152等不同的版本。后边的数字代表不同的网络层数。

![1050.png](../imgs/1050.png)

上图是一个ResNet-18的整体架构。它分为6个**阶段**：Conv1-Conv5和Output阶段。Conv1-Conv5阶段内包含多个**残差模块（Residual Block）**。

**Conv1**

输入是224×224×3的图片。Conv1阶段首先对输入图片进行一个卷积操作，卷积核大小为7×7，输入通道数为3，64个卷积核，输出通道数为64，padding为3，stride为2。输出的特征图为112×112×64。这里是通过卷积步长设置为2来缩小特征图的尺寸。

**Conv2-Conv5**

可以看到Conv2-Conv5中，最重要的就是Residual Block了。后边我们会详细介绍。Conv2-Conv5，每一个阶段都有两个Residual Block。而且每次都是输出特征图的高和宽减半，通道数加倍。有一个细节不同：Conv2阶段是通过Max Poolling来减少特征图尺寸的，而Conv3-Conv5是通过卷积步长为2来减少特征图尺寸的。

**Output**

Output阶段，首先利用一个全局平均池化层来抽取特征，接着连接一个全连接层（fully connection，fc），再加softmax激活进行分类。

![1051.png](../imgs/1051.png)

上图是不同层数的ResNet的架构表格。通过观察可以看到：

- 它们都由6个阶段构成。Conv1-Conv5，output。

- 不论ResNet有几层，它们的conv1和output阶段都一样。

- ResNet-18，ResNet-34比较类似，只是不同阶段里边的Residual Block个数不同，但是每个阶段的Residual Block都是一样的。

- ResNet-50，ResNet-101，ResNet-152比较类似，也是每个阶段的Residual Block一样，只是个数不同。

### 11.6.2 Residual Block

下边我们就来详细看一下不同类型的Residual Block。
第一种是BasicBlock，用于ResNet-18，ResNet-34，由两个3x3卷积层组成。
第二种是Bottleneck，用于ResNet-50/101/152中使用，由一个1x1卷积层，一个3x3卷积层，一个1x1卷积层构成。

#### 11.6.2.1 BasicBlock

我们以ResNet-18为例，它的第二个阶段Conv2，由2个ResidualBlock构成，

![1052.png](../imgs/1052.png)

它的输入是Conv1的输出，特征图尺寸为 112×112×64。然后经过一个3×3的max poolling，padding=1，stride=2。输出特征图尺寸为56×56×64。

然后进入第一个Residual Block，经过64个3×3×64的卷积核，padding为1，stride为1，输出特征图的尺寸不变，还是56×56×64。然后进入Batch Norm，需要注意的是这里的Batch Norm是按通道进行的，因为每个通道代表一个不同的特征。上边我们讨论的是一张图片的特征图尺寸为56×56×64，在用批量数据进行训练时，tensor的shape就为：batch_size×56×56×64（在PyTorch里是batch_size×64×56×56）。其中56×56是高和宽，64是通道数。假如一个通道是检测眼睛这个特征的，那么在一个Batch里就有batch_size×56×56个代表眼睛的特征。需要在这么多个特征上计算均值和方差，然后进行标准化，再进行线性变化。一句话来说，在卷积网络里，进行Batch Norm，不仅考虑一个Batch里不同样本，还要考虑同一个通道上的不同高，宽位置上的特征。

接着下来对特征图里的每个特征按元素进行ReLU激活。然后进入下一个卷积层，输出特征图尺寸不变，接下来是Batch Norm。捷径连接时用这个Residual Blcok的输入特征图，和Batch Norm之后的特征图进行相加，然后求和结果进行ReLU，作为Conv2阶段第一个Residual Block的输出。然后再经过一个同样的Residual Block，得到Conv2的输出。需要注意：这里每个Residual Block第二个Batch Norm后的特征图可以和Residual Block的输入特征图直接相加，是因为它们的形状完全相同，都是56×56×64。

接着我们来看ResNet-18的第三个阶段Conv3，它也有2个个ResidualBlock构成。

![1053.png](../imgs/1053.png)

Conv3与Conv2有以下不同：

- Conv3第一个Residual Block里第一个3×3,128，p=1,s=2的卷积层实现了特征图高宽减半，通道数加倍的效果，输入特征图为56×56×64，输出特征图为28×28×128。

- 在整个Conv3里，剩下的3×3卷积层都是3×3,128，p=1，s=1。保持特征图尺寸一直不变：28×28×128。

- 因为第一个卷积层改变了特征图尺寸，导致输入和输出特征图尺寸不一致，这也让捷径连接产生了问题，因为两个特征图尺寸不同，不能直接相加。所以这里用了1×1,128，stride=2的卷积，同样对输入特征图进行高宽减半，通道数加倍的效果。经过这个1×1卷积后，就可以进行残差连接了。

>
> 你可能奇怪为什么1×1的卷积可以步长为2，那样不是就跳过大量的特征，这些特征就不参加运算吗？这是因为ResNet的设计哲学就是让捷径连接尽量不产生额外的计算量。让模型在加残差连接之前和之后，计算量差不多。但是残差连接必须保证特征图的长宽，以及通道数都一致才可以进行按位相加。而1×1的卷积，步长为2，是达到这一点(长宽减半，通道数加倍)计算量最小的实现。这里确实会丢失信息，但是信息还是主要靠主通道进行传递。

Conv4和Conv5都和Conv3一样，第一个3×3卷积实现特征图高宽减半，通道数翻倍，后边的3×3卷积都维持特征图尺寸不变，捷径连接用一个1×1，stride=2的卷积实现特征图尺寸的变化，然后进行连接。

下边我们给出BasicBlock的代码：

```
classBasicBlock(nn.Module):# Standard ResNet BasicBlock (v1).# 两个 3x3 卷积，每个卷积后跟 BN 和 ReLU。若输入输出维度不一致，则在捷径路径使用 1x1 卷积。expansion =1def__init__(self, in_channels, out_channels, stride=1, downsample=None):super(BasicBlock, self).__init__()# 第一个Residual Block的卷积层可能输入和输出通道数不一致：# 对于Conv2，第一个Residual Block的卷积层输入和输出通道数一致。# 对于Conv3-5的第一个Residual Block：输入输出通道数不一致，则stride设置为2，达到同时减半高宽，翻倍通道数。# 第二个Residual Block的卷积层输入和输出通道数一致，stride设置为1，保持特征图尺寸一致。self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=3, stride=stride,
padding=1, bias=False)
self.bn1 = nn.BatchNorm2d(out_channels)
self.relu = nn.ReLU(inplace=True)# 第二个卷积层的输入和输出通道数都是out_channels,stride=1,保证输入和输出特征图尺寸一致。self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=1,
padding=1, bias=False)
self.bn2 = nn.BatchNorm2d(out_channels)
self.downsample = downsampledefforward(self, x):identity = x

out = self.conv1(x)
out = self.bn1(out)
out = self.relu(out)

out = self.conv2(out)
out = self.bn2(out)# 如果输入和输出特征图尺寸不一致，需要调用stride=2的1×1卷积进行特征图尺寸的调节。ifself.downsampleisnotNone:
identity = self.downsample(x)

out += identity
out = self.relu(out)returnout

```

#### 11.6.2.2 Bottleneck

对于更深的ResNet，比如ResNet-50，ResNet-101，ResNet-152，它们都采用了Bottleneck结构的Residual Block。这样做是为了减少网络的计算量。正是因为采用了Bottleneck结构，ResNet-50的计算量几乎和ResNet-34的计算量相当。这样让训练更深层的卷积神经网络变得可以承受。
我们以ResNet-50的Conv2阶段，我们来分析它的3个Residual Block。

![1054.png](../imgs/1054.png)

从下到上，我们先看Residual Block1，它的输入特征图是经过max pooling之后的56×56×64。
然后经过1×1，64，stride=1的卷积层，特征图尺寸保持不变，然后经过3×3,64，stride=1的卷积层，特征图尺寸不变。然后再经过一个1×1,256，stride=1，这里特征图的高和宽不变，但通道数翻了4倍。所以捷径连接这里也需要用1×1,256，stride=1来保持特征图高宽不变，通道数翻4倍，变为256。最后再将两个同尺寸的特征图进行相加。

接下来我们看Residual Block2，它的输入特征图是56×56×256，然后第一个卷积层是1×1,64，stride=1。这个卷积层不改变特征图的高宽，但是大幅降低了通道数，正是因为这里通道数的降低，让下一层的卷积计算量大幅降低。因为通道数在这里大幅下降，所以叫做Bottleneck。接下来在64通道上进行3×3卷积，然后再接一个1×1,256，stride=1的卷积层将维度提升为256。这样保证了这个Residual Block2的输入和输出维度一致，所以可以直接进行捷径连接。

Residual Blcok3和Residual Block2完全一样，先降低通道，进行3×3卷积，然后提升通道数为256。

接着我们分析ResNet-50的Conv3阶段，它有4个Residual Block。

![1056.png](../imgs/1056.png)

Conv3阶段的Residual Block1的输入特征图是56×56×256。
第一个卷积层通过1×1卷积，降低通道数为128。
第二个3×3卷积层通过步长为2，对特征图的高宽进行减半，通道数不变。
第三个卷积层通过1×1卷积，提高通道数为512。
Residual Block1的整体效果为对输入特征图高宽减半，通道数加倍。所以捷径连接这里需要一个1×1卷积来调整特征图高宽和通道数，才能进行特征图的按元素相加。

Residual Block2的输入特征图是28×28×512。
第一个卷积层通过1×1卷积，降低通道数为128。
第二个3×3卷积不改变特征图尺寸。
第三个卷积层通过1×1卷积，恢复到输入特征图尺寸。
Residual Block2在内部先降低通道数，进行3×3卷积，再恢复通道数，整体不改变特征图尺寸，所以捷径连接可以直接相连。

Residual Block3,4 和Residual Block2完全一致。先通过1×1卷积层降低特征通道数，然后进行3×3卷积，最后再利用1×1卷积恢复通道数，保证输入和输出的特征图shape完全一致。

Conv4，Conv5阶段和Conv3阶段原理一致。都是通过第一个Residual Block完成特征图高宽减半，通道数翻倍。后边的Residual Block内部先降低特征图尺寸，进行卷积计算，再恢复特征图通道数，整体不改变特征尺寸。

最终ResNet50的架构图如下：

![1055.png](../imgs/1055.png)

下边我们给出Bottleneck类型的Residual Block的实现代码：

```
classBottleneck(nn.Module):# Bottleneck block for deeper ResNet (v1).# 使用 1x1 降维 -> 3x3 卷积 -> 1x1 恢复通道数。expansion =4def__init__(self, in_channels, out_channels, stride=1, downsample=None):super(Bottleneck, self).__init__()
mid_channels = out_channels
self.conv1 = nn.Conv2d(in_channels, mid_channels, kernel_size=1, bias=False)
self.bn1 = nn.BatchNorm2d(mid_channels)
self.conv2 = nn.Conv2d(mid_channels, mid_channels, kernel_size=3,
stride=stride, padding=1, bias=False)
self.bn2 = nn.BatchNorm2d(mid_channels)
self.conv3 = nn.Conv2d(mid_channels, out_channels * self.expansion,
kernel_size=1, bias=False)
self.bn3 = nn.BatchNorm2d(out_channels * self.expansion)
self.relu = nn.ReLU(inplace=True)
self.downsample = downsampledefforward(self, x):identity = x

out = self.conv1(x)
out = self.bn1(out)
out = self.relu(out)

out = self.conv2(out)
out = self.bn2(out)
out = self.relu(out)

out = self.conv3(out)
out = self.bn3(out)ifself.downsampleisnotNone:
identity = self.downsample(x)

out += identity
out = self.relu(out)returnout

```

最后我们给出构建ResNet的代码：

```
classResNet(nn.Module):def__init__(self, block, layers, num_classes=1000):super(ResNet, self).__init__()
self.in_channels =64self.conv1 = nn.Conv2d(3,64, kernel_size=7, stride=2, padding=3, bias=False)
self.bn1 = nn.BatchNorm2d(64)
self.relu = nn.ReLU(inplace=True)
self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

self.layer1 = self._make_layer(block,64, layers[0])
self.layer2 = self._make_layer(block,128, layers[1], stride=2)
self.layer3 = self._make_layer(block,256, layers[2], stride=2)
self.layer4 = self._make_layer(block,512, layers[3], stride=2)

self.avgpool = nn.AdaptiveAvgPool2d((1,1))
self.fc = nn.Linear(512* block.expansion, num_classes)def_make_layer(self, block, out_channels, blocks, stride=1):downsample =Noneifstride !=1orself.in_channels != out_channels * block.expansion:
downsample = nn.Sequential(
nn.Conv2d(self.in_channels, out_channels * block.expansion,
kernel_size=1, stride=stride, bias=False),
nn.BatchNorm2d(out_channels * block.expansion),
)

layers = [block(self.in_channels, out_channels, stride, downsample)]
self.in_channels = out_channels * block.expansionfor_inrange(1, blocks):
layers.append(block(self.in_channels, out_channels))returnnn.Sequential(*layers)defforward(self, x):x = self.conv1(x)
x = self.bn1(x)
x = self.relu(x)
x = self.maxpool(x)

x = self.layer1(x)
x = self.layer2(x)
x = self.layer3(x)
x = self.layer4(x)

x = self.avgpool(x)
x = torch.flatten(x,1)
x = self.fc(x)returnxdefres_net50(num_classes=1000):returnResNet(Bottleneck, [3,4,6,3], num_classes=num_classes)defres_net18(num_classes=1000):returnResNet(BasicBlock, [2,2,2,2], num_classes=num_classes)# 测试模型构建与前向传播if__name__ =='__main__':# resnet18 = res_net18(num_classes=1000)# print(resnet18)resnet50 = res_net50(num_classes=1000)
print(resnet50)

```

---

恭喜你，你已经掌握了可以说是卷积神经网络中最著名的ResNet的原理和实现。

扫码请作者喝一杯咖啡来分享你的喜悦吧!

![zsm](../imgs/zsm.png)
