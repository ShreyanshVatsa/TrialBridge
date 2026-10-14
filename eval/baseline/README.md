# v6 baseline (step 1)

Pre-merge SHA: b0914f591626a8cec861969cb7bcf84981d09acc (branch v6-matching, off v5), also in git-sha.txt.

Commands and outputs:
- `npx vitest run` -> unit.txt
- `npm run eval` -> eval.txt (plus results.json and RESULTS.md copies)
- `npm run eval:vignettes` -> eval-vignettes.txt (failed pre-merge: scripts/eval/vignettes/run.ts absent) and eval-vignettes-postmerge.txt (after merging v5-vignette-gold: failed, eval/gold/vignettes-gold-v1.json missing)

Results (pre-merge):
- Unit: 1053 pass, 1 fail (backend.test.ts "ships with every provider disabled until data terms are verified", stale since Groq dataTermsVerified=true).
- Eval: keyword nDCG 0.811; production system nDCG 0.809 (recall 0.859); facts precision 66.0%; v2 pipeline nDCG@10 0.807.

Merged after baseline: v5-criteria, v5-ranking, v5-eval-verify, v5-vignette-gold (v5-design was already an ancestor).
Post-merge unit: 1074 pass, 1 fail (same stale test).
