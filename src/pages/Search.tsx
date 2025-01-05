import { Container } from "@mui/material";
import SearchBar from "../components/Quran/SearchBar";
import { useState } from "react";
import { useQuery } from "react-query";
import { quranApi } from "../services/api";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useQuery(
    ["search", searchQuery],
    () => (searchQuery ? quranApi.searchAyat(searchQuery) : null),
    { enabled: !!searchQuery }
  );

  return (
    <Container maxWidth="lg" className="py-8">
      <SearchBar onSearch={setSearchQuery} />
      {/* Add search results display here */}
    </Container>
  );
}
