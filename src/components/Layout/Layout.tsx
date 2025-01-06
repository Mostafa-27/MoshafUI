import { Box } from "@mui/material";
import { ReactNode } from "react";
import NavigationDrawer from "./NavigationDrawer";

interface LayoutProps {
  children: ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Layout({
  children,
  currentPage,
  totalPages,
  onPageChange,
}: LayoutProps) {
  return (
    <Box className="min-h-screen bg-gray-50">
      {currentPage && totalPages && onPageChange && (
        <NavigationDrawer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      {children}
    </Box>
  );
}
