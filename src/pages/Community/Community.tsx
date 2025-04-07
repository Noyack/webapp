import ComingSoon from "../../routes/ComingSoon"

function Community() {
  const env = import.meta.env.VITE_ENV
  return (<>
    {env==='prod'&&
    <ComingSoon />}
    {env==='dev'&&
    <div>
      
    </div>
    }
    </>
  )
}

export default Community