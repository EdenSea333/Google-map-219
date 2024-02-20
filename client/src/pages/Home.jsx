import React from 'react'

export default function Home() {
  return (
    <div style={{
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/006/303/790/non_2x/world-map-on-white-background-world-map-template-with-continents-north-and-south-america-europe-and-asia-africa-and-australia-vector.jpg")',
        backgroundSize: 'contain',
        height: '100vh'
      }}
      className=' justify-center flex'>
        <div className='h-full bg-slate-100 bg-opacity-50 w-full'>
          <p className='text-6xl text-center font-semibold text-slate-700 mt-40'></p>

        </div>
    </div>
  )
}

