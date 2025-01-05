import { Box } from "@mui/material";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <Box className="min-h-screen bg-gray-50">{children}</Box>;
}
