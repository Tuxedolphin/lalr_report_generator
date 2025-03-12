import { titleCaseString } from "../utils/generalFunctions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FC, useState, type SyntheticEvent } from "react";
import ReportImage from "../classes/ReportImage";

interface EditPhotoModalProps {
  reportImage: ReportImage;
  updateImage: (crop: Crop | null) => void;
  titleText: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPhotoModal: FC<EditPhotoModalProps> = function ({
  reportImage,
  updateImage,
  titleText,
  openModal,
  setOpenModal,
}) {
  // Setting arbitrary crop before image loads
  const [crop, setCrop] = useState<Crop>(reportImage.crop);

  function handleSubmit(): void {
    updateImage(crop);
    handleClose();
  }

  function handleClose(): void {
    setOpenModal(false);
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        4 / 3,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
    updateImage(crop);
  }

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>{titleCaseString(titleText)}</DialogTitle>
      <DialogContent>
        <ReactCrop
          crop={crop}
          aspect={4 / 3}
          onChange={(_, percentCrop) => {
            setCrop(percentCrop);
          }}
          style={{display: "flex", alignItems: "center", justifyContent: "center"}}
        >
          <img
            src={reportImage.image.src}
            onLoad={onImageLoad}
            alt="ACES Photo Screenshot"
          />
        </ReactCrop>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            updateImage(null);
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPhotoModal;
