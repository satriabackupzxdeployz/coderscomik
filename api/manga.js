import { komikuPustaka } from './utils.js';

export default async function handler(req, res) {
  try {
    const data = await komikuPustaka({ tipe: "manga" });
    const mapped = data.map(c => ({
      title: c.title,
      link: c.url,
      thumbnail: c.image,
      genre: c.type
    }));
    res.status(200).json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}