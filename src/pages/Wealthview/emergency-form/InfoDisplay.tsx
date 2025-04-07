// src/components/EmergencyFunds/Summary/InfoDisplay.tsx
import React from 'react';
import { Typography, Divider } from "@mui/material";

interface InfoDisplayProps {
  label: string;
  value: string | number;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col w-full md:w-[calc(max(250px,40%))] gap-2 mb-4">
      <div className="flex flex-col">
        <Typography variant="subtitle1" fontWeight="medium">{label}</Typography>
        <Divider />
      </div>
      <Typography variant="body1">{value}</Typography>
    </div>
  );
};

export default InfoDisplay;