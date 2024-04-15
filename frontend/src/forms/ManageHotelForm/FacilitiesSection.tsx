import { useFormContext } from 'react-hook-form'

import { HotelFormData } from './ManageHotelForm'
import { hotelFacilities } from '../../config/hotel-options-config'

const FacilitiesSection = () => {
  const { register, formState: { errors } } = useFormContext<HotelFormData>()
  return (
    <div>
      <h2 className='text-2xl font-bold mb-3'>Facilities</h2>
      <div className='grid grid-cols-5 gap-3'>
        {hotelFacilities.map((facility) => (
          <label key={facility} className='text-sm flex gap-1 text-gray-700'>
            <input
              type='checkbox'
              value={facility}
              {...register('facilities', {
                validate: (value) => value.length > 0 || 'Select at least one facility'
              })}
            ></input>
            <span>
              {facility}
            </span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className='text-red-500 text-sm font-bold'>{errors.facilities.message}</span>
      )}
    </div>
  )
}

export default FacilitiesSection