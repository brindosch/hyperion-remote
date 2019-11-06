export const toHex = (color) => {
  switch (color) {
    case 'hyperion': return '#2b819a'
    case 'red': return '#f44336'
    case 'pink': return '#e91e63'
    case 'purple': return '#9c27b0'
    case 'deep-purple': return '#673ab7'
    case 'indigo': return '#3f51b5'
    case 'cyan': return '#00bcd4'
    case 'teal': return '#009688'
    case 'green': return '#4caf50'
    case 'lime': return '#cddc39'
    case 'amber': return '#ffc107'
    case 'orange': return '#ff9800'
    case 'deep-orange': return '#ff5722'
    case 'brown': return '#795548'
    default: return '#027be3'
  }
}
