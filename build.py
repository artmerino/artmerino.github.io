import json

with open('papers.json') as f:
    papers = json.load(f)

with open('venues.json') as f:
    venues = json.load(f)

def conferenceBibString(author, title, year, abbreviation, conference,  selected = None, arxiv = None, award=None, blog = None, code = None, combos = None, extended=None, doi = None, html = None, pdf = None, poster = None, slides = None, supportingMaterial = None, website = None, abstract = None):
    """
    author <str>: author of the paper
    title <str>: title of the paper
    year <int>: year of the paper
    abbreviation <str>: abbreviation of the conference
    conference <str>: full name of proceedings (e.g., "In. Proc of the 34th International Conference on Machine Learning" or "To appear in the 34th International Conference on Machine Learning")
    selected <bool>: whether the paper is selected to be highlighted
    arxiv <str>: arXiv code
    award <str>: award received by the paper
    blog <str>: blog post about the paper
    code <str>: code repository
    combos <str>: combos code of the paper
    extended <str>: extended information about the paper (e.g., "An extended abstract of this paper appeared on NeurIPS 2019 Workshop on Machine Learning with Guarantees")
    doi <str>: DOI of the paper
    html <str>: URL of the HTML version of the paper
    pdf <str>: URL of the PDF version of the paper
    poster <str>: URL of the poster
    slides <str>: URL of the slides
    supportingMaterial <str>: URL of the supporting material
    website <str>: URL of the website
    abstract <str>: abstract of the paper
    """
    return ""

for paper in papers:
    paperDic = papers[paper]
    title = paperDic['title']
    authors = paperDic['authors']
    if 'conference' in paperDic:
        confDic = paperDic['conference']
        if 'title' in confDic:
            title = confDic['title']
        if 'authors' in confDic:
            authors = confDic['authors']
        year = confDic['year']
        venue = confDic['venue']
        doi = confDic['doi']
    if 'journal' in paperDic:
        journalDic = paperDic['journal']
        if 'preparation' in paperDic['journal'] and journalDic['preparation'] == True:
            continue
        elif 'submitted' in paperDic['journal']:
            continue
        else: 
            if 'title' in journalDic:
                title = journalDic['title']
            if 'authors' in journalDic:
                authors = journalDic['authors']
            year = journalDic['year']
            venue = journalDic['venue']
            doi = journalDic['doi']
    if 'preprint' in paperDic:
        preprint = paperDic['preprint']
        if 'journal' not in paperDic and 'conference' not in paperDic:
            continue
    if 'conference' not in paperDic and 'journal' not in paperDic and 'preprint' not in paperDic:
        print(paperDic)
        continue

    
