/* ═══════════════════════════════════════════════════════════
   AILearn — data.js
   Projects, badges, sandbox snippets & presets
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   PROJECTS  (5 guided capstone projects)
══════════════════════════════════════ */
const PROJECTS = [
  {
    id: 'proj-1',
    icon: '🎯',
    title: 'Sentiment Classifier',
    gradient: 'linear-gradient(135deg, #7C6FCD, #6366f1)',
    desc: 'Build a production-ready text sentiment classifier from scratch — collect data, engineer features, train multiple models, evaluate rigorously, and serve via a FastAPI endpoint.',
    tags: ['scikit-learn', 'NLP', 'FastAPI', 'Classification'],
    difficulty: 'beginner',
    xp: 200,
    time: '~3 hours',
    steps: [
      'Collect 1,000+ labeled sentiment examples using the Hugging Face datasets library',
      'Implement TF-IDF vectorization with n-gram features and custom preprocessing',
      'Train and compare Logistic Regression, SVM, and Gradient Boosting classifiers',
      'Evaluate using precision, recall, F1 score, AUC-ROC, and a confusion matrix heatmap',
      'Wrap the best model in a FastAPI endpoint with input validation and error handling',
      'Write a one-page Model Card documenting performance, limitations, and intended use'
    ],
    prereqs: ['Code AI: Lessons 1–3', 'Collect Data: Lessons 1–3']
  },
  {
    id: 'proj-2',
    icon: '🧠',
    title: 'Neural Network from Scratch',
    gradient: 'linear-gradient(135deg, #22D3EE, #0ea5e9)',
    desc: 'Implement a two-layer neural network using only NumPy — forward pass, backpropagation, gradient descent, all from math to working code. No frameworks allowed.',
    tags: ['NumPy', 'Backpropagation', 'Math', 'From Scratch'],
    difficulty: 'intermediate',
    xp: 300,
    time: '~5 hours',
    steps: [
      'Implement matrix operations and activation functions (sigmoid, ReLU, softmax) in NumPy',
      'Build the forward pass for a 2-layer MLP with configurable hidden size',
      'Derive the gradients analytically and implement backpropagation step by step',
      'Implement mini-batch SGD with momentum and learning rate decay',
      'Train on MNIST and verify you achieve >95% test accuracy',
      'Visualize learned weights as images and plot the training loss curve'
    ],
    prereqs: ['Build AI: Lessons 1–4', 'Code AI: Lesson 1']
  },
  {
    id: 'proj-3',
    icon: '📊',
    title: 'Dataset Curation Pipeline',
    gradient: 'linear-gradient(135deg, #34D399, #10b981)',
    desc: 'Design and implement a complete data collection → cleaning → annotation → versioning pipeline for a text classification task of your own choosing.',
    tags: ['Data Engineering', 'DVC', 'Annotation', 'Pipelines'],
    difficulty: 'intermediate',
    xp: 280,
    time: '~4 hours',
    steps: [
      'Define your classification task and write a formal data requirements document',
      'Collect 1,000+ raw examples using web scraping or a public API',
      'Write detailed annotation guidelines with 10+ examples per label including edge cases',
      'Annotate 500 examples and compute inter-annotator agreement (Cohen\'s Kappa ≥ 0.7)',
      'Implement a reproducible cleaning pipeline with schema validation and quality checks',
      'Version the dataset with DVC and write a Datasheet for Datasets-style documentation'
    ],
    prereqs: ['Collect Data: All 6 Lessons']
  },
  {
    id: 'proj-4',
    icon: '🤖',
    title: 'RAG-Powered Knowledge Base',
    gradient: 'linear-gradient(135deg, #FB923C, #f59e0b)',
    desc: 'Build a Q&A system over custom documents using vector embeddings, FAISS retrieval, and an LLM for grounded generation with citation.',
    tags: ['RAG', 'FAISS', 'Embeddings', 'LLM API'],
    difficulty: 'advanced',
    xp: 350,
    time: '~6 hours',
    steps: [
      'Collect and chunk technical documents (PDFs, web pages) using a sliding window strategy',
      'Generate embeddings using sentence-transformers and analyze their quality',
      'Build and populate a FAISS vector index with cosine similarity search',
      'Implement semantic retrieval with score thresholding and result deduplication',
      'Design a RAG prompt that requires citation and explicit uncertainty flagging',
      'Evaluate your system with RAGAS metrics: faithfulness, relevance, precision, recall'
    ],
    prereqs: ['Code AI: Lessons 5–7', 'Prompt AI: Lesson 5']
  },
  {
    id: 'proj-5',
    icon: '🚀',
    title: 'Full-Stack AI Agent',
    gradient: 'linear-gradient(135deg, #F472B6, #e879f9)',
    desc: 'Build a ReAct agent that searches the web, executes Python, and reasons across multiple tool calls to autonomously answer complex research questions.',
    tags: ['Agents', 'Tool Use', 'ReAct', 'Production'],
    difficulty: 'advanced',
    xp: 400,
    time: '~8 hours',
    steps: [
      'Design tool schemas for web search, code execution, and document retrieval',
      'Implement the full ReAct loop with proper message history management',
      'Add input validation, output parsing, and error recovery for each tool',
      'Implement max-step limits, timeout handling, and cost tracking',
      'Engineer the system prompt for consistent, safe tool selection behavior',
      'Evaluate on 10 complex research questions using a structured quality rubric'
    ],
    prereqs: ['Code AI: Lesson 8', 'Prompt AI: Lessons 4–6', 'Build AI: Lesson 6']
  }
];

/* ══════════════════════════════════════
   BADGES  (15 total)
══════════════════════════════════════ */
const BADGES = [
  {
    id: 'first-login',
    icon: '🌟', name: 'First Step',
    desc: 'Signed in for the first time',
    cond: p => true
  },
  {
    id: 'build-started',
    icon: '🔨', name: 'Builder',
    desc: 'Started the Build AI track',
    cond: p => p.done.some(l => l.startsWith('build'))
  },
  {
    id: 'code-started',
    icon: '💻', name: 'Coder',
    desc: 'Started the Code AI track',
    cond: p => p.done.some(l => l.startsWith('code'))
  },
  {
    id: 'data-started',
    icon: '📊', name: 'Data Collector',
    desc: 'Started the Collect Data track',
    cond: p => p.done.some(l => l.startsWith('data'))
  },
  {
    id: 'prompt-started',
    icon: '✨', name: 'Prompter',
    desc: 'Started the Prompt AI track',
    cond: p => p.done.some(l => l.startsWith('prompt'))
  },
  {
    id: 'xp-100',
    icon: '⚡', name: 'First Spark',
    desc: 'Earned 100 XP',
    cond: p => (p.xp || 0) >= 100
  },
  {
    id: 'xp-500',
    icon: '🔥', name: 'On Fire',
    desc: 'Earned 500 XP',
    cond: p => (p.xp || 0) >= 500
  },
  {
    id: 'xp-1000',
    icon: '💎', name: 'Elite Learner',
    desc: 'Earned 1,000 XP',
    cond: p => (p.xp || 0) >= 1000
  },
  {
    id: 'xp-2000',
    icon: '👑', name: 'AI Champion',
    desc: 'Earned 2,000 XP — Master level reached',
    cond: p => (p.xp || 0) >= 2000
  },
  {
    id: 'build-complete',
    icon: '🏗️', name: 'AI Builder',
    desc: 'Completed the entire Build AI track',
    cond: p => CUR.build.every(l => p.done.includes(l.id))
  },
  {
    id: 'code-complete',
    icon: '🚀', name: 'AI Coder',
    desc: 'Completed the entire Code AI track',
    cond: p => CUR.code.every(l => p.done.includes(l.id))
  },
  {
    id: 'data-complete',
    icon: '🗄️', name: 'Data Master',
    desc: 'Completed the entire Collect Data track',
    cond: p => CUR.data.every(l => p.done.includes(l.id))
  },
  {
    id: 'prompt-complete',
    icon: '🧠', name: 'Prompt Master',
    desc: 'Completed the entire Prompt AI track',
    cond: p => CUR.prompt.every(l => p.done.includes(l.id))
  },
  {
    id: 'all-complete',
    icon: '🌌', name: 'AI Grandmaster',
    desc: 'Completed all 4 learning tracks',
    cond: p => ['build', 'code', 'data', 'prompt'].every(
      t => CUR[t].every(l => p.done.includes(l.id))
    )
  },
  {
    id: 'project-done',
    icon: '🎯', name: 'Shipped It',
    desc: 'Completed your first capstone project',
    cond: p => (p.projects || []).length >= 1
  }
];

/* ══════════════════════════════════════
   SANDBOX QUICK-INSERT SNIPPETS
══════════════════════════════════════ */
const SNIPPETS = {
  sigmoid: `
def sigmoid(x):
    return 1 / (1 + 2.718**(-x))

for v in [-3, -1, 0, 1, 3]:
    print(f"sigmoid({v:+.0f}) = {sigmoid(v):.4f}")
`,
  relu: `
def relu(x):     return max(0, x)
def leaky_relu(x, a=0.01): return x if x > 0 else a * x
def gelu_approx(x):
    return 0.5 * x * (1 + ((0.7978 * (x + 0.044715 * x**3))**1))

for v in [-2, -0.5, 0, 0.5, 2]:
    print(f"x={v:+.1f}  relu={relu(v):.3f}  leaky={leaky_relu(v):.4f}")
`,
  loss: `
def mse(y_true, y_pred):
    n = len(y_true)
    return sum((a - b)**2 for a, b in zip(y_true, y_pred)) / n

def binary_cross_entropy(y_true, y_pred, eps=1e-9):
    return -sum(
        y * (p + eps) + (1 - y) * (1 - p + eps)
        for y, p in zip(y_true, y_pred)
    ) / len(y_true)

y_true = [1, 0, 1, 1, 0]
y_pred = [0.9, 0.1, 0.8, 0.6, 0.3]
print(f"MSE: {mse(y_true, y_pred):.4f}")
print(f"BCE: {binary_cross_entropy(y_true, y_pred):.4f}")
`,
  backprop: `
def grad_descent_step(X, y, weights, lr=0.01):
    m = len(X)
    preds = [sum(xi * wi for xi, wi in zip(x, weights)) for x in X]
    errors = [p - yi for p, yi in zip(preds, y)]
    grads = [
        sum(errors[i] * X[i][j] for i in range(m)) / m
        for j in range(len(weights))
    ]
    new_w = [w - lr * g for w, g in zip(weights, grads)]
    loss = sum(e**2 for e in errors) / m
    return new_w, loss

X = [[1, 2], [3, 4], [5, 6], [7, 8]]
y = [3, 7, 11, 15]   # y = x1 + x2
w = [0.0, 0.0]
for step in range(300):
    w, loss = grad_descent_step(X, y, w)
print(f"Learned weights: {[round(wi, 3) for wi in w]}")
print(f"Final loss: {loss:.6f}  (should be near 0)")
`
};

/* ══════════════════════════════════════
   SANDBOX FULL-CODE PRESETS
══════════════════════════════════════ */
const PRESETS = {
  neuron: `# ── Single Artificial Neuron ─────────────────────────────
def sigmoid(x): return 1 / (1 + 2.718**(-x))
def relu(x):    return max(0, x)
def tanh(x):
    e, em = 2.718**x, 2.718**(-x)
    return (e - em) / (e + em)

def neuron(inputs, weights, bias, activation=relu):
    z = sum(w * x for w, x in zip(weights, inputs)) + bias
    return activation(z)

inputs  = [0.5, -0.3, 0.8]
weights = [0.4, -0.2,  0.6]
bias    = 0.1

print("=== Activation Function Comparison ===")
print(f"  ReLU:    {neuron(inputs, weights, bias, relu):.4f}")
print(f"  Sigmoid: {neuron(inputs, weights, bias, sigmoid):.4f}")
print(f"  Tanh:    {neuron(inputs, weights, bias, tanh):.4f}")
print()
print(f"  Raw z = {sum(w*x for w,x in zip(weights,inputs))+bias:.4f}")
print("  (ReLU clips negatives to 0; sigmoid squashes to 0-1)")`,

  neural_net: `# ── 2-Layer Neural Network (NumPy-style) ─────────────────
import numpy as np

def relu(x):    return np.maximum(0, x)
def sigmoid(x): return 1 / (1 + np.exp(-x))

class Net:
    def __init__(self, in_d, hidden, out_d):
        np.random.seed(42)
        self.W1 = np.random.randn(in_d, hidden) * 0.1
        self.b1 = np.zeros(hidden)
        self.W2 = np.random.randn(hidden, out_d) * 0.1
        self.b2 = np.zeros(out_d)

    def forward(self, X):
        self.z1 = X @ self.W1 + self.b1
        self.h  = relu(self.z1)
        self.z2 = self.h @ self.W2 + self.b2
        return sigmoid(self.z2)

net = Net(in_d=3, hidden=8, out_d=1)
X   = np.random.randn(5, 3)
out = net.forward(X)

print("=== Forward Pass Results ===")
for i, p in enumerate(out):
    conf = "HIGH" if p[0] > 0.5 else "LOW"
    print(f"  Sample {i+1}: {p[0]:.4f}  confidence={conf}")
print()
print(f"  Network: 3 → 8 (ReLU) → 1 (Sigmoid)")
print(f"  Parameters: {3*8 + 8 + 8*1 + 1} total")`,

  gradient: `# ── Gradient Descent Visualized ──────────────────────────
# Minimizing f(x) = (x - 3)^2  from x = 10

f  = lambda x: (x - 3) ** 2
df = lambda x: 2 * (x - 3)   # derivative

x  = 10.0
lr = 0.15

print(f"{'Step':<5} {'x':>9} {'f(x)':>10} {'grad':>10}")
print("-" * 38)

for step in range(25):
    loss = f(x)
    grad = df(x)
    print(f"{step:<5} {x:>9.4f} {loss:>10.4f} {grad:>10.4f}")
    x = x - lr * grad
    if abs(grad) < 0.001:
        print(f"\nConverged at step {step}! x ≈ {x:.4f}")
        print(f"True minimum is x = 3.0")
        break`,

  attention: `# ── Scaled Dot-Product Self-Attention ────────────────────
import numpy as np

def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()

def self_attention(Q, K, V):
    d_k = Q.shape[-1]
    # Scale to prevent vanishing gradients in softmax
    scores = Q @ K.T / d_k ** 0.5
    weights = np.array([softmax(row) for row in scores])
    output  = weights @ V
    return output, weights

np.random.seed(42)
seq_len, d_model = 4, 6
Q = np.random.randn(seq_len, d_model)
K = np.random.randn(seq_len, d_model)
V = np.random.randn(seq_len, d_model)

out, attn = self_attention(Q, K, V)

print("=== Attention Weight Matrix ===")
print("Row i = how much token i attends to each token")
print()
for i, row in enumerate(attn):
    bar = "".join("█" if w > 0.3 else ("▓" if w > 0.15 else "░") for w in row)
    print(f"  Token {i}: [{bar}]  {[f'{w:.3f}' for w in row]}")`,

  tokenizer: `# ── BPE-Style Tokenizer Simulation ───────────────────────
text = "the cat sat on the mat and the cat ate a rat"
words = text.split()

# Build vocabulary from word frequencies
from collections import Counter
word_freq = Counter(words)
vocab = {w: i for i, w in enumerate(sorted(set(words)))}

# Tokenize
token_ids = [vocab[w] for w in words]

print("=== Vocabulary ===")
for word, idx in sorted(vocab.items()):
    freq = word_freq[word]
    bar = "█" * freq
    print(f"  {word!r:<10} id={idx}  freq={freq}  {bar}")

print()
print(f"Tokenized: {token_ids}")
print(f"Vocab size: {len(vocab)}, Sequence length: {len(token_ids)}")
print()
print("In real BPE, common pairs like 'th'+'e'→'the' merge iteratively")
print("GPT-4 uses ~100k BPE tokens; Claude uses ~100k as well.")`
};
