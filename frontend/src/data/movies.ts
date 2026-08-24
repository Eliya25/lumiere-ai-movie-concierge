export type Movie = {
  title: string
  year: number
  genre: string[]
  cast: string[]
  reason: string
  rating: number
  posterUrl: string
}

export const mockMovies: Movie[] = [
  { title:'Dune: Part Two', year:2024, genre:['Sci-Fi','Adventure'], rating:8.5, cast:['Timothée Chalamet','Zendaya','Rebecca Ferguson'], reason:'Vast, immersive, and emotionally precise—a rare spectacle that rewards your full attention and lingers after the final frame.', posterUrl:'https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg' },
  { title:'Past Lives', year:2023, genre:['Drama','Romance'], rating:7.8, cast:['Greta Lee','Teo Yoo','John Magaro'], reason:'Quietly devastating and beautifully observed, this is for nights when you want something intimate, honest, and deeply human.', posterUrl:'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg' },
  { title:'Decision to Leave', year:2022, genre:['Mystery','Romance'], rating:7.4, cast:['Park Hae-il','Tang Wei','Lee Jung-hyun'], reason:'A seductive puzzle with exquisite craft—equal parts detective story and impossible romance, told with hypnotic confidence.', posterUrl:'https://image.tmdb.org/t/p/w500/N0rskx4mfiLxmtAHtB2HHOZr3X.jpg' },
  { title:'The Holdovers', year:2023, genre:['Comedy','Drama'], rating:7.9, cast:['Paul Giamatti','Da’Vine Joy Randolph','Dominic Sessa'], reason:'Warm without becoming sentimental, with the texture of a rediscovered classic and characters you will genuinely miss.', posterUrl:'https://image.tmdb.org/t/p/w500/VHSzNBTwxV8vh7wylo7O9CLdac.jpg' },
  { title:'Anatomy of a Fall', year:2023, genre:['Drama','Mystery'], rating:7.6, cast:['Sandra Hüller','Swann Arlaud','Milo Machado-Graner'], reason:'A gripping mystery that keeps shifting beneath your feet while asking sharper questions about intimacy and truth.', posterUrl:'https://image.tmdb.org/t/p/w500/kQs6keheMwCxJxrzV83VUwFtHkB.jpg' },
  { title:'The Worst Person in the World', year:2021, genre:['Comedy','Drama'], rating:7.5, cast:['Renate Reinsve','Anders Danielsen Lie','Herbert Nordrum'], reason:'Restless, funny, and achingly alive—a sharp modern portrait of becoming yourself while time keeps moving.', posterUrl:'https://image.tmdb.org/t/p/w500/p5nLFV9aa2F1nXhriWtR7nW8P4F.jpg' },
]
