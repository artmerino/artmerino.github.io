#!/usr/bin/env python3
"""
Convert flattened assets/json/bibliography.json back to BibTeX.
Outputs _bibliography/from_json.bib.
Version types map to BibTeX entry types:
- conference -> @inproceedings (booktitle = venue)
- journal    -> @article       (journal   = venue)
- preprint   -> @article       (journal   = {arXiv preprint})
Linked versions get an `extended` field listing sibling keys.
Title/authors fall back to work-level when missing at version-level.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / 'assets' / 'json' / 'bibliography.json'
OUT_BIB = ROOT / '_bibliography' / 'from_json.bib'


def norm_title(t: str) -> str:
    t = t.lower()
    t = re.sub(r'[^a-z0-9 ]', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def slugify(text: str, maxlen: int = 48) -> str:
    s = re.sub(r'[^a-z0-9]+', '-', norm_title(text)).strip('-')
    if len(s) > maxlen:
        s = s[:maxlen].rstrip('-')
    return s or 'work'


def make_base_id(work) -> str:
    if work.get('arxiv'):
        return work['arxiv']
    # try any doi in versions
    for v in work.get('versions', []):
        if v.get('doi'):
            return re.sub(r'[^a-zA-Z0-9]+', '-', v['doi'])
    if work.get('title'):
        return slugify(work['title'])
    return 'work'


def authors_str(authors):
    return ' and '.join(authors)


def escape_latex(text: str) -> str:
    """Escape LaTeX special chars in plain text fields."""
    repl = {
        '\\': r'\\',
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
    }
    for needle, val in repl.items():
        text = text.replace(needle, val)
    return text


def brace(text: str) -> str:
    return f"{{{{{text}}}}}"


def bib_entry(entry_type: str, key: str, fields: dict) -> str:
    lines = [f"@{entry_type}{{{key},"]
    for k, v in fields.items():
        if v is None:
            continue
        lines.append(f"  {k} = {{{v}}},")
    lines.append("}\n")
    return '\n'.join(lines)


def main():
    data = json.loads(JSON_PATH.read_text(encoding='utf-8'))
    entries = []
    # first pass: build entries and remember keys per work
    work_keys = []
    for work in data:
        base = make_base_id(work)
        counters = {'preprint':0,'journal':0,'conference':0,'other':0}
        vkeys = []
        # skip preprints if there is any non-preprint version
        versions = work.get('versions', [])
        has_non_pre = any(v.get('type') in ('conference','journal') for v in versions)
        for v in work.get('versions', []):
            if v.get('type') == 'preprint' and has_non_pre:
                continue
            counters[v.get('type','other')] += 1
            suffix = {'preprint':'pre','journal':'jrnl','conference':'conf','other':'ver'}.get(v.get('type'),'ver')
            tag = f"{suffix}{counters[v.get('type','other')]}" if counters[v.get('type','other')] > 1 else suffix
            key = f"{base}-{tag}"
            vkeys.append(key)
            etype = 'inproceedings' if v.get('type') == 'conference' else 'article'
            title = v.get('title') or work.get('title')
            authors = v.get('authors') or work.get('authors') or []
            title_field = brace(escape_latex(title)) if title else None
            fields = {
                'author': authors_str(authors) if authors else None,
                'title': title_field,
                'year': v.get('year'),
                'doi': escape_latex(v['doi']) if v.get('doi') else None,
                'arxiv': escape_latex(work['arxiv']) if work.get('arxiv') else None,
                'abbr': brace(escape_latex(v['abbr'])) if v.get('abbr') else None,
                'selected': 'true' if v.get('selected') else None,
                'award': brace(escape_latex(v['award'])) if v.get('award') else None,
                'combos': escape_latex(v['combos']) if v.get('combos') else None,
            }
            if v.get('type') == 'conference':
                fields['booktitle'] = brace(escape_latex(v['venue'])) if v.get('venue') else None
            elif v.get('type') == 'journal':
                fields['journal'] = brace(escape_latex(v['venue'])) if v.get('venue') else None
            elif v.get('type') == 'preprint':
                fields['journal'] = brace('arXiv preprint')
            entries.append({
                'key': key,
                'etype': etype,
                'fields': fields,
                'work_idx': len(work_keys),
                'conf_label_raw': v.get('abbr') or v.get('venue') if v.get('type') == 'conference' else None,
            })
        work_keys.append(vkeys)
    # second pass: if a work has a conference version, add extended note to non-conference versions using conference abbr when available
    for idx, vkeys in enumerate(work_keys):
        # collect conference venue for this work (first one)
        conf_label = None
        conf_key = None
        for e in entries:
            if e['work_idx'] == idx and e['etype'] == 'inproceedings':
                conf_label = e.get('conf_label_raw') or e['fields'].get('abbr') or e['fields'].get('booktitle')
                conf_key = e['key']
                break
        if not conf_label:
            continue
        for e in entries:
            if e['work_idx'] != idx:
                continue
            if e['etype'] != 'inproceedings':
                label = escape_latex(conf_label)
                e['fields']['extended'] = brace(f"An extended abstract was presented at {label}")
    # render
    out_lines = []
    for e in entries:
        out_lines.append(bib_entry(e['etype'], e['key'], e['fields']))
    OUT_BIB.write_text('\n'.join(out_lines), encoding='utf-8')
    print(f"Wrote {OUT_BIB} with {len(entries)} entries from {len(data)} works.")


if __name__ == '__main__':
    main()
