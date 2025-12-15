// components/dashboard/InsightCard.tsx
"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface InsightCardProps {
  title: string;
  value: string;
  color?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, color }) => {
  return (
    <Card
      style={{ backgroundColor: color || "#f3f3f3" }}
      className="w-full p-4 shadow-sm"
    >
      <CardContent className="flex flex-col items-start justify-center">
        <Typography variant="subtitle2" className="text-gray-700">
          {title}
        </Typography>
        <Typography variant="h5" className="font-semibold mt-2">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
