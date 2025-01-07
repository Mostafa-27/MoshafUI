import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

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
  // Function to split text into words and preserve verse numbers
  const splitIntoWords = (text: string): string[] => {
    return text.split(/\s+/).filter((word) => word.length > 0);
  };

  // Function to format verses into lines with 9 words each
  const formatIntoLines = (verses: Verse[]): FormattedLine[] => {
    const lines: FormattedLine[] = [];
    let currentLine: string[] = [];
    let currentVerseNumbers: { number: number; position: number }[] = [];

    // Flatten all words and track verse numbers
    const allWords = verses.reduce((acc, verse) => {
      const words = splitIntoWords(verse.text);
      acc.push(
        ...words.map((word, idx) => {
          if (idx === words.length - 1) {
            return { word, verseNumber: verse.aya };
          }
          return { word };
        })
      );
      return acc;
    }, [] as Array<{ word: string; verseNumber?: number }>);

    // Group words into lines of 9
    allWords.forEach((wordObj, idx) => {
      currentLine.push(wordObj.word);
      if (wordObj.verseNumber) {
        currentVerseNumbers.push({
          number: wordObj.verseNumber,
          position: currentLine.length - 1,
        });
      }

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

  return (
    <Box
      className={`relative bg-[#FDF8EE] rounded-lg shadow-lg p-2 sm:p-3 md:py-4 md:px-6 min-h-[93vh] max-h-[90vh]
        ${isRightPage ? "border-l" : "border-r"} border-gray-300`}
      sx={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 69, 19, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "25px 25px",
      }}
    >
      {/* Decorative Corner Borders */}
      <Box className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#8B4513] rounded-tl-lg" />
      <Box className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#8B4513] rounded-tr-lg" />
      <Box className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#8B4513] rounded-bl-lg" />
      <Box className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#8B4513] rounded-br-lg" />

      {/* Main Content */}
      <Box className="relative z-10 h-full">
        {/* Decorative Header */}
        <Box className="text-center mb-4">
          <div className="w-36 h-0.5 bg-[#8B4513] mx-auto mb-1 rounded-full" />
          <div className="w-24 h-0.5 bg-[#8B4513] mx-auto rounded-full" />
        </Box>

        {/* Quran Text */}
        <Box className="arabic-text text-right h-[calc(100%-6rem)] px-4 flex flex-col">
          {formattedLines.map((line, index) => {
            const words = line.text.split(" ");
            return (
              <div
                key={index}
                className="text-center mb-0.5 leading-[1.8] text-lg sm:text-xl md:text-2xl"
                style={{
                  fontFeatureSettings: "'kern' 1, 'liga' 1, 'calt' 1",
                  letterSpacing: "-0.5px",
                }}
              >
                {words.map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {word}
                    {line.verseNumbers.map((vn) =>
                      vn.position === wordIndex ? (
                        <span
                          key={vn.number}
                          className="inline-block mx-0.5 text-sm sm:text-base text-[#8B4513] font-[traditional-arabic] align-baseline"
                        >
                          ﴿{vn.number}﴾
                        </span>
                      ) : null
                    )}
                    {wordIndex < words.length - 1 && " "}
                  </span>
                ))}
              </div>
            );
          })}
        </Box>

        {/* Page Number */}
        <Box className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <div className="w-16 h-0.5 bg-[#8B4513] mx-auto mb-1 rounded-full" />
          <Typography className="text-[#8B4513] text-base font-semibold">
            {pageData.page}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
