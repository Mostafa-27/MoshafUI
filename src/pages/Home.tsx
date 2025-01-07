import {
  Container,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { quranApi } from "../services/api";
import MushafPage from "../components/Quran/MushafPage";
import SmartPagination from "../components/Quran/SmartPagination";
import Layout from "../components/Layout/Layout";

export default function Home() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(2);

  const {
    data: pageData1,
    isLoading: isLoading1,
    error: error1,
  } = useQuery({
    queryKey: ["quran-page", currentPage1],
    queryFn: () => quranApi.getPage(currentPage1),
  });

  const {
    data: pageData2,
    isLoading: isLoading2,
    error: error2,
  } = useQuery({
    queryKey: ["quran-page", currentPage2],
    queryFn: () => quranApi.getPage(currentPage2),
    enabled: isLargeScreen, // Only fetch second page on large screens
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage1(newPage >= 604 ? 604 : newPage);
    if (isLargeScreen) {
      setCurrentPage2(newPage >= 604 ? 604 : newPage + 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const content = (
    <Container maxWidth="xl" className="py-1 max-h-screen">
      <Box
        className={`grid ${
          isLargeScreen ? "grid-cols-2" : "grid-cols-1"
        } gap-x-4`}
      >
        {isLargeScreen && currentPage1 <= 603 && currentPage2 <= 604 && (
          <MushafPage pageData={pageData2} />
        )}
        <MushafPage pageData={pageData1} />
      </Box>
      <SmartPagination
        currentPage={currentPage1}
        totalPages={604}
        onPageChange={handlePageChange}
      />
    </Container>
  );

  if (isLoading1 || (isLargeScreen && isLoading2)) {
    return (
      <Layout>
        <Box className="flex justify-center items-center h-[70vh]">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  if (error1 || (isLargeScreen && error2)) {
    return (
      <Layout>
        <Box className="text-center text-red-500 mt-8">
          Error loading Quran pages. Please try again later.
        </Box>
      </Layout>
    );
  }

  return (
    <Layout
      currentPage={currentPage1}
      totalPages={604}
      onPageChange={handlePageChange}
    >
      {content}
    </Layout>
  );
}
