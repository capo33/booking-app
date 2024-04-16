import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"

const ImagesSection = () => {
  const { register, formState: { errors } } = useFormContext<HotelFormData>()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register('imageFiles', {
            validate: (imageFiles: FileList) => {
              const totalLength = imageFiles.length
              if (totalLength === 0) { // no images uploaded yet 
                return 'Please upload at least one image'
              }

              if (totalLength > 6) {
                return 'You can upload at most 6 images'
              }
              const validTypes = ['image/jpeg', 'image/png']
              for (let i = 0; i < totalLength; i++) {
                if (!validTypes.includes(imageFiles[i].type)) {
                  return 'Please upload only jpeg or png images'
                }
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