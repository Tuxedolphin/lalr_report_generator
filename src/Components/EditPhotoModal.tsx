import { titleCaseString } from "../utils/generalFunctions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FC, SyntheticEvent, useState } from "react";
import CroppedPicture from "../classes/CroppedPicture";
import { centerCrop, makeAspectCrop } from "react-image-crop";

const onloadFunction = function (e: SyntheticEvent): Crop {
  const image = e.target as HTMLImageElement;
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      4 / 3,
      image.naturalWidth,
      image.naturalHeight
    ),
    image.naturalWidth,
    image.naturalHeight
  );
};

interface EditPhotoModalProps {
  reportImage: CroppedPicture;
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
  const [crop, setCrop] = useState<Crop>(reportImage.crop);

  function handleSubmit(): void {
    updateImage(crop);
    reportImage.saveCroppedBlob().catch((error: unknown) => {
      console.error(error);
    });
    handleClose();
  }

  function handleClose(): void {
    setOpenModal(false);
  }

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <DialogTitle>{titleCaseString(titleText)}</DialogTitle>
      <DialogContent>
        <ReactCrop
          crop={crop}
          aspect={4 / 3}
          keepSelection
          onChange={(_, percentCrop) => {
            setCrop(percentCrop);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={reportImage.image.src}
            onLoad={(e) => {
              setCrop(onloadFunction(e));
            }}
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
