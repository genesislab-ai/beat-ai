## 14.4 模型评估

经过漫长的等待，终于得到我们期望的模型了，每次看着训练过程中loss的变化，也是我的一大乐趣，希望你也能享受这个过程。下边我们就来对训练出来的模型进行评估。

### 14.4.1 人工测评

```
import torch
import sentencepiece as spm
from translator import Seq2Seq, Encoder, Decoder, Attention

# ---------------------#
# 1. Load Tokenizers
# ---------------------#
sp_en = spm.SentencePieceProcessor()
sp_en.load('en_bpe.model')
sp_cn = spm.SentencePieceProcessor()
sp_cn.load('zh_bpe.model')
PAD_ID = sp_en.pad_id()
BOS_ID = sp_en.bos_id()
EOS_ID = sp_en.eos_id()

# ---------------------#
# 2. Load Trained Model
# ---------------------#
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Model hyperparameters (must match training)
INPUT_DIM = sp_en.get_piece_size()
OUTPUT_DIM = sp_cn.get_piece_size()
ENC_EMB_DIM = 512
DEC_EMB_DIM = 512
HID_DIM = 512
N_LAYERS = 3

attention = Attention(HID_DIM).to(DEVICE)
encoder = Encoder(INPUT_DIM, ENC_EMB_DIM, HID_DIM, n_layers=N_LAYERS).to(DEVICE)
decoder = Decoder(OUTPUT_DIM, DEC_EMB_DIM, HID_DIM, attention, n_layers=N_LAYERS).to(DEVICE)
model = Seq2Seq(encoder, decoder, DEVICE).to(DEVICE)
model.load_state_dict(torch.load('seq2seq_bpe_attention.pt', map_location=DEVICE))
model.eval()

# ---------------------#
# 3. Translation Function (Greedy)
# ---------------------#
def translate_sentence(sentence, max_len=100):
# Tokenize and convert to IDs
tokens = [BOS_ID] + sp_en.encode(sentence, out_type=int) + [EOS_ID]
src_tensor = torch.LongTensor(tokens).unsqueeze(1).to(DEVICE)  # [src_len, 1]
src_len = [len(tokens)]

# 调用Encoder
with torch.no_grad():
encoder_outputs, hidden, cell = encoder(src_tensor, src_len)

# 第一个输入token，序列起始token：<bos>
trg_indices = [BOS_ID]
# 逐个token，循环调用Decoder。
for _ in range(max_len):
# 最新生成的token作为输入
trg_tensor = torch.LongTensor([trg_indices[-1]]).to(DEVICE)
with torch.no_grad():
output, hidden, cell, _ = decoder(trg_tensor, hidden, cell, encoder_outputs,
(src_tensor != PAD_ID).permute(1, 0))
# 取预测概率最大的token作为输出
pred_token = output.argmax(1).item()
trg_indices.append(pred_token)
if pred_token == EOS_ID:
break

# 将token id解码为文字 (跳过<bos>和<eos>)
translated = sp_cn.decode(trg_indices[1:-1])
return translated

# ---------------------#
# 4. Interactive Test
# ---------------------#
if __name__ == '__main__':
while True:
src_sent = input("Enter English sentence (or 'quit' to exit): ")
if src_sent.lower() in ['quit', 'exit']:
break
translation = translate_sentence(src_sent)
print(f"Chinese Translation: {translation}\n")

```

你可以通过上边的代码[inference.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter14/inference.py)进行测试，它依赖[translator.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter14/translator.py)。

可以看到英文句子是一次性送入Encoder的。而在Decoder生成中文翻译阶段，是逐字生成的。首先用`<bos>`作为初始输入，Decoder产生一个中文token，然后把新生成中文token作为输入，再送入Decoder，生成下一个中文token。这种模式叫做**自回归**。

运行后，你可以输入英文句子，模型会输出翻译后的中文句子。怎么样，效果是不是还不错？尽管我已经训练过很多模型，但是每次看到模型开始按照预想方式的工作，内心还是不由得感叹它的精妙，这可能就是人工智能技术的魅力吧。

### 14.4.2 BLEU指标评估

通过运行[BLEU_socre.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter14/BLEU_score.py)，它依赖[inference.py](https://github.com/RethinkFun/DeepLearning/blob/master/chapter14/inference.py)。运行后将显示你训练模型的BLEU值。

```
import sacrebleu
from inference import translate_sentence
# 读取验证集的英文原文和中文参考
with open('data/en2cn/valid_en.txt', 'r', encoding='utf-8') as f:
src_sentences = [line.strip() for line in f.readlines()]

with open('data/en2cn/valid_zh.txt', 'r', encoding='utf-8') as f:
ref_sentences = [line.strip() for line in f.readlines()]

# 检查长度是否匹配
assert len(src_sentences) == len(ref_sentences), "源语言和参考翻译句子数不匹配"

# 用模型生成翻译
hypotheses = []
for i, src in enumerate(src_sentences):
print(f"Translating {i+1}/{len(src_sentences)}...")
translation = translate_sentence(src)
print(ref_sentences[i], translation)
hypotheses.append(translation.strip())

# 计算 BLEU
bleu = sacrebleu.corpus_bleu(hypotheses, [ref_sentences], tokenize='zh')

print("\n========== BLEU Evaluation Result ==========")
print(f"BLEU Score: {bleu.score:.2f}")

```

### 14.4.3 下一步改进

如果你想停留在这里继续完善这个模型，那么我建议你可以尝试：

-
你可以通过增加隐状态的维度：hid_dim，词向量的维度：emb_dim。

-
增加LSTM层的数量。

-
多训练一些迭代。

-
可以把贪婪生成中文翻译改为Beam Search。

我们后边会讲Transformer架构，在翻译任务上它会有更好的表现。

---

恭喜你，你已经用RNN实现了一个不错的翻译模型！

扫码请作者喝一杯咖啡来分享你的喜悦吧!

![zsm](../imgs/zsm.png)
