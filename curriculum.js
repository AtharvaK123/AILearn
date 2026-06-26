export const ACADEMIES = [
  {
    id: "foundations",
    name: "AI Foundations",
    icon: "🧠",
    lessons: 45,
    difficulty: "beginner",
    prereqs: ["None"],
    description: "Build a complete mental model of artificial intelligence.",
    objectives: [
      "Understand AI history",
      "Understand machine learning",
      "Understand deep learning",
      "Understand LLMs",
      "Understand AI applications"
    ],
    skills: [
      "AI Literacy",
      "LLM Concepts",
      "Critical Thinking"
    ],
    modules: [
      {
        title: "Introduction to AI",
        desc: "The history and evolution of artificial intelligence.",
        time: "2 hrs",
        lessons: [
          {
            title: "What is AI?",
            desc: "Learn the fundamental definition of artificial intelligence.",
            time: "10 min",
            concepts: [
              "Artificial Intelligence",
              "Narrow AI",
              "General AI"
            ],
            exercises: [
              "Identify 5 AI products",
              "Classify AI systems"
            ],
            quiz: [
              "What is Narrow AI?",
              "How is AI different from automation?"
            ],
            mistakes: [
              "Thinking AI means robots",
              "Confusing AI and ML"
            ],
            apps: [
              "Chatbots",
              "Recommendation Systems"
            ]
          }
        ]
      }
    ]
  },

  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    icon: "✍️",
    lessons: 50,
    difficulty: "beginner",
    prereqs: ["AI Foundations"],
    description: "Learn how to communicate effectively with AI systems.",
    objectives: [
      "Write effective prompts",
      "Use few-shot prompting",
      "Use chain-of-thought reasoning",
      "Create structured outputs"
    ],
    skills: [
      "Prompt Design",
      "Reasoning",
      "AI Communication"
    ],
    modules: [
      {
        title: "Prompt Fundamentals",
        desc: "Core prompting concepts.",
        time: "2 hrs",
        lessons: [
          // lessons...
        ]
      }
    ]
  },

  {
    id: "python-for-ai",
    name: "Python for AI",
    icon: "🐍",
    lessons: 60,
    difficulty: "beginner",
    prereqs: ["AI Foundations"],
    description: "Master Python for building AI systems.",
    objectives: [
      "Learn Python",
      "Learn NumPy",
      "Learn Pandas",
      "Build AI applications"
    ],
    skills: [
      "Python",
      "Data Analysis",
      "Automation"
    ],
    modules: [
      {
        title: "Python Basics",
        desc: "Variables, functions, loops and data structures.",
        time: "4 hrs",
        lessons: [
          // lessons...
        ]
      }
    ]
  },

  {
    id: "machine-learning",
    name: "Machine Learning",
    icon: "📊",
    lessons: 60,
    difficulty: "intermediate",
    prereqs: ["Python for AI", "Data Science"],
    description: "Learn classical machine learning algorithms.",
    objectives: [
      "Build ML models",
      "Evaluate performance",
      "Tune hyperparameters"
    ],
    skills: [
      "Regression",
      "Classification",
      "Model Evaluation"
    ],
    modules: [
      // modules...
    ]
  },

  {
    id: "deep-learning",
    name: "Deep Learning",
    icon: "🧬",
    lessons: 70,
    difficulty: "advanced",
    prereqs: ["Machine Learning"],
    description: "Neural networks and modern deep learning.",
    objectives: [
      "Build neural networks",
      "Train deep models",
      "Fine tune models"
    ],
    skills: [
      "PyTorch",
      "Neural Networks",
      "Transformers"
    ],
    modules: [
      // modules...
    ]
  },

  {
    id: "nlp",
    name: "Natural Language Processing",
    icon: "💬",
    lessons: 40,
    difficulty: "advanced",
    prereqs: ["Deep Learning"],
    modules: []
  },

  {
    id: "computer-vision",
    name: "Computer Vision",
    icon: "👁️",
    lessons: 40,
    difficulty: "advanced",
    prereqs: ["Deep Learning"],
    modules: []
  },

  {
    id: "generative-ai",
    name: "Generative AI",
    icon: "🎨",
    lessons: 50,
    difficulty: "advanced",
    prereqs: ["Deep Learning"],
    modules: []
  },

  {
    id: "agents",
    name: "AI Agents",
    icon: "🤖",
    lessons: 60,
    difficulty: "advanced",
    prereqs: ["Prompt Engineering", "Generative AI"],
    modules: []
  },

  {
    id: "rag",
    name: "Retrieval Augmented Generation",
    icon: "📚",
    lessons: 35,
    difficulty: "advanced",
    prereqs: ["Embeddings", "AI Agents"],
    modules: []
  },

  {
    id: "fine-tuning",
    name: "Fine Tuning",
    icon: "⚙️",
    lessons: 35,
    difficulty: "advanced",
    prereqs: ["Deep Learning"],
    modules: []
  },

  {
    id: "mlops",
    name: "MLOps",
    icon: "🚀",
    lessons: 40,
    difficulty: "advanced",
    prereqs: ["Machine Learning"],
    modules: []
  },

  {
    id: "product-development",
    name: "AI Product Development",
    icon: "🏗️",
    lessons: 30,
    difficulty: "intermediate",
    prereqs: ["Prompt Engineering"],
    modules: []
  },

  {
    id: "ai-business",
    name: "AI Business",
    icon: "💼",
    lessons: 25,
    difficulty: "intermediate",
    prereqs: ["AI Foundations"],
    modules: []
  },

  {
    id: "ethics",
    name: "AI Ethics & Safety",
    icon: "🛡️",
    lessons: 25,
    difficulty: "intermediate",
    prereqs: ["AI Foundations"],
    modules: []
  },

  {
    id: "research",
    name: "AI Research",
    icon: "🔬",
    lessons: 30,
    difficulty: "expert",
    prereqs: ["Deep Learning"],
    modules: []
  }
];
