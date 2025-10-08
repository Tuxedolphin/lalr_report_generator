import {
  styled,
  Typography,
  IconButton,
  Box,
  Button,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
  Divider,
  Fade,
  useMediaQuery,
} from "@mui/material";
import {
  Clear as ClearIcon,
  AddAPhoto,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { FC, useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CroppedPicture from "../classes/CroppedPicture";
import { Crop, makeAspectCrop, centerCrop } from "react-image-crop";
import { SetErrorsType } from "../types/types";

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

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/heic",
  "image/heif",
];

const VALID_IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|tiff?|heic|heif)$/i;

interface JustificationPhotoInputProps {
  photo: CroppedPicture | undefined;
  label: string;
  onPhotoChange: (photo: CroppedPicture | undefined) => void;
  error?: boolean;
  setErrors: SetErrorsType;
  errorKey: string;
}

const JustificationPhotoInput: FC<JustificationPhotoInputProps> = ({
  photo,
  label,
  onPhotoChange,
  error,
  setErrors,
  errorKey,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("edit");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (error) setErrorMessage("Required");
  }, [error]);

  const isValidImageFile = (file: File | Blob): boolean => {
    if (file instanceof File) {
      const hasValidExtension = VALID_IMAGE_EXTENSIONS.test(file.name.toLowerCase());
      if (!hasValidExtension) return false;
      return VALID_IMAGE_TYPES.includes(file.type);
    }
    return VALID_IMAGE_TYPES.includes(file.type);
  };

  const updateImage = (crop: Crop | null, image?: Blob | File) => {
    if (image) {
      setIsLoading(true);

      if (!isValidImageFile(image)) {
        setErrorMessage("Please select a valid image file");
        setIsLoading(false);
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      setErrorMessage(null);
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }

    if (crop === null) {
      onPhotoChange(image ? new CroppedPicture(image) : undefined);
    } else {
      onPhotoChange(photo?.updateAndReturnCrop(crop));
    }

    setRefreshKey(prev => prev + 1);

    if (image) {
      setTimeout(() => {
        setIsLoading(false);
        setRefreshKey(prev => prev + 1);
      }, 600);
    }
  };

  const reportImage = photo || new CroppedPicture();
  const hasImage = !!reportImage.image.src;

  const handleFileChange = (file: File) => {
    updateImage(null, file);
    setModalMode("add");
    setOpenModal(true);
  };

  const handleEditClick = () => {
    setModalMode("edit");
    setOpenModal(true);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          aspectRatio: 3 / 2,
          position: "relative",
          borderRadius: 2.5,
          overflow: "hidden",
          boxShadow: hasImage
            ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
            : "none",
          transition: "all 0.3s ease",
          border: errorMessage
            ? `2px solid ${theme.palette.error.main}`
            : hasImage
              ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              : `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          "&:hover": {
            boxShadow: hasImage
              ? `0 12px 28px ${alpha(theme.palette.primary.main, 0.2)}`
              : `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
            transform: hasImage ? "translateY(-2px)" : "none",
          },
        }}
        key={`photo-container-${refreshKey}`}
      >
        {hasImage ? (
          <>
            <DisplayPhotoCanvas
              reportImage={reportImage}
              isLoading={isLoading}
              onEditClick={handleEditClick}
            />
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
                zIndex: 100,
              }}
            >
              <IconButton
                aria-label="Edit image"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  transition: "all 0.2s ease",
                }}
                onClick={handleEditClick}
              >
                <EditIcon color="primary" fontSize="small" />
              </IconButton>

              <IconButton
                aria-label="Remove image"
                sx={{
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  backdropFilter: "blur(4px)",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.2),
                  },
                  transition: "all 0.2s ease",
                }}
                onClick={() => updateImage(null)}
              >
                <ClearIcon color="error" fontSize="small" />
              </IconButton>
            </Box>
          </>
        ) : (
          <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            sx={{
              width: "100%",
              height: "100%",
              color: errorMessage ? theme.palette.error.main : theme.palette.primary.main,
              borderColor: "transparent",
              borderRadius: 2.5,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "transparent",
                backgroundColor: alpha(
                  errorMessage ? theme.palette.error.main : theme.palette.primary.main,
                  0.05
                ),
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <AddAPhoto sx={{ fontSize: 38, color: alpha(errorMessage ? theme.palette.error.main : theme.palette.primary.main, 0.8), mb: 1 }} />
              <Typography variant="subtitle1" fontWeight={500} sx={{ fontSize: { xs: 14, sm: 15 }, color: errorMessage ? theme.palette.error.main : theme.palette.text.primary }}>
                {errorMessage ?? `Upload ${label}`}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, maxWidth: "70%", textAlign: "center" }}>
                {errorMessage ? "Select a valid image file" : "JPG, PNG, HEIC formats"}
              </Typography>
            </Box>
            <VisuallyHiddenInput
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/heic,image/heif,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.heic,.heif"
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  handleFileChange(event.target.files[0]);
                }
              }}
            />
          </Button>
        )}
      </Paper>
      
      <EditPhotoModal
        reportImage={reportImage}
        updateImage={updateImage}
        titleText={modalMode === "add" ? `Add ${label}` : `Edit ${label}`}
        openModal={openModal}
        setOpenModal={setOpenModal}
        mode={modalMode}
        onComplete={() => setRefreshKey(prev => prev + 1)}
      />
    </>
  );
};

// Helper components (copied from AddPhotosButton)
interface CanvasProps {
  reportImage: CroppedPicture;
  isLoading?: boolean;
  onEditClick: () => void;
}

const DisplayPhotoCanvas: FC<CanvasProps> = ({ reportImage, isLoading = false }) => {
  const theme = useTheme();
  const image = reportImage.image;
  const crop = reportImage.crop;
  const [renderComplete, setRenderComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = image.naturalWidth * (crop.width / 100);
    canvas.height = image.naturalHeight * (crop.height / 100);

    const cropX = image.naturalWidth * (crop.x / 100);
    const cropY = image.naturalHeight * (crop.y / 100);

    context?.translate(-cropX, -cropY);
    context?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
    setRenderComplete(true);
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.palette.background.paper }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          transition: "opacity 0.3s ease",
          opacity: renderComplete && !isLoading ? 1 : 0.7,
        }}
      />
      {isLoading && (
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: alpha(theme.palette.background.paper, 0.6), backdropFilter: "blur(3px)", zIndex: 2 }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}
    </Box>
  );
};

const onloadFunction = (img: HTMLImageElement): Crop => {
  const { naturalWidth, naturalHeight } = img;
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, 4 / 3, naturalWidth, naturalHeight), naturalWidth, naturalHeight);
};

interface EditPhotoModalProps {
  reportImage: CroppedPicture;
  updateImage: (crop: Crop | null, image?: Blob | File) => void;
  titleText: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  onComplete?: () => void;
}

const EditPhotoModal: FC<EditPhotoModalProps> = ({ reportImage, updateImage, titleText, openModal, setOpenModal, mode, onComplete }) => {
  const theme = useTheme();
  const [crop, setCrop] = useState<Crop>(reportImage.crop);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isAddMode = mode === "add";

  useEffect(() => {
    if (openModal && reportImage.image.src) {
      setImageLoaded(false);
      if (reportImage.image.complete) {
        setTimeout(() => {
          const initialCrop = onloadFunction(reportImage.image);
          setCrop(initialCrop);
          setImageLoaded(true);
        }, 100);
      }
    } else {
      setImageLoaded(false);
    }
  }, [openModal, reportImage]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;
    setCrop(onloadFunction(e.currentTarget));
    setImageLoaded(true);
  };

  const handleCropChange = (_: unknown, percentCrop: Crop) => {
    setCrop(percentCrop);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateImage(crop);
      setIsSubmitting(false);
      handleClose(false);
      if (onComplete) setTimeout(onComplete, 20);
    }, 100);
  };

  const handleClose = (shouldDelete = isAddMode) => {
    setOpenModal(false);
    setImageLoaded(false);
    if (shouldDelete) updateImage(null);
    if (onComplete) setTimeout(onComplete, 20);
  };

  return (
    <Dialog
      open={openModal}
      onClose={() => handleClose(isAddMode)}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      slots={{ transition: Fade }}
      slotProps={{
        paper: { elevation: 24 },
        backdrop: {
          sx: { backgroundColor: alpha(theme.palette.background.default, 0.75), backdropFilter: "blur(8px)" },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.5, pt: 2.5, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EditIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: "1.75rem" }} />
          <Typography variant="h5" component="div" fontWeight={600}>{titleText}</Typography>
        </Box>
        <IconButton size="small" onClick={() => handleClose(isAddMode)}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
        <Paper elevation={0} sx={{ overflow: "hidden", borderRadius: 2, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, mb: 3, width: "100%" }}>
          <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: { xs: "250px", sm: "300px", md: "400px" }, width: "100%", backgroundColor: "#000" }}>
            {!imageLoaded && (
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, gap: 2 }}>
                <CircularProgress size={48} thickness={4} color="primary" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Preparing image...</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", opacity: imageLoaded ? 1 : 0.1, transition: "opacity 0.3s ease", position: "relative" }}>
              <ReactCrop crop={crop} onChange={handleCropChange} aspect={4 / 3} keepSelection>
                <img
                  ref={imgRef}
                  src={reportImage.image.src}
                  onLoad={handleImageLoad}
                  alt="Photo Preview"
                  style={{ maxWidth: "100%", height: "auto", width: "auto", display: "block", objectFit: "contain" }}
                />
              </ReactCrop>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, justifyContent: "space-between" }}>
        {!isAddMode && (
          <Button variant="outlined" color="inherit" onClick={() => { updateImage(null); handleClose(false); }}>
            Delete
          </Button>
        )}
        <Box sx={{ flexGrow: isAddMode ? 1 : 0 }} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
        >
          {isSubmitting ? "Saving..." : isAddMode ? "Add" : "Apply Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JustificationPhotoInput;