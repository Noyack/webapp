import { Typography } from "@mui/material"
import Logo from "./../../assets/noyackLogo.png"
import { useState } from "react"
import StepOne from "./StepOne"
import StepTwo from "./StepTwo"
import StepThree from "./StepThree"
import StepFour from "./StepFour"
import Steppers from "./components/Steppers"

function Onboarding() {
    const [step, setStep] = useState(1)
  return (
    <div className="flex flex-col p-10 bg-[#F1F1F1] min-h-screen">
        <header className="flex flex-col items-center gap-10">
            <div>
                <img className="" src={Logo} alt="Noyack logo"/>
            </div>
            <div className="text-center">
                <Typography variant="h2" fontSize={"35px"}>Step title here</Typography>
                <Typography variant="body2">Step description goes here</Typography>
            </div>
            <div>
                <Steppers completed={step} />
            </div>
        </header>
        <main>
            {step === 0 && <StepOne setStep={setStep} />}
            {step === 1 && <StepTwo setStep={setStep} />}
            {step === 2 && <StepThree />}
            {step === 3 && <StepFour />}
        </main>
    </div>
  )
}

export default Onboarding