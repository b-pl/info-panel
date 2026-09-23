export const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // format 24-godzinny
    });
};