import { Typography } from '@mui/material'
import Logo from '../assets/noyackLogo.png'
import AsideImage from '../assets/sign-image.jpg'
import { SignInButton } from '@clerk/clerk-react'

function SignInPage() {
  return (
    <div className="min-h-screen grid grid-cols-[2fr_1fr] bg-[#F8F8F8] "> 
          {/* Main Content - Flexible middle column */}
          <div className='flex justify-center'>

          <main className="h-screen py-6 px-5 flex flex-col gap-[50px] justify-center content-center">
            <div className=" flex flex-col gap-10">
              <div className="flex gap-[35px]">
                  <img src={Logo} className="w-50"/>
                  
              <div className='flex gap-[5px] items-center'>
                <Typography>Already have an account?</Typography>
                <div className='text-[#009FE3]'>
                  <SignInButton />
                </div>
              </div>
              </div>
            </div>

            <div className=''>
              <Typography variant='h2' className='text-[39px] font-bold'>Explore our funds today</Typography>
              <Typography variant='caption' className='text-[16px]'>Create your free account and view our funds in just a few steps.</Typography>
            </div>

            <form className='sign-up-form'>
              <div className='flex flex-col gap-[13px]'>
                <div className='flex gap-[8px]'>
                  <input className='sign-input max-w-[220px]' type="text" placeholder='First Name' />
                  <input className='sign-input max-w-[220px]' type="text" placeholder='Last Name' />
                </div>
                <input className='sign-input' type="text" placeholder='Location' />
                <input className='sign-input' type="text" placeholder='Age'/>
                <input className='sign-input' type="text"  placeholder='Why are you interested in alts? '/>
                <input className='sign-input' type="text"  placeholder='Select accreditation status'/>
              </div>
              <button className='text-lg py-2'>
                Create An Account
              </button>
            </form>
          </main>
          </div>

          {/* Aside - Fixed width */}
          <div className="form-aside h-screen sticky top-0 flex justify-center items-center p-8 ">
          <img src={AsideImage} className=" aside-img rounded-[25px]  object-cover "/>
          </div>
        </div>
  )
}

export default SignInPage