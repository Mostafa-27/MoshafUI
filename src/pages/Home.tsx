import { Container, CircularProgress, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { quranApi } from "../services/api";
import MushafPage from "../components/Quran/MushafPage";
import MushafPagination from "../components/Quran/MushafPagination";

export default function Home() {
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

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
  });

  const handlePageChange = (newPage: number) => {
    console.log(newPage + 1);
    if (newPage > 0) {
      setCurrentPage1(Math.abs(newPage) + 2);
      setCurrentPage2(Math.abs(newPage) + 3);
    } else {
      setCurrentPage1(Math.abs(newPage) - 2);
      setCurrentPage2(Math.abs(newPage) - 3 || 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading1 || isLoading2) {
    return (
      <Box className="flex justify-center items-center h-[70vh]">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error1 || error2) {
    return (
      <Box className="text-center text-red-500 mt-8">
        Error loading Quran pages. Please try again later.
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Box className="grid grid-cols-2 gap-4">
        {currentPage2 > 1 && <MushafPage pageData={pageData2} isRightPage />}
        <MushafPage pageData={pageData1} />
      </Box>
      <MushafPagination
        currentPage={currentPage1}
        totalPages={604} // Total number of pages in the Quran
        onPageChange={handlePageChange}
      />
    </Container>
  );
}
