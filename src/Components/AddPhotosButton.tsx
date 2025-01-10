import { styled, Typography, IconButton, Box, Button } from "@mui/material";
import { Image as ImageIcon, Clear as ClearIcon } from "@mui/icons-material";
import { FC, useState } from "react";
import EditPhotoModal from "./EditPhotoModal";
import Canvas from "./Canvas";
import {
  ReportImage,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
} from "../Classes/Report";
import { Crop } from "react-image-crop";
import { Dayjs } from "dayjs";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface AddPhotosFormProps {
  uploadPhotoText: string;
  photoType:
    | keyof GeneralInformationType
    | keyof AcesInformationType
    | keyof CameraInformationType;
  image: ReportImage;
  updateInformation: (
    key:
      | keyof GeneralInformationType
      | keyof AcesInformationType
      | keyof CameraInformationType,
    value: string | Dayjs | ReportImage
  ) => void;
}

const AddPhotosButton: FC<AddPhotosFormProps> = (props) => {
  const {
    uploadPhotoText,
    photoType,
    image: reportImage,
    updateInformation,
  } = props;

  const [crop, setCrop] = useState<Crop>(
    reportImage.crop ?? {
      unit: "%",
      x: 0,
      y: 0,
      width: 80,
      height: 60,
    }
  );

  const [openModal, setOpenModal] = useState(false); // To set if we need to change the button to the image

  /**
   *  Updates the image of the report object passed in
   * @param crop The crop object, or null if the photo is to be deleted
   */
  const updateImage = (crop: Crop | null) => {
    if (!crop) updateInformation(photoType, new ReportImage());
    else
      updateInformation(photoType, {
        ...reportImage,
        crop: crop,
      } as ReportImage);
  };

  console.log(crop);

  return (
    <>
      <Box sx={{ width: "100%", aspectRatio: 4 / 3, position: "relative" }}>
        {!openModal && reportImage.image.src ? (
          <>
            <Canvas crop={crop} image={reportImage.image} />
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 100 }}
              onClick={() => {
                updateInformation(photoType, new ReportImage());
              }}
            >
              <ClearIcon />
            </IconButton>
          </>
        ) : (
          <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            sx={{
              width: "100%",
              height: "100%",
              color: "primary",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon sx={{ width: 50, height: 50 }} />
              <Typography fontSize={18}>
                {uploadPhotoText.toUpperCase()}
              </Typography>
            </Box>
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  updateInformation(
                    photoType,
                    new ReportImage(event.target.files[0], crop)
                  );
                  setOpenModal(true);
                }
              }}
            />
          </Button>
        )}
      </Box>
      <EditPhotoModal
        image={reportImage.image}
        updateImage={updateImage}
        photoType={photoType}
        titleText={"Edit " + props.uploadPhotoText}
        crop={crop}
        setCrop={setCrop}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default AddPhotosButton;
