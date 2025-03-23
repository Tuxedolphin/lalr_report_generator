import { styled, Typography, IconButton, Box, Button } from "@mui/material";
import { Image as ImageIcon, Clear as ClearIcon } from "@mui/icons-material";
import { FC, useState } from "react";
import EditPhotoModal from "./EditPhotoModal";
import CroppedPicture from "../classes/CroppedPicture";
import DrawnOnPicture from "../classes/DrawnOnPicture";
import { Crop } from "react-image-crop";
import { useReportContext } from "../context/contextFunctions";
import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { PhotosType } from "../types/types";
import DisplayPhotoCanvas from "./DisplayPhotoCanvas";

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
  photoType: PhotosType;
}

const AddPhotosButton: FC<AddPhotosFormProps> = function ({ photoType }) {
  const [report, updateReport] = useReportContext();

  const isAces = photoType === "acesScreenshot";

  /**
   * Updates the image of the report object passed in
   * @param crop The crop object, or null if the photo is to be deleted / to be created
   */
  const updateImage = async (crop: Crop | null, image?: Blob | File) => {
    if (isAces) {
      if (crop === null) {
        updateReport.acesInformation(photoType, new CroppedPicture(image));
        updateReport.acesInformation("drawnScreenshot", null);
      } else {
        updateReport.acesInformation(
          photoType,
          reportImage?.updateAndReturnCrop(crop)
        );
        updateReport.acesInformation(
          "drawnScreenshot",
          new DrawnOnPicture(await reportImage?.getNewCroppedBlob())
        );
      }

      report.updateDBReport("acesInformation");
    } else {
      if (crop === null)
        updateReport.cameraInformation(photoType, new CroppedPicture(image));
      else
        updateReport.cameraInformation(
          photoType,
          reportImage?.updateAndReturnCrop(crop)
        );

      report.updateDBReport("incidentInformation");
    }
  };

  let reportImage = isAces
    ? report.acesInformation.acesScreenshot
    : report.cameraInformation[photoType];

  if (reportImage === undefined) {
    reportImage = new CroppedPicture();
    if (isAces) {
      updateReport.acesInformation(photoType, reportImage);
    } else {
      updateReport.cameraInformation(photoType, reportImage);
    }
  }

  const [openModal, setOpenModal] = useState(false); // To be set to true if we need to change the button to the image

  return (
    <>
      <Box sx={{ width: "100%", aspectRatio: 3 / 2, position: "relative" }}>
        {!openModal && reportImage.image.src ? (
          <>
            <DisplayPhotoCanvas reportImage={reportImage} />
            <IconButton
              sx={{ position: "absolute", top: 0, right: 0, zIndex: 100 }}
              onClick={() => {
                updateImage(null).catch((e: unknown) => {
                  console.error(e);
                });
              }}
            >
              <ClearIcon color="error" />
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
                {`Upload ${camelCaseToTitleCase(photoType)}`.toUpperCase()}
              </Typography>
            </Box>
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => {
                if (event.target.files) {
                  updateImage(null, event.target.files[0]).catch(
                    (e: unknown) => {
                      console.error(e);
                    }
                  );
                  setOpenModal(true);
                }
              }}
            />
          </Button>
        )}
      </Box>
      <EditPhotoModal
        reportImage={reportImage}
        updateImage={updateImage}
        titleText={"Edit " + camelCaseToTitleCase(photoType)}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default AddPhotosButton;
