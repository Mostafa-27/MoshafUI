import { useState } from "react";
import { Paper, InputBase, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Box className="max-w-2xl mx-auto w-full">
      <Paper
        component="form"
        className="p-2 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <InputBase
          className="ml-4 flex-1"
          placeholder="Search in Quran..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton type="submit" aria-label="search" className="p-2">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
