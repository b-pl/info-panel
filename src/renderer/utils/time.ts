export const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // format 24-godzinny
        timeZone: 'Europe/Warsaw'
    });
};

export const localizeTime = (date: string | null) => {
    if (!date) return null;

    return new Date(date).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // format 24-godzinny
        timeZone: 'Europe/Warsaw'
    });
};