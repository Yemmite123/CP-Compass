import moment from "moment";

export const validateFields = (data, required, noScroll) => {
  let errors = {};

  for (var i = 0, len = required.length; i < len; i++) {
    let val = data[required[i]];
    if (!data.hasOwnProperty(required[i])) {
      continue;
    }
    if (typeof data[required[i]] === "object") {
      val = JSON.stringify(data[required[i]]);
    }
    if (val.trim() === "" || val.length === 0) {
      noScroll && window.scrollTo(0, 0);
      errors[required[i]] = `field is required`;
    }
  }
  return errors;
};

export const isPasswordEqual = (confirm, password) => {
  let errors = {};
  if (confirm === password) {
    return null;
  }
  errors.confirm = "passwords should be equal";
  return errors;
};

export const serializeErrors = (error) => {
  let errorObject = {};

  if (error && typeof error === "object") {
    error.forEach((error) => {
      errorObject[Object.values(error)[1]] = error[Object.keys(error)[0]];
    });
  }
  return errorObject;
};

export const paymentMethods = [
  {
    label: "Debit Card",
    value: "card",
    imgUrl: "card-icon",
    imgBlue: "card-blue",
  },
  {
    label: "Direct Bank Transfer",
    value: "transfer",
    imgUrl: "bank-icon",
    imgBlue: "transfer-blue",
  },
];

export const fundingSource = [
  {
    label: "Debit Card",
    value: "card",
    imgUrl: "card-grey",
    imgBlue: "card-blue",
  },
  {
    label: "Wallet",
    value: "wallet",
    imgUrl: "funding-wallet-grey",
    imgBlue: "funding-wallet-blue",
  },
];

export const pieData = {
  datasets: [
    {
      data: [10, 20, 30],
      backgroundColor: ["#044472", "#3F9ADA", "#9DC6FB"],
    },
  ],
  labels: ["Termed Investment", "Financial Instruments", "Wallet"],
};

export const pieOptions = {
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        let sum = 0;
        const dataArr = data.datasets[0].data;
        sum = dataArr.reduce((a, b) => a + b, 0);
        var label =
          data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || "";
        const itemPercentage = (label / sum) * 100;
        // var text = data.labels[tooltipItem.index];
        return `${Number(itemPercentage).toFixed(2)}%`;
      },
    },
  },
};

export const portfolioPieData = {
  datasets: [
    {
      data: [1000, 20500, 30],
      backgroundColor: ["#C95B10", "#3F9ADA", "#9DC6FB"],
    },
  ],
  labels: ["Termed Investment", "Financial Instruments", "Wallet"],
};

export const portfolioPie = (wallet, termed, financial) => {
  const data = {
    Wallet: wallet,
    "Termed Investment": termed,
  };
  const labels = ["Wallet", "Termed Investment"];
  return {
    datasets: [
      {
        data: [wallet, termed],
        backgroundColor: ["#AD3336", "#C95B10", "#9DC6FB"],
      },
    ],
    labels: labels.map((label) => `${label}: ${formatCurrency(data[label])}`),
  };
};

export const portfolioPieOptions = {
  cutout: "50%",
  cutoutPercentage: 80,
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        let sum = 0;
        const dataArr = data.datasets[0].data;
        sum = dataArr.reduce((a, b) => a + b, 0);
        var label =
          data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || "";
        const itemPercentage = (label / sum) * 100;
        var text = data.labels[tooltipItem.index];
        return `${text}: (${Number(itemPercentage).toFixed(2)}%)`;
      },
    },
  },
};

export const relationshipOption = [
  {
    name: "Brother",
    value: "brother",
  },
  {
    name: "Father",
    value: "father",
  },
  {
    name: "Mother",
    value: "mother",
  },
  {
    name: "Sister",
    value: "sister",
  },
  {
    name: "Friend",
    value: "friend",
  },
  {
    name: "Spouse",
    value: "spouse",
  },
  {
    name: "Son",
    value: "son",
  },
  {
    name: "Daughter",
    value: "daughter",
  },
];

export const genderOption = [
  {
    name: "Male",
    value: "male",
  },
  {
    name: "Female",
    value: "female",
  },
];

export const documentOptions = [
  {
    name: "International passport",
    value: "international_passport",
  },
  {
    name: "Drivers licence",
    value: "drivers_licence",
  },
  {
    name: "PVC",
    value: "pvc",
  },
  {
    name: "National ID",
    value: "national_id",
  },
];

export const employmentOption = [
  {
    name: "Employed",
    value: "employed",
  },
  {
    name: "Self employed",
    value: "self-employed",
  },
  {
    name: "Unemployed",
    value: "unemployed",
  },
  {
    name: "Student",
    value: "student",
  },
  {
    name: "Retired",
    value: "Retired",
  },
];

export const qualificationOption = [
  {
    name: "SSCE",
    value: "ssce",
  },
  {
    name: "NCE",
    value: "nce",
  },
  {
    name: "OND",
    value: "ond",
  },
  {
    name: "HND",
    value: "hnd",
  },
  {
    name: "Bachelors degree",
    value: "bachelors",
  },
  {
    name: "Masters degree",
    value: "masters",
  },
  {
    name: "PhD",
    value: "phd",
  },
  {
    name: "Others",
    value: "others",
  },
];

export const frequencyOption = [
  {
    name: "Daily",
    value: "daily",
  },
  {
    name: "Weekly",
    value: "weekly",
  },
  {
    name: "Quarterly",
    value: "quarterly",
  },
  {
    name: "Bi-annually",
    value: "bi-annually",
  },
  {
    name: "Annually",
    value: "annually",
  },
];

export const investmentFrequency = [
  {
    name: "Daily",
    value: "daily",
  },
  {
    name: "Weekly",
    value: "weekly",
  },
  {
    name: "Monthly",
    value: "monthly",
  },
  {
    name: "Quarterly",
    value: "quarterly",
  },
  {
    name: "Bi-annually",
    value: "bi-annually",
  },
  {
    name: "Annually",
    value: "annually",
  },
];

export const getTimeOfDay = () => {
  const format = "hh:mm:ss";
  const morningTime = moment("00:00:00", format);
  const afternoonTime = moment("12:00:00", format);
  const eveningTime = moment("18:00:00", format);

  if (moment().isBetween(morningTime, afternoonTime)) {
    return "morning";
  }
  if (moment().isBetween(afternoonTime, eveningTime)) {
    return "afternoon";
  }
  return "evening";
};

export const getTransactionTypeColor = (transaction) => {
  if (transaction.status === "success" && transaction.type === "service") {
    return "processed";
  }

  if (transaction.status === "pending" && transaction.type === "debit") {
    return "pending";
  }

  if (transaction.type === "service") {
    return "processed";
  }

  if (transaction.type === "credit") {
    return "credit";
  }

  if (transaction.type === "debit") {
    return "debit";
  }

  if (transaction.type === "failed") {
    return "debit";
  }

  if (transaction.type === "invest") {
    return "invest";
  }
};

export const getTransactionTypeImg = (transaction) => {
  const withdrawImg = require("#/assets/icons/funds-withdrawn-icon.svg");
  const depositImg = require("#/assets/icons/funds-deposited.svg");
  const investedImg = require("#/assets/icons/invested-icon.svg");
  const failedImg = require("#/assets/icons/failed-icon.svg");
  const pendingImg = require("#/assets/icons/pending-icon.svg");

  if (transaction.status === "success" && transaction.type === "service") {
    return investedImg;
  }

  if (transaction.status === "pending" && transaction.type === "debit") {
    return pendingImg;
  }

  if (transaction.type === "credit") {
    return depositImg;
  }
  if (transaction.type === "debit") {
    return withdrawImg;
  }

  if (transaction.type === "failed") {
    return failedImg;
  }

  if (transaction.type == "service") {
    return investedImg;
  }

};

export const questionOptions = [
  {
    label: "A Wedding with my dream partner",
    value: "wedding",
  },
  {
    label: "A new car",
    value: "car",
  },
  {
    label: "Acquire a new/my next property",
    value: "property",
  },
];

export const interests = [
  "News",
  "Investments",
  "Socializing",
  "Sports",
  "Art",
  "Self-development",
  "Fashion",
  "Food & Drink",
  "others",
];

export const formatCurrency = (amount) => {
  return Number(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

//adds the commas
export const formatStringToCurrency = (amount) => {
  amount = amount.replace(/^/, "₦");
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, "$&,");
};

// removes commas
export const formatCurrencyToString = (amount) => {
  amount = amount.replace("₦", "");

  return amount.replace(/\,/g, "");
};

export const formatAmount = (amount) => {
  return Number(amount).toLocaleString();
};

export const convertDate = (date) => {
  return moment(date).format("DD MMMM YYYY");
};

export const interestRate = 10 / 100;

export const interestCalculation = (data) => {
  const amount = 10000;

  const interest = (interestRate * 30) / 365; //use when there's an end date
  const interestAccruedDaily = (interestRate * amount) / 365; //when there is no enddate but there is an amount
  const interestActual = interestRate * amount;

  return { interest, interestAccruedDaily, interestActual };
};

export const calculateAmountToPay = (data) => {
  const endDate = new Date(data.endDate);
  const startDate = new Date(data.startDate);
  var DifferenceInTime = endDate.getTime() - startDate.getTime();
  var DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
  var DifferenceInWeeks = Math.round(DifferenceInTime / (1000 * 3600 * 24 * 7));
  var DifferenceInMonths = DifferenceInTime / (1000 * 3600 * 24 * 7 * 4);
  var DifferenceInQuarter = DifferenceInTime / (1000 * 3600 * (24 * 7 * 4 * 3));
  var DifferenceInBiAnnually =
    DifferenceInTime / (1000 * 3600 * (24 * 7 * 4 * 6));
  var DifferenceInAnnually =
    DifferenceInTime / (1000 * 3600 * (24 * 7 * 4 * 6));

  const getTimeLine = (frequency) => {
    switch (frequency) {
      case "daily":
        return DifferenceInDays;
      case "weekly":
        return DifferenceInWeeks;
      case "monthly":
        return DifferenceInMonths;
      case "quarterly":
        return DifferenceInQuarter;
      case "bi-annually":
        return DifferenceInBiAnnually;
      case "annually":
        return DifferenceInAnnually;
      default:
        break;
    }
  };

  const depositAmount = data.target / getTimeLine(data.frequency);

  return depositAmount;
};

export const calculateInterest = (data, interestRate) => {
  const startTime = moment(data.startDate);
  const endTime = moment(data.endDate);

  const noOfDays = endTime.diff(startTime, "days");
  const year = moment().isLeapYear() ? 366 : 365;

  const interest =
    parseInt(data.target, 10) * (interestRate / 100) * (noOfDays / year);
  const calculatedInterest = interest + parseInt(data.target, 10);

  return calculatedInterest;
};

export const verifyFrequencyPeriod = (data) => {
  const startTime = moment(data.startDate);
  const endTime = moment(data.endDate);

  const noOfDays = endTime.diff(startTime, "days");

  switch (data.frequency) {
    case "daily":
      if (noOfDays < 1) {
        return "date range is not up to a day";
      }
      break;
    case "weekly":
      if (noOfDays < 7) {
        return "date range is not up to a week";
      }
      break;

    case "monthly":
      if (noOfDays < 30) {
        return "date range is not up to a month";
      }
      break;

    case "quarterly":
      if (noOfDays < 90) {
        return "date range is not up to a quarter";
      }
      break;

    case "bi-annually":
      if (noOfDays < 180) {
        return "date range is not up to bi-annual";
      }
      break;

    case "annually":
      if (noOfDays < 365) {
        return "date range is not up to a year";
      }
      break;
    default:
      break;
  }
};

export const isNegative = (value) => {
  if (parseInt(value, 10) > 0) return false;
  if (parseInt(value, 10) === 0) return "neutral";
  return true;
};

export const checkFileType = (url) => {
  var extension = url.split(".").pop();
  if (
    ["jpg", "JPG", "JPEG", "jpeg", "png", "PNG", "GIF", "svg"].includes(
      extension
    )
  ) {
    return "image";
  }
  if (["pdf", "PDF", "docx", "xls"].includes(extension)) {
    return "file";
  }
  return "file";
};

export const formatDate = (date) => {
  if (moment().format("YYYY-MM-DD") === date) {
    return "Today";
  } else if (moment().subtract(1, "days").format("YYYY-MM-DD") === date) {
    return "Yesterday";
  }
  return date;
};

export const checkLike = (likes, commentId) => {
  return likes.find((like) => like.comment_id === commentId);
};

export const checkUnread = (notifications) => {
  const notificationKeys = Object.keys(notifications);
  if (notificationKeys.length > 0) {
    for (let i = 0; i < notificationKeys.length; i++) {
      const findItem = notifications[notificationKeys[i]].find(
        (item) => !item.read
      );
      return findItem;
    }
  }
  return;
};

export const refineOptions = (options) => {
  const refined = options.map((item) => {
    return { name: item, value: item.toLowerCase() };
  });
  return refined;
};

export const calculatePenalty = (
  percent,
  liquidationAmount,
  interest,
  investment
) => {
  let penalty;
  let percentage =
    ((investment?.balance - liquidationAmount) / investment?.balance) * 100; //to get the percentage of the liquidated amount
  const finalAccrued = (percentage / 100) * investment?.accruedInterest; // to get the final accrued interest percentage

  if (
    investment?.balance >= investment?.targetAmount ||
    moment().diff(moment(investment?.endDate), "days") <= 0
  ) {
    penalty = (percent / 100) * finalAccrued;
  } else {
    penalty = 0;
  }
  const amountToGet =
    liquidationAmount === "0" ? 0 : liquidationAmount - penalty + finalAccrued;
  return { penalty, amountToGet };
};

export const calculateLiquidationInterest = (amount, balance, accrued) => {
  return amount === "0" ? 0 : (((amount / balance) * 100) / 100) * accrued;
};

export const industiesList = [
 { name: "Agriculture", value: "Agriculture"},
 { name: "Commerce", value: "Commerce"},
 { name: "Construction/Real Estate", value: "Construction/Real Estate"},
 { name: "Consumer Goods", value: "Consumer Goods"},
 { name: "Education", value: "Education"},
 { name: "Financial Services", value: "Financial Services"},
 { name: "Healthcare", value: "Healthcare"},
 { name: "Hospitality", value: "Hospitality"},
 { name: "Industrial Goods", value: "Industrial Goods"},
 { name: "Information & Communications Technology (ICT)", value: "Information & Communications Technology (ICT)"},
 { name: "Manufacturing", value: "Manufacturing"},
 { name: "Media", value: "Media"},
 { name: "Oil & Gas", value: "Oil & Gas"},
 { name: "Postal", value: "Postal"},
 { name: "Public Sector", value: "Public Sector"},
 { name: "Services", value: "Services"},
 { name: "Shipping & Logistics", value: "Shipping & Logistics"},
 { name: "Tourism", value: "Tourism"},
 { name: "Transportation", value: "Transportation"},
 { name: "Utilities", value: "Utilities"},
];

export const openOffCanvas = (name) => {
  document.querySelector(`.${name}`).classList.add("show");
  let offcanvasOverlay = document.createElement("div");
  offcanvasOverlay.classList.add("offcanvas-backdrop", "show", "fade");
  document.body.lastChild.after(offcanvasOverlay);
};

export const closeOffCanvas = (name) => {
  let offcanvas = document.querySelector(`.${name}`);
  let overlay = document.querySelectorAll(".offcanvas-backdrop");

  overlay.forEach((val) => {
    val.style.opacity = "0";
  });

  offcanvas.style.transform = "translateX(100%)";

  setTimeout(() => {
    offcanvas.classList.remove("show");
    offcanvas.style.transform = "";
    overlay.forEach((val) => {
      val.style.opacity = "0";
      val.remove();
    });
  }, 300);
};
