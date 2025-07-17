import { Button, Select, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import { OnboardStepProps } from "../../types";

const customInput = "border-2 p-3 rounded-lg";

function StepTwo({ setStep }: OnboardStepProps) {
  const [choice] = useState<number | null>(1);
  const [stage, setStage] = useState<number>(1);
  const [recurring, setRecurring] = useState(false);
  const [type, setType] = useState("One Time");
  const [recurrence, setRecurrence] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (event: any) => {
    setRecurrence(Number(event.target.value));
  };

  const handleStageAdvance = () => {
    if (stage && stage < 4) {
      setStage((prev) => prev + 1);
    } else {
      setStep(1);
    }
  };

  const handleStagePrev = () => {
    if (stage && stage > 1) {
      setStage((prev) => prev - 1);
    }
  };

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType) {
      setType(newType);
      setRecurring(newType === "Recurring");
    }
  };

  return (
    <div className="flex flex-wrap justify-evenly py-10">
      {choice && stage === 1 && (
        <div className="flex flex-col w-[calc(min(600px,90dvw))] gap-5 p-15 rounded-4xl shadow-lg bg-white">
          <Typography variant="h3" fontSize={"25px"} fontWeight={"bold"}>
            Invest
          </Typography>
          <div className="flex justify-center">
            <ToggleButtonGroup
              color="primary"
              value={type}
              exclusive
              onChange={handleChange}
              aria-label="Payment recurrence"
            >
              <ToggleButton color="success" value="One Time">
                One Time
              </ToggleButton>
              <ToggleButton color="success" value="Recurring">
                Recurring
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {!recurring ? (
            <>
              <div className="flex gap-3 flex-wrap">
                <label className="font-semibold">How much would you like to invest?</label>
                <input type="text" placeholder="John" className={customInput} />
              </div>
              <Typography variant="caption" className="text-gray-400">
                Minimum Investment: $100
              </Typography>
              
            </>
          ) : (
            <>
              <div className="flex gap-3 flex-wrap">
                <label className="font-semibold">How much would you like to invest?</label>
                <input type="text" placeholder="John" className={customInput} />
              </div>
              <div className="flex gap-3 flex-wrap">
                <label className="font-semibold">Frequency</label>
                <Select value={recurrence} onChange={handleSelectChange}>
                  <MenuItem value={0}>Monthly</MenuItem>
                  <MenuItem value={1}>Semi-Yearly</MenuItem>
                  <MenuItem value={2}>Yearly</MenuItem>
                </Select>
              </div>
            </>
          )}
          <div className="flex gap-5 self-end">
                <Button variant="contained" color="inherit" onClick={handleStagePrev}>
                  Previous
                </Button>
                <Button variant="contained" color="success" onClick={handleStageAdvance}>
                  Next
                </Button>
              </div>
        </div>
      )}
    </div>
  );
}

export default StepTwo;
