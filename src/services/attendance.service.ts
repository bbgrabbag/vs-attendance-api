import { EntryModel } from "../models/entry.model";
import { EntryFilters, User } from "../types";

export const checkIn = async (user: User) => {
  const existingEntries = await EntryModel.find({ email: user.email });
  const entry = new EntryModel({
    first_name: user.firstName,
    last_name: user.lastName,
    start: new Date(),
    email: user.email,
    first_entry: !existingEntries.length,
  });
  const doc = await entry.save();
  return doc;
};

export const checkOut = async (user: User) => {
  const entries = await EntryModel.find({ email: user.email }).sort({
    createdAt: "desc",
  });
  const latest = entries[0];
  if (!latest) throw Error("InvalidCheckout: No entries found");
  if (latest.end)
    throw Error(
      "InvalidCheckout: Latest entry already has checked out at " + latest.end,
    );
  latest.end = new Date();
  return await latest.save();
};

export const getAllEntries = async (filters: EntryFilters) => {
  const entries = await EntryModel.find(filters);
  return entries;
};
