## 3.4导数运算法则

### 3.4.1 函数和差求导法则

如果函数$u=u(x)$以及$v=v(x)$都在x点处可导，则：

$$
[u(x)\pm v(x)]' = u'(x)\pm v'(x)
$$

我们可以根据导数的定义进行证明：

$$
[u(x)\pm v(x)]' = \lim_{\triangle x \to 0} \frac{[u(x+\triangle x)\pm v(x+\triangle x)]-[u(x)\pm v(x)]}{\triangle x}
$$

$$
= \lim_{\triangle x \to 0} \frac{u(x+\triangle x)-u(x)}{\triangle x}\pm\lim_{\triangle x \to 0} \frac{v(x+\triangle x)-v(x)}{\triangle x}
$$

$$
= u'(x)\pm v'(x)
$$

### 3.4.2函数积的求导法则

如果函数$u=u(x)$以及$v=v(x)$都在x点处可导，则：

$$
[u(x)v(x)]' = u'(x)v(x)+u(x)v'(x)
$$

同样可以利用导数的定义进行证明：

$$
[u(x)v(x)]' = \lim_{\triangle x \to 0} \frac{u(x+\triangle x) v(x+\triangle x) -u(x)v(x)}{\triangle x}
$$

$$
= \lim_{\triangle x \to 0} \frac{u(x+\triangle x) v(x+\triangle x) -u(x)v(x+\triangle x)+u(x)v(x+\triangle x)-u(x)v(x)}{\triangle x}
$$

$$
= \lim_{\triangle x \to 0} \frac{[u(x+\triangle x) -u(x)]v(x+\triangle x) + u(x)[v(x+\triangle x)-v(x)]}{\triangle x}
$$

$$
= \lim_{\triangle x \to 0} \frac{[u(x+\triangle x) -u(x)]}{\triangle x}v(x+\triangle x)+ u(x)\lim_{\triangle x \to 0} \frac{v(x+\triangle x)-v(x)}{\triangle x}
$$

$$
= u'(x) \lim_{\triangle x \to 0} v(x+ \triangle x)+ u(x) v'(x)
$$

$$
= u'(x) v(x)+ u(x) v'(x)
$$

根据函数积的求导法则，可以推出：

当$f(x)=Cg(x)$, 其中C为常数，则有：

$$
f'(x) = C'g(x) + C g'(x) = Cg'(x)
$$

### 3.4.3函数商的求导法则

如果函数$u=u(x)$以及$v=v(x)$都在x点处可导，以及$v(x) \ne 0$则：

$$
\left [\frac{u(x)}{v(x)} \right ]' = \lim_{\triangle x \to 0} \frac{\frac{u(x+\triangle x)}{v(x+\triangle x)}-\frac{u(x)}{v(x)}}{\triangle x}
$$

$$
= \lim_{\triangle x \to 0} \frac{u(x+\triangle x) v(x) -u(x)v(x+\triangle x ) }{v(x+\triangle x )v(x)\triangle x }
$$

$$
= \lim_{\triangle x \to 0} \frac{u(x+\triangle x) v(x)-u(x)v(x)+u(x)v(x)-u(x)v(x+\triangle x ) }{v(x+\triangle x )v(x)\triangle x }
$$

$$
= \lim_{\triangle x \to 0} \frac{[u(x+\triangle x) -u(x)] v(x) -u(x)[v(x+\triangle x )-v(x)] }{v(x+\triangle x )v(x)\triangle x }
$$

$$
= \lim_{\triangle x \to 0} \frac{\frac{u(x+\triangle x) -u(x)}{\triangle x} v(x) -u(x)\frac{v(x+\triangle x )-v(x)}{\triangle x} }{v(x+\triangle x )v(x)}
$$

$$
= \frac{u'(x)v(x)-u(x)v'(x)}{v^2(x)}
$$

### 3.4.4 链式法则（复合函数求导法则）

如果$u=g(x)$在x点可导，而$y=f(u)$在$u=g(x)$点可导，那么$y=f(g(x))$在x点可导，并且导数为：

$$
f'(x) = f'(u)g'(x)
$$

或者表示为：

$$
\frac{\mathrm{d} y}{\mathrm{d} x} =\frac{\mathrm{d} y}{\mathrm{d} u}\cdot \frac{\mathrm{d} u}{\mathrm{d} x}
$$

首先举个例子帮助你理解。

假如你可以用人民币换美元，可以用美元换比特币。假设在某个时间点，人民币换美元的汇率为0.12，美元对比特币的汇率为0.0001，则人民币对比特币的汇率就可以用0.12乘以0.0001来计算。

下边进行证明。

$$
\lim_{\triangle u \to 0}\frac{\triangle y}{\triangle u}=f'(u)
$$

$$
\Rightarrow \frac{\triangle y}{\triangle u} = f'(u) + \alpha (\triangle u)
$$

$$
\alpha (\triangle u)$是当$\triangle u \longrightarrow 0$时的无穷小。上式两边同时乘以$\triangle u
$$

$$
\Rightarrow \triangle y = f'(u) \triangle u + \alpha (\triangle u) \triangle u
$$

等式两边同时除以$\triangle x$,可以推导出：

$$
\Rightarrow \frac{\triangle y}{\triangle x} = f'(u) \frac{\triangle u}{\triangle x} + \alpha (\triangle u) \frac{\triangle u}{\triangle x}
$$

然后两边取极限：

$$
\Rightarrow \lim_{\triangle x \to 0} \frac{\triangle y}{\triangle x} = \lim_{\triangle x \to 0} \left [f'(u) \frac{\triangle u}{\triangle x} + \alpha (\triangle u) \frac{\triangle u}{\triangle x}\right ]
$$

根据可导函数必连续，可以得知当$\triangle x \longrightarrow 0$时，$\triangle u \longrightarrow 0$。从而可以得到：

$$
\lim_{\triangle x \to 0} \alpha (\triangle u) = \lim_{\triangle u \to 0} \alpha (\triangle u)=0
$$

又因为：

$$
\lim_{\triangle x \to 0} \frac{\triangle u}{\triangle x}=g'(x)
$$

所以：

$$
\lim_{\triangle x \to 0} \frac{\triangle y}{\triangle x}=f'(u) \lim_{\triangle x \to 0} \frac{\triangle u}{\triangle x}
$$

$$
\Rightarrow f'(x) = f'(u)g'(x)
$$

### 3.4.5 例题

我们尝试用上边的导数运算法则对下边这个函数求导：

$$
f(x)=(e^x \sin x+3x)^2
$$

这是一个复合函数求导，我们定义：

$$
u=g(x)=e^x \sin x+3x
$$

则$f(u)=u^2$

$$
f'(x)=f'(u)g'(x)
$$

$$
f'(x)=2u \cdot g'(x)
$$

代入$u=g(x)=e^x \sin x+3x$

$$
f'(x)=2(e^x \sin x+3x) \cdot g'(x)
$$

接下来需要求$g'(x)$

应用求导的四则运算规则有：

则$g'(x)=e^x \sin x + e^x \cos x +3$

代入$f'(x)$的表达式中，得到最终答案：

$$
f'(x)=2(e^x \sin x+3x) \cdot (e^x \sin x + e^x \cos x +3)
$$
