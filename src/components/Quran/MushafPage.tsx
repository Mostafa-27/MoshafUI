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
    <Box
      className={`relative bg-[#FDF8EE] rounded-lg shadow-lg p-2 sm:p-3 md:py-6 md:px-8 min-h-[93vh] max-h-[90vh]
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
      <Box className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#8B4513] rounded-tl-lg" />
      <Box className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#8B4513] rounded-tr-lg" />
      <Box className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#8B4513] rounded-bl-lg" />
      <Box className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#8B4513] rounded-br-lg" />

      {/* Main Content */}
      <Box className="relative z-10 h-full">
        {/* Decorative Header */}
        <Box className="text-center mb-6">
          <div className="w-48 h-1 bg-[#8B4513] mx-auto mb-2 rounded-full" />
          <div className="w-32 h-1 bg-[#8B4513] mx-auto rounded-full" />
        </Box>

        {/* Quran Text */}
        <Box className="arabic-text text-right leading-loose text-xl sm:text-2xl md:text-3xl overflow-y-auto h-[calc(100%-8rem)] px-4">
          {pageData.verses.map((verse) => (
            <span key={verse.index} className="relative inline">
              {verse.text}
              <span className="inline-block mx-2 text-base sm:text-lg text-[#8B4513] font-[traditional-arabic]">
                ﴿{verse.aya}﴾
              </span>
            </span>
          ))}
        </Box>

        {/* Page Number */}
        <Box className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <div className="w-20 h-1 bg-[#8B4513] mx-auto mb-2 rounded-full" />
          <Typography className="text-[#8B4513] text-lg font-semibold">
            {pageData.page}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
