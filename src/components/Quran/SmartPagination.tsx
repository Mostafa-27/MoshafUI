import {
  Box,
  IconButton,
  Typography,
  Button,
  TextField,
  Popover,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import { useState } from "react";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SmartPaginationProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [jumpToPage, setJumpToPage] = useState("");

  const handleJumpClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleJumpClose = () => {
    setAnchorEl(null);
  };

  const handleJumpSubmit = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage("");
      handleJumpClose();
    }
  };

  const open = Boolean(anchorEl);

  // Calculate the current spread (two pages)
  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  return (
    <Box className="flex flex-row-reverse items-center justify-center gap-3 mt-6 mb-4">
      <IconButton
        onClick={() => onPageChange(1)}
        disabled={currentPage <= 1}
        className="hover:bg-gray-100"
        size="small"
      >
        <LastPage />
      </IconButton>

      <IconButton
        onClick={() => onPageChange(currentPage - 2)}
        disabled={currentPage <= 1}
        className="hover:bg-gray-100"
      >
        <ChevronRight />
      </IconButton>

      <Button
        variant="outlined"
        size="small"
        onClick={handleJumpClick}
        className="min-w-[160px]"
      >
        <Typography className="text-gray-700">
          {leftPage}-{rightPage} / {totalPages}
        </Typography>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleJumpClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box className="p-4 flex gap-2">
          <TextField
            size="small"
            label="Go to page"
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            inputProps={{
              min: 1,
              max: totalPages,
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleJumpSubmit}
            disabled={
              !jumpToPage ||
              parseInt(jumpToPage) < 1 ||
              parseInt(jumpToPage) > totalPages
            }
          >
            Go
          </Button>
        </Box>
      </Popover>

      <IconButton
        onClick={() => onPageChange(currentPage + 2)}
        disabled={rightPage >= totalPages}
        className="hover:bg-gray-100"
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={() => onPageChange(totalPages - 1)}
        disabled={rightPage >= totalPages}
        className="hover:bg-gray-100"
        size="small"
      >
        {/* <LastPage /> */}
        <FirstPage />
      </IconButton>
    </Box>
  );
}
