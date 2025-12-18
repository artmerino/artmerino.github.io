module Jekyll
  module Scholar
    # Monkey patch to add custom sorting by publication type within year groups
    class BibliographyTag < Liquid::Tag
      
      # Override the bibliography_list method to add custom sorting
      alias_method :original_bibliography_list, :bibliography_list
      
      def bibliography_list(bibliography, prefix, group)
        # Get the original sorted list
        entries = original_bibliography_list(bibliography, prefix, group)
        
        # If we're grouping by year, also sort by type within each year
        if config['group_by'] == 'year'
          # Sort the entries by type within the current group
          entries.sort! do |a, b|
            entry_sort_order(a) <=> entry_sort_order(b)
          end
        end
        
        entries
      end
      
      private
      
      def entry_sort_order(entry)
        # Lower numbers come first
        # 1 = journal articles (type: article, but NOT preprints)
        # 2 = conference papers (type: inproceedings)  
        # 3 = preprints (type: article with arXiv journal or abbr)
        
        if entry.type.to_s == 'article'
          # Check if it's a preprint by looking at journal field or abbr
          journal = entry['journal'].to_s.downcase
          abbr = entry['abbr'].to_s.downcase
          
          if journal.include?('arxiv') || journal.include?('preprint') || abbr.include?('arxiv')
            return 3  # Preprint
          else
            return 1  # Journal article
          end
        elsif entry.type.to_s == 'inproceedings' || entry.type.to_s == 'incollection'
          return 2  # Conference paper
        else
          return 4  # Other types
        end
      end
    end
  end
end
