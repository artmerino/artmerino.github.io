#!/usr/bin/env python3
"""
Convert BibTeX at _bibliography/papers.bib into grouped JSON with versions.
Writes to assets/json/bibliography.json.
Grouping heuristic: arXiv ID > DOI > normalized title.
Version types: preprint (arXiv), journal (article not arXiv), conference (inproceedings).
"""
import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
BIB_PATH = ROOT / '_bibliography' / 'papers.bib'
OUT_PATH = ROOT / 'assets' / 'json' / 'bibliography.json'


def parse_bibtex(text: str):
    entries = []
    cur = None
    buf = []
    for line in text.splitlines():
        if line.strip().startswith('@') and '{' in line:
            if cur:
                buf.append(line)
                entries.append('\n'.join(buf))
                buf = []
            cur = True
            buf.append(line)
        elif cur:
            buf.append(line)
    if buf:
        entries.append('\n'.join(buf))
    parsed = []
    for e in entries:
        m = re.match(r'@([^{]+)\{\s*([^,]+),', e)
        if not m:
            continue
        etype, key = m.group(1).strip(), m.group(2).strip()
        fields = {}
        for ln in e.splitlines()[1:]:
            ln = ln.strip().rstrip(',')
            if not ln or ln == '}':
                continue
            kvm = re.match(r'([^=]+)=\s*(.+)', ln)
            if not kvm:
                continue
            name = kvm.group(1).strip()
            val = kvm.group(2).strip()
            if val.startswith('{{') and val.endswith('}}'):
                val = val[2:-2]
            elif val.startswith('{') and val.endswith('}'):
                val = val[1:-1]
            elif val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            fields[name] = val
        parsed.append({'entry_type': etype.lower(), 'key': key, 'fields': fields})
    return parsed


def norm_title(t: str) -> str:
    t = t.lower()
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()


def to_grouped_json(parsed):
    works = {}
    for p in parsed:
        f = p['fields']
        gkey = f.get('arxiv') or f.get('doi') or (norm_title(f.get('title', '')) if f.get('title') else None) or p['key']
        if gkey not in works:
            works[gkey] = {
                'title': f.get('title'),
                'authors': [a.strip() for a in f.get('author', '').split(' and ')] if f.get('author') else None,
                'arxiv': f.get('arxiv'),
                'versions': []
            }
        # classify version type
        vtype = 'other'
        if p['entry_type'] == 'inproceedings':
            vtype = 'conference'
        elif p['entry_type'] == 'article':
            j = (f.get('journal') or '').lower()
            vtype = 'preprint' if 'arxiv' in j else 'journal'
        version = {
            'type': vtype,
            'year': f.get('year'),
            'abbr': f.get('abbr'),
            'title': f.get('title'),
            'authors': [a.strip() for a in f.get('author', '').split(' and ')] if f.get('author') else None,
            'venue': f.get('booktitle') if vtype == 'conference' else f.get('journal'),
            'doi': f.get('doi'),
            'selected': True if (f.get('selected', '').lower() == 'true') else False,
            'award': f.get('award'),
            'combos': f.get('combos')
        }
        # promote arxiv to work-level if present
        if f.get('arxiv') and not works[gkey].get('arxiv'):
            works[gkey]['arxiv'] = f.get('arxiv')
        works[gkey]['versions'].append(version)
        # prefer non-preprint for canonical title/authors
        if not works[gkey].get('title') or vtype == 'journal':
            works[gkey]['title'] = version['title'] or works[gkey]['title']
        if not works[gkey].get('authors') and version['authors']:
            works[gkey]['authors'] = version['authors']
        # no work-level year; keep years per version only
    # remove redundant fields from versions that match canonical work fields
    for w in works.values():
        c_title = w.get('title')
        c_authors = w.get('authors') or []
        for v in w['versions']:
            # drop identical authors
            if v.get('authors') is not None:
                va = v.get('authors') or []
                if va == c_authors:
                    v.pop('authors', None)
            # drop identical title
            if v.get('title') is not None and v.get('title') == c_title:
                v.pop('title', None)
            # if combos equals any canonical, lift to work-level and drop from version
        # lift shared combos if all versions share the same non-empty value
        combos_vals = [v.get('combos') for v in w['versions'] if v.get('combos')]
        if combos_vals:
            if len(set(combos_vals)) == 1:
                w['combos'] = combos_vals[0]
                for v in w['versions']:
                    v.pop('combos', None)
    return list(works.values())


def main():
    text = BIB_PATH.read_text(encoding='utf-8')
    parsed = parse_bibtex(text)
    out = to_grouped_json(parsed)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Wrote {OUT_PATH} with {len(out)} works.')


if __name__ == '__main__':
    main()
