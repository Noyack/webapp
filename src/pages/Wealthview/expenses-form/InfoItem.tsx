import { Typography, Divider } from "@mui/material";

// Info display component for summary view
interface InfoItemProps {
  label: string;
  value: string | number;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col w-full md:w-[calc(max(250px,40%))] gap-2 mb-4">
      <div className="flex flex-col">
        <Typography variant="subtitle1" fontWeight="medium">{label}</Typography>
        <Divider />
      </div>
      <Typography variant="body1">{value}</Typography>
    </div>
  );
}

export default InfoItem;