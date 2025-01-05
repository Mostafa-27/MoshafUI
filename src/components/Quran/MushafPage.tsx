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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        className={`bg-white rounded-lg shadow-md p-6 h-[842px] relative
          ${isRightPage ? "border-l" : "border-r"} border-gray-200`}
      >
        <Box className="arabic-text text-right leading-loose text-2xl">
          {pageData.verses.map((verse) => (
            <span key={verse.index}>
              {verse.text}
              <span className="inline-block mx-2 text-base text-gray-500">
                ﴿{verse.aya}﴾
              </span>
            </span>
          ))}
        </Box>
        <Typography className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500">
          {pageData.page}
        </Typography>
      </Box>
    </motion.div>
  );
}
