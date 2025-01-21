import { titleCaseString } from "../utils/functions";
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
import {
  type GeneralInformationType,
  type AcesInformationType,
  ReportImage,
  CameraInformationType,
} from "../classes/Report";
import { Dayjs } from "dayjs";
import { FC, type SyntheticEvent } from "react";

interface EditPhotoModalProps {
  image: HTMLImageElement;
  updateImage: (crop: Crop | null) => void;
  titleText: string;
  photoType:
    | keyof GeneralInformationType
    | keyof AcesInformationType
    | keyof CameraInformationType;
  crop: Crop;
  setCrop: React.Dispatch<React.SetStateAction<Crop>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPhotoModal: FC<EditPhotoModalProps> = (props) => {
  const {
    image,
    updateImage,
    photoType,
    titleText,
    crop,
    setCrop,
    openModal,
    setOpenModal,
  } = props;

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
        >
          <img
            src={image.src}
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
