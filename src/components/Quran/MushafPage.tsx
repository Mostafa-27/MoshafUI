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

export default function MushafPage({
  pageData,
  isRightPage = false,
}: MushafPageProps) {
  return (
    <>
      <Box
        className={`bg-white rounded-lg shadow-md p-2 sm:p-3 md:py-3 md:px-4 min-h-[93vh] max-h-[90vh] relative
          ${isRightPage ? "border-l" : "border-r"} border-gray-200`}
      >
        <Box className="arabic-text text-right leading-loose text-base sm:text-xl md:text-2xl overflow-y-auto h-full">
          {pageData.verses.map((verse) => (
            <span key={verse.index}>
              {verse.text}
              <span className="inline-block mx-1 sm:mx-2 text-sm sm:text-base text-gray-500">
                ﴿{verse.aya}﴾
              </span>
            </span>
          ))}
        </Box>
        <Typography className="absolute bottom-[-4vh] left-1/2 -translate-x-1/2 text-gray-500 text-sm sm:text-base">
          {pageData.page}
        </Typography>
      </Box>
    </>
  );
}
