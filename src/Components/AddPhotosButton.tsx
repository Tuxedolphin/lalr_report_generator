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
import CroppedPicture from "../Classes/CroppedPicture";
import { Crop, makeAspectCrop, centerCrop } from "react-image-crop";
import { useReportContext } from "../context/contextFunctions";
import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { PhotosType, SetErrorsType } from "../types/types";

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

// Valid image MIME types
const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/heic", // Common iOS format
  "image/heif", // Common iOS format
];

// Valid image extensions
const VALID_IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|tiff?|heic|heif)$/i;

interface AddPhotosFormProps {
  photoType: PhotosType;
  error: boolean;
  setErrors: SetErrorsType;
}

const AddPhotosButton: FC<AddPhotosFormProps> = function ({
  photoType,
  error,
  setErrors,
}) {
  const theme = useTheme();
  const [report, updateReport] = useReportContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("edit");
  const [refreshKey, setRefreshKey] = useState(0);

  const isAces = photoType === "acesScreenshot";

  // Check for error state and set error message
  useEffect(() => {
    if (error) setErrorMessage("Required");
  }, [error]);

  /**
   * Validates whether a file is a valid image type
   */
  const isValidImageFile = (file: File | Blob): boolean => {
    if (file instanceof File) {
      const hasValidExtension = VALID_IMAGE_EXTENSIONS.test(
        file.name.toLowerCase()
      );
      if (!hasValidExtension) return false;

      return VALID_IMAGE_TYPES.includes(file.type);
    }

    // For Blob objects, check only the type
    return VALID_IMAGE_TYPES.includes(file.type);
  };

  /**
   * Updates the image of the report object passed in
   * @param crop The crop object, or null if the photo is to be deleted / to be created
   */
  const updateImage = (crop: Crop | null, image?: Blob | File) => {
    if (image) {
      setIsLoading(true);

      // Validate image file type
      if (!isValidImageFile(image)) {
        setErrorMessage("Please select a valid image file");
        setIsLoading(false);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        return;
      }

      setErrorMessage(null);
      setErrors((prev) => ({
        ...prev,
        [photoType]: "",
      }));
    }

    if (isAces) {
      if (crop === null) {
        updateReport.acesInformation(photoType, new CroppedPicture(image));
        updateReport.acesInformation("drawnScreenshot", null, true);
      } else {
        updateReport.acesInformation(
          photoType,
          reportImage?.updateAndReturnCrop(crop),
          true
        );
      }
    } else {
      if (crop === null)
        updateReport.cameraInformation(
          photoType,
          new CroppedPicture(image),
          true
        );
      else
        updateReport.cameraInformation(
          photoType,
          reportImage?.updateAndReturnCrop(crop),
          true
        );
    }

    // Force a refresh of the UI
    setRefreshKey((prev) => prev + 1);

    // Simulate loading for better UX
    if (image) {
      setTimeout(() => {
        setIsLoading(false);
        // Force another refresh after loading completes
        setRefreshKey((prev) => prev + 1);
      }, 600);
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
        key={`photo-container-${refreshKey.toString()}`}
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
              {/* Edit button */}
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

              {/* Delete button */}
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
                onClick={() => {
                  updateImage(null);
                }}
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
              color: errorMessage
                ? theme.palette.error.main
                : theme.palette.primary.main,
              borderColor: "transparent",
              borderRadius: 2.5,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "transparent",
                backgroundColor: alpha(
                  errorMessage
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                  0.05
                ),
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <AddAPhoto
                sx={{
                  fontSize: 38,
                  color: alpha(
                    errorMessage
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                    0.8
                  ),
                  mb: 1,
                }}
              />
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{
                  fontSize: { xs: 14, sm: 15 },
                  color: errorMessage
                    ? theme.palette.error.main
                    : theme.palette.text.primary,
                }}
              >
                {errorMessage ?? `Upload ${camelCaseToTitleCase(photoType)}`}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  maxWidth: "70%",
                  textAlign: "center",
                }}
              >
                {errorMessage
                  ? "Select a valid image file"
                  : "JPG, PNG, HEIC formats"}
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
        titleText={
          modalMode === "add"
            ? `Add ${camelCaseToTitleCase(photoType)}`
            : `Edit ${camelCaseToTitleCase(photoType)}`
        }
        openModal={openModal}
        setOpenModal={setOpenModal}
        mode={modalMode}
        onComplete={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </>
  );
};

interface CanvasProps {
  reportImage: CroppedPicture;
  isLoading?: boolean;
  onEditClick: () => void;
}

const DisplayPhotoCanvas: FC<CanvasProps> = function ({
  reportImage,
  isLoading = false,
}) {
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

    context?.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    setRenderComplete(true);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.paper,
        "&:hover .edit-button": {
          opacity: 1,
          transform: "translateY(0)",
        },
      }}
    >
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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(3px)",
            zIndex: 2,
          }}
        >
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}
    </Box>
  );
};

// Helper function to set initial crop for images of any size
const onloadFunction = (img: HTMLImageElement): Crop => {
  const { naturalWidth, naturalHeight } = img;
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      4 / 3,
      naturalWidth,
      naturalHeight
    ),
    naturalWidth,
    naturalHeight
  );
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

const EditPhotoModal: FC<EditPhotoModalProps> = function ({
  reportImage,
  updateImage,
  titleText,
  openModal,
  setOpenModal,
  mode,
  onComplete,
}) {
  const theme = useTheme();
  const [crop, setCrop] = useState<Crop>(reportImage.crop);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const imgRef = useRef<HTMLImageElement | null>(null);

  const isAddMode = mode === "add";

  // Reset crop when the modal opens with a new image
  useEffect(() => {
    if (openModal && reportImage.image.src) {
      setImageLoaded(false);

      // Reset crop to optimal value for the current image
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
    // Store reference and set initial crop in one step
    imgRef.current = e.currentTarget;
    setCrop(onloadFunction(e.currentTarget));
    setImageLoaded(true);
  };

  // This ensures we only crop the actual image, not the surrounding black space
  const handleCropChange = (_: unknown, percentCrop: Crop) => {
    setCrop(percentCrop);
  };

  function handleSubmit(): void {
    setIsSubmitting(true);

    // It'll take a moment for updateImage to process the crop and blob, and since I didn't make it async,
    // I'll just set a timeout to ensure the image is updated before closing the modal
    setTimeout(() => {
      updateImage(crop);
      setIsSubmitting(false);
      handleClose(false);

      if (onComplete) {
        setTimeout(onComplete, 20);
      }
    }, 100);
  }

  function handleClose(shouldDelete = isAddMode): void {
    setOpenModal(false);
    setImageLoaded(false);

    if (shouldDelete) {
      updateImage(null);
    }

    if (onComplete) {
      setTimeout(onComplete, 20);
    }
  }

  function handleCloseButton(): void {
    handleClose(isAddMode);
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {
        handleClose(isAddMode);
      }}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      aria-labelledby="photo-edit-dialog-title"
      transitionDuration={{ enter: 300, exit: 200 }}
      slots={{
        transition: Fade,
      }}
      slotProps={{
        paper: {
          elevation: 24,
        },
        backdrop: {
          sx: {
            backgroundColor: alpha(theme.palette.background.default, 0.75),
            backdropFilter: "blur(8px)",
          },
          transitionDuration: { enter: 300, exit: 200 },
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: fullScreen ? 0 : 2,
          borderTop: `4px solid ${theme.palette.primary.main}`,
          overflow: "hidden",
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.25)}`,
          margin: fullScreen ? 0 : { xs: "16px", sm: "32px" },
          transitionDuration: { enter: 300, exit: 200 },
        },
      }}
      disableScrollLock={false}
    >
      <DialogTitle
        id="photo-edit-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          pt: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EditIcon
            sx={{
              mr: 1.5,
              color: theme.palette.primary.main,
              fontSize: "1.75rem",
            }}
          />
          <Typography variant="h5" component="div" fontWeight={600}>
            {titleText}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleCloseButton}
          aria-label="Close dialog"
          sx={{
            borderRadius: 2,
            color: theme.palette.text.secondary,
            transition: "all 0.2s ease",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
            },
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: 3,
          bgcolor: alpha(theme.palette.background.default, 0.4),
        }}
      >
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
            backgroundColor: theme.palette.background.paper,
            mb: 3,
            width: "100%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: { xs: "250px", sm: "300px", md: "400px" },
              width: "100%",
              backgroundColor: "#000", // Black background to make image boundaries clear
            }}
          >
            {!imageLoaded && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  gap: 2,
                }}
              >
                <CircularProgress size={48} thickness={4} color="primary" />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Preparing image...
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                opacity: imageLoaded ? 1 : 0.1,
                transition: "opacity 0.3s ease",
                position: "relative",
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                aspect={4 / 3}
                keepSelection
                className="react-crop-container"
              >
                <img
                  ref={imgRef}
                  src={reportImage.image.src}
                  onLoad={handleImageLoad}
                  alt="Photo Preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </ReactCrop>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              fontWeight: 500,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                display: "inline-block",
              }}
            />
            Drag to adjust the crop area.
          </Typography>
        </Paper>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          justifyContent: "space-between",
          background: alpha(theme.palette.background.default, 0.4),
        }}
      >
        {!isAddMode && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              updateImage(null);
              handleClose(false);
            }}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              borderColor: alpha(theme.palette.error.main, 0.5),
              color: theme.palette.error.main,
              "&:hover": {
                borderColor: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
            }}
          >
            Delete
          </Button>
        )}

        <Box sx={{ flexGrow: isAddMode ? 1 : 0 }} />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CheckIcon />
            )
          }
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: 2,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: "all 0.2s ease",
          }}
        >
          {isSubmitting ? "Saving..." : isAddMode ? "Add" : "Apply Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPhotosButton;
