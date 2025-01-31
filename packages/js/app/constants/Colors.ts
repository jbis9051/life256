const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const palette = {
    primary: '#FF6339', // red
    secondary: '#FF3A66', // orange
    primaryPaper: '#FFFFFF', // white
    secondaryPaper: '#4B4B4B', // dark grey
    grey0: '#F5F8F9', // light grey
    grey4: '#BDBDBD', // medium grey
    active: '#34A853', // green
    inactive: '#FBBC05', // yellow
    white: '#FFFFFF',
    black: '#000000',
    red: '#C40233',
};

export default {
    colors: {
        primary: palette.primary,
        secondary: palette.secondary,
        primaryPaper: palette.grey0,
        secondaryPaper: palette.grey4,
        active: palette.active,
        inactive: palette.inactive,
        danger: palette.red,
    },
    complementColors: {
        primary: palette.white,
        secondary: palette.white,
        primaryPaper: palette.black,
        secondaryPaper: palette.white,
        active: palette.black,
        inactive: palette.black,
        danger: palette.white,
    },
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
};
