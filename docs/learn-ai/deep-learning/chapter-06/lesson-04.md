## 6.4Tensor

Tensor可以说是PyTorch里最重要的概念，PyTorch把对数据的存储和操作都封装在Tensor里。PyTorch里的模型训练的输入输出数据，模型的参数，都是用Tensor来表示的。Tensor在操作方面和NumPy的ndarray是非常类似的。不同的是Tensor还实现了像GPU计算加速，自动求导等PyTorch的核心功能。

### 6.4.1 Tensor是多维数组

Tensor是PyTorch里对多维数组的表示。可以用它来表示：

**标量（0维）**：单个数，比如`torch.tensor(3.14)`

**向量（1维）**：一列数，比如`torch.tensor([1,2,3])`

**矩阵（2维）**：行列数据，比如`torch.tensor([[1,2],[3,4]])`

**高维张量（3维及以上）**：高维数据，比如`torch.tensor([[[1,2],[3,4]],[[5,6],[7,8]]])`

### 6.4.2 创建一个Tensor

最常见的创建一个tensor的方法是通过`torch.tensor()`方法来创建。这个方法的输入有一个data参数，是必填的参数。它可以是Python里的标量（int，float），也可以是Python里的list、tuple，另外PyTorch也支持用NumPy的ndarray来创建一个tensor。

```
importtorchimportnumpyasnp# 1D Tensort1 = torch.tensor([1,2,3])
print(t1)# 2D Tensort2 = torch.tensor([[1,2,3], [4,5,6]])
print(t2)# 3D Tensort3 = torch.tensor([[[1,2], [3,4]], [[5,6], [7,8]]])
print(t3)# 从 NumPy 创建 Tensorarr = np.array([1,2,3])
t_np = torch.tensor(arr)
print(t_np)

```

在创建tensor时，PyTorch会根据你传入的数据，自动推断tensor的类型，当然，你也可以自己指定类型。比如：

```
importtorch
t1 = torch.tensor((2,2),dtype=torch.float32)
print(t1)

```

PyTorch里的数据类型，主要为：

**整数型**torch.uint8、torch.int32、torch.int64。其中torch.int64为默认的整数类型。

**浮点型**torch.float16、torch.bfloat16、 torch.float32、torch.float64，其中torch.float32为默认的浮点数据类型。

**布尔型**torch.bool

在PyTorch里使用最广泛的就是浮点型tensor。其中torch.float32称为全精度，torch.float16/torch.bfloat16称为半精度。一般情况下模型的训练是在全精度下进行的。如果采用混合精度训练的话，会在某些计算过程中采用半精度计算。混合精度计算会节省显存占用以及提升训练速度。

PyTorch里没有字符串类型，因为Tensor主要关注于数值计算，并不需要支持字符串类型。

Bool类型在PyTorch里可以进行高效的索引选择，所以PyTorch支持Bool类型。比如Bool类型tensor进行索引操作示例如下：

```
x = torch.tensor([1,2,3,4,5])
mask = x >2# 生成一个布尔掩码print(mask)# tensor([False, False,  True,  True,  True])# 用布尔掩码选出大于 2 的值filtered_x = x[mask]
print(filtered_x)# tensor([3, 4, 5])# 用布尔掩码选出大于 2 的值,并赋值为0x[mask]=0print(x)# tensor([1, 2, 0, 0, 0])

```

在创建tensor时，你还可以指定tensor的设备。如果你不指定，默认是在CPU/内存上。如果你想创建一个GPU/显存上的tensor。可以通过把device关键字设定为“cuda”来指定。

```
t_gpu = torch.tensor([1,2,3],device="cuda")

```

你也可以创建一个用指定值或者随机值填充的tensor。同时你可以指定这个tensor的形状。

```
shape = (2,3)
rand_tensor = torch.rand(shape)# 生成一个从[0,1]均匀抽样的tensor。randn_tensor = torch.randn(shape)# 生成一个从标准正态分布抽样的tensor。ones_tensor = torch.ones(shape)#生成一个值全为1的tensor。zeros_tensor = torch.zeros(shape)# 生成一个值全为0的tensor。twos_tensor = torch.full(shape,2)#  生成一个值全为2的tensor。

```

### 6.4.3 Tensor的属性

通过上边的学习，我们知道一个tensor有几个常用的关键属性，第一个是tensor的形状，第二个是tensor内元素的类型，第三个是tensor的设备。我们可以通过以下方法来查看：

```
tensor = torch.rand(3,4)

print(f"Shape of tensor: {tensor.shape}")
print(f"Datatype of tensor: {tensor.dtype}")
print(f"Device tensor is stored on: {tensor.device}")

```

除此之外，tensor还有一个重要属性，`requires_grad`是否需要计算梯度，在下一节我们会详细讲。你可以通过`tensor.requires_grad`来查看。

### 6.4.4 Tensor的操作

**形状变换**

在对Tensor进行操作的过程中，我们经常要对tensor进行形状的改变。这里我们介绍常用的一些操作。

```
x = torch.randn(4,4)#  生成一个形状为4x4的随机矩阵。x = x.reshape(2,8)# 通过reshape操作，可以将4x4的矩阵改变为2x8的矩阵。

```

上边通过reshape操作将4x4的矩阵改变为2x8的矩阵。你也可以将这个矩阵改为1x16的矩阵，只要元素个数一致就可以。

你可以通过permute函数来交换tensor的维度（转置），需要注意的是它的作用与reshape不同，reshape是按元素顺序重新组织维度，permute会改变元素的顺序。

```
x = torch.tensor([[1,2,3], [4,5,6]])
x_reshape = x.reshape(3,2)
x_transpose = x.permute(1,0)#交换第0个和第1个维度。对于二维矩阵就是行列互换，进行转置。print("reshape:",x_reshape)
print("permute:",x_transpose)

```

输出如下：

```
reshape: tensor([[1, 2],
[3, 4],
[5, 6]])
permute: tensor([[1, 4],
[2, 5],
[3, 6]])

```

对于二维tensor，你可以调用`tensor.t()`方法进行转置操作。
有时，需要扩展tensor的维度，可以使用unsqueeze函数。

```
x = torch.tensor([[1,2,3],[4,5,6]])#扩展第0维x_0 = x.unsqueeze(0)
print(x_0.shape,x_0)#扩展第1维x_1 = x.unsqueeze(1)
print(x_1.shape,x_1)#扩展第2维x_2 = x.unsqueeze(2)
print(x_2.shape,x_2)

```

输出为：

```
torch.Size([1, 2, 3]) tensor([[[1, 2, 3],
[4, 5, 6]]])
torch.Size([2, 1, 3]) tensor([[[1, 2, 3]],

[[4, 5, 6]]])
torch.Size([2, 3, 1]) tensor([[[1],
[2],
[3]],

[[4],
[5],
[6]]])

```

你可以使用tensor的squeeze方法来缩减tensor的大小为1的维度。你可以指定需要缩减的维度索引，如果不指定，则会缩减所有大小为1的维度。

```
x = torch.ones((1,1,3))
print(x.shape, x)
y = x.squeeze(dim=0)
print(y.shape, y)
z = x.squeeze()
print(z.shape, z)

```

输出为：

```
torch.Size([1, 1, 3]) tensor([[[1., 1., 1.]]])
torch.Size([1, 3]) tensor([[1., 1., 1.]])
torch.Size([3]) tensor([1., 1., 1.])

```

**数学运算**

```
a = torch.ones((2,3))
b = torch.ones((2,3))

print(a + b)# 加法print(a - b)# 减法print(a * b)# 逐元素乘法print(a / b)# 逐元素除法print(a @ b.t())# 矩阵乘法

```

输出为：

```
tensor([[2., 2., 2.],
[2., 2., 2.]])
tensor([[0., 0., 0.],
[0., 0., 0.]])
tensor([[1., 1., 1.],
[1., 1., 1.]])
tensor([[1., 1., 1.],
[1., 1., 1.]])
tensor([[3., 3.],
[3., 3.]])

```

**统计函数**

一个tensor中包含多个元素，对这些元素可以进行统计操作。比如通过`tensor.sum()`求和，通过`tensor.mean()`求均值，通过`tensor.std()`求标准差，通过`tensor.min()`求最小值等。

以计算均值为例，对于一个3x2的tensor，我们可以整体求均值，也可以统计每一行的均值，或者每一列的均值。

Tensor对整体所有元素进行统计，比如求均值没有什么问题，但是Tensor按不同维度进行统计时，却和我们一般直觉是不同的。我们看个例子。

对于下边这个tensor，t1，它的shape为(3,2)。

$$
t1=\begin{bmatrix} 1 & 3\\ 1 & 3\\ 1 & 3 \end{bmatrix}
$$

我们调用`t1.mean(dim=0)`，就是针对第0个维度求均值，第0个维度是行，第1个维度是列，那么你认为结果是什么呢？

你可能认为是每行求一个均值，最终结果为：

$$
mean=\begin{bmatrix} 2\\ 2\\ 2 \end{bmatrix}
$$

但实际结果是：

$$
mean=\begin{bmatrix} 1&3 \end{bmatrix}
$$

原因是Tensor指定统计的维度，意味着要“消灭”这个维度。比如指定`dim=0`意味着，统计结果要“消灭”行这个维度，各个列的值在不同行上进行统计。

同理，对于`t1.mean(dim=1)`，意味着要对不同的行，在列上进行统计，最终“消灭”列这个维度。结果为：

$$
mean=\begin{bmatrix} 2\\ 2\\ 2 \end{bmatrix}
$$

另外，对于上边t1这个tensor而言，本来shape为(3,2)，`t1.mean(dim=0)`结果的shape为(2,)，也就是有本来的2维tensor，“消灭”了行的维度，变为1维tensor，这个维度为列的维度数:2。`t1.mean(dim=1)`结果的shape为(3,)，原本2维tensor，“消灭”了列的维度，变为1维tensor，这个维度为行的维度数:3。

如果你想让tensor对某一维度进行统计后，保持原来的维度不变，不会“消灭”统计的维度。你可以指定参数`keepdim=True`。`t1.mean(dim=0,keepdim=True)`结果的shape为(1,2)，`t1.mean(dim=1,keepdim=True)`结果的shape为(3,1)。

具体代码如下：

```
import torch

t = torch.tensor([[1.0, 3.0], [1.0, 3.0], [1.0, 3.0]])

mean = t.mean()
print("mean:", mean)

mean = t.mean(dim=0)
print("mean on dim 0:", mean)

mean = t.mean(dim=0, keepdim=True)
print("keepdim:", mean)

```

输出为：

```
mean: tensor(2.)
mean on dim 0: tensor([1., 3.])
keepdim: tensor([[1., 3.]])

```

**索引和切片**

和python里的序列数据类似，tensor也支持索引和切片操作。

```
x = torch.tensor([[1,2,3], [4,5,6]])
print(x[0,1])# 访问第一行第二个元素print(x[:,1])# 访问第二列print(x[1, :])# 访问第二行print(x[:, :2])# 访问前两列

```

**广播机制**

原则上来说，tensor的所有的逐元素运算都要求两个tensor的形状必须完全一致。比如对于tensorA和tensorB进行逐元素计算，只有tensorA的形状与tensorB的形状完全一致。才能保证tensorA的每个元素都有与之对应的tensorB的元素来进行计算。

但在实际中，假如我们有一个tensor：t1。t1的shape为（3，2）。我们想给t1的每个元素都加上1。此时我们不必构造一个shape为（3,2），元素全为1的tensor再进行相加。我们可以直接写 t1 +1，PyTorch内部会虚拟扩展出一个形状为（3,2）的tensor，再和t1相加。这种机制，就是广播机制。需要注意的是，PyTorch 在进行广播计算时，并不会真的复制数据，而是通过调整张量的索引方式（Strided Memory Access）来实现逐元素计算。从而节省大量的存储，提高计算效率。示例代码如下：

```
t1 = torch.randn((3,2))
print(t1)
t2 = t1 +1# 广播机制print(t2)

```

更进一步，假如我们有两个tensor： t1，t2。其中t1的shape为（3,2），t2的shape为（2，）也是可以对t1和t2进行按位计算的。这里的逻辑是t1有3行2列数据。t2只有2个元素。先将t2转化为1行2列的元素，然后再虚拟复制到3行2列。最后进行按位操作。示例代码如下：

```
t1 = torch.ones((3,2))
t2 = torch.ones(2)

t3 = t1 + t2# 广播机制print(t1)
print(t2)
print(t3)

```

输出为：

```
tensor([[1., 1.],
[1., 1.],
[1., 1.]])
tensor([1., 1.])
tensor([[2., 2.],
[2., 2.],
[2., 2.]])

```

广播机制的一般原则是：

#### 一. 维度对齐

先检查两个tensor的形状，如果它们的维度个数不同，在短的那个前边补1，使它们的维度个数相同。
比如对tensor t1和t2进行加法：

**例1：**

t1的shape为（3,2,2）

t2是个标量，shape为空。

则通过reshape将t2的shape调整为（1,1,1）

**例2：**

t1的shape为（2,2）

t2的shape为（3,2,2）

则通过reshape将t1的shape调整为（1,2,2）

**例3：**

t1的shape为（3,1）

t2的shape为（1,4）

t1和t2都有2个维度，不需要进行维度对齐。

**例4：**

t1的shape为（3,2）

t2的shape为（1,3）

t1和t2都有2个维度，不需要进行维度对齐。

#### 二. 扩展维度

在维度值为1的维度上，通过虚拟复制，让两个tensor的维度值相等。
对于上一步维度对齐后的例子分别有：

**例1：**

t1的shape为（3,2,2）

t2的shape为（1,1,1）

扩展t2的维度为（3,2,2）

**例2：**

t1的shape为（1,2,2）

t2的shape为（3,2,2）

扩展t1的维度为（3,2,2）

**例3：**

t1的shape为（3,1）

t2的shape为（1,4）

扩展t1的维度为（3,4）扩展t2的维度为（3,4）

**例4：**

t1的shape为（3,2）

t2的shape为（1,3）

因为t1和t2最后一个维度不同，且都不为1，无法进行扩展。所以无法进行广播，无法进行按位计算。

#### 三. 进行按位计算

需要特别注意的是，扩展维度时会对两个tensor的每个维度的维度值进行检查，如果在某个维度上两个tensor的维度值不同，那么必须有一个tensor在这个维度的维度值是1，否则广播就会失败，整个计算就失败。

### 6.4.5利用GPU加速计算

在GPU上进行矩阵运算可以获得大幅度的加速，这也是为什么深度学习模型训练都采用GPU来进行。

你默认创建的tensor都是在CPU/内存上的。你有两种方法让tensor转移到GPU/显存上。

-
创建时，设定tensor的设备为“cuda”。

-
将cpu上的tensor通过`to("cuda")`方法转移到GPU上。

还有一个常用的函数来检查你的环境里是否有可用的英伟达GPU。

```
torch.cuda.is_available()

```

下边是一个对比PyTorch在CPU和GPU上进行同样的矩阵乘法所花费的时间。

```
importtorchimporttime# 确保 GPU 可用device = torch.device("cuda"iftorch.cuda.is_available()else"cpu")
print(f"Using device: {device}")# 生成随机矩阵size =10000# 矩阵大小A_cpu = torch.rand(size, size)# 默认在CPU上创建tensorB_cpu = torch.rand(size, size)

start_cpu = time.time()
C_cpu = torch.mm(A_cpu, B_cpu)# 矩阵乘法end_cpu = time.time()
cpu_time = end_cpu - start_cpu# 在 GPU 上计算A_gpu = A_cpu.to(device)# 将tensor转移到GPU上B_gpu = B_cpu.to(device)

start_gpu = time.time()
C_gpu = torch.mm(A_gpu, B_gpu)
torch.cuda.synchronize()# 确保GPU计算完成end_gpu = time.time()
gpu_time = end_gpu - start_gpu

print(f"CPU time: {cpu_time:.6f} sec")iftorch.cuda.is_available():
print(f"GPU time: {gpu_time:.6f} sec")else:
print("GPU not available, skipping GPU test.")

```

在我的1080ti GPU的环境上，输出结果为：

```
Using device: cuda
CPU time: 3.521070 sec
GPU time: 0.225902 sec

```

### 6.4.6 Tensor在不同设备上的计算原则

在 PyTorch 中，将 Tensor 和 Model 移动到 CUDA（GPU）设备的原则如下：

**一. Tensor 放入 CUDA**

使用 tensor.to('cuda') 或 tensor.cuda() 可以将一个张量（Tensor）移动到 GPU 上。此时，该张量的数据存储和计算都会在 GPU 上进行。

**二. Model 放入 CUDA**

使用 model.to('cuda') 或 model.cuda() 可以将一个模型移动到 GPU 上。这实际上是将模型内部的所有可学习参数（即 Parameter，本质上是 Tensor）移动到 GPU 上。

**三. 计算设备一致性**

Tensor进行计算时，参与计算的所有Tensor必须位于同一设备上。否则，PyTorch 会抛出错误。

**四. 计算结果的设备归属**

运算结果的Tensor会位于参与计算Tensor所在的设备上。

一般情况下，我们利用GPU训练模型，会把Input Tensor，Label Tenosr和Model移动到GPU上，则整个模型的训练期间的计算都会在GPU上。因为前向传播时，Input Tensor和模型内部参数Tensor进行计算，得到模型Output Tensor也在GPU上。Output Tensor和 LabelTensor 都在GPU上，计算得到的Loss，梯度也在GPU上。

一句话总结就是：模型和张量需要显式移动到目标设备上（如 GPU）；所有参与同一计算的张量必须位于相同设备，计算结果也会保留在该设备上。
