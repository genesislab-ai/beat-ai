## 10.8 图像增强

假如你要训练一个分辨猫和狗的模型，收集越多的图片训练的模型泛化性能越好。但是收集更多图片是有成本代价的。而图像增强技术是一个有效的快速获得更多训练样本的技术。

### 10.8.1 图像增强是什么？

图像增强是指通过一系列变换方法，在保持图像语义（表达内容）不变的前提下，生成多样化的新图像数据。这些变换可以是几何的（如旋转、翻转）、颜色的（如亮度调整、颜色抖动），也可以是基于噪声、滤波或仿射变换等手段。

通过这些增强操作，我们可以从原始图像生成多个“不同但本质相同”的样本，显著增加数据多样性，提高模型鲁棒性。
图像增强可以分为以下几类：

- 几何变化

- 颜色变化

- 噪声与模糊

- 遮罩

- 其他技术

### 10.8.2 几何变化

几何变化可以对图像进行以下操作：**旋转**，一个图片旋转一定角度后，表达的语义是不变的。比如将一张猫的图片，旋转后，还是一个猫的图片。

![1029.png](../imgs/1029.png)

接下来我们看如何在PyTorch里实现对图片的旋转操作。
首先我们定义一个函数，它可以对图片应用PyTorch里`Transform`对象的操作。然后展示图片。

```
defimshow(img_path, transform):"""
Function to show data augmentation
Param img_path: path of the image
Param transform: data augmentation technique to apply
"""img = Image.open(img_path)
fig, ax = plt.subplots(1,2, figsize=(15,4))
ax[0].set_title(f'Original image {img.size}')
ax[0].imshow(img)
img = transform(img)
ax[1].set_title(f'Transformed image {img.size}')
ax[1].imshow(img)
plt.show()

```

可以通过以下代码来对图片进行在-30到30度之间进行随机旋转。

```
path =r"E:\电子书\RethinkFun深度学习\data\PetImages\Cat\6039.jpg"transform = transforms.RandomRotation(degrees=30)
imshow(path, transform)

```

**翻转**，对图片进行水平或者垂直翻转。

水平翻转

```
path =r"E:\电子书\RethinkFun深度学习\data\PetImages\Cat\6039.jpg"transform = transforms.RandomHorizontalFlip(p=1.0)# p=1.0 表示总是翻转，p是翻转的概率值。imshow(path, transform)

```

![1030.png](../imgs/1030.png)

垂直翻转

```
transform = transforms.RandomVerticalFlip(p=1.0)

```

**裁剪**随机或者中心裁剪出图像区域。

随机裁剪

```
transform = transforms.RandomCrop(size=(120,120))

```

![1031.png](../imgs/1031.png)

**透视变换**用于模拟图像拍摄时角度扭曲的效果。

```
transform = transforms.RandomPerspective(
distortion_scale=0.5,# 控制变形强度，0~1，越大越扭曲p=1.0,# 应用该变换的概率interpolation=transforms.InterpolationMode.BILINEAR
)

```

![1032.png](../imgs/1032.png)

### 10.8.3 颜色变化

**亮度、对比度、饱和度、色调**

```
transforms.ColorJitter(
brightness=0.5,
contrast=0.5,
saturation=0.5,
hue=0.1)

```

具体参数设置：

-
brightness
控制图像的亮暗程度。
设置为 x 时，相当于亮度因子从 [1 - x, 1 + x] 中随机选一个。
如 brightness=0.5，指的是亮度因子范围是 [0.5, 1.5]。

-
contrast
控制图像的对比度（明暗之间的差异程度）。
同样是 [1 - x, 1 + x] 的范围。

-
saturation
控制图像颜色的鲜艳程度。
[1 - x, 1 + x]

-
hue
控制色调（颜色本质）在色环上旋转。
值范围应在 [-0.5, 0.5]。
hue=0.1， 色调会在 [-0.1, 0.1] 范围内扰动（即 ±10%）。

![1033.png](../imgs/1033.png)

### 10.8.4 模糊

**高斯模糊**

```
# 对图像进行高斯模糊，kernel size 为 5，sigma 可调节模糊强度transform = transforms.GaussianBlur(kernel_size=5, sigma=(0.1,3.0))

```

其中`kernel_size`指高斯模糊卷积核的大小（窗口大小）,它决定了模糊区域的范围，必须为奇数。设置越大，模糊效果越明显。`sigma`高斯模糊核的标准差范围（控制模糊程度的参数）,这里传入的是一个元组 (0.1, 3.0)，表示在这个范围内随机采样一个 sigma 值。sigma 越大，模糊越强；越小，模糊越轻。如果你传入单个数字，比如 sigma=1.0，那么模糊强度是固定的。

![1034.png](../imgs/1034.png)

### 10.8.5 遮罩

**遮罩(Cutout)**遮罩的思想和Dropout的思想类似，它通过在训练图像上随机遮挡一个或多个连续的方形区域，从而让模型学会忽略局部信息，更关注整体上下文特征。这样，模型的鲁棒性得到提升，尤其在面对部分遮挡或图像缺失时表现更好。

遮罩功能PyTorch里没有直接的实现，我们可以自己实现一个：

```
fromPILimportImageimportnumpyasnpimportrandomdefcutout_pil_multi(image, mask_size=50, num_masks=3):"""
对图像应用多个 Cutout 遮挡块

参数:
- image: PIL.Image 对象
- mask_size: 每个遮挡块的大小（正方形边长）
- num_masks: 遮挡块的数量
"""image_np = np.array(image).copy()
h, w = image_np.shape[0], image_np.shape[1]for_inrange(num_masks):
y = random.randint(0, h -1)
x = random.randint(0, w -1)

y1 = max(0, y - mask_size //2)
y2 = min(h, y + mask_size //2)
x1 = max(0, x - mask_size //2)
x2 = min(w, x + mask_size //2)# 遮挡区域设置为黑色image_np[y1:y2, x1:x2, :] =0returnImage.fromarray(image_np)

```

然后进行调用：

```
path =r"E:\电子书\RethinkFun深度学习\data\PetImages\Cat\6039.jpg"imshow(path, cutout)

```

![1035.png](../imgs/1035.png)

**10.8.6 其他技术**

通过上边的例子，可以发现图像增强是一个可以充分发挥你想象的技术。比如你可以给猫的图片里叠加一些经常和猫一起出现的物件，比如增加一个猫爬架。
你可以将猫的图片传入多模态大模型，让大模型生成一些类似的图片。

**10.8.7 给之前代码加上图像增强**

```
train_transform = transforms.Compose([
transforms.Resize((150,150)),
transforms.RandomCrop(size=(IMG_SIZE, IMG_SIZE)),
transforms.RandomHorizontalFlip(p=0.5),
transforms.ColorJitter(
brightness=0.5,
contrast=0.5,
saturation=0.5,
hue=0.1),
transforms.RandomRotation(degrees=30),
transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

valid_transform = transforms.Compose([
transforms.Resize((IMG_SIZE, IMG_SIZE)),
transforms.ToTensor(),
transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

train_dataset = ImageDataset(train_samples, train_transform)
valid_dataset = ImageDataset(valid_samples, valid_transform)

```

比如我们可以给之前的猫狗分类的代码增加图像增强的功能，只需要给训练的图片增加，验证的图片则不需要。因为有了图像增强，相当于我们扩充了训练集，并且不用担心过拟合。

---

恭喜你，你已经掌握了卷积神经网络的基本知识。

扫码请作者喝一杯咖啡来分享你的喜悦吧!

![zsm](../imgs/zsm.png)

**
