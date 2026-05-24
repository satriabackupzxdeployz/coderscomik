import { komikuHomepage } from './utils.js';

export default async function handler(req, res) {
  try {
    const data = await komikuHomepage();
    const format = (items) => items.map(c => ({
      title: c.title,
      link: c.url,
      thumbnail: c.image,
      genre: c.type
    }));
    res.status(200).json({
      popular: format(data.popular),
      latest: format(data.latest)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}