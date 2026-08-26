
export const displayedDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
    }).format(date);
}