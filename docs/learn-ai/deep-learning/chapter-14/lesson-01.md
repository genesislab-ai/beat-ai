## 14.1 数据准备

从这一节开始，我们将动手来实现一个可以将英文翻译为中文的模型。这一节我们先来做一些数据准备工作。
具体代码在[translator.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter14/translator.py)里。

### 14.1.1 训练数据

你可以从[这个地址](https://pan.baidu.com/s/1v2K4Awr03mXUUPJbpyMfpw?pwd=4ak4)下载英文和中文对照的数据。解压`en2cn.zip`文件后，你会得到4个文件。

`train_en.txt`和`train_zh.txt`是训练数据。

`valid_en.txt`和`valid_zh.txt`是验证数据。

其中`train_en.txt`有一千万行英文句子，`train_zh.txt`中有对应的一千万行中文翻译句子。类似的`valid_en.txt`和`valid_zh.txt`分别有8000个英文和中文对照的句子。

### 14.1.2 构建词典

我们在[之前章节](http://www.rethink.fun/chapter12/%E8%AF%8D%E5%85%B8%E7%94%9F%E6%88%90.html)讲过如何利用BPE算法构建NLP模型的词典。这里我们就来实际构建一次。

首先你需要安装sentencepiece这个包，

```
pip install sentencepiece

```

然后运行下边代码来分别生成英文和中文的词典。

```
importsentencepieceasspm
spm.SentencePieceTrainer.Train('--input="data\\en2cn\\train_en.txt" --model_prefix=en_bpe --vocab_size=16000 --model_type=bpe --character_coverage=1.0 --unk_id=0 --pad_id=1 --bos_id=2 --eos_id=3')
spm.SentencePieceTrainer.Train('--input="data\\en2cn\\train_zh.txt" --model_prefix=zh_bpe --vocab_size=16000 --model_type=bpe --character_coverage=0.9995 --unk_id=0 --pad_id=1 --bos_id=2 --eos_id=3')

```

--character_coverage参数是覆盖多少用字符集，因为英文单个字符有限，所以我们设置为1.0。但是中文有很多生僻字，所以我们设置为0.9995防止词表被大量生僻词占用。

vocab_size=16000参数是设置词表的大小，我们都设置为16000。

因为英语基本字符有限，中文基本字符较多，字符组合可能较多，需要分别统计频率，所以BPE生成中文词表过程会比较慢。这个过程可能需要几十分钟。建议你耐心等它生成完成。

如果你真的心急，可以通过下边的参数来采样一百万句子来生成词表。

```
--input_sentence_size=1000000 --shuffle_input_sentence=true

```

生成完之后，我们可以打开`en_bpe.vocab`来看一下英文词表：

```
<unk>   0
<pad>   0
<s> 0
</s>    0
▁t  -0
he  -1
▁a  -2
in  -3
ou  -4
re  -5
▁s  -6
▁w  -7
on  -8
▁the    -9
er  -10
at  -11
▁c  -12
▁m  -13
▁I  -14
▁b  -15
an  -16
it  -17
ing -18

```

中文词表：

```
<unk>   0
<pad>   0
<s> 0
</s>    0
▁我 -0
..  -1
▁你 -2
我们    -3
什么    -4
▁他 -5
一个    -6
知道    -7
... -8
▁我们   -9
他们    -10
▁但 -11
如果    -12
不是    -13
没有    -14
可以    -15
因为    -16
▁在 -17
你的    -18

```

词表里的每个词，我们叫做一个token，其中符号“▁”表示词开始的位置。后边的数字，分数越大（接近 0），表示该 token 在训练时越频繁或优先级越高；分数越小（负号越大），表示频率更低。

接下来我们使用我们训练出来的词典模型进行分词：

```
importsentencepieceasspm

sp_cn = spm.SentencePieceProcessor()
sp_cn.load('zh_bpe.model')

text ="今天天气非常好。"eoncode_result = sp_cn.encode(text, out_type=int)
print("编码：", eoncode_result)

decode_result = sp_cn.decode(eoncode_result)
print("解码：", decode_result)

```

可以看到输出为：

```
编码： [387, 3205, 5241, 11821]
解码： 今天天气非常好。

```

其中：

“今天” 作为一个token，编码为387。

“天气” 作为一个token被编码为3205。

“非常好” 作为一个token被编码为5241。

“。” 作为一个token被编码为11821。

### 14.1.3 定义Dataset

```
importtorchfromtorch.utils.dataimportDataset, DataLoaderclassTranslationDataset(Dataset):## 初始化方法，读取英文和中文训练文本。然后给每个句子前后增加<bos>和<eos>。 为了防止训练时显存不足，对于长度超过限制的## 句子进行过滤。def__init__(self, src_file, trg_file, src_tokenizer, trg_tokenizer, max_len=100):withopen(src_file, encoding='utf-8')asf:
src_lines = f.read().splitlines()withopen(trg_file, encoding='utf-8')asf:
trg_lines = f.read().splitlines()assertlen(src_lines) == len(trg_lines)
self.pairs = []
self.src_tokenizer = src_tokenizer
self.trg_tokenizer = trg_tokenizerforsrc, trginzip(src_lines, trg_lines):# 每个句子前边增加<bos>后边增加<eos>src_ids = [BOS_ID] + self.src_tokenizer(src) + [EOS_ID]
trg_ids = [BOS_ID] + self.trg_tokenizer(trg) + [EOS_ID]# 只保留输入和输出序列token数同时小于max_len的训练样本。iflen(src_ids) <= max_lenandlen(trg_ids) <= max_len:
self.pairs.append((src_ids, trg_ids))# <-- 直接保存token id序列def__len__(self):returnlen(self.pairs)def__getitem__(self, idx):src_ids, trg_ids = self.pairs[idx]returntorch.LongTensor(src_ids), torch.LongTensor(trg_ids)## 对一个batch的输入和输出token序列，依照最长的序列长度，用<pad> token进行填充，确保一个batch的数据形状一致，组成一个tensor。@staticmethoddefcollate_fn(batch):src_batch, trg_batch = zip(*batch)
src_lens = [len(x)forxinsrc_batch]
trg_lens = [len(x)forxintrg_batch]
src_pad = nn.utils.rnn.pad_sequence(src_batch, padding_value=PAD_ID)
trg_pad = nn.utils.rnn.pad_sequence(trg_batch, padding_value=PAD_ID)returnsrc_pad, trg_pad, src_lens, trg_lens

```

如上代码所示，我们定义了一个`TranslationDataset`，它继承自`Dataset`。在初始化方法中，读取了英文和中文训练数据，并对每个句子首尾增加`<bos>`和`<eos>`token。这两个token在训练模型时很重要，生成模型看到输入是`<bos>`就知道接下来要开始输出翻译内容了。 如果生成模型输出了`<eos>`就代表生成模型输出完毕。为了防止训练时显存不足，我们去掉了过长的训练数据。

我们同时定义了一个`collate_fn`方法，它是对batch数据来进行额外处理的。它的作用是把一个batch里的英文token序列或者中文token序列都补成同样长度，batch长度以batch里最长的序列为准，其他序列后边以`<pad>`token来填充。这么做的原因是我们想把一个batch的数据作为一个tensor传入模型进行训练，但是tensor要求内部数据形状必须一致，所以我们用`<pad>`token填充短的序列。如下图所示：

![1341.png](../imgs/1341.png)

因为我们把读取数据和编码过程都放在了Dataset的初始化方法里，所以加载数据需要一些时间。

### 14.1.4 利用Dataloader读取数据

```
dataset = TranslationDataset('data\\en2cn\\train_en.txt','data\\en2cn\\train_zh.txt', tokenize_en, tokenize_cn)
loader = DataLoader(dataset, batch_size=4, shuffle=True, collate_fn=TranslationDataset.collate_fn)forsrc, trg, _, _inloader:
print(src.shape, trg.shape)
print(src, trg)break

```

输出为：

```
torch.Size([15, 4])
torch.Size([13, 4])
tensor([[    2,     2,     2,     2],
[  140,   582,   315,  5447],
[15878,  7077, 15878, 15880],
[    9,  2199, 15860,   315],
[  178,   146,   418, 15878],
[  172,   416,    42, 15860],
[   42,   250,   219, 15875],
[ 2118,  2836,   882,   196],
[10110,   146, 15869, 15875],
[   54,     3,     3,   746],
[ 3995,     1,     1,  1185],
[15869,     1,     1,   130],
[    3,     1,     1,   928],
[    1,     1,     1, 15880],
[    1,     1,     1,     3]])
tensor([[    2,     2,     2,     2],
[ 2238,   211,  1535,   846],
[   18, 13633,  2661,  7902],
[12171, 12687,  4458, 11833],
[12885,  5072, 11827, 11458],
[11850, 12222, 11821, 11823],
[12787,    12,     3,    26],
[12400,    79,     1,   449],
[11827,  1204,     1, 11822],
[11821,    12,     1,  1203],
[    3,     3,     1,  7762],
[    1,     1,     1, 11833],
[    1,     1,     1,     3]])

```

你可能注意到，输出的tensor的shape为[seq_len, batch_size]。这时因为在pytorch里，RNN默认的数据处理和模型输入都先是seq_len,后是batch_size。因为RNN里对序列数据的处理必须是按序列顺序从前到后处理，所以将seq_len放在第一位方便按照序列顺序读取数据。我们在对batch数据处理的函数里调用了`nn.utils.rnn.pad_sequence()`函数，它默认输出的tensor形状就是[seq_len, batch_size]。
