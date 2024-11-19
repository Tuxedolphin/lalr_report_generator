import { titleCaseString } from "../Functions/functions";
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
} from "../Classes/Report";
import { Dayjs } from "dayjs";
import { FC, useEffect, useState, type SyntheticEvent } from "react";

interface EditPhotoModalProps {
  image: HTMLImageElement;
  updateInformation: (
    key:
      | keyof GeneralInformationType
      | keyof AcesInformationType
      | keyof CameraInformationType,
    value: string | Dayjs | ReportImage
  ) => void;
  titleText: string;
  photoType:
    | keyof GeneralInformationType
    | keyof AcesInformationType
    | keyof CameraInformationType;
  crop: Crop;
  setCrop: React.Dispatch<React.SetStateAction<Crop>>;
  setChangeButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPhotoModal: FC<EditPhotoModalProps> = (props) => {
  const {
    image,
    updateInformation,
    photoType: key,
    titleText,
    setChangeButton,
  } = props;

  const { crop, setCrop } = props;
  const [openModal, setOpenModal] = useState(false);

  function handleSubmit(): void {
    setChangeButton(true);
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

  useEffect(() => {
    if (!image.src) {
      setOpenModal(false);
      return;
    }

    setOpenModal(true);
  }, [image, setOpenModal]);

  if (!image.src) return;

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
            updateInformation(key, new ReportImage());
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
