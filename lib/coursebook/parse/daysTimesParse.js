import {daysOfWeek} from "../../consts.js";

export const isTimes = timeString => /^[0-9]{1,2}:[0-9]{2}[ap]m - [0-9]{1,2}:[0-9]{2}[ap]m$/.test(timeString);
export const splitIntoDays = days => days.split(/\W/).filter(Boolean);
export const isNormalDays = daysString => splitIntoDays(daysString).every(day => daysOfWeek.includes(day));
export const isSpecialDays = daysString => /^\d{4}-\d{2}-\d{2} (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/.test(daysString);
export const isDays = daysString => isNormalDays(daysString) || isSpecialDays(daysString);
