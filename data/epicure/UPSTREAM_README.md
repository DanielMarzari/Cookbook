# Ancillary materials -- Epicure

Files supplied alongside the main paper.  arXiv preserves these
under `anc/` and lists them on the abstract page.

| File | Size | Description |
|---|---:|---|
| `supplement.pdf` | ~550 KB | Supplementary appendices (corpus and vocabulary detail, graph and cuisine appendices, stratified direction quality, factor decomposition, full mode atlas pointer, full SLERP table pointer, UMAP supplement, reproducibility table). |
| `epicure_supplementary_csvs.tar.gz` | ~250 KB | The twelve CSVs referenced from the supplement (mode atlases, SLERP full table, orthogonal-residual SNR, factor pole-direction alignments, linear-probe metrics, cross-modal validation, WEAT effect sizes, Procrustes sensory axis) plus the schema README documenting every column. |
| `epicure_embeddings.tar.gz` | ~5.4 MB | The three trained Epicure embeddings (Cooc, Core, Chem) as CSVs -- one row per canonical ingredient, 300 dimensions each -- plus a cross-reference vocabulary file.  See the in-archive `README.txt`. |

## Quick load

```bash
tar xzf epicure_supplementary_csvs.tar.gz
tar xzf epicure_embeddings.tar.gz
```

Both archives extract into a single top-level directory (`csv/` and
`embeddings/` respectively) for clean unpacking.
