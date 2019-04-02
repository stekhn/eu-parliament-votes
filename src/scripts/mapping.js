export default (function() {
  function voteColor(vote) {
    const voteColor = {
      yes: '#0571b0',
      no: '#ca0020',
      abstained: '#a9a9a9'
    };

    return voteColor[vote] || 'none';
  }

  function voteType(type, config) {
    const voteTypes = {
      'yes': {
        description: 'voted in favor',
        color: '#0571b0',
        offsetX: config.midX + 5,
        reverse: false,
        showLabels: true
      },
      'no': {
        description: 'voted against',
        color: '#ca0020',
        offsetX: config.midX - 65,
        reverse: true,
        showLabels: true
      },
      'abstained': {
        description: 'abstained',
        color: '#a9a9a9',
        offsetX: config.midX - 45,
        reverse: false,
        showLabels: false
      }
    };

    return voteTypes[type];
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

  function groupName(name) {
    const groupName = {
      'PPE': 'EPP',
      'S&D': 'S&D',
      'ECR': 'ECR',
      'ALDE': 'ALDE',
      'Verts/ALE': 'Greens/EFA',
      'GUE/NGL': 'GUE/NGL',
      'EFDD': 'EFDD',
      'ENF': 'ENF',
      'NI': 'NI'
    };

    return groupName[name] || name;
  }

  return {
    voteColor,
    voteType,
    groupColor,
    groupName
  };
})();


