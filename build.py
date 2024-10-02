import json

def ordinal(n: int):
    if 11 <= (n % 100) <= 13:
        suffix = 'th'
    else:
        suffix = ['th', 'st', 'nd', 'rd', 'th'][min(n % 10, 4)]
    return str(n) + suffix

def authorsListToBibString(authorsList):
    authorsString = ""
    for i, author in enumerate(authorsList):
        lastSpace = author.rfind(" ")
        if lastSpace == -1:
            authorBibName = author
        else:
            authorBibName = f"{author[lastSpace+1:]}, {author[:lastSpace]}"
        if i == 0:
            authorsString += authorBibName
        else:
            authorsString += f" and {authorBibName}"
    return authorsString


def conferenceBibString(id,authors, title, year, abbreviation, conference,  extras = {}):
    """
    id <str>: unique identifier of the paper
    authors <str>: authors of the paper
    title <str>: title of the paper
    year <int>: year of the paper
    abbreviation <str>: abbreviation of the conference
    conference <str>: full name of proceedings (e.g., "In. Proc of the 34th International Conference on Machine Learning" or "To appear in the 34th International Conference on Machine Learning")
    
    Potential extras are:
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
    outString = f"@inproceedings{{{id},\n"
    outString += f"  author = {{{authors}}},\n"
    outString += f"  title = {{{{{title}}}}},\n"
    outString += f"  year = {{{year}}},\n"
    outString += f"  booktitle = {{{{{conference}}}}},\n"
    outString += f"  abbr = {{{{{abbreviation}}}}},\n"
    for extra in ['selected', 'award', 'arxiv', 'blog', 'code', 'combos', 'doi', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
        if extra in extras:
            outString += f"  {extra} = {{{extras[extra]}}},\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"  {extra} = {{{{extras[extra]}}}},\n"
    outString += "}\n"
    return outString

def journalBibString(id,authors, title, year, abbreviation, jorunal, extras={}):
    """
    id <str>: unique identifier of the paper
    authors <str>: authors of the paper
    title <str>: title of the paper
    year <int>: year of the paper
    abbreviation <str>: abbreviation of the journal
    journal <str>: full name of the journal

    Potential extras are:
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
    outString = f"@article{{{id},\n"
    outString += f"  author = {{{authors}}},\n"
    outString += f"  title = {{{{{title}}}}},\n"
    outString += f"  year = {{{year}}},\n"
    outString += f"  abbr = {{{{{abbreviation}}}}},\n"
    outString += f"  journal = {{{{{jorunal}}}}},\n"
    for extra in ['selected', 'award', 'arxiv', 'blog', 'code', 'combos', 'doi', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
        if extra in extras:
            outString += f"  {extra} = {{{extras[extra]}}},\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"  {extra} = {{{{{extras[extra]}}}}},\n"
    
    outString += "}\n"
    return outString

def preprintBibString(id,authors, title, year, extras={}):
    """
    id <str>: unique identifier of the paper
    authors <str>: authors of the paper
    title <str>: title of the paper
    year <int>: year of the paper

    Potential extras are:
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
    outString = f"@preprint{{{id},\n"
    outString += f"  author = {{{authors}}},\n"
    outString += f"  title = {{{{{title}}}}},\n"
    outString += f"  year = {{{year}}},\n"
    outString += f"  abbr = {{arXiv}},\n"
    if 'doi' in extras:
        if extras['doi']:
            outString += f"  doi = {{{extras['doi']}}},\n"
    for extra in ['selected', 'award', 'arxiv', 'blog', 'code', 'combos', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
        if extra in extras:
            outString += f"  {extra} = {{{extras[extra]}}},\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"  {extra} = {{{{{extras[extra]}}}}},\n"
    outString += "}\n"
    return outString



def buildBibFile():
    with open('papers.json') as f:
     papers = json.load(f)

    with open('venues.json') as f:
        venues = json.load(f)
    venuesConferenceDic = venues['conferences']
    journalConferenceDic = venues['journals']
    outputString = ""
    for i,paper in enumerate(papers):
        paperDic = papers[paper]
        title = paperDic['title']
        authors = paperDic['authors']
        nonArxivAvailable = False
        if 'conference' in paperDic:
            # Conference papers
            nonArxivAvailable = True
            confDic = paperDic['conference']
            if 'title' in confDic:
                title = confDic['title']
            if 'authors' in confDic:
                authors = confDic['authors']
            year = confDic['year']
            currentVer = int(year)-2020+int(venuesConferenceDic[confDic['venue']]['2020ed'])
            venue = confDic['venue']
            extras = confDic
            if "doi" not in extras or not confDic['doi']:
                proceedingsName = f"To appear in Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            else:
                proceedingsName = f"In Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            if 'preprint' in paperDic:
                extras['arxiv'] = paperDic['preprint']['arxiv']
            outputString=(conferenceBibString(f"conf-{i+1}", authorsListToBibString(authors), title, year, venue, proceedingsName, extras = extras))+outputString
        if 'journal' in paperDic:
            journalDic = paperDic['journal']
            if not ('preparation' in paperDic['journal'] and journalDic['preparation'] == True) and not 'submitted' in paperDic['journal']:
                nonArxivAvailable = True
                if 'title' in journalDic:
                    title = journalDic['title']
                if 'authors' in journalDic:
                    authors = journalDic['authors']
                year = journalDic['year']
                venue = journalDic['venue']
                extras = journalDic
                if 'doi' not in extras or not journalDic['doi']:
                    journalName = f"To appear in {journalConferenceDic[journalDic['venue']]['name']}"
                else:
                    journalName = f"{journalConferenceDic[journalDic['venue']]['name']}"
                if 'preprint' in paperDic:
                    extras['arxiv'] = paperDic['preprint']['arxiv']
                if 'conference' in paperDic:
                    extras['extended'] = f"An extended abstract was presented at {paperDic['conference']['venue']} {paperDic['conference']['year']}"
                outputString=(journalBibString(f"journal-{i+1}", authorsListToBibString(authors), title, year, venue, journalName, extras = extras))+outputString
        if 'preprint' in paperDic:
            # Preprints
            preprint = paperDic['preprint']
            if not nonArxivAvailable:
                if 'title' in journalDic:
                    title = journalDic['title']
                if 'authors' in journalDic:
                    authors = journalDic['authors']
                outputString=(preprintBibString(f"preprint-{i+1}", authorsListToBibString(authors), title, preprint['year'], extras = preprint))+outputString
        if 'conference' not in paperDic and 'journal' not in paperDic and 'preprint' not in paperDic:
            # Papers in preparation for which no preprint is available
            # print(paperDic)
            continue
    with open("_bibliography/papers.bib", "w") as text_file:
        text_file.write(outputString)
    return 

buildBibFile()
