export function capitaliseFirstCharEachWord(sentence) {
    return sentence.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}
