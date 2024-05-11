import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  adultCount: number;
  childCount: number;
}

type ManageHotelFormProps = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
}

const ManageHotelForm = ({onSave, isLoading}:ManageHotelFormProps) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit } = formMethods // handleSubmit will handle any validation errors and pass the data to the onSubmit function

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    // create a new instance of the form data object and append the form data
    const formData = new FormData();
    formData.append('name', formDataJson.name);
    formData.append('city', formDataJson.city);
    formData.append('country', formDataJson.country);
    formData.append('description', formDataJson.description);
    formData.append('type', formDataJson.type);
    formData.append('pricePerNight', formDataJson.pricePerNight.toString()); // convert to string
    formData.append('starRating', formDataJson.starRating.toString());
    formData.append('adultCount', formDataJson.adultCount.toString());
    formData.append('childCount', formDataJson.childCount.toString());

    // formData.append('facilities', JSON.stringify(formDataJson.facilities));
    // for (let i = 0; i < formDataJson.imageFiles.length; i++) {
    //   formData.append('images', formDataJson.imageFiles[i]);
    // }

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility)
    })

    // we take imageFiles and convert them to an array and then loop through each image file and append it to the formData
    // and FileList type does not have a map method so we convert it to an array first using Array.from
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    })

    onSave(formData)
  });

  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 fonHt-bold text-xl disabled:bg-gray-500">
            {isLoading ? 'Loading...' : 'Save'}
            </button>
        </span>
      </form>
    </FormProvider>
  )
}

export default ManageHotelForm