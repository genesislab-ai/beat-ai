## 3.6 偏导数

### 3.6.1 一元函数的导数

之前我们讲过一元函数的导数，函数在自变量某一点$x_0$的导数，表示当自变量的变化量$\triangle x \to 0$时，因变量关于自变量的变化率。

$$
f'(x_0)=\lim_{\triangle x \to 0} \frac{\triangle y}{\triangle x}=\lim_{\triangle x \to 0} \frac{f(x_0+\triangle x)-f(x_0)}{\triangle x}
$$

### 3.6.2 多元函数的偏导数

对于多元函数，比如：

$$
z=f(x,y)
$$

我们想要求函数在点$(x_0,y_0)$处的导数时，情况就变得复杂。因为对于一元函数而言，自变量只有一个，但是对多元函数，自变量有两个。为了简化我们的研究，每次可以只让自变量里的一个变量变化，而其他变量保持不变，这时对多元函数的求导，就转化为对一元函数的求导了，我们把这种导数，叫做偏导数。

比如对于上边自变量包含x和y的多元函数，在点$(x_0,y_0)$处，固定$y=y_0$，对x求偏导：

$$
f_x(x_0,y_0)=\lim_{\triangle x \to 0} \frac{\triangle z_x}{\triangle x}=\lim_{\triangle x \to 0} \frac{f(x_0+\triangle x,y_0)-f(x_0,y_0)}{\triangle x}
$$

在点$(x_0,y_0)$处，固定$x=x_0$，对y求偏导：

$$
f_y(x_0,y_0)=\lim_{\triangle y \to 0} \frac{\triangle z_y}{\triangle y}=\lim_{\triangle y \to 0} \frac{f(x_0,y_0+\triangle y)-f(x_0,y_0)}{\triangle y}
$$

偏导数也可以用另一种形式表示，比如z对x求偏导，可以表示为：

$$
\frac{\partial z}{\partial x}
$$

### 3.6.2 一个例子

我们看一个二元函数：

$$
f(x,y)=x^2y+3xy^2
$$

我们分别求它对$x$和$y$的偏导数。

**对x求偏导**

当求x的偏导时，把y看做常数。

$$
\frac{\partial z }{\partial x}=2xy+3y^2
$$

**对y求偏导**当求y的偏导时，把x看做常数。

$$
\frac{\partial z }{\partial y}=x^2+6xy
$$

**计算一个具体的点**

比如在点x=1，y=2处：

$$
\frac{\partial z }{\partial x}=2xy+3y^2=16
$$

$$
\frac{\partial z }{\partial y}=x^2+6xy=13
$$

### 3.6.3 偏导数的几何意义

![0311.png](../imgs/0311.png)

根据上图可以看出，多元函数的偏导数也和一元函数的导数一样，都是表示切线斜率。

对于偏导数$f_x(x_0,y_0)$表示的是平面$y=y_0$与曲面$z=f(x,y)$的交线在$x=x_0$处，z对于x的变化率。

对于偏导数$f_y(x_0,y_0)$表示的是平面$x=x_0$与曲面$z=f(x,y)$的交线在$y=y_0$处，z对于y的变化率。
