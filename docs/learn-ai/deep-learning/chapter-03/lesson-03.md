## 3.3 常用求导公式

### 3.3.1幂函数的导函数

我们首先根据导函数的定义来推出$f(x)=x^2$的导函数。

$$
f'(x)=\lim_{\triangle x \to 0}\frac{f(x+\triangle x)-f(x)}{\triangle x}=\lim_{\triangle x \to 0}\frac{(x+\triangle x)^2-x^2}{\triangle x}
$$

$$
=\lim_{\triangle x \to 0}\frac{x^2+2x\triangle x+{\triangle x}^2-x^2}{\triangle x}
$$

$$
=\lim_{\triangle x \to 0}\frac{2x\triangle x+{\triangle x}^2}{\triangle x}
$$

$$
=2x+\lim_{\triangle x \to 0}{\triangle x}
$$

$$
=2x
$$

接下来我们推导一下$f(x)=x^n$的导函数。

**二项式定理**

$$
(a + b)^n = \sum_{k=0}^n C_{n}^{k}a^{n-k} b^k
$$

首先复习一下二项式定理，n个（a+b）相乘，实际展开式中的每一项都是n个数的乘积。n个数里要么是a，要么是b。n个数里有k个a，n-k个b的概率就为$C_{n}^{k}$

接下来我们进行幂函数的导函数推导：

$$
f'(x)=\lim_{\triangle x \to 0}\frac{f(x+\triangle x)-f(x)}{\triangle x}=\lim_{\triangle x \to 0}\frac{(x+\triangle x)^n-x^n}{\triangle x}
$$

对于${(x+\triangle x)}^n$部分利用二项式定理展开：

$$
{(x+\triangle x)}^n=x^n + nx^{n-1}\triangle x+\frac{n(n-1)}{2}x^{n-2}{\triangle x}^2+\cdot\cdot\cdot+{\triangle x}^n
$$

将展开式带入幂函数求导极限式中有：

$$
f'(x)=\lim_{\triangle x \to 0}\frac{nx^{n-1}\triangle x+\frac{n(n-1)}{2}x^{n-2}{\triangle x}^2+\cdot\cdot\cdot+{\triangle x}^n}{\triangle x}
$$

$$
f'(x)=\lim_{\triangle x \to 0}{nx^{n-1}+(n-1)x^{n-2}{\triangle x}+\cdot\cdot\cdot+{\triangle x}^{n-1}}
$$

$$
f'(x)=nx^{n-1}
$$

所以最终得到$f(x)=x^n$的导函数为$nx^{n-1}$

### 3.3.2 常见函数的导函数

毕竟我们这个不是高数课，就不一一推导每种常见函数的导函数了。这里给出公式，都是必须记住的。

**常数求导**

如果$f(x)=C$，C为常数，则：$f'(x)=0$。导数描述的是因变量针对自变量而言在某一点的变化率，函数值为常数，变化率一直为0。

**幂函数求导**

如果$f(x)=x^n$，其中n为**实数**，则$f'(x)=nx^{n-1}$

**指数函数求导**

如果$f(x)=a^x$,其中$(a>0;a\ne1)$, 则$f'(x)=a^x \ln a$

特别的如果$f(x)=e^x$,则$f'(x)=e^x$(导函数和原函数相同）

**对数函数求导**

如果$f(x)=\log_{a}{x}$,其中$(a>0;a\ne1)$,则$f'(x)=\frac{1}{x \ln a}$

特别的，如果$f(x) = \ln x$,则$f'(x) = \frac{1}{x}$

**三角函数求导**

如果$f(x)=\sin x$，则$f'(x)=\cos x$

如果$f(x)=\cos x$，则$f'(x)=-\sin x$
