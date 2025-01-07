import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Verse {
  index: number;
  sura: number;
  aya: number;
  text: string;
}

interface PageData {
  page: number;
  startVerse: { sura: number; aya: number };
  endVerse: { sura: number; aya: number };
  verses: Verse[];
}

interface MushafPageProps {
  pageData: PageData;
  isRightPage?: boolean;
}

interface FormattedLine {
  text: string;
  verseNumbers: { number: number; position: number }[];
}

export default function MushafPage({
  pageData,
  isRightPage = false,
}: MushafPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to split text into words and preserve verse numbers
  const splitIntoWords = (text: string): string[] => {
    // Remove special formatting characters and extra spaces
    const cleanText = text.replace(/[﴿﴾]/g, "").replace(/\s+/g, " ").trim();
    return cleanText
      .split(" ")
      .filter((word) => word.length > 0 && !/^\d+$/.test(word));
  };

  // Function to format verses into lines with 9 words each
  const formatIntoLines = (verses: Verse[]): FormattedLine[] => {
    const lines: FormattedLine[] = [];
    let currentLine: string[] = [];
    let currentVerseNumbers: { number: number; position: number }[] = [];

    // Flatten all words and track verse numbers
    const allWords = verses.reduce((acc, verse) => {
      const words = splitIntoWords(verse.text);
      const wordsWithVerseInfo = words.map((word, idx) => {
        if (idx === words.length - 1) {
          return { word, verseNumber: verse.aya };
        }
        return { word };
      });
      return [...acc, ...wordsWithVerseInfo];
    }, [] as Array<{ word: string; verseNumber?: number }>);

    // Group words into lines of 9
    allWords.forEach((wordObj, idx) => {
      // Only add actual words (not verse numbers or formatting)
      if (wordObj.word.length > 0 && !/^\d+$/.test(wordObj.word)) {
        currentLine.push(wordObj.word);
      }

      if (wordObj.verseNumber) {
        currentVerseNumbers.push({
          number: wordObj.verseNumber,
          position: currentLine.length - 1,
        });
      }

      // Create a new line when we reach 9 actual words or it's the last word
      if (currentLine.length === 9 || idx === allWords.length - 1) {
        if (currentLine.length > 0) {
          lines.push({
            text: currentLine.join(" "),
            verseNumbers: currentVerseNumbers,
          });
          currentLine = [];
          currentVerseNumbers = [];
        }
      }
    });

    // Ensure we have exactly 15 lines
    while (lines.length < 15) {
      lines.push({ text: "", verseNumbers: [] });
    }

    // Take only first 15 lines if we have more
    return lines.slice(0, 15);
  };

  const formattedLines = formatIntoLines(pageData.verses);

  // Function to adjust font size for each line
  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth - 20; // Reduced padding
    const containerHeight = containerRef.current.offsetHeight;
    const lineCount = lineRefs.current.length;
    const targetLineHeight = (containerHeight / lineCount) * 0.98; // Increased height ratio

    const adjustFontSize = () => {
      const screenWidth = window.innerWidth;
      // Reduced font sizes
      let maxFontSize = screenWidth < 640 ? 28 : screenWidth < 1024 ? 32 : 38;
      let minFontSize = screenWidth < 640 ? 14 : screenWidth < 1024 ? 16 : 20;
      let bestFontSize = minFontSize;

      // Even tighter spacing for better containment
      const baseWordSpacing =
        screenWidth < 640 ? 0.3 : screenWidth < 1024 ? 0.4 : 0.5;
      const baseLineHeight =
        screenWidth < 640 ? 1.4 : screenWidth < 1024 ? 1.6 : 1.8;

      lineRefs.current.forEach((lineRef) => {
        if (!lineRef || !lineRef.firstChild) return;

        let currentFontSize = maxFontSize;
        while (minFontSize <= maxFontSize) {
          currentFontSize = Math.floor((minFontSize + maxFontSize) / 2);
          lineRef.style.fontSize = `${currentFontSize}px`;
          lineRef.style.lineHeight = `${baseLineHeight}`;
          lineRef.style.wordSpacing = `${baseWordSpacing}em`;

          const lineHeight = lineRef.offsetHeight;
          const lineWidth = lineRef.scrollWidth;

          if (lineWidth > containerWidth || lineHeight > targetLineHeight) {
            maxFontSize = currentFontSize - 1;
          } else if (
            lineWidth < containerWidth - (screenWidth < 640 ? 6 : 10) &&
            lineHeight < targetLineHeight
          ) {
            minFontSize = currentFontSize + 1;
            bestFontSize = Math.max(bestFontSize, currentFontSize);
          } else {
            bestFontSize = currentFontSize;
            break;
          }
        }
      });

      // Apply the best font size and spacing to all lines
      lineRefs.current.forEach((lineRef) => {
        if (!lineRef) return;
        lineRef.style.fontSize = `${bestFontSize}px`;
        lineRef.style.lineHeight = `${baseLineHeight}`;
        lineRef.style.wordSpacing = `${baseWordSpacing}em`;
      });
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [formattedLines]);

  return (
    <Box
      className={`relative bg-white rounded-lg shadow-lg p-0.5 sm:p-1 md:py-1 md:px-2 
      min-h-[90vh] sm:min-h-[92vh] md:min-h-[95vh] 
      max-h-[90vh] sm:max-h-[92vh] md:max-h-[95vh] 
      w-[95vw] sm:w-[90vw] md:w-[48vw] lg:w-[45vw] 
      mx-auto border-8 border-double border-[#8B4513] ${
        isRightPage ? "border-l" : "border-r"
      }`}
    >
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-t-4 border-l-4 border-[#8B4513] rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-t-4 border-r-4 border-[#8B4513] rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-b-4 border-l-4 border-[#8B4513] rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-b-4 border-r-4 border-[#8B4513] rounded-br-lg" />

      {/* Decorative Corner Patterns */}
      <div className="corner-pattern corner-pattern-tl" />
      <div className="corner-pattern corner-pattern-tr" />
      <div className="corner-pattern corner-pattern-bl" />
      <div className="corner-pattern corner-pattern-br" />

      {/* Inner Border */}
      <Box className="relative z-10 h-full py-2 sm:py-3 border-4 border-[#8B4513] mx-1 sm:mx-2 my-1 sm:my-2 rounded-lg">
        {/* Quran Text */}
        <Box
          ref={containerRef}
          className="arabic-text h-[calc(100%-1rem)] px-1 sm:px-2 flex flex-col justify-between items-center mx-auto"
        >
          {formattedLines.map((line, index) => {
            const words = line.text.split(" ");
            return (
              <div
                key={index}
                ref={(el) => (lineRefs.current[index] = el)}
                className="text-center whitespace-nowrap w-full"
                style={{
                  fontFeatureSettings: "'kern' 1, 'liga' 1, 'calt' 1",
                  letterSpacing: "0",
                  textAlign: "justify",
                  textAlignLast: "center",
                  paddingInline: window.innerWidth < 640 ? "3%" : "5%",
                }}
              >
                {words.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="inline-block mx-[0.06em] sm:mx-[0.08em]"
                  >
                    {word}
                    {line.verseNumbers.map((vn) =>
                      vn.position === wordIndex ? (
                        <span
                          key={vn.number}
                          className="verse-number inline-block mx-0.5"
                          style={{ fontSize: "0.8em" }}
                        >
                          ﴿{vn.number}﴾
                        </span>
                      ) : null
                    )}
                  </span>
                ))}
              </div>
            );
          })}
        </Box>

        {/* Page Number */}
        <Box className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
          <Typography className="text-gray-600 text-xs font-semibold">
            {pageData.page}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
