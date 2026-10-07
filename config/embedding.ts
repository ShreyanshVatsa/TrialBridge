/** Embedding model shared by ingestion and the browser. Changing it requires re-running ingestion. */
export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMS = 384;
/** Model weights precision used in Node and the browser (8-bit quantized ONNX). */
export const EMBEDDING_DTYPE = "q8" as const;
/** Stored vectors are L2-normalized then scaled to int8: q = round(v * INT8_SCALE). */
export const INT8_SCALE = 127;
/** Pipeline/prompt versions recorded in meta.json and used in cache keys. */
export const PIPELINE_VERSION = "1.0.0";
export const PROMPT_VERSION = "analyze-v2";
