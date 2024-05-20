import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"
import React from "react"

const ImagesSection = () => {
  const { register,
    watch,
    formState: { errors },
    setValue
  } = useFormContext<HotelFormData>()

  const existingImageUrls = watch('imageUrls')

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, // to specify the type of button event
    imageUrl: string
  ) => {
    event.preventDefault()
    setValue('imageUrls', existingImageUrls.filter((url) => url !== imageUrl))
   }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt="hotel"
                  className="min-h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={(event) => handleDelete(event, url)}
                  // absolute inset-0 means the button will be positioned at the top right corner of the parent div 
                  // absolute inset-0 means the button will be positioned based on its closest element that has className of relative
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100  text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register('imageFiles', {
            validate: (imageFiles: FileList) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0)
              if (totalLength === 0) { // no images uploaded yet 
                return 'Please upload at least one image'
              }

              if (totalLength > 6) {
                return 'Total number of images cannot be more than 6'
              }
               
              return true
            }
          })} />
      </div>
      {errors.imageFiles && <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>}
    </div>
  )
}

export default ImagesSection