import { komikuChapter } from './utils.js';

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ images: [] });
    const images = await komikuChapter(url);
    res.status(200).json({ images });
  } catch (error) {
    res.status(500).json({ images: [] });
  }
}