
export const getAspectRatioClass = (aspectRatio: string): string => {
  switch (aspectRatio) {
    case 'square':
    case '1:1':
      return 'aspect-square';
    case 'video':
    case '16:9':
      return 'aspect-video';
    case '4:3':
      return 'aspect-4/3';
    case '3:2':
      return 'aspect-3/2';
    default:
      return 'aspect-auto';
  }
};
