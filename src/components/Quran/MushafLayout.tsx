import { Box, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import MushafPage from "./MushafPage";

interface Ayah {
  index: number;
  sura: number;
  aya: number;
  text: string;
}

interface MushafLayoutProps {
  ayat: Ayah[];
}

export default function MushafLayout({ ayat }: MushafLayoutProps) {
  const theme = useTheme();
  const isLargeScreen = true;

  // Split ayat into pages (approximately 15 ayat per page)
  const ayatPerPage = 15;
  const pages: Ayah[][] = [];
  for (let i = 0; i < ayat.length; i += ayatPerPage) {
    pages.push(ayat.slice(i, i + ayatPerPage));
  }
  console.log(pages, "paaaaaages");
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pages[0]?.[0]?.sura}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box className="max-w-[1400px] mx-auto">
          <Box className="grid gap-4">
            {true ? (
              // Two-page spread for large screens
              <Box className="grid grid-cols-2 gap-2">
                {pages.map(
                  (pageAyat, index) =>
                    index % 2 === 0 && (
                      <Box
                        key={index}
                        className="col-span-2 grid grid-cols-2 gap-2"
                      >
                        {pages[index + 1] && (
                          <MushafPage
                            pageNumber={index}
                            ayat={pages[index]}
                            isRightPage
                          />
                        )}
                        {pages[index + 1] && (
                          <MushafPage
                            pageNumber={index + 2}
                            ayat={pages[index + 1]}
                            isRightPage
                          />
                        )}
                        <MushafPage pageNumber={index + 1} ayat={pageAyat} />
                      </Box>
                    )
                )}
              </Box>
            ) : (
              // Single page for small screens
              <Box className="grid gap-4">
                {pages.map((pageAyat, index) => (
                  <MushafPage
                    key={index}
                    pageNumber={index + 1}
                    ayat={pageAyat}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
