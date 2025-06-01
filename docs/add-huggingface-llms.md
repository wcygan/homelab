# Add LLMs through HuggingFace

Reference: https://huggingface.co/docs/hugs/how-to/kubernetes

## LLMs to add

Since our cluster doesn't use GPUs but it does have a lot of Memory, we can try to use smaller LLMs like this:

- [DeepSeek-R1](https://docs.unsloth.ai/basics/deepseek-r1-0528-how-to-run-locally)
  - [unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF](https://huggingface.co/unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF)
- [Gemma 3](https://docs.unsloth.ai/basics/gemma-3-how-to-run-and-fine-tune)
  - [unsloth/gemma-3-4b-it-GGUF:Q4_K_XL](https://huggingface.co/unsloth/gemma-3-4b-it-GGUF)

These two models seem good to start with:

1. unsloth/DeepSeek-R1-0528-Qwen3-8B-GGUF
2. unsloth/gemma-3-4b-it-GGUF:Q4_K_XL

