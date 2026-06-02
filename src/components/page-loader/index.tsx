import { Loader } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader className="animate-spin text-accent" size={30} />
    </div>
  )
}

export default PageLoader