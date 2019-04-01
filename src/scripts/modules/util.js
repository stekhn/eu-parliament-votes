export default (function() {
  function voteColor(vote) {
    const voteColor = {
      yes: '#0571b0',
      no: '#ca0020',
      abstained: '#a9a9a9'
    };

    return voteColor[vote] || 'none';
  }

  function groupColor(name) {
    const groupColors = {
      'PPE': '#003C78',
      'S&D': '#C80000',
      'ECR': '#0082FF',
      'ALDE': '#FFAA00',
      'Verts/ALE': '#009900',
      'GUE/NGL': '#460000',
      'EFDD': '#8B9FA0',
      'ENF': '#9B20A9',
      'NI': '#666666'
    };

    return groupColors[name] || '#a9a9a9';
  }

  function sortByLength(a, b) {
    const aLength = a.values.reduce((acc, cur) => {
      return acc + cur.values.length;
    }, 0);
    const bLength = b.values.reduce((acc, cur) => {
      return acc + cur.values.length;
    }, 0);

    return (aLength > bLength) ? -1 : ((bLength > aLength) ? 1 : 0);
  }

  function chunkArray(arr, chunkCount) {
    const chunks = [];

    while(arr.length) {
      const chunkSize = Math.ceil(arr.length / chunkCount--);
      const chunk = arr.slice(0, chunkSize);
      chunks.push(chunk);
      arr = arr.slice(chunkSize);
    }

    return chunks;
  }

  return {
    voteColor,
    groupColor,
    sortByLength,
    chunkArray
  };
})();


