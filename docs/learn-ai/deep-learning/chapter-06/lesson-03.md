## 6.3 GPU环境下PyTorch安装

这个小节我们来配置GPU环境下的PyTorch开发环境。使用GPU训练深度学习的模型，性能会有大幅提升。这都得益于GPU的高并行计算。后边我们会详细讲解其内部原理。

**CUDA**

CUDA(Compute Unified Device Architecture)是英伟达推出的一套可以利用GPU高性能并行计算的框架和编程模型。它深度结合硬件架构，并抽象出编程模型，方便程序开发利用GPU性能。PyTorch同样是通过CUDA来利用GPU的。

### 6.3.1 Anaconda安装

Anaconda 是一个非常流行的 Python 开发平台，它的核心功能是提供虚拟环境隔离和包管理。通过 Anaconda，你可以在一台电脑上轻松创建多个独立的 Python 开发环境，每个环境可以配置不同的 Python 版本和依赖库，互不干扰。

你可以去[这个地址](https://www.anaconda.com/download/success)下载最新的Anaconda安装包。

下载后进行安装，需要注意的是安装路径中不能包含空格。

### 6.3.2 在Anaconda中创建一个环境

![0601.png](../imgs/0601.png)

运行完成后在开始菜单中搜索并打开**Anaconda Prompt**

conda 默认有一个环境，叫做base。我们需要创建一个自己的开发环境，创建环境的命令格式如下：

```
conda create --name 环境名称 python=3.9

```

你可以通过上边的命令创建一个新的开发环境，并指定环境名称和python版本。比如我要创建一个名叫做pytorch的环境，那么我的命令就为

```
conda create --name pytorch python=3.9

```

删除一个环境的命令为：

```
conda remove --name 环境名称 --all

```

列出所有环境的命令为：

```
conda env list

```

### 6.3.3 切换到你创建的环境

进入**Anaconda Prompt**，你默认的环境是base，需要通过命令切换到你新创建的环境中去。

```
conda activate 环境名称

```

比如，以我新创建的环境PyTorch为例：

![0602.png](../imgs/0602.png)

切换后，你可以看到括号里的环境名发生变化。

### 6.3.4 检查CUDA版本

如果你机器上有英伟达的显卡，并且正确安装了显卡驱动。你可以在命令行里输入如下命令，查看该显卡支持的**最高**CUDA版本。

```
nvidia-smi

```

比如我这个机器上是3090显卡，它当前驱动支持的最高CUDA版本为12.6

![0606.png](../imgs/0606.png)

### 6.3.5 安装PyTorch

可以到[这个地址](https://pytorch.org/get-started/locally/)查看pytorch的安装命令。

![0603.png](../imgs/0603.png)

在这个界面上你可以通过配置生成安装最新PyTorch的命令，但是一般我们都会安装之前稳定版本，所以我们点击上图中的“install previous versions of PyTorch”链接。

![0621.png](../imgs/0621.png)

进入之前版本页面后，我们找到我们想要安装的PyTorch版本，比如V2.4.0，我们寻找pip安装命令模块，并选择对应CUDA版本下的安装命令，这里注意，选择的CUDA版本不能大于上边我们确认的硬件驱动支持的最高版本。如果这里支持的CUDA版本都大于你显卡驱动支持的最高CUDA版本，说明你的显卡驱动太旧了，你可以安装最新的显卡驱动。

比如上边我机器最高支持到12.6，这里我就选择最接近的12.4版本。复制pip安装命令，然后在Anaconda Prompt里输入我们复制的pip 安装命令。

运行复制的pip命令来安装pytorch：

```
pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url https://download.pytorch.org/whl/cu124

```

### 6.3.6 安装VS Code

VS Code 是一个开源的集成开发环境。你可以在[这个页面](https://code.visualstudio.com/)下载VS Code。
下载完成并安装后，初次打开VS Code，我们需要做一些配置。

**安装中文语言插件**

![0613.png](../imgs/0613.png)

第一步点击插件按钮。
第二步在搜索框搜索“chinese”。
第三步安装插件。

![0614.png](../imgs/0614.png)

安装完成后，VS Code的右下角会弹出一个对话框，改变软件语言，并重启。点击并重启VS Code。

**安装Python语言插件**再次进入后，我们用同样的方式来安装PyTorch语言的编译插件。

![0615.png](../imgs/0615.png)

我们搜索“python”，然后点击安装。安装成功后不需要重启。

**配置Python环境**

![0616.png](../imgs/0616.png)

首先我们点击VS Code右下角的PyThon环境配置按钮。

![0617.png](../imgs/0617.png)

然后选择我们之前在Anaconda里配置好的pytorch环境。

### 6.3.7 验证环境

![0618.png](../imgs/0618.png)

我们在VS Code里切换到资源管理器窗口，选择一个文件夹作为项目路径。

![0619.png](../imgs/0619.png)

然后新建一个Python文件，比如“test.py”。

我们输入：

```
importtorch
print(torch.cuda.is_available())

```

![0622.png](../imgs/0622.png)

点击VS Code 上代表运行的小三角，执行代码。执行后，输出为True，表明PyTorch可以调用我们的GPU，VS Code也配置成功了。
