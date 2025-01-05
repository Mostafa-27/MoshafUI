import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface MushafPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MushafPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MushafPaginationProps) {
  return (
    <Box className="flex items-center justify-center gap-4 mt-6 mb-4">
      <IconButton
        onClick={() => onPageChange(-currentPage)}
        disabled={currentPage <= 1}
        className="hover:bg-gray-100"
      >
        <ChevronLeft />
      </IconButton>

      <Typography className="text-gray-700">
        Page {currentPage} of {totalPages}
      </Typography>

      <IconButton
        onClick={() => onPageChange(currentPage)}
        disabled={currentPage >= totalPages || currentPage >= 604}
        className="hover:bg-gray-100"
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
