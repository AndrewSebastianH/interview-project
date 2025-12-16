// components/dashboard/InsightCard.tsx
"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface InsightCardProps {
  title: string;
  value: string;
  gradient?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  gradient,
}) => {
  return (
    <Card
      style={{
        background:
          gradient || "linear-gradient(135deg, #11998e 0%, #0f766e 100%)",
      }}
      className="w-full p-4 shadow-sm"
    >
      <CardContent className="flex flex-col items-start justify-center">
        <Typography
          fontWeight={600}
          variant="subtitle1"
          className="text-amber-50"
          sx={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          {title}
        </Typography>
        <Typography
          fontWeight={700}
          variant="h5"
          className="text-white mt-2"
          sx={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
