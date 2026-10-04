export interface YouTubeVideo {
  id: string;
  title: string;
  category: "Car Culture" | "Supercar Film" | "Track & Meet" | "Build Breakdown";
  url: string;
  duration: string;
  badge: string;
}

export const YOUTUBE_SHOWCASE: YouTubeVideo[] = [
  {
    id: "yt-01",
    title: "UNDERGROUND MEETS // THE RAW SPIRIT OF CENTRAL INDIA CAR CULTURE",
    category: "Car Culture",
    url: "https://www.youtube.com/@CARDYNASTY",
    duration: "14:22",
    badge: "Official Film",
  },
  {
    id: "yt-02",
    title: "PORSCHE 911 GT3 // HIGH SPEED CHASE & PURE EXHAUST SYMPHONY",
    category: "Supercar Film",
    url: "https://www.youtube.com/@CARDYNASTY",
    duration: "08:45",
    badge: "Cinema Cut",
  },
  {
    id: "yt-03",
    title: "MIDNIGHT CONVOY // 50+ SUPERCAR RALLY HIGHLIGHTS & ROLLING SHOTS",
    category: "Track & Meet",
    url: "https://www.youtube.com/@CARDYNASTY",
    duration: "12:10",
    badge: "Aftermovie",
  },
  {
    id: "yt-04",
    title: "BEHIND THE LENS // HOW WE RIG CINEMA CAMERAS TO SUPERCAR HOODS",
    category: "Build Breakdown",
    url: "https://www.youtube.com/@CARDYNASTY",
    duration: "18:04",
    badge: "BTS Documentary",
  },
];
