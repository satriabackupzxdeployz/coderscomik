import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://komiku.org";
const headers = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36"
};

export async function komikuHomepage() {
  const res = await axios.get(BASE_URL, { headers });
  const $ = cheerio.load(res.data);
  const popular = [];
  $("#ls12-populer article.ls2").each((i, el) => {
    popular.push({
      title: $(el).find("h3 a").text().trim(),
      url: $(el).find("h3 a").attr("href"),
      image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
      type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : "Manhua"
    });
  });
  
  const latest = [];
  $(".ls2-wrap article.ls2").each((i, el) => {
    latest.push({
      title: $(el).find("h3 a").text().trim(),
      url: $(el).find("h3 a").attr("href"),
      image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
      type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : "Manhua"
    });
  });
  return { popular: popular.slice(0, 20), latest: latest.slice(0, 20) };
}

export async function komikuPustaka(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.tipe) queryParams.append("tipe", params.tipe);
  const url = `${BASE_URL}/pustaka/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const res = await axios.get(url, { headers });
  const $ = cheerio.load(res.data);
  
  const comics = [];
  $(".ls2").each((i, el) => {
    const title = $(el).find("h3 a").text().trim();
    if (title) {
      comics.push({
        title,
        url: $(el).find("h3 a").attr("href"),
        image: $(el).find(".ls2v img").attr("data-src") || $(el).find(".ls2v img").attr("src"),
        type: $(el).find(".flag").attr("src")?.includes("jp.png") ? "Manga" : $(el).find(".flag").attr("src")?.includes("kr.png") ? "Manhwa" : $(el).find(".flag").attr("src")?.includes("cn.png") ? "Manhua" : "Unknown",
      });
    }
  });
  return comics;
}

export async function komikuDetail(url) {
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  const res = await axios.get(fullUrl, { headers });
  const $ = cheerio.load(res.data);
  
  const title = $("h1").first().text().trim();
  let image = $(".ims img").attr("src") || $(".thumb img").attr("src") || $(".thumb img").attr("data-src");
  if (image && !image.startsWith("http")) image = "https:" + image;
  
  const info = {};
  $(".inftable tr").each((i, el) => {
    const key = $(el).find("th").text().trim().replace(":", "");
    const value = $(el).find("td").text().trim();
    if (key && value) info[key] = value;
  });
  
  const genreLinks = [];
  $(".inftable .genre li a").each((i, el) => {
    genreLinks.push($(el).text().trim());
  });
  
  const sinopsis = $(".desc").text().trim();
  const chapters = [];
  $("#daftarChapter tr").each((i, el) => {
    const chapterLink = $(el).find("td.judulseries a");
    const chapterTitle = chapterLink.text().trim();
    const chapterUrl = chapterLink.attr("href");
    const date = $(el).find("td.tanggalseries").text().trim();
    if (chapterTitle && chapterUrl) {
      chapters.push({ chapter: chapterTitle, url: chapterUrl, date });
    }
  });
  
  return { title, image, info, sinopsis, genres: genreLinks, chapters };
}

export async function komikuChapter(url) {
  const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
  const res = await axios.get(fullUrl, { headers });
  const $ = cheerio.load(res.data);
  const images = [];
  
  $(".chapter-image img, .img-con img").each((i, el) => {
    let src = $(el).attr("src") || $(el).attr("data-src");
    if (src && !src.includes("lazy") && !src.includes("komiku.org/asset/img/lazy")) {
      if (!src.startsWith("http")) src = "https:" + src;
      images.push(src);
    }
  });
  return images;
}

export async function komikuSearch(query) {
  const res = await axios.get(`${BASE_URL}/?post_type=manga&s=${encodeURIComponent(query)}`, { headers });
  const $ = cheerio.load(res.data);
  const comics = [];
  $(".bge").each((i, el) => {
    comics.push({
      title: $(el).find("h3").text().trim(),
      url: $(el).find("a").attr("href"),
      image: $(el).find("img").attr("data-src") || $(el).find("img").attr("src"),
      genre: $(el).find(".tpe1_inf b").text().trim()
    });
  });
  return comics;
}