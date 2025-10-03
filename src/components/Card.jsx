import React from 'react'

const Card = ({imageurl,movieTital,rating,year}) => {
  return (
    <div className="max-w-sm h-96 bg-gray-900 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="flex-1 p-3">
            <img className="rounded-lg w-full h-60 object-cover" src={imageurl} alt="Poster not availabel" />
        </div>
        <div className="p-4 bg-gray-900">
            <h5 className="mb-2 text-xl font-bold text-white">{movieTital}</h5>
            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <img className='h-5 w-5 mr-2' src="./star.png" alt="" />
                    <span className='text-yellow-400 text-lg font-semibold mr-3'>{rating}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='text-gray-400 text-sm'>{year}</span>
                    <span className='text-gray-400 text-sm'>•</span>
                    <span className='text-gray-400 text-sm'>Movie</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card