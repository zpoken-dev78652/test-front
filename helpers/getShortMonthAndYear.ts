import { User } from "../types";

export const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const getShortMonthAndYear = (user: User | undefined) => {
  if (!user) return;
  const registeredDate = new Date(user.registered_at);
  const month = registeredDate.getMonth();
  const year = registeredDate.getFullYear();

  return `${shortMonthNames[month]} ${year}`;
};
