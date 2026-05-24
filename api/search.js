import { komikuSearch } from './utils.js';

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);
    const data = await komikuSearch(q);
    const mapped = data.map(c => ({
      title: c.title,
      link: c.url,
      thumbnail: c.image,
      genre: c.genre
    }));
    res.status(200).json(mapped);
  } catch (error) {
    res.status(500).json([]);
  }
}