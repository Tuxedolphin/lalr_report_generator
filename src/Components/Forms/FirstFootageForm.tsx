import { FC, useEffect, useMemo, useRef, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { useReportContext } from "../../context/contextFunctions";
import { Box } from "@mui/material";
import Canvas from "../Canvas";
import DrawnOnPicture from "../../classes/DrawnOnPicture";

/**
 * If the report is acknowledged by the ops center, the form should be a drawing form instead.
 */

interface DrawingFormProps {}

const DrawingForm: FC<DrawingFormProps> = function () {
  const [report, updateReport] = useReportContext();

  const reportImage =
    report.acesInformation.drawnScreenshot ??
    new DrawnOnPicture(report.acesInformation.acesScreenshot?.croppedBlob!); // It'll never be null

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = reportImage.image;

    image.onload = () => {
      const canvas = ref.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      context?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    };
  }, [reportImage.image]);

  return (
    <>
      <canvas ref={ref} className="full-width" />
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

  return report.incidentInformation.opsCenterAcknowledged ? (
    <DrawingForm />
  ) : (
    <form id="firstFootageForm" onSubmit={handleSubmit}>
      {timingAndPhotoInputs}
    </form>
  );
};

export default FirstFootageForm;
