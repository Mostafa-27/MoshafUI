import { Container, CircularProgress, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { quranApi } from "../services/api";
import MushafPage from "../components/Quran/MushafPage";
import SmartPagination from "../components/Quran/SmartPagination";

export default function Home() {
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
  });

  console.log(pageData1, "page1", pageData2, "page2");

  const handlePageChange = (newPage: number) => {
    setCurrentPage1(newPage);
    setCurrentPage2(newPage + 1);
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
        {<MushafPage pageData={pageData2} />}
        <MushafPage pageData={pageData1} />
      </Box>
      <SmartPagination
        currentPage={currentPage1}
        totalPages={604}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}
