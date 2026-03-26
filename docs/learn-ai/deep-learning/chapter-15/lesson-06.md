## 15.6 利用Transformer实现翻译模型

在上一章里，我们用RNN训练了一个英文翻译中文的模型，这一节我们改为Transformer模型。
完整的训练代码可以从github下载[train.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter15/train.py)。它依赖于[transformer.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter15/transformer.py)。

### 15.6.1 数据准备

我们用和上一节同样的数据，大家可以拷贝上一章的数据到本章节代码下。同时我们还是用上一章创建的中英文词表。
在定义Dataset时，代码也和上一章基本类似，但是有一点不同，最终生成的批量序列token id 张量时，Transformer的tensor形状是把batch放在第一个维度的，`batch_frist=True`具体Dataset代码如下：

```
classTranslationDataset(Dataset):## 初始化方法，读取英文和中文训练文本。然后给每个句子前后增加<bos>和<eos>。 为了防止训练时显存不足，对于长度超过限制的## 句子进行过滤。def__init__(self, src_file, trg_file, src_tokenizer, trg_tokenizer, max_len=100):withopen(src_file, encoding='utf-8')asf:
src_lines = f.read().splitlines()withopen(trg_file, encoding='utf-8')asf:
trg_lines = f.read().splitlines()assertlen(src_lines) == len(trg_lines)
self.pairs = []
self.src_tokenizer = src_tokenizer
self.trg_tokenizer = trg_tokenizer
index =0forsrc, trginzip(src_lines, trg_lines):
index +=1ifindex %100000==0:
print(index)# 每个句子前边增加<bos>后边增加<eos>src_ids = [BOS_ID] + self.src_tokenizer(src) + [EOS_ID]
trg_ids = [BOS_ID] + self.trg_tokenizer(trg) + [EOS_ID]# 只保留输入和输出序列token数同时小于max_len的训练样本。iflen(src_ids) <= max_lenandlen(trg_ids) <= max_len:
self.pairs.append((src_ids, trg_ids))# <-- 直接保存token id序列def__len__(self):returnlen(self.pairs)def__getitem__(self, idx):src_ids, trg_ids = self.pairs[idx]returntorch.LongTensor(src_ids), torch.LongTensor(trg_ids)## 对一个batch的输入和输出token序列，依照最长的序列长度，用<pad> token进行填充，确保一个batch的数据形状一致，组成一个tensor。@staticmethoddefcollate_fn(batch):src_batch, trg_batch = zip(*batch)
src_lens = [len(x)forxinsrc_batch]
trg_lens = [len(x)forxintrg_batch]## 注意，Transformer里的tensor，设置batch_frist=True。src_pad = nn.utils.rnn.pad_sequence(src_batch, batch_first=True, padding_value=PAD_ID)
trg_pad = nn.utils.rnn.pad_sequence(trg_batch, batch_first=True,padding_value=PAD_ID)returnsrc_pad, trg_pad, src_lens, trg_lens

```

Transformer训练时，会传递一个Mask矩阵，Mask矩阵的作用有两个：

-
对于Encoder输入的序列，在计算自注意力时，不关注`<pad>`token。

-
对于Decoder输入的序列，在进行自注意力时，不关注`<pad>`token 和当前 token 后边的 token。

生成Mask的代码：

```
defcreate_mask(src, tgt, pad_idx):# mask <pad> token for encoder.src_mask = (src != pad_idx).unsqueeze(1).unsqueeze(2)# (batch, 1, 1, src_len)# mask <pad> token for decoder.tgt_pad_mask = (tgt != pad_idx).unsqueeze(1).unsqueeze(2)# (batch, 1, 1, tgt_len)tgt_len = tgt.size(1)# decoder mask 当前token后边的token。tgt_sub_mask = torch.tril(torch.ones((tgt_len, tgt_len), device=tgt.device)).bool()# (tgt_len, tgt_len)# decoder 同时mask <pad> token, 以及当前token后边的token。tgt_mask = tgt_pad_mask & tgt_sub_mask# (batch, 1, tgt_len, tgt_len)returnsrc_mask, tgt_mask

```

### 15.6.2 训练代码

相信你可以看懂下边的代码，我们不做过多解释。得益于Transformer的并行化，训练时间比训练RNN要快不少。

```
deftrain(model, dataloader, optimizer, criterion, pad_idx):model.train()
total_loss =0step =0log_loss =0# 用于每100步统计forsrc, tgt, src_lens, tgt_lensindataloader:
step +=1src = src.to(DEVICE)
tgt = tgt.to(DEVICE)

tgt_input = tgt[:, :-1]
tgt_output = tgt[:,1:]

src_mask, tgt_mask = create_mask(src, tgt_input, pad_idx)

optimizer.zero_grad()
encoder_output = model.encode(src, src_mask)
decoder_output = model.decode(encoder_output, src_mask, tgt_input, tgt_mask)
output = model.project(decoder_output)

output = output.reshape(-1, output.shape[-1])
tgt_output = tgt_output.reshape(-1)

loss = criterion(output, tgt_output)
loss.backward()

optimizer.step()

total_loss += loss.item()
log_loss += loss.item()ifstep %100==0:
avg_log_loss = log_loss /100print(f"Step {step}: Avg Loss = {avg_log_loss:.4f}")
log_loss =0# 重置每100步的loss计数returntotal_loss / len(dataloader)defmain():# 超参数SRC_VOCAB_SIZE =16000TGT_VOCAB_SIZE =16000SRC_SEQ_LEN =128TGT_SEQ_LEN =128BATCH_SIZE =2NUM_EPOCHS =10LR =1e-4# 数据集加载train_dataset = TranslationDataset('valid_en.txt','valid_zh.txt',tokenize_en, tokenize_cn)
train_dataloader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, collate_fn=train_dataset.collate_fn)# 构建模型model = build_transformer(SRC_VOCAB_SIZE, TGT_VOCAB_SIZE, SRC_SEQ_LEN, TGT_SEQ_LEN).to(DEVICE)

optimizer = optim.Adam(model.parameters(), lr=LR)
criterion = nn.CrossEntropyLoss(ignore_index=PAD_ID)forepochinrange(NUM_EPOCHS):
loss = train(model, train_dataloader, optimizer, criterion, PAD_ID)
print(f"Epoch {epoch+1}/{NUM_EPOCHS} - Loss: {loss:.4f}")

torch.save(model.state_dict(),"transformer.pt")

```

### 15.6.3 模型测试

你可以通过[inference.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter15/inference.py)来手动测试模型的英译中的能力，相信通过对比，你可以发现它的能力比同样的RNN模型要好不少。

同时，你也可以测评它的BLEU score。具体代码和上一章的代码一样,[BLEU_score.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter15/BLEU_score.py)。它依赖于上边的inference.py。通过运行BLEU score，你也可以发现模型性能比RNN的翻译模型要提升不少。

---

恭喜你，你已经训练了一个你自己的Transformer模型！

扫码请作者喝一杯咖啡来分享你的喜悦吧!

![zsm](../imgs/zsm.png)
