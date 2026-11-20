import { collection, doc, getDocs, setDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { handleFirestoreError, OperationType } from "./firestoreErrors";

export interface Booking {
  bookingId: string;
  userId: string;
  userEmail: string;
  userName: string;
  tier: "1080p" | "1440p" | "4K";
  ratePerHour: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  durationHours: number;
  totalAmount: number;
  status: "confirmed" | "active" | "completed" | "cancelled";
  createdAt?: any;
}

export interface DayOption {
  dateString: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Today, Aug 30" or "Mon, Sep 1"
  dayName: string;
  isToday: boolean;
}

export interface TimeSlotOption {
  startTime: string; // "09:00" or "09:30"
  endTime: string; // "10:00" or "10:30"
  display: string; // "9:00 AM - 10:00 AM"
  available: boolean;
}

/**
 * Converts 24-hour time string (HH:mm) to 12-hour AM/PM format (h:mm A)
 */
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let hour = parseInt(hStr, 10);
  const minute = mStr || "00";
  if (isNaN(hour)) return timeStr;
  
  const period = hour >= 12 && hour < 24 ? "PM" : "AM";
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  
  return `${displayHour}:${minute} ${period}`;
}

/**
 * Returns the next 15 days from today
 */
export function getNext15Days(): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = d.getDate();

    let displayDate = `${dayName}, ${monthName} ${dayNum}`;
    if (i === 0) displayDate = `Today (${monthName} ${dayNum})`;
    if (i === 1) displayDate = `Tomorrow (${monthName} ${dayNum})`;

    days.push({
      dateString,
      displayDate,
      dayName,
      isToday: i === 0,
    });
  }

  return days;
}

/**
 * Generates clean 30-minute interval slots and filters out past times if date is today
 */
export function getAvailableSlots(dateString: string, durationHours: number = 1): TimeSlotOption[] {
  const slots: TimeSlotOption[] = [];
  const now = new Date();
  
  const selectedDate = new Date(dateString);
  const isToday =
    now.getFullYear() === selectedDate.getFullYear() &&
    now.getMonth() === selectedDate.getMonth() &&
    now.getDate() === selectedDate.getDate();

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Generate slots for each 30-minute mark from 00:00 to 23:30
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const startTotalMinutes = hour * 60 + minute;
      const endTotalMinutes = startTotalMinutes + durationHours * 60;

      // End time must be on or before 24:00 (1440 min)
      if (endTotalMinutes > 24 * 60) continue;

      const endHour = Math.floor(endTotalMinutes / 60);
      const endMinute = endTotalMinutes % 60;

      const startTimeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const endTimeStr = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

      // Check if slot has already passed for today
      let isPast = false;
      if (isToday) {
        // If current time is past the slot start time (plus a 5-min buffer)
        if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
          isPast = true;
        }
      }

      if (!isPast) {
        slots.push({
          startTime: startTimeStr,
          endTime: endTimeStr,
          display: `${formatTo12Hour(startTimeStr)} - ${formatTo12Hour(endTimeStr)}`,
          available: true,
        });
      }
    }
  }

  return slots;
}

/**
 * Creates a booking in Firestore
 */
export async function createBooking(
  userId: string,
  userEmail: string,
  userName: string,
  tier: "1080p" | "1440p" | "4K",
  ratePerHour: number,
  date: string,
  startTime: string,
  endTime: string,
  durationHours: number
): Promise<Booking> {
  const bookingId = `book_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const totalAmount = ratePerHour * durationHours;

  const bookingData: Booking = {
    bookingId,
    userId,
    userEmail,
    userName,
    tier,
    ratePerHour,
    date,
    startTime,
    endTime,
    durationHours,
    totalAmount,
    status: "confirmed",
  };

  const bookingDocPath = `users/${userId}/bookings/${bookingId}`;
  try {
    const bookingRef = doc(db, "users", userId, "bookings", bookingId);
    await setDoc(bookingRef, {
      ...bookingData,
      createdAt: serverTimestamp(),
    });
    return bookingData;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, bookingDocPath);
  }
}

/**
 * Fetches all bookings for a user
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const bookingsPath = `users/${userId}/bookings`;
  try {
    const bookingsRef = collection(db, "users", userId, "bookings");
    const q = query(bookingsRef, orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => docSnap.data() as Booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, bookingsPath);
  }
}
