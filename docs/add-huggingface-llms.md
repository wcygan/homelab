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

## Deployed and found a problem:

```bash
# Attempt 1
│   Warning  InspectFailed  4m59s (x71 over 20m)  kubelet            Failed to apply default image tag "hfhugs/unsloth-gemma-3-4b- │
│ it-GGUF:Q4_K_XL": couldn't parse image name "hfhugs/unsloth-gemma-3-4b-it-GGUF:Q4_K_XL": invalid reference format: repository na │
│ me (hfhugs/unsloth-gemma-3-4b-it-GGUF) must be lowercase

# Attempt 2
│   Warning  InspectFailed  4m38s (x48 over 14m)  kubelet            Failed to apply default image tag "unsloth/gemma-3-4b-it-GGUF │
│ :Q4_K_XL": couldn't parse image name "unsloth/gemma-3-4b-it-GGUF:Q4_K_XL": invalid reference format: repository name (unsloth/ge │
│ mma-3-4b-it-GGUF) must be lowercase
```

## Quick Checking with Docker

https://huggingface.co/docs/hugs/how-to/docker

## k8s blog post

https://huggingface.co/blog/hugs

Maybe the blog post will show us how to fix the problem.

Maybe we need to follow what HUGS allows?

- https://huggingface.co/docs/hugs/hardware
- https://huggingface.co/docs/hugs/models

# Finale

Sadly, I don't think HUGS will work for us. So, time to revert our changes.