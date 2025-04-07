import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import TimingAndPhotoInput from "../../../components/TimingAndPhotoInput";
import { useReportContext } from "../../../context/contextFunctions";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  alpha,
  useTheme,
  Stack,
  Fade,
} from "@mui/material";
import {
  ExpandMore,
  Draw as DrawIcon,
  HelpOutline,
  NotificationsActive,
  Check,
  DirectionsCar,
  LocationOn,
} from "@mui/icons-material";
import DrawnOnPicture from "../../../classes/DrawnOnPicture";
import {
  checkForError,
  clearCanvas,
  getOffset,
  setCanvasStroke,
} from "../../../utils/helperFunctions";
import exampleImage from "../../../assets/example_image.png";
import Section from "../../../components/Section";
import { ErrorsType, SetErrorsType } from "../../../types/types";
import {
  timingInputToPhoto,
  fadeInAnimationSx,
} from "../../../utils/constants";

interface FirstFootageFormProps {
  handleNext: (
    newMaxSteps?: number,
    newActiveStep?: number,
    hasError?: boolean
  ) => void;
}

const FirstFootageForm: FC<FirstFootageFormProps> = function ({ handleNext }) {
  const [report] = useReportContext();

  const [errors, setErrors] = useState<ErrorsType>({});

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();

    let hasError = false;

    // We don't really check for errors for drawing the acknowledgment box
    if (!report.incidentInformation.opsCenterAcknowledged) {
      hasError = checkForError(errors, setErrors, report.cameraInformation);
    }

    handleNext(undefined, undefined, hasError);
  };

  return (
    <Fade in={true} timeout={500}>
      <form id="firstFootageForm" onSubmit={handleSubmit}>
        {report.incidentInformation.opsCenterAcknowledged ? (
          <DrawingForm />
        ) : (
          <TimingPhotoInputForm errors={errors} setErrors={setErrors} />
        )}
      </form>
    </Fade>
  );
};

interface TimingPhotoInputFormProps {
  errors: ErrorsType;
  setErrors: SetErrorsType;
}

const TimingPhotoInputForm: FC<TimingPhotoInputFormProps> = function ({
  errors,
  setErrors,
}) {
  const [report] = useReportContext();
  const cameraInformation = report.cameraInformation;

  const isLA = report.incidentInformation.reportType === "LA";

  const timings = isLA
    ? ([
        {
          timeDispatched: cameraInformation.timeDispatched ?? null,
          icon: <NotificationsActive color="error" />,
        },
        {
          timeAllIn: cameraInformation.timeAllIn ?? null,
          icon: <Check color="success" />,
        },
      ] as const)
    : ([
        {
          timeMoveOff: cameraInformation.timeMoveOff ?? null,
          icon: <DirectionsCar color="warning" />,
        },
        {
          timeArrived: cameraInformation.timeArrived ?? null,
          icon: <LocationOn color="info" />,
        },
      ] as const);

  useEffect(() => {
    const initialErrors = {} as ErrorsType;
    timings.forEach((timing) => {
      Object.keys(timing).forEach((key) => {
        if (key !== "icon") {
          const timingKey = key as
            | "timeDispatched"
            | "timeAllIn"
            | "timeMoveOff"
            | "timeArrived";
          const photoKey = timingInputToPhoto[timingKey];
          initialErrors[timingKey] = "";
          initialErrors[photoKey] = "";
        }
      });
    });

    setErrors(initialErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We only update the initial errors on mount

  if (Object.keys(errors).length === 0) return; // Ensure that the errors are set

  return timings.map((timing, index) => {
    const timingKey =
      Object.keys(timing).find((key) => key !== "icon" && key !== "title") ??
      "";
    return (
      <TimingAndPhotoInput
        timingInput={{ [timingKey]: timing[timingKey as keyof typeof timing] }}
        key={timingKey}
        reportKey="cameraInformation"
        errors={errors}
        setErrors={setErrors}
        icon={timing.icon}
        sx={fadeInAnimationSx(`${(index * 0.1).toString()}s`)}
      />
    );
  });
};

/**
 * If the report is acknowledged by the ops center, the form should be a drawing form instead.
 */

const DrawingForm: FC = function () {
  const theme = useTheme();
  const [report, updateReport] = useReportContext();
  const [isDown, setIsDown] = useState(false);

  const reportImage =
    report.acesInformation.drawnScreenshot ??
    new DrawnOnPicture(
      report.acesInformation.acesScreenshot?.croppedBlob ?? new Blob() // Technically this should never be null
    );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const updateImage = function (image: DrawnOnPicture) {
    updateReport.acesInformation("drawnScreenshot", image);
    report.updateDBReport("acesInformation");
  };

  const beginDraw = (e: SyntheticEvent) => {
    if (!canvasRef.current || !contextRef.current) return;

    contextRef.current.beginPath();
    reportImage.start = getOffset(e, canvasRef);

    updateImage(reportImage);

    clearCanvas(contextRef.current, canvasRef.current);
    setIsDown(true);

    report.updateDBReport("acesInformation");
  };

  const updateDraw = (e: SyntheticEvent) => {
    if (!canvasRef.current || !contextRef.current || !isDown) return;

    clearCanvas(contextRef.current, canvasRef.current);

    const start = reportImage.start;
    const end = getOffset(e, canvasRef);

    contextRef.current.strokeRect(
      start[0],
      start[1],
      end[0] - start[0],
      end[1] - start[1]
    );

    reportImage.end = end;
    updateImage(reportImage);
  };

  const endDraw = function () {
    setIsDown(false);
    contextRef.current?.closePath();
    report.updateDBReport("acesInformation");
  };

  useEffect(() => {
    const image = reportImage.image;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    const updateCanvasSize = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Calculate stroke width based on image dimensions
      // Base stroke width is 3, but we'll scale it for larger images
      const baseStrokeWidth = 2;
      const referenceWidth = 300; // Reduced reference width to increase scaling
      // Increase the upper limit of the scale factor from 2 to 4
      const scaleFactor = Math.max(1, image.naturalWidth / referenceWidth);
      const scaledStrokeWidth = baseStrokeWidth * scaleFactor;

      if (context) {
        setCanvasStroke(context, "red", scaledStrokeWidth);
      }
    };

    if (!context) return;

    if (image.complete) {
      updateCanvasSize();
    } else {
      image.onload = updateCanvasSize;
    }

    const start = reportImage.start;
    const end = reportImage.end;

    context.strokeRect(
      start[0],
      start[1],
      end[0] - start[0],
      end[1] - start[1]
    );

    contextRef.current = context;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section
      id="draw-section"
      title="Draw Acknowledgment Box"
      icon={<DrawIcon />}
      accentColor={theme.palette.secondary.main}
      sx={fadeInAnimationSx("0s")}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.08)}`,
          mb: 3,
        }}
      >
        <canvas
          ref={canvasRef}
          className="full-width"
          onTouchStart={beginDraw}
          onMouseDown={beginDraw}
          onTouchMove={updateDraw}
          onMouseMove={updateDraw}
          onTouchEnd={endDraw}
          onMouseUp={endDraw}
          style={{
            backgroundImage: `url(${reportImage.image.src})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            touchAction: "none",
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      <Accordion
        sx={{
          borderRadius: 2,
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
          "&:before": {
            display: "none",
          },
          "& .MuiAccordionSummary-root": {
            borderRadius: 2,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.05),
            "&:hover": {
              backgroundColor: alpha(theme.palette.info.main, 0.1),
            },
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <HelpOutline sx={{ color: theme.palette.info.main }} />
            <Typography fontWeight={500} color="textSecondary">
              Drawing Guide
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To indicate that ops center has acknowledged the incident, please
            draw a rectangular selection on the image. Click and drag to create
            a rectangle that encompasses the relevant acknowledgment
            information.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Please refer to an example below:
          </Typography>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: `0 3px 10px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <img
              src={exampleImage}
              alt="Example acknowledgment"
              className="full-width"
              style={{ display: "block", width: "100%" }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Section>
  );
};

export default FirstFootageForm;
