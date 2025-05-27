import { useState } from "react";
import InvestTypeCard from "./components/InvestTypeCard";
import { Button, Typography } from "@mui/material";
import { OnboardStepProps, UserTypeOption, ContactDetails, Address, IdentityDetails } from "../../types"; // Import types from types.ts

function StepOne({ setStep }: OnboardStepProps) {
  const [choice, setChoice] = useState<number | null>(1);
  const [stage, setStage] = useState<number>(1);
  const [formData, setFormData] = useState<{
    contactDetails: Partial<ContactDetails>;
    address: Partial<Address>;
    identity: Partial<IdentityDetails>;
  }>({
    contactDetails: {},
    address: {},
    identity: {}
  });

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

  const updateContactDetails = (field: keyof ContactDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value
      }
    }));
  };

  const updateAddress = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const updateIdentity = (field: keyof IdentityDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: value
      }
    }));
  };

  const customInput = "border-2 p-3 rounded-lg";
  
  const choices: UserTypeOption[] = [
    {
      id: 1,
      title: "Individual",
      caption: "For Myself",
      desc: "You are investing for yourself",
    },
    {
      id: 2,
      title: "Legal Entity",
      caption: "LLC, LP, trust, or corp",
      desc: "You are investing on behalf of an established legal entity",
    },
    {
      id: 3,
      title: "IRA",
      caption: "for retirement",
      desc: "Invest through an existing IRA or work with our team to set one up.",
    },
    {
      id: 4,
      title: "Custodial",
      caption: "for the benefit of someone else",
      desc: "You are investing on behalf of another individual",
    },
  ];
  
  return (
    <div className="flex flex-wrap justify-evenly py-10">
      {!choice && choices.map((option) => (
        <InvestTypeCard 
          key={option.id} 
          {...option} 
          setChoice={setChoice} 
        />
      ))}

      {choice && stage === 1 && (
        <>
          <form className="flex flex-col w-[calc(min(600px,90dvw))] gap-10 p-15 rounded-4xl shadow-lg bg-white">
            <Typography variant="h3" fontSize={"25px"} fontWeight={"bold"}>Contact Details</Typography>
            <div className="flex gap-3 flex-wrap">
              <input 
                type="text" 
                placeholder="John" 
                className={customInput}
                value={formData.contactDetails.firstName || ''}
                onChange={(e) => updateContactDetails('firstName', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Doe" 
                className={customInput}
                value={formData.contactDetails.lastName || ''}
                onChange={(e) => updateContactDetails('lastName', e.target.value)}
              />
            </div>
            <input 
              type="email" 
              placeholder="john@example.com" 
              className={customInput}
              value={formData.contactDetails.email || ''}
              onChange={(e) => updateContactDetails('email', e.target.value)}
            />
            <input 
              type="date" 
              placeholder="mm/dd/yyyy" 
              className={customInput}
              value={formData.contactDetails.dateOfBirth || ''}
              onChange={(e) => updateContactDetails('dateOfBirth', e.target.value)}
            />
            <input 
              type="tel" 
              placeholder="(000) 000-0000" 
              className={customInput}
              value={formData.contactDetails.phone || ''}
              onChange={(e) => updateContactDetails('phone', e.target.value)}
            />
            <div className="flex gap-5 self-end">
              <Button variant="contained" color="inherit" onClick={handleStagePrev}>Previous</Button>
              <Button variant="contained" color="success" onClick={handleStageAdvance}>Next</Button>
            </div>
          </form>
        </>
      )}
      
      {choice && stage === 2 && (
        <>
          <form className="flex flex-col w-[calc(min(600px,90dvw))] gap-10 p-15 rounded-4xl shadow-lg bg-white">
            <Typography variant="h3" fontSize={"25px"} fontWeight={"bold"}>Address</Typography>
            <div className="flex flex-col gap-1">
              <label>Street Address</label>
              <input 
                type="text" 
                placeholder="65W 5Av" 
                className={customInput}
                value={formData.address.streetAddress || ''}
                onChange={(e) => updateAddress('streetAddress', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Apt., Suite or Building#</label>
              <input 
                type="text" 
                placeholder="#" 
                className={customInput}
                value={formData.address.aptSuiteBuilding || ''}
                onChange={(e) => updateAddress('aptSuiteBuilding', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>City</label>
              <input 
                type="text" 
                placeholder="New York" 
                className={customInput}
                value={formData.address.city || ''}
                onChange={(e) => updateAddress('city', e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label>State</label>
                <input 
                  type="text" 
                  placeholder="Kansas City" 
                  className={customInput}
                  value={formData.address.state || ''}
                  onChange={(e) => updateAddress('state', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Zip / Postal Code</label>
                <input 
                  type="text" 
                  placeholder="123456" 
                  className={customInput}
                  value={formData.address.zipCode || ''}
                  onChange={(e) => updateAddress('zipCode', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-5 self-end">
              <Button variant="contained" color="inherit" onClick={handleStagePrev}>Previous</Button>
              <Button variant="contained" color="success" onClick={handleStageAdvance}>Next</Button>
            </div>
          </form>
        </>
      )}
      
      {choice && stage === 3 && (
        <>
          <form className="flex flex-col w-[calc(min(600px,90dvw))] gap-10 p-15 rounded-4xl shadow-lg bg-white">
            <Typography variant="h3" fontSize={"25px"} fontWeight={"bold"}>Social Security Number</Typography>
            <div className="flex flex-col gap-1">
              <label>SSN</label>
              <input 
                type="text" 
                placeholder="___-__-____" 
                className={customInput}
                value={formData.identity.ssn || ''}
                onChange={(e) => updateIdentity('ssn', e.target.value)}
              />
            </div>
            <div className="flex gap-5 self-end">
              <Button variant="contained" color="inherit" onClick={handleStagePrev}>Previous</Button>
              <Button variant="contained" color="success" onClick={handleStageAdvance}>Next</Button>
            </div>
          </form>
        </>
      )}
      
      {choice && stage === 4 && (
        <>
          <form className="flex flex-col w-[calc(min(600px,90dvw))] gap-10 p-15 rounded-4xl shadow-lg bg-white">
            <Typography variant="h3" fontSize={"25px"} fontWeight={"bold"}>Investor Accreditation</Typography>
            <div className="flex flex-col gap-5">
              <Typography>Are You an accredited investor? It's okay if you are not.</Typography>
              <div className="flex gap-5">
                <input type="checkbox" className={customInput}/>
                <label>Are You an accredited investor? It's okay if your are not.</label>
              </div>
              <div className="flex gap-5">
                <input type="checkbox" className={`${customInput}, self-baseline`}/>
                <label className="self-baseline">Yes, I have made over $200,000 individually, or $300,000 as a household
                  , over the last two years, and/or have a net worth over $1,000,000
                  excluding the value of my primary residence, or am representing a legal entity.
                </label>
              </div>
            </div>  
            <div className="flex gap-5 self-end">
              <Button variant="contained" color="inherit" onClick={handleStagePrev}>Previous</Button>
              <Button variant="contained" color="success" onClick={handleStageAdvance}>Next</Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default StepOne;