//import Time from "../../../classes/Time";

export const colors = {
    red: "#FF0000",
    black: "#000000",
    white: "#FFFFFF",
    grey: "#D8D8D8",
    orange : "#F79646",
    blue: "#4472C4",
  } as const;
  
  export const enDash = "\u2013";
  
  export const shortFormToLongForm = {
    LA: "Late Activation",
    LR: "Late Response",
  } as const;
  
  export const secondPageTableHeight = 1.98;
  
  
  export const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ] as const;
  
  //defaultFirstBorder used for first slide ONLY
  export const defaultFirstBorder = {
    type: "solid",
    pt: 2,
    color: colors.black
  } as const;
  
  //defaultBorder used for all other slides
  export const defaultBorder = {
    type: "solid",
    pt: 1,
    color: colors.black
  } as const;
  
  const tableCommonOptions = {
    align: "center",
    valign: "middle",
    fill: { color: colors.black },
    margin: 0,
  } as const;
  
  const tableCellSize = {
    //First Table refers to top table of first slide of LR report
    firstColW: [1.75, 2.0, 1.48, 1.75, 1.75, 1.75],
    firstColH: [0.24, 0.36, 0.24, 0.36, 3.44],
  
    //Second Table refers to table containing Justifications and Remarks
    secondColW: [2.54, 1.1, 5.42],
    secondColH: [0.39, 0.27, 0.27, 0.27, 0.27, 1.1],
  
    //Legends Table refers to table containing legends for LR report
    legendsColW:[0.41, 1.01],
    legendsColH:[0.39, 0.436, 0.436, 0.436, 0.436, 0.436],
  
    generalColW:[3.33, 3.33, 3.33],
    generalColH:[0.39, 0.32, 0.32, 3.97],
  
    remarksColW:[2.16, 7.84],
    remarksColH:[1.5],
  };
  
  export const lrFirstTableOptions = {
      colW: tableCellSize.firstColW,
      rowH: tableCellSize.firstColH,
      h: 3,
      x: 1.52,
      y: 0.08,
      border:defaultFirstBorder,
      ...tableCommonOptions
  }
  
  const secondTableCommonOptions = (type: "LR" | "legends") => ({
    x: type === "LR" ? 1.52 : 10.58,
    y: 4.72,
    align: "center",
    valign: "middle",
    border: defaultFirstBorder,
    fill: { color: colors.black },
    margin: 0,
  }) as const;
  
  export const secondTableOptions = {
    LR: {
      colW: tableCellSize.secondColW,
      rowH: tableCellSize.secondColH,
      h: 3,
      ...secondTableCommonOptions("LR"),
    },
    legends:{
      colW: tableCellSize.legendsColW,
      rowH: tableCellSize.legendsColH,
      h: 3,
      ...secondTableCommonOptions("legends"),
    }
  };
  
  export const defaultJustification = {
    LA: (appliance:string)=>{
      return `${appliance} responded within 1 Min.`;
    },
    LR: (boundary: string) => {
      return `MVC < ${boundary} min (Justified by MVC Footage)`;
    },
    LRpptShort: (
      boundary: string,
      opsCenterAcknowledged: boolean,
      //totalTime?: 1
    ) => {
      return opsCenterAcknowledged
        ? `MVC < ${boundary} min \n(Ops Center Acknowledged)`
        : `MVC: 1`;
    },
    LRpptLong: (boundary: string, opsCenterAcknowledged: boolean, time: 1) => {
      return opsCenterAcknowledged
        ? `Ops Center acknowledged appliance responded within ${boundary}min`
        : `Total Time — ${time.toString()}`;
    },
  };
  
  //lrTableHeaders refer table headers for first page of LR report
  export const tableHeaders = {
    LRfirst: [
      "ACES INCIDENT NO.",
      "DISPATCHED - DAY / TIME",
      "ARRIVAL TIME",
      "RESPONSE TIME",
      "TIME EXCEEDED",
      "ACTIVATION TIME < 1 MIN",
    ].map((header) => ({
      text: header,
      options: { bold: true, fill: { color: colors.orange }, fontSize: 9 },
    })),

    LRsecond:[
      "INCIDENT TYPE",
      "LOCATION",
      "APPL DISPATCHED",
      "RESPONSE ZONE",
      "VEHICLE COMD / PUMP OPERATOR",
    ].map((header, index, array) => ({
      text: header,
      options: index === array.length - 1 
        ? { bold: true, fill: { color: colors.orange }, fontSize: 9, colspan: 2 } 
        : { bold: true, fill: { color: colors.orange }, fontSize: 9 },
    })),

    LRthird:[
      "JUSTIFICATIONS",
      "Y/N",
      "REMARKS",
    ].map((header) => ({
      text: header,
      options: { bold: true, fill: { color: colors.orange }, fontSize: 9 }
    })),

    legends: [
      "LEGEND"
    ].map((detail) => ({
      text: detail,
      options: { bold: true, fill: { color: colors.orange }, fontSize: 9, colspan: 2 }
    })),

    generalTop: (type: "LR" | "LA", appliance: string) => [
      [
        { text: type === "LR" ? "Response for " : "Activation Time for ", options: { bold: true, color: colors.black, fontSize: 18 } },
        { text: appliance, options: { bold: true, color: colors.red, fontSize: 18 } }
      ]
    ].map((parts) => ({
      text: parts,
      options: { fill: { color: colors.white }, fontSize: 18, colspan: 3 }
    })),

    general: (type: "LR" | "LA") => [
      "Incident No.",
      type === "LR" ? "Response Time (ACES)" : "Activation Time (ACES)",
      type === "LR" ? "Actual Response Time" : "Actual Activation Time",
    ].map((detail) => ({
      text: detail,
      options: {fill: { color: colors.grey }, fontSize: 14 }
    })),

    remarks: (details: string) => [
      "Remarks",
      details
    ].map((detail, idx) => ({
      text: `   ${detail}`,
      options: {
        fill: { color: colors.white },
        fontSize: 14,
        align: idx === 1 ? "left" : "center"
      }
    })),

  } as const;

  
  export const legendsTableDetails = {
    details: [
      ["", "Route Taken"],
      ["", "Congestion"],
      ["", "SFTL"],
      ["", "Responded From"],
      ["", "Incident Location"],
    ].map((detailRow) =>
      detailRow.map((detail) => ({
        text: detail,
        options: { fill: { color: colors.white }, fontSize: 9, },
      }))
    ),
  } as const;
  
  export const generalTableOptions = {
    colW: tableCellSize.generalColW,
    rowH: tableCellSize.generalColH,
    h: 3,
    x: 1.67,
    y: 0.34,
    border:defaultBorder,
    ...tableCommonOptions
  } as const;
  
  export const remarksTableOptions = {
    colW: tableCellSize.remarksColW,
    rowH: tableCellSize.remarksColH,
    h: 3,
    x: 1.67,
    y: 5.34,
    border:defaultBorder,
    ...tableCommonOptions
  } as const;
  
  //define only x positions of arrows
  export const arrowPositions = [
    4.14, 6.6, 9.05
  ];
  
  //define only x positions of images
  export const imagePositions = [
    1.91, 4.42, 6.897, 9.38
  ];
  
  export const remarksTimePositions =[
    1.8, 4.4, 6.86, 9.38
  ];

  export const shortLongStation: { [key: string]: string } = {
  "Yishun Fire Station": "YFS",
  "Nee Soon Central Fire Post": "NSCFP",
  "Sembawang Fire Station": "SFP",
  "Ang Mo Kio Fire Station": "AMKFS",
  "Cheng San Fire Post": "CSFP",
  "Seng Kang Fire Station": "SKFS",
  "Braddell Heights Fire Post": "BHFP",
  "Punggol Fire Station": "PGFS",
  } as const;

  export const laPhotoPositions = [
    1.818,5.251,8.657
  ];

  export const miniRemarksLAxpos = [
    1.74, 5.17, 8.58
  ];

