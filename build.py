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

def authorsListToTexString(authorsList):
    authorsString = "with "
    shortList = authorsList.copy()
    shortList.remove("Arturo Merino")
    n = len(shortList)
    for i, author in enumerate(shortList):
        if i==0:
            authorsString += f"{author}"
        elif i<n-1:
            authorsString += f", {author}"
        elif i==n-1 and n==2:
            authorsString += f" and {author}"
        elif i==n-1 and n>2:
            authorsString += f", and {author}"
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
    if 'doi' in extras:
        if extras['doi'] and extras['doi'] != "False":
            outString += f"  doi = {{{extras['doi']}}},\n"
    if 'selected' in extras:
        if extras['selected'] and extras['selected'] != "False":
            outString += f"  selected = {{true}},\n"
    for extra in ['award', 'arxiv', 'blog', 'code', 'combos', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
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
    if 'doi' in extras:
        if extras['doi'] and extras['doi'] != "False":
            outString += f"  doi = {{{extras['doi']}}},\n"
    if 'selected' in extras:
        if extras['selected'] and extras['selected'] != "False":
            outString += f"  selected = {{true}},\n"
    for extra in ['award', 'arxiv', 'blog', 'code', 'combos', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
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
    outString = f"@article{{{id},\n"
    outString += f"  author = {{{authors}}},\n"
    outString += f"  title = {{{{{title}}}}},\n"
    outString += f"  year = {{{year}}},\n"
    outString += f"  abbr = {{arXiv}},\n"
    outString += f"  journal = {{arXiv preprint}},\n"
    for extra in ['selected', 'award', 'arxiv', 'blog', 'code', 'combos', 'html', 'pdf', 'poster', 'slides', 'supportingMaterial', 'website', 'abstract']:
        if extra in extras:
            outString += f"  {extra} = {{{extras[extra]}}},\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"  {extra} = {{{{{extras[extra]}}}}},\n"
    outString += "}\n"
    return outString

def conferenceTexString(id,journalId,authors, title, year, abbreviation, conference,  extras = {}):
    """
    id <int>: unique identifier of the paper
    journalId <int>: unique identifier of the journal version
    authors <str>: authors of the paper
    title <str>: title of the paper
    year <int>: year of the paper
    abbreviation <str>: abbreviation of the conference
    conference <str>: full name of conference
    
    Potential extras are:
    arxiv <str>: arXiv code
    award <str>: award received by the paper
    doi <str>: DOI of the paper
    """
    outString = f"""
\\begin{{cvpublication}}
\t{{C{id}}}
\t{{{title}}}
\t{{{authors}}}
\t{{{abbreviation}}}
\t{{{year}}}
    """
    outString += "{\n"
    outString += f"\t\\begin{{cvitems}}\n"
    outString += f"\t\\item {conference}\n"
    if 'doi' in extras:
        if extras['doi'] and extras['doi'] != "False":
            outString += f"\t\\item[] DOI: \\href{{https://doi.org/{extras['doi']}}}{{{extras['doi']}}}\n"
    if 'award' in extras:
        outString += f"\t\\item[] {extras['award']}\n"
    if 'doi' not in extras or not extras['doi']:
        if 'arxiv' in extras :
            outString += f"\t\\item[] Available on arXiv:\\href{{https://arxiv.org/abs/{extras['arxiv']}}}{{{extras['arxiv']}}}\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"\t\\item {extras[extra]}\n"
    if journalId=="preparation":
        outString += f"\t\\item Journal version in preparation\n"
    elif 'journalSubmitted' in extras:
        outString += f"\t\\item Journal version submitted to {extras['journalSubmitted']}\n"
    elif journalId>=0:
        outString += f"\t\\item Journal version: \\hyperlink{{paperC{journalId}}}{{[J{journalId}]}}\n"
    outString += f"\t\\end{{cvitems}}\n\t{'}'}\n\\end{{cvpublication}}"
    return outString

def journalTexString(id,conferenceID,authors, title, year, abbreviation, journal,  extras = {}):
    """
    id <int>: unique identifier of the paper
    conferenceID <int>: unique identifier of the conference version
    authors <str>: authors of the paper
    title <str>: title of the paper
    year <int>: year of the paper
    abbreviation <str>: abbreviation of the journal
    journal <str>: full name of the journal
    
    Potential extras are:
    arxiv <str>: arXiv code
    award <str>: award received by the paper
    doi <str>: DOI of the paper
    """
    outString = f"""
\\begin{{cvpublication}}
\t{{J{id}}}
\t{{{title}}}
\t{{{authors}}}
\t{{{abbreviation}}}
\t{{{year}}}
    """
    outString += "{\n"
    outString += f"\t\\begin{{cvitems}}\n"
    outString += f"\t\\item {journal}\n"
    if 'doi' in extras:
        if extras['doi'] and extras['doi'] != "False":
            outString += f"\t\\item[] DOI: \\href{{https://doi.org/{extras['doi']}}}{{{extras['doi']}}}\n"
    if 'award' in extras:
        outString += f"\t\\item[] {extras['award']}\n"
    if 'doi' not in extras or not extras['doi']:
        if 'arxiv' in extras :
            outString += f"\t\\item[] Available on arXiv:\\href{{https://arxiv.org/abs/{extras['arxiv']}}}{{{extras['arxiv']}}}\n"
    for extra in ['extended']:
        if extra in extras:
            outString += f"\t\\item {extras[extra]}\n"
    if conferenceID>=0:
        outString += f"\t\\item Conference version: \\hyperlink{{paperC{conferenceID}}}{{[C{conferenceID}]}}\n"
    outString += f"\t\\end{{cvitems}}\n\t{'}'}\n\\end{{cvpublication}}"
    return outString


def buildBibFile():
    with open('papers.json') as f:
     papers = json.load(f)

    with open('venues.json') as f:
        venues = json.load(f)
    venuesConferenceDic = venues['conferences']
    journalConferenceDic = venues['journals']
    conferenceString = ""
    journalString = ""
    preprintString = ""
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
            extras = paperDic | confDic
            if "doi" not in extras or not confDic['doi']:
                proceedingsName = f"To appear in Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            else:
                proceedingsName = f"In Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            if 'preprint' in paperDic:
                extras['arxiv'] = paperDic['preprint']['arxiv']
            conferenceString=(conferenceBibString(f"conf-{i+1}", authorsListToBibString(authors), title, year, venue, proceedingsName, extras = extras))+conferenceString
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
                extras = paperDic | journalDic
                if 'doi' not in extras or not journalDic['doi']:
                    journalName = f"To appear in {journalConferenceDic[journalDic['venue']]['name']}"
                else:
                    journalName = f"{journalConferenceDic[journalDic['venue']]['name']}"
                if 'preprint' in paperDic:
                    extras['arxiv'] = paperDic['preprint']['arxiv']
                if 'conference' in paperDic:
                    extras['extended'] = f"An extended abstract was presented at {paperDic['conference']['venue']} {paperDic['conference']['year']}"
                journalString=(journalBibString(f"journal-{i+1}", authorsListToBibString(authors), title, year, venue, journalName, extras = extras))+journalString
        if 'preprint' in paperDic:
            # Preprints
            preprint = paperDic['preprint']
            if not nonArxivAvailable:
                if 'title' in journalDic:
                    title = journalDic['title']
                if 'authors' in journalDic:
                    authors = journalDic['authors']
                preprintString=(preprintBibString(f"preprint-{i+1}", authorsListToBibString(authors), title, preprint['year'], extras = preprint))+preprintString
        if 'conference' not in paperDic and 'journal' not in paperDic and 'preprint' not in paperDic:
            # Papers in preparation for which no preprint is available
            # print(paperDic)
            continue
    with open("_bibliography/papers.bib", "w") as text_file:
        text_file.write(preprintString+conferenceString+journalString)
    return 

def preprintTexString(id,authors, title, year, arxiv,extras = {}):
    """
    id <int>: unique identifier of the paper
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
    outString = f"""
\\begin{{cvpublication}}
\t{{P{id}}}
\t{{{title}}}
\t{{{authors}}}
\t{{arXiv}}
    """
    if year:
        outString += f"{{{year}}}\n"
    else:
        outString += "\n"
    outString += f"\t{'{'}\n\t\\begin{{cvitems}}\n"
    if arxiv:
        outString += f"\t\t\\item Available on arXiv:\\href{{https://arxiv.org/abs/{arxiv}}}{{{arxiv}}}\n"
    else:
        outString += f"\t\t\\item Available upon request\n"
    if 'conferenceSubmitted' in extras:
        outString += f"\t\t\\item Submitted to {extras['conferenceSubmitted']}\n"
    if 'journalSubmitted' in extras:
        outString += f"\t\t\\item Submitted to {extras['journalSubmitted']}\n"
    outString += f"\t\\end{{cvitems}}\n\t{'}'}\n\\end{{cvpublication}}"
    return outString


def buildTexFile():
    with open('papers.json') as f:
        papers = json.load(f)
    with open('venues.json') as f:
        venues = json.load(f)
    venuesConferenceDic = venues['conferences']
    journalConferenceDic = venues['journals']
    journalsId = {}
    journalIdx = 0
    conferenceId = {}
    conferenceIdx = 0
    shouldShowPreprint = {}
    outString = ""
    for i,paper in enumerate(papers):
        paperDic = papers[paper]
        if 'conference' in paperDic:
            conferenceIdx+=1
            conferenceId[i] = conferenceIdx
    for i,paper in enumerate(papers):
        paperDic = papers[paper]
        title = paperDic['title']
        authors = paperDic['authors']
        shouldShowPreprint[i] = True
        if 'journal' in paperDic:
            journalDic = paperDic['journal']
            if not ('preparation' in paperDic['journal'] and journalDic['preparation'] == True) and not 'submitted' in paperDic['journal']:
                journalIdx+=1
                journalsId[i] = journalIdx
                shouldShowPreprint[i] = False
                if 'title' in journalDic:
                    title = journalDic['title']
                if 'authors' in journalDic:
                    authors = journalDic['authors']
                year = journalDic['year']
                venue = journalDic['venue']
                extras = paperDic | journalDic
                if 'doi' not in extras or not journalDic['doi']:
                    journalName = f"To appear in {journalConferenceDic[journalDic['venue']]['name']}"
                else:
                    journalName = f"{journalConferenceDic[journalDic['venue']]['name']}"
                if 'preprint' in paperDic:
                    extras['arxiv'] = paperDic['preprint']['arxiv']
                outString+=(journalTexString(f"{journalIdx}", conferenceId[i] ,authorsListToTexString(authors), title, year, venue, journalName, extras = extras))
            elif ('preparation' in paperDic['journal'] and journalDic['preparation'] == True):
                journalsId[i] = "preparation"
            elif 'submitted' in paperDic['journal']:
                journalsId[i] = journalDic['submitted']
    for i,paper in enumerate(papers):
        paperDic = papers[paper]
        title = paperDic['title']
        authors = paperDic['authors']
        if 'conference' in paperDic:
            # Conference papers
            journalId = journalsId[i]
            shouldShowPreprint[i] = False
            confDic = paperDic['conference']
            if 'title' in confDic:
                title = confDic['title']
            if 'authors' in confDic:
                authors = confDic['authors']
            year = confDic['year']
            currentVer = int(year)-2020+int(venuesConferenceDic[confDic['venue']]['2020ed'])
            venue = confDic['venue']
            extras = paperDic | confDic
            if "doi" not in extras or not confDic['doi']:
                proceedingsName = f"To appear in Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            else:
                proceedingsName = f"In Proc. {ordinal(currentVer)} {venuesConferenceDic[confDic['venue']]['name']}"
            if 'preprint' in paperDic:
                extras['arxiv'] = paperDic['preprint']['arxiv']
            if 'journal' in paperDic:
                if 'submitted' in paperDic['journal']:
                    extras['journalSubmitted'] = journalConferenceDic[paperDic['journal']['submitted']]['name']
            outString+=(conferenceTexString(f"{conferenceId[i]}", journalId ,authorsListToTexString(authors), title, year, venue, proceedingsName, extras = extras))
    preprintIdx=0
    for i,paper in enumerate(papers):
        paperDic = papers[paper]
        title = paperDic['title']
        authors = paperDic['authors']
        extras = {}
        if 'preprint' in paperDic:
            # Preprints
            preprintDic = paperDic['preprint']
            if 'title' in preprintDic:
                title = preprintDic['title']
            if 'authors' in preprintDic:
                authors = preprintDic['authors']
            if 'year' in preprintDic:
                year = preprintDic['year']
            else:
                year = False
            if 'journal' in paperDic:
                if 'submitted' in paperDic['journal']:
                    extras['journalSubmitted'] = journalConferenceDic[paperDic['journal']['submitted']]['name']
            if 'conference' in paperDic:
                if 'submitted' in paperDic['conference']:
                    extras['conferenceSubmitted'] = venuesConferenceDic[paperDic['conference']['submitted']]['name']
            if shouldShowPreprint[i] and 'arxiv' not in preprintDic:
                preprintIdx+=1
                outString+=(preprintTexString(f"{preprintIdx}", authorsListToTexString(authors), title, year, False,extras = extras))
            elif shouldShowPreprint[i] and 'arxiv' in preprintDic:
                preprintIdx+=1
                outString+=(preprintTexString(f"{preprintIdx}", authorsListToTexString(authors), title, year, preprintDic['arxiv'],extras = extras))
    with open("CV/data/publications.tex", "w") as text_file:
        text_file.write(outString)
    return 

def buildVenuesFile():
    with open('venues.json') as f:
        venues = json.load(f)
    outputString = "arXiv:\n  url: https://arxiv.org/\n  color: \"#41424C\"\n"
    conferencesDic = venues['conferences']
    journalsDic = venues['journals']
    for conference in conferencesDic:
        outputString += f"{conference}: \n  color: \"#196ca3\"\n"
    for journal in journalsDic:
        outputString += f"{journal}: \n  url: {journalsDic[journal]['url']}\n  color: \"#c32b72\"\n"
    with open("_data/venues.yml", "w") as text_file:
        text_file.write(outputString)
    return


buildTexFile()
# buildBibFile()
# buildVenuesFile()
