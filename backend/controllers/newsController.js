// app/controllers/newsController.js
import { createNews, listenNews } from "../models/NewsModel";

// Save news (used in SendNews.jsx)
export const saveNews = async (station, title, news) => {
  try {
    await createNews(station, title, news);
    console.log("✅ News saved successfully");
  } catch (error) {
    console.error("❌ Error saving news:", error);
  }
};

// Subscribe to news (used in StationDashboard.jsx)
export const subscribeNews = (callback) => {
  return listenNews(callback);
};
