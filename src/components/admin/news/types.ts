
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  date: string;
}

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Banks o\' Dee secure vital win against Formartine United',
    summary: 'A convincing 3-1 victory at Spain Park keeps the team in title contention',
    content: 'Banks o\' Dee delivered an impressive performance against Formartine United on Saturday, securing a vital 3-1 win at Spain Park. The victory keeps the team firmly in the title race as they look to challenge for Highland League honors this season.',
    image: '/lovable-uploads/banks-o-dee-logo.png',
    date: '2023-09-23'
  },
  {
    id: '2',
    title: 'Youth Development Program Expansion',
    summary: 'Club announces expansion of youth development program with new age groups',
    content: 'Banks o\' Dee FC is proud to announce the expansion of our youth development program, which will now include additional age groups and enhanced training facilities. This initiative demonstrates our commitment to developing local talent and building a sustainable future for the club.',
    date: '2023-09-15'
  }
];
