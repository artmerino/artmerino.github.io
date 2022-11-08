require 'latex/decode'
# Disable the Math module of latex-decode as it interferes with MathJax
module LaTeX
  module Decode
    class Maths < Decoder
      def self.decode! (string)
        string
      end
    end
  end
end