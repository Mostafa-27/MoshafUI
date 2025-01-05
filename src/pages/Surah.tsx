import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { quranApi } from "../services/api";
import MushafLayout from "../components/Quran/MushafLayout";

interface Ayah {
  index: number;
  sura: number;
  aya: number;
  text: string;
}

export default function Surah() {
  const { id } = useParams();
  const suraId = parseInt(id || "1");
  const [ayat, setAyat] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await quranApi.getSurah(suraId);
        setAyat(data);
      } catch (err) {
        setError("Error loading surah. Please try again later.");
        console.error("Error fetching surah:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurah();
  }, [suraId]);

  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-[70vh]">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center mt-8">
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="mb-6 text-center">
        Surah {suraId}
      </Typography>
      <MushafLayout ayat={ayat} />
    </Container>
  );
}
