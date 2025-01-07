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

    const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
    const containerHeight = containerRef.current.offsetHeight;
    const lineCount = lineRefs.current.length;
    const targetLineHeight = (containerHeight / lineCount) * 0.95; // 95% of available height per line

    const adjustFontSize = () => {
      // First pass: Find a font size that fits the width
      let maxFontSize = 52;
      let minFontSize = 24;
      let bestFontSize = minFontSize;

      lineRefs.current.forEach((lineRef) => {
        if (!lineRef || !lineRef.firstChild) return;

        let currentFontSize = maxFontSize;
        while (minFontSize <= maxFontSize) {
          currentFontSize = Math.floor((minFontSize + maxFontSize) / 2);
          lineRef.style.fontSize = `${currentFontSize}px`;
          lineRef.style.lineHeight = "2.2";

          const lineHeight = lineRef.offsetHeight;
          const lineWidth = lineRef.scrollWidth;

          if (lineWidth > containerWidth || lineHeight > targetLineHeight) {
            maxFontSize = currentFontSize - 1;
          } else if (
            lineWidth < containerWidth - 18 &&
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

      // Second pass: Apply the best font size to all lines
      lineRefs.current.forEach((lineRef) => {
        if (!lineRef) return;
        lineRef.style.fontSize = `${bestFontSize}px`;
        lineRef.style.lineHeight = "2.2";
      });

      console.log(`Final font size: ${bestFontSize}px`);
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [formattedLines]);

  return (
    <Box
      className={`relative bg-white rounded-lg shadow-lg p-0.5 sm:p-1 md:py-2 md:px-3 min-h-[85vh] sm:min-h-[90vh] md:min-h-[93vh] max-h-[85vh] sm:max-h-[90vh] md:max-h-[93vh] w-full mx-auto border border-gray-300 ${
        isRightPage ? "border-l" : "border-r"
      }`}
    >
      {/* Main Content */}
      <Box className="relative z-10 h-full py-6">
        {/* Quran Text */}
        <Box
          ref={containerRef}
          className="arabic-text h-[calc(100%-2rem)] px-4 sm:px-6 md:px-8 flex flex-col justify-between"
        >
          {formattedLines.map((line, index) => {
            const words = line.text.split(" ");
            return (
              <div
                key={index}
                ref={(el) => (lineRefs.current[index] = el)}
                className="text-center leading-[1.5] whitespace-nowrap"
                style={{
                  fontFeatureSettings: "'kern' 1, 'liga' 1, 'calt' 1",
                  letterSpacing: "2px",
                  textAlign: "justify",
                  textAlignLast: "center",
                  paddingInline: "10%",
                }}
              >
                {words.map((word, wordIndex) => (
                  <span key={wordIndex} className="mx-[0.1em]">
                    {word}
                    {line.verseNumbers.map((vn) =>
                      vn.position === wordIndex ? (
                        <span
                          key={vn.number}
                          className="verse-number inline-block mx-1"
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
        <Box className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <Typography className="text-gray-600 text-sm font-semibold">
            {pageData.page}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
