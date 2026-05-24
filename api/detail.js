import { komikuDetail } from './utils.js';

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false });
    const data = await komikuDetail(url);
    res.status(200).json({
      status: true,
      title: data.title,
      thumbnail: data.image,
      description: data.sinopsis,
      genres: data.genres,
      info: { pengarang: data.info.Pengarang || '' },
      chapters: data.chapters.map(c => ({
        title: c.chapter,
        link: c.url,
        date: c.date
      }))
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}