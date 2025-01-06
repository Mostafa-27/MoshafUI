import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Menu, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { quranApi } from "../../services/api";
import { surahs } from "../../data/surahs";

interface NavigationDrawerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function NavigationDrawer({
  currentPage,
  totalPages,
  onPageChange,
}: NavigationDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [surahNumber, setSurahNumber] = useState("");
  const [ayahNumber, setAyahNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedSurah = surahs.find((s) => s.id === parseInt(surahNumber));

  const handleNavigate = () => {
    const page = parseInt(pageNumber);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageNumber("");
      setIsOpen(false);
    }
  };

  const handleSurahAyahSearch = async () => {
    if (!surahNumber || !ayahNumber) return;

    try {
      setIsLoading(true);
      const response = await quranApi.getPageNumberByAya(
        parseInt(surahNumber),
        parseInt(ayahNumber)
      );
      if (response) {
        onPageChange(response.page);
        setSurahNumber("");
        setAyahNumber("");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error searching by Surah/Ayah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 bg-white shadow-md hover:bg-gray-100"
        size="large"
      >
        <Menu />
      </IconButton>

      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          className: "w-80",
        }}
      >
        <Box className="p-4">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h6">Navigation</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Box className="flex flex-col gap-4">
            <Typography className="text-gray-600">
              Current Page: {currentPage}
            </Typography>
            <Typography className="text-gray-600 mb-4">
              Total Pages: {totalPages}
            </Typography>

            <TextField
              label="Go to page"
              type="number"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              inputProps={{
                min: 1,
                max: totalPages,
              }}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleNavigate}
              disabled={
                !pageNumber ||
                parseInt(pageNumber) < 1 ||
                parseInt(pageNumber) > totalPages
              }
              fullWidth
            >
              Go to Page
            </Button>

            <Divider className="my-4" />

            <Typography variant="subtitle1" className="font-medium">
              Search by Surah & Ayah
            </Typography>

            <Box className="flex flex-col gap-2">
              <FormControl fullWidth size="small">
                <InputLabel>Surah</InputLabel>
                <Select
                  value={surahNumber}
                  onChange={(e) => {
                    setSurahNumber(e.target.value);
                    setAyahNumber(""); // Reset ayah when surah changes
                  }}
                  label="Surah"
                >
                  {surahs.map((surah) => (
                    <MenuItem key={surah.id} value={surah.id}>
                      <span className="flex justify-between w-full">
                        <span>{surah.arabicName}</span>
                        <span className="text-gray-500">({surah.id})</span>
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Ayah</InputLabel>
                <Select
                  value={ayahNumber}
                  onChange={(e) => setAyahNumber(e.target.value)}
                  label="Ayah"
                  disabled={!selectedSurah}
                >
                  {selectedSurah &&
                    Array.from(
                      { length: selectedSurah.numberOfAyahs },
                      (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          {i + 1}
                        </MenuItem>
                      )
                    )}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              onClick={handleSurahAyahSearch}
              disabled={
                isLoading ||
                !surahNumber ||
                !ayahNumber ||
                parseInt(surahNumber) < 1 ||
                parseInt(surahNumber) > 114
              }
              fullWidth
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
