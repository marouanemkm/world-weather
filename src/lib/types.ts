export type City = {
  slug: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  tz: string;
};

export type CurrentDayWeather = {
  temperatureC: number;
  weatherCode: number;
  label: string;
  emoji: string;
};
