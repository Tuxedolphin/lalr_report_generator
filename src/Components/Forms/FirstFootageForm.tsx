import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { useReportContext } from "../../context/contextFunctions";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import DrawnOnPicture from "../../classes/DrawnOnPicture";
import {
  clearCanvas,
  getOffset,
  setCanvasStroke,
} from "../../utils/generalFunctions";
import exampleImage from "../../assets/example_image.png";

/**
 * If the report is acknowledged by the ops center, the form should be a drawing form instead.
 */

interface DrawingFormProps {}

const DrawingForm: FC<DrawingFormProps> = function () {
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
    updateReport("drawnScreenshot", image);
  };

  const beginDraw = function (e: SyntheticEvent) {
    if (!canvasRef.current || !contextRef.current) return;

    contextRef.current.beginPath();
    reportImage.startCoordinates = getOffset(e, canvasRef);
    updateImage(reportImage);

    clearCanvas(contextRef.current, canvasRef.current);
    setIsDown(true);
  };

  const updateDraw = function (e: SyntheticEvent) {
    if (!canvasRef.current || !contextRef.current || !isDown) return;

    clearCanvas(contextRef.current, canvasRef.current);

    const start = reportImage.startCoordinates;
    const end = getOffset(e, canvasRef);

    contextRef.current.strokeRect(
      start[0],
      start[1],
      end[0] - start[0],
      end[1] - start[1]
    );

    reportImage.endCoordinates = end;
    updateImage(reportImage);
  };

  const endDraw = function () {
    setIsDown(false);
    contextRef.current?.closePath();
  };

  useEffect(() => {
    const image = reportImage.image;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    const updateCanvasSize = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    };

    if (!context) return;

    if (image.complete) {
      updateCanvasSize();
      setCanvasStroke(context, "red", 3);
    } else {
      image.onload = () => {
        updateCanvasSize();
        setCanvasStroke(context, "red", 3);
      };
    }

    const start = reportImage.startCoordinates;
    const end = reportImage.endCoordinates;

    context.strokeRect(
      start[0],
      start[1],
      end[0] - start[0],
      end[1] - start[1]
    );

    contextRef.current = context;
  }, []);

  return (
    <>
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
        }}
      />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography component="span">Guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="p">
            To indicate that ops center has acknowledged the incident, please
            draw a rectangular selection on the image. Click and drag to create
            a rectangle that encompasses the relevant acknowledgment
            information.
          </Typography>
          <p></p>
          <Typography component="p">
            Please refer to an example below:
          </Typography>
          <img
            src={exampleImage}
            alt="Example acknowledgment"
            className="full-width"
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

/**
 * The form is broken up into two as on mobile, one form would be a bit too long
 */

interface FirstFootageFormProps {
  handleNext: (newMaxSteps?: number, newActiveStep?: number) => void;
}

const FirstFootageForm: FC<FirstFootageFormProps> = function ({ handleNext }) {
  const [report, updateReport] = useReportContext();
  const cameraInformation = report.cameraInformation;
  const isLA = report.incidentInformation.reportType === "LA";

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();
    handleNext();
  };

  const timings = isLA
    ? ([
        { timeDispatched: cameraInformation.timeDispatched ?? null },
        { timeAllIn: cameraInformation.timeAllIn ?? null },
      ] as const)
    : ([
        { timeMoveOff: cameraInformation.timeMoveOff ?? null },
        { timeArrived: cameraInformation.timeArrived ?? null },
      ] as const);

  const timingAndPhotoInputs = timings.map((timing) => (
    <TimingAndPhotoInput timingInput={timing} key={Object.keys(timing)[0]} />
  ));

  return (
    <form id="firstFootageForm" onSubmit={handleSubmit}>
      {report.incidentInformation.opsCenterAcknowledged ? (
        <DrawingForm />
      ) : (
        timingAndPhotoInputs
      )}
    </form>
  );
};

export default FirstFootageForm;
