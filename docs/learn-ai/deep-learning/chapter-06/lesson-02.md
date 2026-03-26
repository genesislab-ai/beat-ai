## 6.2 CPU环境下PyTorch安装

这个小节我们来配置CPU环境下的PyTorch开发环境。

### 6.2.1 Anaconda安装

Anaconda 是一个非常流行的 Python 开发平台，它的核心功能是提供虚拟环境隔离和包管理。通过 Anaconda，你可以在一台电脑上轻松创建多个独立的 Python 开发环境，每个环境可以配置不同的 Python 版本和依赖库，互不干扰。

你可以去[这个地址](https://www.anaconda.com/download/success)下载最新的Anaconda安装包。

下载后进行安装，需要注意的是安装路径中不能包含空格。

### 6.2.2 在Anaconda中创建一个环境

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

### 6.2.3 切换到你创建的环境

进入**Anaconda Prompt**，你默认的环境是base，需要通过命令切换到你新创建的环境中去。

```
conda activate 环境名称

```

比如，以我新创建的环境PyTorch为例：

![0602.png](../imgs/0602.png)

切换后，你可以看到括号里的环境名发生变化。

### 6.2.4 安装pytorch

可以到[这个地址](https://pytorch.org/get-started/locally/)查看pytorch的安装命令。

![0603.png](../imgs/0603.png)

在这个界面上你可以通过配置生成安装最新PyTorch的命令，但是一般我们都会安装之前稳定版本，所以我们点击上图中的“install previous versions of PyTorch”链接。

![0612.png](../imgs/0612.png)

进入之前版本页面后，我们找到我们想要安装的PyTorch版本，比如V2.4.0，我们寻找pip安装命令模块，并选择**CPU Only**下的安装命令，并复制，然后在Anaconda Prompt里输入我们复制的pip 安装命令。

```
pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url https://download.pytorch.org/whl/cpu

```

### 6.2.5 安装VS Code

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

### 6.2.6 验证环境

![0618.png](../imgs/0618.png)

我们在VS Code里切换到资源管理器窗口，选择一个文件夹作为项目路径。

![0619.png](../imgs/0619.png)

然后新建一个Python文件，比如“test.py”。

我们输入：

```
importtorch
print(torch.__version__)

```

![0620.png](../imgs/0620.png)

点击VS Code 上代表运行的小三角，执行代码。执行后，输出为我们安装的CPU版本的PyTorch的版本号，代表我们VS Code也配置成功了。
