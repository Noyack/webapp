import { useState, FormEvent } from 'react'
import Logo from '../assets/noyackLogo.png'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'
import { UserCreationData } from '../types';


function Creation() {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [age, setAge] = useState<number | undefined>();
  const [location, setLocation] = useState<string>("");
  const { user } = useUser();
  
  const handleSubmitCreation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate data before submission
    if (!fname || !lname || !age || !location) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      const userData: UserCreationData = {
        fname,
        lname,
        email: user?.emailAddresses,
        age,
        location
      };
      
      await axios.post(`http://localhost:3000/users`, userData);
      // Handle successful submission - maybe redirect or show success message
      console.log("User profile created successfully");
    } catch (error) {
      console.error("Error creating user profile:", error);
      // Handle error - show error message to user
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-[2fr_1fr] bg-[#F8F8F8]"> 
      {/* Main Content - Flexible middle column */}
      <div className='flex justify-center'>
        <main className="h-screen py-6 px-5 flex flex-col gap-[50px] justify-center content-center">
          <div className="flex flex-col gap-10">
            {/* Content can go here */}
          </div>
          <form onSubmit={handleSubmitCreation} className='sign-up-form'>
            <div className='flex flex-col gap-[13px]'>
              <div className='flex gap-[8px]'>
                <input 
                  onChange={(e) => setFname(e.target.value)} 
                  className='sign-input max-w-[220px]' 
                  type="text" 
                  placeholder='First Name'
                  required 
                />
                <input 
                  onChange={(e) => setLname(e.target.value)} 
                  className='sign-input max-w-[220px]' 
                  type="text" 
                  placeholder='Last Name'
                  required 
                />
              </div>
              <input 
                onChange={(e) => setLocation(e.target.value)} 
                className='sign-input' 
                type="text" 
                placeholder='Location'
                required 
              />
              <input 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setAge(undefined);
                  } else {
                    setAge(parseInt(val, 10));
                  }
                }} 
                className='sign-input' 
                type="number" 
                placeholder='Age'
                required
              />
            </div>
            <button type='submit' className='text-lg py-2'>
              Create An Account
            </button>
          </form>
        </main>
      </div>

      {/* Aside - Fixed width */}
      <div className="creation-form-aside h-screen sticky top-0 flex justify-center items-center p-8">
        <div className="flex gap-[35px]">
          <img src={Logo} alt="Noyack Logo" className="w-50 creation-aside"/>
        </div>
      </div>
    </div>
  )
}

export default Creation